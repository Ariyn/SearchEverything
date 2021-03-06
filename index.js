const { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray, globalShortcut } = require('electron')
const path = require('path')
const fs = require('fs')

memo = function() {
    db = {"bbbb": "test", "test1":"test", "test2": "test2", "test3":"test3", "test4":"test4"}
    return {
        db: this.db,
        search(title) {
            results = []
            console.log(this.db)
            for (const key in this.db) {
                if (key.indexOf(title) != -1) {
                    results.push({
                        "title": key,
                        "body": this.db[key],
                    })
                }
            }

            return results
        },
        set(title, body) {
            console.log(this.db)
            // if(this.db[title] !== undefined) {
            //     return "already exists"
            // }

            this.db[title] = body
        }
    }
}()

ipcMain.on("memo-request", (event, action, ...args) => {
    console.log(action, args)

    switch (action) {
        case "save":
            if (args.length != 2) {
                event.returnValue = "incorrect arguments"
                return
            }

            const localDbResult = memo.set(args[0], args[1])
            if(localDbResult == "already exists") {
                event.returnValue = localDbResult;
                return
            }

            try {
                const data = fs.writeFileSync(args[0], args[1])
                console.log("data", data)
                event.returnValue = "done"
            } catch (err) {
                console.log("errored", err)
                event.returnValue = err;
            }
            break
        case "search":
            if (args.length != 1) {
                event.returnValue = "incorrect arguments"
                return
            }
            if (args[0] == "") {
                event.returnValue = []
                return 
            }

            event.returnValue = memo.search(args[0])
            break
    }
    return
})

function createWindow () {
    if(windowMutex) {
        return
    }
    
    const win = new BrowserWindow({
      width: 500,
      height: 460,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          preload: 'preload.js',
      },
      frame: false,
      transparent: true,
    })
  
    win.loadFile('main.html')
    windowMutex = true;
  }

var windowMutex = false;
var lastClickedTime = null;
app.whenReady().then(() => {
    const ret = globalShortcut.register('CommandOrControl+Space', () => {
        let now = new Date();
        if (lastClickedTime != null && now - lastClickedTime <= 300) {
            createWindow();
            lastClickedTime = null;
        } else {
            lastClickedTime = now;
        }
        

        console.log('CommandOrControl+Space is pressed')
      })
    
      if (!ret) {
        console.log('registration failed')
      }
    
      // Check whether a shortcut is registered.
      console.log(globalShortcut.isRegistered('CommandOrControl+Space'))

      if (!tray) { // if tray hasn't been created already.
        createTray()
    }

  createWindow()
})

let tray = null
function createTray () {
    // https://www.flaticon.com/kr/authors/pixel-perfect/tritone
  const icon = './icon.png' // required.
  console.log(icon)
  const trayicon = nativeImage.createFromPath(icon)
  tray = new Tray(trayicon.resize({ width: 16 }))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        createWindow()
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit() // actually quit the app.
      }
    },
  ])

  tray.setContextMenu(contextMenu)
}

app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
    // app.dock.hide()
    windowMutex = false;
})

app.on('will-quit', () => { 
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })

var i=0;
setInterval(() => {
    console.log("here "+i)
    i++;

}, 1000)