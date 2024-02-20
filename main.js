const electron = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 750,
    icon: __dirname + "./assets/icons.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      devTools: !app.isPackaged,
    },
  });
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "./pages/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
/*
  var arr = [];
  fs.existsSync("data.json", function(exist){
    if(!exist){    
      fs.writeFile("data.json", JSON.stringify(arr),"utf-8", (err)=> {
        console.log(err);
      })
    }
  });
  */

   //dosya yoksa yeni kayit dosyasi olusturma
  var arr = [];
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.log("Config file doesnot exist, creationg one.");
      fs.writeFile("data.json", JSON.stringify(arr), "utf-8", (err) => {
        console.log(err);
      });
    }
  });
 

  //kaydetme islemi
  ipcMain.on("newTask:save", (err, data) => {
    var readJson = fs.readFileSync("data.json");
    var jsonObj = JSON.parse(readJson);
    let id_num;
    if(jsonObj.length>0){
      id_num = (jsonObj[(jsonObj.length)-1].id);
    }
    else {
      id_num = 10;
    }
    
   
    var datas = {
      id: id_num + 1,
      tanim: data[0],
      aciklama: data[1],
      tarih: data[2],
      status: data[3],
    };

    jsonObj.push(datas);

    const jsonData = JSON.stringify(jsonObj, null, 2);

    const finished = (error) => {
      if (error) {
        console.log(error);
        return;
      }
    };

    fs.writeFileSync("data.json", jsonData, finished);
  });

  //silme islemi
  ipcMain.on("task:delete", (e, id) => {
    var readJson = fs.readFileSync("data.json");
    var jsonObj = JSON.parse(readJson);
    delete jsonObj[id];

    //json dosyasında null kaydını silmek icin
    jsonObj = jsonObj.filter((x) => x !== null);
    const jsonData = JSON.stringify(jsonObj, null, 2);

    const finished = (error) => {
      if (error) {
        console.log(error);
        return;
      }
    };

    fs.writeFileSync("data.json", jsonData, finished);
  });

  //update islemi
  ipcMain.on("newTask:update", (err, data) => {
    var readJson = fs.readFileSync("data.json");
    var jsonObj = JSON.parse(readJson);

    for (var i = 0; i < jsonObj.length; ++i) {
      if (jsonObj[i].id === data[0]) {
        jsonObj[i].tanim = data[1];
        jsonObj[i].aciklama = data[2];
        jsonObj[i].tarih = data[3];
        jsonObj[i].status = data[4];
      }
    }
    const jsonData = JSON.stringify(jsonObj, null, 2);

    const finished = (error) => {
      if (error) {
        console.log(error);
        return;
      }
    };

    fs.writeFileSync("data.json", jsonData, finished);
  });

  mainWindow.webContents.on("dom-ready", () => {
    var readJson = fs.readFileSync("data.json");
    var jsonObj = JSON.parse(readJson);

    mainWindow.webContents.send("initApp", jsonObj);
  });
});
