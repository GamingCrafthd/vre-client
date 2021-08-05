const { app, BrowserWindow, ipcMain } = require('electron')

app.whenReady().then(() => {
    const window = new BrowserWindow({
        title: "VRE Client",
        width: 300,
        height: 400,
        autoHideMenuBar: true,
        icon: "icon.png",
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    window.menuBarVisible = false;
    window.loadFile("login.html")
    ipcMain.on('resize', (event, arg) => {
        window.setSize(arg.width, arg.height)
        window.center()
    })
    ipcMain.on('open_file', (event, arg) => window.loadFile(arg.file))
    ipcMain.on('fullscreen', event => {
        window.resizable = true
        window.setFullScreen(true)
    })
})

ipcMain.on('manage:vehicles', event => openWindow("management/vehicles.html", "Fuhrparkverwaltung"))

ipcMain.on('manage:maps', event => openWindow("management/maps.html", "Mapverwaltung"))

ipcMain.on('manage:rules', event => openWindow("management/rules.html", "Weisungsverwaltung"))

ipcMain.on('manage:user', event => openWindow("management/user.html", "Userverwaltung"))

function openWindow(file, name) {
    const window = new BrowserWindow({
        title: name,
        width: 640,
        height: 480,
        autoHideMenuBar: true,
        icon: "icon.png",
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    window.menuBarVisible = false;
    window.loadFile(file)
}