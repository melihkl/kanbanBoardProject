const ipcRenderer = window.require("electron").ipcRenderer;
const fs = require("fs");

function boardList(count, result) {
  for (let i = 0; i < count; i++) {
    var div = document.createElement("div");
    let spanTanim = document.createElement("span");
    var spanAciklama = document.createElement("span");
    var spanTarih = document.createElement("span");
    var spanDurum = document.createElement("span");

    var duzenleBtn = document.createElement("button");
    var silBtn = document.createElement("button");

    spanTanim.className = "tanim-text";
    spanAciklama.className = "aciklama-text";
    spanTarih.className = "tarih-text";
    spanDurum.className = "durum-text";
    silBtn.className = "sil";
    silBtn.innerHTML = "Sil";
    duzenleBtn.className = "duzenle";
    // duzenleBtn.id = "duzenle" + div.id;

    duzenleBtn.innerHTML = "Düzenle";
    div.id = i;
    spanDurum.id = "status" + i;
    silBtn.id = div.id;
    duzenleBtn.id = div.id;

    div.className = "list-box";
    div.draggable = "true";

    div.appendChild(spanTanim);
    div.appendChild(spanAciklama);
    div.appendChild(spanTarih);
    div.appendChild(spanDurum);
    div.appendChild(silBtn);
    div.appendChild(duzenleBtn);

  //silme islemi
    silBtn.addEventListener("click", function (e) {
      if (confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
        e.target.parentNode.remove();
        ipcRenderer.send("task:delete", e.target.getAttribute("id"));
      }
    });

    //durumlara gore listeleme

    if (result[i].status === "Progress") {
      document.querySelector(".progress").appendChild(div);
      spanTanim.innerHTML = result[i].tanim;
      spanAciklama.innerHTML = result[i].aciklama;
      spanTarih.innerHTML = result[i].tarih;
      spanDurum.innerHTML = result[i].status;
      spanDurum.style.backgroundColor = "#0747a6";
    } else if (result[i].status === "To Do") {
      document.querySelector(".todo").appendChild(div);
      spanTanim.innerHTML = result[i].tanim;
      spanAciklama.innerHTML = result[i].aciklama;
      spanTarih.innerHTML = result[i].tarih;
      spanDurum.innerHTML = result[i].status;
      spanDurum.style.backgroundColor = "#FB8072";
    } else if (result[i].status === "Done") {
      document.querySelector(".done").appendChild(div);
      spanTanim.innerHTML = result[i].tanim;
      spanAciklama.innerHTML = result[i].aciklama;
      spanTarih.innerHTML = result[i].tarih;
      spanDurum.innerHTML = result[i].status;
      spanDurum.style.backgroundColor = "#00875a";
    }
  }
}

function dragDrop(result) {
  let lists = document.getElementsByClassName("list-box");
  let done = document.querySelector(".done");
  let progress = document.querySelector(".progress");
  let todo = document.querySelector(".todo");

  let list = [];

  for (list of lists) {
    list.addEventListener("dragstart", function (e) {
      let selected = e.target;
      let x = e.toElement.id;
      let sDurumListe = document.querySelectorAll(".list-box #status" + x);

      //status u done yapma
      done.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      done.addEventListener("drop", function (e) {
        done.appendChild(selected);
        result[x].status = "Done";
        sDurumListe[0].innerHTML = "Done";
        sDurumListe[0].style.backgroundColor = "#00875a";
        jsonUpdate(x, "Done");
        selected = null;
      });

      //status u progress yapma
      progress.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      progress.addEventListener("drop", function (e) {
        progress.appendChild(selected);
        result[x].status = "Progress";
        sDurumListe[0].innerHTML = "Progress";
        sDurumListe[0].style.backgroundColor = "#0747a6";
        jsonUpdate(x, "Progress");
        selected = null;
      });

      //status u todo yapma
      todo.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      todo.addEventListener("drop", function (e) {
        todo.appendChild(selected);
        result[x].status = "To Do";
        sDurumListe[0].innerHTML = "To Do";
        sDurumListe[0].style.backgroundColor = "#FB8072";
        jsonUpdate(x, "To Do");
        selected = null;
      });
    });
  }

}

function jsonUpdate(i, durumBilgi) {
  var readJson = fs.readFileSync("data.json");
  var jsonObj = JSON.parse(readJson);

  jsonObj[i].status = durumBilgi;

  const jsonData = JSON.stringify(jsonObj, null, 2);

  const finished = (error) => {
    if (error) {
      console.log(error);
      return;
    }
  };

  fs.writeFileSync("data.json", jsonData, finished);
}

ipcRenderer.on("initApp", (e, result) => {
  boardList(result.length, result);
  dragDrop(result);
  duzenleme();
});
