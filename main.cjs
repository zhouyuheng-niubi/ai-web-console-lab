
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,

    webPreferences: {
      zoomFactor: 1.0,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar:true
  });
  // 使用 file:// 协议加载，并设置基础路径
  const indexPath = path.join(__dirname, 'dist/index.html');
  win.loadFile(indexPath) // 加载本地 HTML 文件
  // 开发工具调试模式
  // win.webContents.openDevTools();
  win.setAspectRatio(16 / 9);
}

// if (import.meta.env.DEV) {
//   import('vconsole').then(({ default: VConsole }) => {
//     new VConsole()  // 初始化，页面会出现vConsole按钮
//   })
// }



app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
