module.exports = async (kernel) => {
  const serverPort = await kernel.port()
  return {
    daemon: true,
    run: [
      // Backend in dev mode (tsx watch) — keeps running
      {
        method: "shell.run",
        params: {
          venv: "env",
          venv_python: "3.12",
          path: "app/app/server",
          env: {
            PORT: `${serverPort}`,
            NO_AUTO_BROWSER: "true",
            PYTHON_PATH: "{{platform === 'win32' ? path.resolve(cwd, 'app/env/Scripts/python.exe') : path.resolve(cwd, 'app/env/bin/python')}}",
            ACESTEP_PATH: "{{path.resolve(cwd, 'app/ACE-Step-1.5')}}",
            HF_HOME: "{{path.resolve(cwd, 'app/models')}}",
            HUGGINGFACE_HUB_CACHE: "{{path.resolve(cwd, 'app/models')}}",
            TRANSFORMERS_CACHE: "{{path.resolve(cwd, 'app/models')}}",
            TORCH_HOME: "{{path.resolve(cwd, 'app/models/torch')}}",
            XDG_CACHE_HOME: "{{path.resolve(cwd, 'app/cache')}}",
            HF_HUB_ENABLE_HF_TRANSFER: "1",
            DEFAULT_MODEL: "marcorez8/acestep-v15-xl-turbo-bf16",
            MANAGE_PIPELINE: "true",
            NODE_ENV: "development",
            PYTHONIOENCODING: "utf-8",
            PYTHONUNBUFFERED: "1",
            PYTORCH_CUDA_ALLOC_CONF: "expandable_segments:True"
          },
          message: ["npm run dev"],
          on: [{
            event: "/(https?:\\/\\/[a-zA-Z0-9.\\-]+:[0-9]+)/",
            done: true
          }]
        }
      },
      // Frontend with Vite HMR (new shell, daemon continues)
      {
        method: "shell.run",
        params: {
          path: "app/app",
          message: ["npx vite"],
          on: [{
            event: "/Local:\\s+(https?:\\/\\/[a-zA-Z0-9.\\-]+:[0-9]+)/",
            done: true
          }]
        }
      },
      {
        method: "local.set",
        params: {
          url: "{{input.event[1]}}"
        }
      }
    ]
  }
}
