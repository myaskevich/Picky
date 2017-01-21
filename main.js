const { app, Menu, Tray, clipboard, dialog } = require('electron')

const execa = require('execa')
const rgbHex = require('rgb-hex')

app.on('ready', () => {
  const tray = new Tray(__dirname + '/assets/Icon.png')
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit Picky', click() { app.quit() }},
  ])

  tray.setToolTip('Picky')

  tray.on('click', () => {
    let hex, error = ''
    const picker = execa('osascript', [__dirname + '/scripts/ChooseColor.scpt'])

    picker.stdout.on('data', (data) => {
      const rgb = data
        .toString()
        .split(', ')
        .map(Number)
        .map(n => n / 257)

      hex = rgbHex.apply(null, rgb)
    })

    picker.stderr.on('data', (data) => {
      error = data.toString()
    })

    picker.on('exit', (code) => {
      if (hex && code === 0) {
        clipboard.writeText(`#${hex}`)
      } else if (error && code !== 0) {
        if (error.indexOf('User canceled. (-128)') === -1) {
          dialog.showErrorBox('Error', String(error))
        }
      }
    })
  })

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
})
