
var { app, BrowserWindow, Tray, Menu } = require("electron");
var path = require("path");
var url = require("url");

var iconpath = path.join(__dirname, "./assets/img/bee-illustration.png");

let tray = null;

app.on("ready", function() {
  var win = new BrowserWindow({ width: 600, height: 600, icon: iconpath });
  win.loadFile(path.join(__dirname, "index.html"));
  
  win.on("minimize", () => {
    if (tray) {
      return win.hide();
    }
    tray = new Tray(iconpath);
  
    const template = [
      {
        label: "Show App",
        click: function () {
          win.show();
        },
      },
      {
        label: "Quit",
        click: function () {
          win.close();
        },
      },
    ];
  
    const contextMenu = Menu.buildFromTemplate(template);
    tray.setContextMenu(contextMenu);
    tray.setToolTip("Bee Portal");
    win.hide();
  
  });
});

