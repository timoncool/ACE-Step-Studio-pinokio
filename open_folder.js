// Generic "open folder in file explorer" script.
// Used by pinokio.js menu items via `params: { path: "<relative-folder>" }`.
module.exports = {
  run: [{
    method: "fs.open",
    params: {
      path: "{{input.path}}",
      action: "view"
    }
  }]
}
