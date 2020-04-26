const ipc = require("electron").ipcRenderer;
const $ = require("jquery");

let data;
let bookID = 0;

function draw() {
  let isbn =  undefined;
  if( data[bookID].ID["opf:scheme"].includes("ISBN")){
    isbn = data[bookID]["ID"]["#text"]
  }
  $("#bookTitle")[0].innerText = data[bookID]["title"];
  try{
    $(
      "#bookIMG"
    )[0].src = `data:image/${data[bookID].cover[0]};base64, ${data[bookID].cover[1]}`;
  
  } catch(e){1==1;}
  
  $("#bookInfo")[0].innerHTML = `Book Author: ${data[bookID].creator["#text"]}</br>Book ISBN: ${isbn}</br>Book Publisher: ${data[bookID].publisher}`
}

$(document).ready(function () {
  ipc.sendTo(1, "Loaded", "we are go");
  ipc.on("previewData", function (event, arg) {
    data = arg;
    console.log("Hello!");
    console.log(data);

    draw();
  });
});

$("#nextBtn").click(() => {
  bookID++;
  draw();
});
