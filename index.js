const { app, BrowserWindow, ipcMain } = require('electron')
require('update-electron-app')({
    repo: "GamingCrafthd/vre-client"
})
if (require('electron-squirrel-startup')) return app.quit()
if (handleSquirrelEvent()) return

function handleSquirrelEvent() {
    if (process.argv.length === 1) return false
    const ChildProcess = require('child_process')
    const path = require('path')
    const appFolder = path.resolve(process.execPath, '..')
    const rootAtomFolder = path.resolve(appFolder, '..')
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
    const exeName = path.basename(process.execPath)
    const spawn = function(command, args) {
        let spawnedProcess
        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
        } catch (e) {}
        return spawnedProcess
    }
    const spawnUpdate = function(args) { return spawn(updateDotExe, args) }
    const squirrelEvent = process.argv[1]
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName])
            setTimeout(app.quit, 1000)
            return true
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName])
            setTimeout(app.quit, 1000)
            return true
        case '--squirrel-obsolete':
            app.quit()
            return true
    }
}

app.whenReady().then(() => {
    let not_admin = true,
        admin = false;

    // Get admin privilges
    if (not_admin) admin = true;

    const loading_screen = openWindow("goodbye.html", "VRE-Client", false, 480, 320)
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
        },
        show: false
    })
    window.menuBarVisible = false
    window.loadFile("login.html")
    setTimeout(() => {
        loading_screen.hide()
        window.show()
    }, false ? 10000 : 1)
    window.on('close', () => {
        console.log("Good-bye!")
        openWindow("goodbye.html", "VRE-Client", false, 480, 320)
            //setTimeout(app.quit, 5000)
        setTimeout(app.quit, false ? 5000 : 1)
    })
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

ipcMain.on('manage:vehicles', event => openWindow("management/vehicles.html", "Fuhrparkverwaltung", true, 640, 480))

ipcMain.on('manage:maps', event => openWindow("management/maps.html", "Mapverwaltung", true, 640, 480))

ipcMain.on('manage:rules', event => openWindow("management/rules.html", "Weisungsverwaltung", true, 640, 480))

ipcMain.on('manage:user', event => openWindow("management/user.html", "Userverwaltung", true, 640, 480))

function openWindow(file, name, frame, width, height) {
    const window = new BrowserWindow({
        title: name,
        width: width,
        height: height,
        autoHideMenuBar: true,
        icon: "icon.png",
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: frame
    })
    window.menuBarVisible = false
    window.loadFile(file)
    return window;
}