let loaded = false

function loadButtons() {
    if (loaded) return
    loaded = true

    doc.getById("manage_user").addEventListener("click", () => {
        ipcRenderer.send('manage:user')
    })

    doc.getById("manage_vehicles").addEventListener("click", () => {
        ipcRenderer.send('manage:vehicles')
    })

    doc.getById("manage_maps").addEventListener("click", () => {
        ipcRenderer.send('manage:maps')
    })

    doc.getById("manage_rules").addEventListener("click", () => {
        ipcRenderer.send('manage:rules')
    })
}