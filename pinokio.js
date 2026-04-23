const path = require('path')
module.exports = {
  version: "6.0.0",
  title: "ACE-Step Studio",
  description: "Suno at home. Local AI music generation studio — full songs with vocals, lyrics, covers, and music videos. Built on ACE-Step 1.5 XL.",
  icon: "icon.jpg",
  menu: async (kernel, info) => {
    let installed = info.exists("app/env")
    let running = {
      install:     info.running("install.js"),
      start:       info.running("start.js"),
      start_no_lm: info.running("start_no_lm.js"),
      start_dev:   info.running("start_dev.js"),
      update:      info.running("update.js"),
      reset:       info.running("reset.js"),
      link:        info.running("link.js"),
    }

    if (running.install) {
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Installing",
        href: "install.js",
      }]
    }

    if (installed) {
      if (running.start || running.start_no_lm || running.start_dev) {
        const script = running.start
          ? "start.js"
          : running.start_no_lm
            ? "start_no_lm.js"
            : "start_dev.js"
        const local = info.local(script)
        if (local && local.url) {
          return [
            { default: true, icon: "fa-solid fa-rocket", text: "Open Web UI", href: local.url },
            { icon: "fa-solid fa-terminal", text: "Terminal", href: script },
          ]
        }
        return [{
          default: true,
          icon: "fa-solid fa-terminal",
          text: "Terminal",
          href: script,
        }]
      }

      if (running.update) {
        return [{ default: true, icon: "fa-solid fa-terminal", text: "Updating", href: "update.js" }]
      }
      if (running.reset) {
        return [{ default: true, icon: "fa-solid fa-terminal", text: "Resetting", href: "reset.js" }]
      }
      if (running.link) {
        return [{ default: true, icon: "fa-solid fa-terminal", text: "Deduplicating", href: "link.js" }]
      }

      return [
        { icon: "fa-solid fa-power-off", text: "Start (Standard — DiT + LM)", href: "start.js" },
        { icon: "fa-solid fa-power-off", text: "Start (No LM — more VRAM for DiT)", href: "start_no_lm.js" },
        { icon: "fa-solid fa-code",      text: "Start (Dev mode with Vite HMR)", href: "start_dev.js" },
        { icon: "fa-solid fa-folder-open", text: "Open Folder",
          menu: [
            { icon: "fa-solid fa-music",    text: "Generated Audio",   href: "open_folder.js", params: { path: "app/app/server/public/audio" } },
            { icon: "fa-solid fa-database", text: "App Data (songs DB, settings)", href: "open_folder.js", params: { path: "app/app/data" } },
            { icon: "fa-solid fa-brain",    text: "Models Cache",      href: "open_folder.js", params: { path: "app/models" } },
          ]
        },
        { icon: "fa-solid fa-rotate",    text: "Update", href: "update.js" },
        { icon: "fa-solid fa-plug",      text: "Install", href: "install.js" },
        {
          icon: "fa-solid fa-file-zipper",
          text: "<div><strong>Save Disk Space</strong><div>Deduplicate redundant library files</div></div>",
          href: "link.js",
        },
        {
          icon: "fa-regular fa-circle-xmark",
          text: "<div><strong>Reset</strong><div>Revert to pre-install state</div></div>",
          href: "reset.js",
          confirm: "Are you sure you wish to reset the app? This removes all installed deps.",
        },
      ]
    }

    return [{
      default: true,
      icon: "fa-solid fa-plug",
      text: "Install",
      href: "install.js",
    }]
  }
}
