function showBoard(id, event) {
  // console.log(x, y)
  fetch(`/searchBoard/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        updateBoard(id, data.board.name, event);
      } else {
        console.error(data.message);
      }
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
}
function updateBoard(id, str, event) {
  // var str = '1,1,1,1,1,1\nW,F,E,L,D,H\nW,F,E,L,D,H\nW,F,E,L,D,H\nW,F,E,L,D,H'
  const race = {
    h: "human",
    g: "god",
    b: "beast",
    d: "demon",
    m: "machina",
    e: "elf",
    r: "dragon",
  };
  str = str.replace(/undefined/g, "u");
  // let S = str.split(";");
  // console.log(str, S)
  let ban = str.split("\n");
  let row = ban.length;
  for (let i = 0; i < row; i++) {
    ban[i] = ban[i].split(",");
  }
  let col = ban[0].length;
  // console.log(row, col);
  // console.log(ban);
  // console.log(background);
  var table = '<table id="board">';
  // table.setAttribute('id', 'board');
  // table.style.border = '1px solid black';
  for (let i = 0; i < row; i++) {
    var tr = "<tr>";
    for (let j = 0; j < col; j++) {
      // var td = document.createElement('td');
      var bgc = "";
      if ((i + j) % 2 == 0) {
        bgc = "rgba(89, 50, 23, 0.7)";
      } else {
        bgc = "rgba(194, 144, 109, 0.7)";
      }
      var td =
        "<td style='border:1px solid black;width:32px;height:32px;" +
        "background-color: " +
        bgc +
        ";'>";
      // var div1 = document.createElement('div');
      var div1 = "<div class = runeAttrImg>";
      // div1.setAttribute('class', 'runeAttrImg');
      // td.style.border = '1px solid black';
      // td.style.width = '32px'; td.style.height = '32px';

      // td.style.opacity = '0.7';
      // var img = document.createElement('img');
      imgSrc = "";
      // img.style.width = '32px'; img.style.height = '32px';
      if (ban[i][j][0] <= "z" && ban[i][j][0] >= "a") {
        imgSrc = "./icon/rune_" + ban[i][j][0] + ".png";
      } else if (ban[i][j][0] <= "Z" && ban[i][j][0] >= "A") {
        // now = ban[i][j];
        imgSrc = "./icon/rune_" + ban[i][j][0].toLowerCase() + "_enc.png";
      } else if (ban[i][j][0] <= "9" && ban[i][j][0] >= "1") {
        imgSrc = "./icon/rune_" + ban[i][j][0] + ".png";
      }
      if (ban[i][j][0] != "-") {
        var img = "<img style = 'width:32px; height:32px;' src=" + imgSrc + ">";
        div1 = div1 + img;
      }
      // td.appendChild(div1);
      if (ban[i][j][1] !== undefined) {
        // var div2 = document.createElement('div');
        var div2 = "<div class=runeRaceImg>";
        // div2.setAttribute('class', 'runeRaceImg');
        var raceImgSrc = "./icon/rune_" + race[ban[i][j][1]] + ".png";
        var raceImg =
          "<img style='width:32px;height:32px;' src=" + raceImgSrc + ">";
        // raceImg = document.createElement('img');
        // raceImg.style.width = '32px'; raceImg.style.height = '32px';
        div2 = div2 + raceImg + "</div>";
        // div2.appendChild(raceImg);
        // div1.appendChild(div2);
        div1 = div1 + div2;
      }
      td = td + div1 + "</div></td>";
      tr = tr + td;
      // tr.appendChild(td);
    }
    tr = tr + "</tr>";
    table = table += tr;
    // table.appendChild(tr);
  }
  table = table + "</table>";
  tableDiv = document.getElementById("fixedBoard");
  tableDiv.innerHTML = table;
  // console.log("fixed_board_label_" + id.toString());
  // const span = document.getElementById('fixed_board_label_' + id.toString());
  // console.log(span.style)
  // console.log(span.clientLeft, span.clientTop)

  const x = Math.min(1674, event.clientX);
  const y = event.clientY;
  // console.log(x, y);
  // x = span.left
  // y = span.top
  tableDiv.style.display = "block";
  tableDiv.style.left = x + "px";
  tableDiv.style.top = y + "px";
  // tableDiv.style.pageY = y + span.height
}
function clearBoard() {
  tableDiv = document.getElementById("fixedBoard");
  tableDiv.style.display = "none";
}
// updateBoard(0, 'We,Fe,Ee,Le,De,He\nWe,Fe,Ee,Le,De,He\nWe,Fe,Ee,Le,De,He\n-,-,-,-,-,-\n-,-,-,-,-,-\n-,-,-,-,-,-\n-,-,-,-,-,-\n-,-,-,-,-,-');
