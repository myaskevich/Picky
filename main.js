const { resolve } = require('path')
const { app, Menu, Tray, clipboard } = require('electron')

const execa = require('execa')
const rgbHex = require('rgb-hex')

app.on('ready', () => {
  const tray = new Tray('./assets/Icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click() { app.quit() }},
  ])

  tray.setToolTip('Picky')

  tray.on('click', () => {
    const picker = execa('osascript', [resolve('./scripts/ChooseColor.scpt')])
    let hex

    picker.stdout.on('data', (data) => {
      const rgb = data
        .toString()
        .split(', ')
        .map(Number)
        .map(n => n / 257)

      hex = rgbHex.apply(null, rgb)
    })

    picker.on('error', console.error)

    picker.on('exit', (code) => {
      if (hex && code === 0) {
        clipboard.writeText(`#${hex}`)
      }
    })
  })

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
})
