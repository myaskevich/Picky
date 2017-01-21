const {app, Menu, Tray} = require('electron')

let tray = null

app.on('ready', () => {
  tray = new Tray('./assets/Icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click() { app.quit() }},
  ])
  tray.setToolTip('Picky')

  tray.on('click', () => {
    console.log('choose color');
  })

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
})
