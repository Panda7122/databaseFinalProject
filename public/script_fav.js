// script_fav.js
var resultsDiv = document.getElementById("results");

document.addEventListener("DOMContentLoaded", function () {
  fetch("/check-session")
    .then((response) => response.json())
    .then((data) => {
      if (data.loggedIn) {
        document.getElementById(
          "greeting"
        ).textContent = `你好，${data.nickname}`;
        // 調用 showFavorite 函數來顯示最愛列表
        showFavorite(document.getElementById("results"));
      }
    });
});

function showFavorite(resultsDiv) {
  fetch("/read-card")
    .then((response) => response.json())
    .then((favorites) => {
      var tooltips = [];
      favorites.forEach((favorite) => {
        var resultDiv = document.createElement("div");
        resultDiv.className = "result image-container";

        var img = document.createElement("img");
        img.src =
          "https://tinghan33704.com/tos_tool_data/img/monster/" +
          favorite.card_id +
          ".png";

        var iconStar = document.createElement("img");
        iconStar.setAttribute("class", "tooltipIcon");

        iconStar.src = `./icon/icon_${favorite.star}.png`;
        var iconRace = document.createElement("img");
        iconRace.setAttribute("class", "tooltipIcon");
        iconRace.src = getRaceIconPath(favorite.race);
        var iconAttribute = document.createElement("img");
        iconAttribute.setAttribute("class", "tooltipIcon");
        iconAttribute.src = getAttributeIconPath(favorite.attribute);
        const TitleColor = {
          光: { background: "rgba(40, 28, 13, 0.8)", text: "#C68E42" },
          暗: { background: "rgba(25, 1, 34, 0.8)", text: "#7B16AC" },
          水: { background: "rgba(15, 17, 34, 0.8)", text: "#4B55AC" },
          木: { background: "rgba(5, 23, 2, 0.8)", text: "#127319" },
          火: { background: "rgba(36, 11, 7, 0.8)", text: "#B23625" },
        };
        var cardNameText = document.createElement("div");
        cardNameText.setAttribute("class", "tooltipTitle");
        cardNameText.appendChild(iconAttribute);
        cardNameText.appendChild(iconRace);
        cardNameText.appendChild(iconStar);
        cardNameText.innerHTML =
          cardNameText.innerHTML + (favorite.c_name || favorite.name || "undefined");
        cardNameText.style.backgroundColor =
          TitleColor[favorite.attribute].background;
        cardNameText.style.color = TitleColor[favorite.attribute].text;

        var skillname = document.createElement("p");
        skillname.setAttribute("class", "tooltipSkillName");
        skillname.innerHTML = favorite.name + "<br>";

        var contentText = document.createElement("p");
        contentText.setAttribute("class", "tooltipContent");

        var content = favorite.description
          ? favorite.description.replace(/\n/g, "<br>")
          : "沒有技能";
        contentText.innerHTML = content.replace(
          /board{(\d+)}([^<]+)/g,
          "<span class='fixed_board_label', id=\"fixed_board_label_$1\" onmouseenter='showBoard($1, event)' onmouseleave='clearBoard()'>$2</span>"
        );
        // div.appendChild(iconAttribute);
        // div.appendChild(iconRace);
        // div.appendChild(iconStar);
        // div.appendChild(cardNameText);
        var tooltipText = document.createElement("div");
        tooltipText.className = "tooltip";
        tooltipText.style.display = "none";
        tooltipText.appendChild(cardNameText);
        tooltipText.appendChild(skillname);
        tooltipText.appendChild(contentText);

        tooltips.push(tooltipText);

        resultDiv.onclick = function () {
          // 關閉所有其他的 tooltips
          tooltips.forEach(function (otherTooltip) {
            if (otherTooltip !== tooltipText) {
              otherTooltip.style.display = "none";
            }
          });
          // 切換當前 tooltip 的顯示狀態
          tooltipText.style.display =
            tooltipText.style.display === "none" ? "block" : "none";
        };

        resultDiv.appendChild(img);
        resultDiv.appendChild(tooltipText);
        var p = document.createElement("p");
        p.textContent = favorite.card_id;
        resultDiv.appendChild(p);

        resultsDiv.appendChild(resultDiv);

        fetch("/check-session")
          .then((response) => response.json())
          .then((data) => {
            if (data.loggedIn && data.username) {
              var deleteButton = document.createElement("button");
              deleteButton.setAttribute('class', 'coolButton')
              deleteButton.textContent = "從我的最愛刪除";
              deleteButton.onclick = function () {
                // 關閉所有其他的 tooltips
                tooltips.forEach(function (otherTooltip) {
                  otherTooltip.style.display = "none";
                });
                fetch("/delete-card", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    cardId: favorite.card_id,
                    nickname: data.nickname,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.success) {
                      console.log("卡片已從收藏中刪除。");
                      resultDiv.remove();
                    } else {
                      console.error("刪除卡片失敗。");
                    }
                  })
                  .catch((error) => {
                    console.error("刪除卡片過程中出現錯誤:", error);
                  });
              };
              tooltipText.appendChild(deleteButton);
            }
          });
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getRaceIconPath(race) {
  if (race == "神族") {
    race = "god";
  } else if (race == "魔族") {
    race = "demon";
  } else if (race == "人類") {
    race = "human";
  } else if (race == "獸族") {
    race = "beast";
  } else if (race == "龍類") {
    race = "dragon";
  } else if (race == "妖精類") {
    race = "elf";
  } else if (race == "機械族") {
    race = "machina";
  } else if (race == "強化素材") {
    race = "level_up";
  } else if (race == "進化素材") {
    race = "evolve";
  } else {
    return `./icon/icon_beast.png`;
  }
  return `./icon/icon_${race}.png`;
}

function getAttributeIconPath(attribute) {
  if (attribute == "水") {
    attribute = "w";
  } else if (attribute == "火") {
    attribute = "f";
  } else if (attribute == "木") {
    attribute = "e";
  } else if (attribute == "光") {
    attribute = "l";
  } else if (attribute == "暗") {
    attribute = "d";
  } else {
    return `./icon/icon_d.png`;
  }

  return `./icon/icon_${attribute}.png`;
}
