const $ = require("jquery");
const fs = require("fs");
const { remote } = require("electron");
const { BrowserWindow } = require("electron").remote;
const dialog = remote.dialog;
const WIN = remote.getCurrentWindow();
const reader = require("epub-info-reader");
const ipc = require("electron").ipcRenderer;
console.log(ipc);
let folderPath;
let books = [];
let previewID;

ipc.on("Loaded", () =>{
  ipc.sendTo(previewID, "previewData", books);

})

function getFolderName(path) {
  return path.substring(path.lastIndexOf("/") + 1);
}

async function getFolderPath() {
  let options = {
    title: "Choose Folder",
    defaultPath: "/home/",
    properties: ["openDirectory"],
  };

  let data = await dialog.showOpenDialog(WIN, options);
  return data.filePaths[0];
}

function showPreview() {
  let win = new BrowserWindow({
    width: 475,
    height: 815,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.loadURL(`file://${__dirname}/preview.html`);
  previewID = win.webContents.id;

}

$("#folderSelect").click((e) => {
  getFolderPath().then((data) => {
    folderPath = data;
    e.target.innerText = getFolderName(folderPath);
  });
});

$("#startBtn").click(() => {
  if (!folderPath) {
    alert("Please choose a folder!");
  } else {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        alert(err);
      } else {
        files.forEach((file) => {
          if (file.substring(file.length - 4) === "epub") {
            reader.parseEpub(folderPath + "/" + file, (err, data) => {
              reader.getCover(folderPath + "/" + file, (err, cover) => {
                data["cover"] = cover;
                books.push(data);

              } );
            });
          }
        });
        showPreview();
      }
    });
  }
});
