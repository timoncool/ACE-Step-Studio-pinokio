module.exports = async (kernel) => {
  const port = await kernel.port()
  return {
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          venv: "env",
          venv_python: "3.12",
          path: "app/app/server",
          env: {
            PORT: `${port}`,
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
            PYTHONIOENCODING: "utf-8",
            PYTHONUNBUFFERED: "1",
            PYTORCH_CUDA_ALLOC_CONF: "expandable_segments:True"
          },
          message: ["npx tsx src/index.ts"],
          on: [{
            event: "/(https?:\\/\\/[a-zA-Z0-9.\\-]+:[0-9]+)/",
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
