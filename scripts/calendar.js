const fs = require("fs");
const monthYearElement = document.getElementById("monthYear");
const datesElement = document.getElementById("dates");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentDate = new Date();
var readJson;
var jsonObj;
// json dosyasındaki verileri oku
function jRead() {
  readJson = fs.readFileSync("data.json");
  jsonObj = JSON.parse(readJson);
  return jsonObj;
}

const updateCalendar = () => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const firstDay = new Date(currentYear, currentMonth, 0);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();
  const firstDayIndex = firstDay.getDay();
  const lastDayIndex = lastDay.getDay();

  const monthYearString = currentDate.toLocaleString("tr-TR", {
    month: "long",
    year: "numeric",
  });
  monthYearElement.textContent = monthYearString;
  jRead();

  //json tarihi split etmek icin
  var jsondt = [];
  var jsonDateParse;
  var jsonDateList = [];
  var jsonYear = [];
  var jsonMonth = [];
  var jsonDay = [];

  for (let j = 0; j < jsonObj.length; j++) {
    jsondt[j] = jsonObj[j].tarih;
    jsonDateParse = jsondt[j].split("-");
    jsonDateList.push(...jsonDateParse);
  }

  for (let j = 0; j < jsonDateList.length; j = j + 3) {
    jsonYear.push(jsonDateList[j]);
  }

  for (let j = 1; j < jsonDateList.length; j = j + 3) {
    jsonMonth.push(jsonDateList[j]);
  }

  for (let j = 2; j < jsonDateList.length; j = j + 3) {
    jsonDay.push(jsonDateList[j]);
  }

  let event = false;
  let datesHTML = "";

  for (let i = firstDayIndex; i > 0; i--) {
    const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
    datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
  }

  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    // json dosyasındaki tarihin gun/ay/yil olarak ayrildiktan sonra karsilastirilmasi
    for (let x = 0; x < jsonDay.length; x++) {
      if (jsonMonth[x] < 10 && jsonDay[x] < 10) {
        if (
          jsonMonth[x] === "0" + (currentMonth + 1) &&
          jsonYear[x] == currentYear &&
          jsonDay[x] == "0" + i
        ) {
          event = true;
        }
      } else if (jsonMonth[x] >= 10 && jsonDay[x] < 10) {
        if (
          jsonMonth[x] == currentMonth + 1 &&
          jsonYear[x] == currentYear &&
          jsonDay[x] == "0" + i
        ) {
          event = true;
        }
      } else if (jsonMonth[x] < 10 && jsonDay[x] >= 10) {
        if (
          jsonMonth[x] == currentMonth + 1 &&
          jsonYear[x] == currentYear &&
          jsonDay[x] == +i
        ) {
          event = true;
        }
      } else if (jsonMonth[x] >= 10 && jsonDay[x] >= 10) {
        if (
          jsonMonth[x] == currentMonth + 1 &&
          jsonYear[x] == currentYear &&
          jsonDay[x] == +i
        ) {
          event = true;
        }
      }
    }
    const activeClass =
      date.toDateString() === new Date().toDateString() ? "active" : "";

    if (event) {
      datesHTML += `<div class="date event ${activeClass}">${i}</div>`;
      event = false;
    } else {
      datesHTML += `<div class="date ${activeClass}">${i}</div>`;
    }
  }

  for (let i = 1; i <= 7 - lastDayIndex; i++) {
    const nextDate = new Date(currentYear, currentMonth + 1, i);
    datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
  }

  datesElement.innerHTML = datesHTML;
};

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
  listeleme();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
  listeleme();
});

updateCalendar();
listeleme();

function listeleme() {
  jRead();
  let btn = document.getElementsByClassName("date event");
  let monthYear = document.getElementById("monthYear");

  let s;
  let fulTarih;

  /*
  var tt = document.createElement("task-box");
  var tnmL = document.createElement("block-one");
  var ackL = document.createElement("block-two");
  var drmL = document.createElement("block-three");
*/

  for (b of btn) {
    b.addEventListener("click", function (e) {
      let gun = e.target.innerHTML;
      s = monthYear.innerHTML.split(" ");
      if (s[0] === "Ocak") {
        s[0] = "01";
      }
      if (s[0] === "Şubat") {
        s[0] = "02";
      }
      if (s[0] === "Mart") {
        s[0] = "03";
      }
      if (s[0] === "Nisan") {
        s[0] = "04";
      }
      if (s[0] === "Mayıs") {
        s[0] = "05";
      }
      if (s[0] === "Haziran") {
        s[0] = "06";
      }
      if (s[0] === "Temmuz") {
        s[0] = "07";
      }
      if (s[0] === "Ağustos") {
        s[0] = "08";
      }
      if (s[0] === "Eylül") {
        s[0] = "09";
      }
      if (s[0] === "Ekim") {
        s[0] = "10";
      }
      if (s[0] === "Kasım") {
        s[0] = "11";
      }
      if (s[0] === "Aralık") {
        s[0] = "12";
      }

      if (gun > 10) {
        fulTarih = s[1] + "-" + s[0] + "-" + gun;
        for (let j = 0; j < jsonObj.length; j++) {
          if (jsonObj[j].tarih == fulTarih) {
            taskDivAdd(
              jsonObj[j].tanim,
              jsonObj[j].aciklama,
              jsonObj[j].status
            );
          }
        }
      }

      if (gun < 10) {
        fulTarih = s[1] + "-" + s[0] + "-0" + gun;
        for (let j = 0; j < jsonObj.length; j++) {
          if (jsonObj[j].tarih == fulTarih) {
            taskDivAdd(
              jsonObj[j].tanim,
              jsonObj[j].aciklama,
              jsonObj[j].status
            );
          }
        }
      }
    });
  }
}

// takvimde secilen tarihin icindeki tasklari listeleme

function taskDivAdd(tanim, aciklama, durum) {
  let tasks = document.getElementById("tasks");
  var taskBox = document.createElement("div");
  var blockOne = document.createElement("div");
  var blockTwo = document.createElement("div");
  var blockThree = document.createElement("div");
  var divTnm = document.createElement("div");
  var divAck = document.createElement("div");
  var divDrm = document.createElement("div");
  var labelTnm = document.createElement("label");
  var labelAck = document.createElement("label");
  var labelDrm = document.createElement("label");

  taskBox.className = "task-box";
  blockOne.className = "blockOne";
  blockTwo.className = "blockTwo";
  blockThree.className = "blockThree";
  divTnm.className = "tnmL";
  divAck.className = "ackL";
  divDrm.className = "drmL";

  labelTnm.innerHTML = "Tanım : ";
  labelAck.innerHTML = "Açıklama : ";
  labelDrm.innerHTML = "Durum : ";

  tasks.appendChild(taskBox);
  taskBox.appendChild(blockOne);
  blockOne.append(labelTnm, divTnm);

  divTnm.innerHTML = tanim;

  taskBox.appendChild(blockTwo);
  blockTwo.append(labelAck, divAck);
  divAck.innerHTML = aciklama;

  taskBox.appendChild(blockThree);
  blockThree.append(labelDrm, divDrm);
  divDrm.innerHTML = durum;
}

let removeBtn = document.getElementById("remove");

removeBtn.addEventListener("click", () => {
  let tasks = document.getElementById("tasks");
  let taskbox = document.querySelectorAll(".task-box");

  for (let tBox of taskbox) {
    tasks.removeChild(tBox);
  }
});
