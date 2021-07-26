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
})