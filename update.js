module.exports = {
  run: [
    // Pull launcher itself
    {
      method: "shell.run",
      params: { message: "git pull" }
    },
    // Pull ACE-Step-Studio app
    {
      when: "{{exists('app')}}",
      method: "shell.run",
      params: {
        path: "app",
        message: "git pull"
      }
    },
    // Pull ACE-Step-1.5 pipeline
    {
      when: "{{exists('app/ACE-Step-1.5')}}",
      method: "shell.run",
      params: {
        path: "app/ACE-Step-1.5",
        message: "git pull"
      }
    },
    // Rebuild frontend
    {
      when: "{{exists('app/app/node_modules')}}",
      method: "shell.run",
      params: {
        path: "app/app",
        message: ["npm install", "npx vite build"]
      }
    },
    // Server deps refresh
    {
      when: "{{exists('app/app/server/node_modules')}}",
      method: "shell.run",
      params: {
        path: "app/app/server",
        message: ["npm install"]
      }
    },
    // Python deps refresh — pulls in any new deps added since first install.
    // As of 2026-05-04: pytorch-wavelets + pywavelets for DCW (CVPR 2026 quality boost).
    // uv is idempotent; already-installed deps are no-ops.
    {
      when: "{{exists('app/env')}}",
      method: "shell.run",
      params: {
        path: "app",
        venv: "env",
        message: [
          "uv pip install \"pytorch-wavelets>=1.3.0\" \"pywavelets>=1.9.0\""
        ]
      }
    }
  ]
}
