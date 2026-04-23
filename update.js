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
    }
  ]
}
