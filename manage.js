let loaded = false

function loadButtons() {
    if(loaded) return
    loaded = true

    document.getElementById("manage_user").addEventListener("click", () => {
        ipcRenderer.send('manage:user')
    })

    document.getElementById("manage_vehicles").addEventListener("click", () => {
        ipcRenderer.send('manage:vehicles')
    })

    document.getElementById("manage_maps").addEventListener("click", () => {
        ipcRenderer.send('manage:maps')
    })

    document.getElementById("manage_rules").addEventListener("click", () => {
        ipcRenderer.send('manage:rules')
    })
}