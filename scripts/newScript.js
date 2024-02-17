const ipcRenderer = window.require("electron").ipcRenderer;

let saveBtn = document.querySelector(".saveBtn");
let tanimValue = document.querySelector(".tanim");
let aciklamaValue = document.querySelector(".aciklama");
let tarihValue = document.querySelector(".tarih");
let durumValue = document.querySelector(".status-info");


saveBtn.addEventListener("click", () => {
  ipcRenderer.send("newTask:save", [
    tanimValue.value,
    aciklamaValue.value,
    tarihValue.value,
    durumValue.value,
  ]);
});
