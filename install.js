module.exports = {
  // Triggers Pinokio to install local AI prerequisites (CUDA on NVIDIA, Hugging Face CLI, etc.)
  // before this script runs. Required for any launcher that runs local AI models,
  // even when torch.js is also used.
  requires: {
    bundle: "ai"
  },
  run: [
    // 1. Clone ACE-Step-Studio into app/
    {
      when: "{{!exists('app')}}",
      method: "shell.run",
      params: {
        message: ["git clone -b master https://github.com/timoncool/ACE-Step-Studio app"]
      }
    },

    // 2. Clone ACE-Step-1.5 (Python ML pipeline) into app/ACE-Step-1.5
    {
      when: "{{!exists('app/ACE-Step-1.5')}}",
      method: "shell.run",
      params: {
        path: "app",
        message: ["git clone https://github.com/ace-step/ACE-Step-1.5"]
      }
    },

    // 3. Python deps into venv (env folder sits at app/env) — Python 3.12 required by ace-step
    {
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.12",
        path: "app",
        message: [
          "uv pip install hatchling editables",
          "uv pip install -e ACE-Step-1.5/acestep/third_parts/nano-vllm/",
          "uv pip install \"transformers>=4.51.0,<4.58.0\" diffusers \"gradio==6.2.0\" matplotlib scipy soundfile loguru einops accelerate fastapi diskcache \"uvicorn[standard]\" numba vector-quantize-pytorch torchcodec \"torchao>=0.16.0,<0.17.0\" toml peft modelscope tensorboard typer-slim hf_transfer hf_xet lightning lycoris-lora safetensors xxhash \"pytorch-wavelets>=1.3.0\" \"pywavelets>=1.9.0\""
        ]
      }
    },

    // 4. Install ace-step package itself (separate step so its failure doesn't stop subsequent ones)
    {
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.12",
        path: "app",
        message: ["uv pip install -e ACE-Step-1.5/ --no-deps"]
      }
    },

    // 4b. MLX native acceleration for Apple Silicon (no-op on other platforms)
    {
      when: "{{platform === 'darwin' && arch === 'arm64'}}",
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.12",
        path: "app",
        message: ["uv pip install \"mlx>=0.25.2\" \"mlx-lm>=0.20.0\""]
      }
    },

    // 5. PyTorch (cross-platform via torch.js, with triton for torch.compile)
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          venv_python: "3.12",
          path: "app",
          triton: true
        }
      }
    },

    // 6. Flash-Attention 2 for NVIDIA (optional — ace-step handles no-flash-attn gracefully).
    //    Wrapped so wheel availability problems (404, torch version mismatch) don't abort install.
    {
      when: "{{gpu === 'nvidia' && platform === 'win32' && arch !== 'arm64'}}",
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.12",
        path: "app",
        message: [
          "uv pip install https://github.com/mjun0812/flash-attention-prebuild-wheels/releases/download/v0.7.11/flash_attn-2.8.3%2Bcu128torch2.7-cp312-cp312-win_amd64.whl || ver>nul"
        ]
      }
    },
    {
      when: "{{gpu === 'nvidia' && platform === 'linux' && arch !== 'arm64'}}",
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.12",
        path: "app",
        message: [
          "uv pip install https://github.com/mjun0812/flash-attention-prebuild-wheels/releases/download/v0.7.11/flash_attn-2.8.3+cu128torch2.7-cp312-cp312-linux_x86_64.whl || true"
        ]
      }
    },

    // 6. Frontend: npm install + build
    {
      method: "shell.run",
      params: {
        path: "app/app",
        message: ["npm install", "npx vite build"]
      }
    },


    // 7b. Download ffmpeg.exe for Windows so the Video Studio can render
    //     videos. The portable run.bat installer drops ffmpeg into
    //     <projectRoot>/ffmpeg/ — Pinokio doesn't, so users hit
    //     "Video rendering failed" with a missing-binary error. We mirror
    //     the portable layout (app/ffmpeg/ffmpeg.exe) so the backend's
    //     existing findFfmpeg() resolver picks it up automatically.
    //     Linux/macOS users typically have ffmpeg via apt/brew/homebrew —
    //     the backend's PATH-fallback handles those, no download needed.
    {
      when: "{{platform === 'win32'}}",
      method: "shell.run",
      params: {
        path: "app",
        message: [
          // Single PowerShell command: ensure ffmpeg/ dir, download release-essentials zip,
          // expand, copy out ffmpeg.exe (and ffprobe.exe for symmetry), clean up.
          "powershell -NoProfile -ExecutionPolicy Bypass -Command \"" +
            "$dst = Join-Path (Get-Location) 'ffmpeg'; " +
            "New-Item -ItemType Directory -Path $dst -Force | Out-Null; " +
            "if (Test-Path (Join-Path $dst 'ffmpeg.exe')) { Write-Host '[ffmpeg] already present, skipping'; exit 0 }; " +
            "$tmp = Join-Path $env:TEMP 'ace-ffmpeg'; " +
            "New-Item -ItemType Directory -Path $tmp -Force | Out-Null; " +
            "$zip = Join-Path $tmp 'ffmpeg.zip'; " +
            "Write-Host '[ffmpeg] downloading release-essentials build...'; " +
            "Invoke-WebRequest -UseBasicParsing 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip' -OutFile $zip; " +
            "Expand-Archive -Path $zip -DestinationPath $tmp -Force; " +
            "$exe = Get-ChildItem -Path $tmp -Filter 'ffmpeg.exe' -Recurse | Select-Object -First 1; " +
            "$probe = Get-ChildItem -Path $tmp -Filter 'ffprobe.exe' -Recurse | Select-Object -First 1; " +
            "if (-not $exe) { throw 'ffmpeg.exe not found in archive' }; " +
            "Copy-Item -Path $exe.FullName -Destination (Join-Path $dst 'ffmpeg.exe') -Force; " +
            "if ($probe) { Copy-Item -Path $probe.FullName -Destination (Join-Path $dst 'ffprobe.exe') -Force }; " +
            "Remove-Item -Path $tmp -Recurse -Force; " +
            "Write-Host '[ffmpeg] installed to' $dst" +
            "\""
        ]
      }
    },

    // 7. Server: npm install
    {
      method: "shell.run",
      params: {
        path: "app/app/server",
        message: ["npm install"]
      }
    },

    // 8. Done
    {
      method: "input",
      params: {
        title: "Installation complete",
        description: "Click <strong>Start (Standard)</strong> in the sidebar to launch ACE-Step Studio. Models (~7.5 GB for default BF16) download automatically on first run."
      }
    }
  ]
}
