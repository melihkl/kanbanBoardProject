function duzenleme() {
  let duzenleBtn = document.getElementsByClassName("duzenle");

  for (duzen of duzenleBtn) {
    duzen.addEventListener("click", function (e) {
      var readJson = fs.readFileSync("data.json");
      var jsonObj = JSON.parse(readJson);
      let idx = e.target.id;
      let infoStatus;

      var infoPage = window.open(
        "update.html",
        "witdh = " + window.screen.width,
        "height = 700px"
      );
      infoPage.addEventListener("load", function () {
        let guncelleBtn = infoPage.document.getElementById("updateBtn");
        let uTanim = infoPage.document.getElementById("tanim");
        let uAciklama = infoPage.document.getElementById("aciklama");
        let uTarih = infoPage.document.getElementById("tarih");
        let uStatus = infoPage.document.querySelector(".status-info");

        if (jsonObj[idx].status == "To Do") {
          infoStatus = 1;
        } else if (jsonObj[idx].status == "Progress") {
          infoStatus = 2;
        } else if (jsonObj[idx].status == "Done") {
          infoStatus = 3;
        }
        uTanim.setAttribute("value", jsonObj[idx].tanim);
        uAciklama.innerHTML = jsonObj[idx].aciklama;
        uTarih.setAttribute("value", jsonObj[idx].tarih);
        uStatus.options[infoStatus].setAttribute("selected", "selected");

        guncelleBtn.addEventListener("click", () => {
          ipcRenderer.send("newTask:update", [
            jsonObj[idx].id,
            uTanim.value,
            uAciklama.value,
            uTarih.value,
            uStatus.value,
          ]);
          setTimeout(() => {
            infoPage.close();
          }, 1000);
        });
      });
    });
  }
}
