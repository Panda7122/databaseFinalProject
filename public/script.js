var sMod = 1;

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// 紀錄點擊的角色敘述
var currentTooltip = null;

// 新增一個狀態變量來追蹤請求狀態
var isProcessing = false;

// When the user clicks the button, open the modal
function openModal() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// function manageCards() {
//   window.location.href = "managecards.html";
// }
function readFeedback() {
  window.location.href = "read_feedback.html";
}

// Redirects to the feedback page
function feedback() {
  window.location.href = "feedback.html";
}

// Redirects to the favorites page
function favorites() {
  window.location.href = "favorite.html";
}

function resetSelection() {
  // 選擇所有的 checkbox 元素
  var checkboxes = document.querySelectorAll(".tgl-flip");

  // 遍歷每個 checkbox 並將其設置為未選中
  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });
}

// 打開忘記密碼模態框
function forgotPassword() {
  document.getElementById("forgotPasswordModal").style.display = "block";
}

// 關閉忘記密碼模態框
function closeForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").style.display = "none";
}

// 重設密碼
function resetPassword() {
  var username = document.getElementById("fp_username").value;
  var nickname = document.getElementById("fp_nickname").value;
  var newPassword = document.getElementById("fp_new_password").value;
  var confirmPassword = document.getElementById("fp_confirm_password").value;

  // 檢查新密碼與確認密碼是否一致
  if (newPassword !== confirmPassword) {
    alert("新密碼與確認密碼不一致");
    return;
  }

  // 發送重設密碼的請求
  fetch("/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      nickname: nickname,
      newPassword: newPassword,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      if (data.success) {
        closeForgotPasswordModal();
      }
    });
}

function search() {
  var input = document.getElementById("searchInput").value;
  var options = collectCheckboxStates();
  var queryString = encodeURIComponent(input);
  var searchMode = sMod ? "AND" : "OR";

  // Constructing a query string from the options object
  Object.keys(options).forEach((key) => {
    if (options[key] === "true") {
      queryString += `&${key}=true`;
    }
  });
  queryString += `&searchMode=${searchMode}`;

  // Fetch request with updated query
  fetch(`http://localhost:3300/search?query=${queryString}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Search results:", data);
      // Store the search results in local storage
      localStorage.setItem("searchResults", JSON.stringify(data));
      // Redirect to the results page
      window.location.href = "result.html";
    })
    .catch((error) => {
      console.error("Error during search:", error);
    });
}

function renderResult(result, resultsDiv) {
  fetch("formatted_character.json")
    .then((response) => response.json())
    .then((characters) => {
      var character = characters.find((c) => c.id == result.card_id);
      var resultDiv = document.createElement("div");
      resultDiv.className = "result image-container";

      var img = document.createElement("img");
      var tooltipText = document.createElement("div");
      tooltipText.className = "tooltip";

      // if (character) {
      img.src =
        "https://tinghan33704.com/tos_tool_data/img/monster/" +
        result.card_id +
        ".png";
      resultDiv.onclick = function () {
        // 如果當前 tooltip 已顯示且點擊的是同一個圖片，則隱藏它
        if (currentTooltip && this === currentImage) {
          currentTooltip.style.display = "none";
          currentTooltip = null;
          currentImage = null;
        } else {
          // 如果有其他 tooltip 正在顯示，先隱藏它
          if (currentTooltip) {
            currentTooltip.style.display = "none";
          }
          tooltipText.style.display = "block";
          currentTooltip = tooltipText;
          currentImage = this;
        }
      };

      // var div = document.createElement('div');
      var iconStar = document.createElement("img");
      iconStar.setAttribute("class", "tooltipIcon");

      iconStar.src = `./icon/icon_${result.star}.png`;
      var iconRace = document.createElement("img");
      iconRace.setAttribute("class", "tooltipIcon");
      iconRace.src = getRaceIconPath(result.race);
      var iconAttribute = document.createElement("img");
      iconAttribute.setAttribute("class", "tooltipIcon");
      iconAttribute.src = getAttributeIconPath(result.attribute);
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
        cardNameText.innerHTML + (result.name || "undefined");
      console.log(result)
      cardNameText.style.backgroundColor =
        TitleColor[result.attribute].background;
      cardNameText.style.color = TitleColor[result.attribute].text;

      var skillname = document.createElement("p");
      skillname.setAttribute("class", "tooltipSkillName");
      skillname.innerHTML = result.skill_name + ' ' + '<span style="font-size:15px;color:red;">' + result.charge + ':' + (result.charge_time >= 0 ? result.charge_time : '-') + '</span>' + "<br>";

      var contentText = document.createElement("p");
      contentText.setAttribute("class", "tooltipContent");
      var series = document.createElement("div");
      series.setAttribute("class", "tooltipSeries");
      series.innerHTML = result.series_name + "<br>";


      var content = result.description
        ? result.description.replace(/\n/g, "<br>")
        : "沒有技能";
      contentText.innerHTML = content.replace(
        /board{(\d+)}([^<]+)/g,
        "<span class='fixed_board_label', id=\"fixed_board_label_$1\" onmouseenter='showBoard($1, event)' onmouseleave='clearBoard()'>$2</span>"
      );
      tooltipText.appendChild(cardNameText);
      tooltipText.appendChild(skillname);
      tooltipText.appendChild(contentText);
      tooltipText.appendChild(series);



      resultDiv.appendChild(img);
      resultsDiv.appendChild(tooltipText);

      var p = document.createElement("p");
      p.textContent = result.card_id;
      resultDiv.appendChild(p);

      resultsDiv.appendChild(resultDiv);

      fetch("/check-session")
        .then((response) => response.json())
        .then((sessionData) => {
          if (sessionData.loggedIn) {
            fetch(`/check-card?cardId=${result.card_id}`)
              .then((response) => response.json())
              .then((backpackData) => {
                var button = document.createElement("button");
                // deleteButton.setAttribute('class', '')
                button.setAttribute('class', 'coolButton')
                button.style.width = 'auto'
                button.style.fontSize = '15px';
                button.style.padding = '0.5em 0.5em';
                button.textContent = backpackData.inBackpack
                  ? "從我的最愛刪除"
                  : "新增到我的最愛";
                // 設置按鈕的初始 onclick 事件處理器
                button.onclick = backpackData.inBackpack
                  ? function () {
                    removeFromBackpack(result.card_id);
                  }
                  : function () {
                    addToBackpack(result.card_id);
                  };
                // 立即調用 updateButtonFunction 以確保按鈕功能正確
                updateButtonFunction(button, result.card_id);
                tooltipText.appendChild(button);
              });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function removeFromBackpack(button, cardId, userNickname) {
  if (isProcessing) return;
  isProcessing = true;

  fetch("/delete-card", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cardId: cardId, nickname: userNickname }),
  })
    .then((response) => response.json())
    .then((data) => {
      isProcessing = false;
      if (data.success) {
        console.log("卡片已從收藏中刪除。");
        updateButton(button, cardId, false);
        showTemporaryMessage("卡片刪除成功"); // 顯示刪除成功的訊息
      } else {
        console.error("刪除卡片失敗。");
        showTemporaryMessage("卡片刪除失敗"); // 顯示刪除失敗的訊息
      }
    })
    .catch((error) => {
      isProcessing = false;
      console.error("刪除卡片過程中出現錯誤:", error);
      showTemporaryMessage("卡片刪除失敗"); // 顯示刪除失敗的訊息
    });
}

function addToBackpack(button, cardId, userNickname) {
  if (isProcessing) return;
  isProcessing = true;

  fetch("/add-card", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cardId: cardId, nickname: userNickname }),
  })
    .then((response) => response.json())
    .then((data) => {
      isProcessing = false;
      if (data.success) {
        console.log("卡片已新增到收藏。");
        updateButton(button, cardId, true);
        showTemporaryMessage("卡片新增成功"); // 顯示新增成功的訊息
      } else {
        console.error("新增卡片失敗。");
        showTemporaryMessage("卡片新增失敗"); // 顯示新增失敗的訊息
      }
    })
    .catch((error) => {
      isProcessing = false;
      console.error("新增卡片過程中出現錯誤:", error);
      showTemporaryMessage("卡片新增失敗"); // 顯示新增失敗的訊息
    });
}

function updateButton(button, cardId, inBackpack) {
  button.textContent = inBackpack ? "從我的最愛刪除" : "新增到我的最愛";
  button.onclick = inBackpack
    ? function () {
      removeFromBackpack(button, cardId);
    }
    : function () {
      addToBackpack(button, cardId);
    };
}

function showTemporaryMessage(message) {
  var resultsDiv = document.getElementsByClassName("result-page"); // 獲取 results 容器的引用
  var messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.style.position = "absolute"; // 改為 absolute 以便於在 results 容器內定位
  messageDiv.style.top = "0";
  messageDiv.style.left = "50%";
  messageDiv.style.transform = "translateX(-50%)";
  messageDiv.style.backgroundColor = "lightgreen";
  messageDiv.style.padding = "10px";
  messageDiv.style.borderRadius = "5px";
  messageDiv.style.zIndex = "1000";
  resultsDiv.appendChild(messageDiv); // 將訊息 div 附加到 results 容器

  setTimeout(function () {
    resultsDiv.removeChild(messageDiv);
  }, 1000); // 訊息將在1秒後消失
}

function updateButtonFunction(button, cardId) {
  if (button.textContent === "新增到我的最愛") {
    button.onclick = function () {
      // 實現新增卡片到背包的邏輯
      fetch("/add-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId: cardId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("卡片已新增到收藏。");
            button.textContent = "從我的最愛刪除";
            updateButtonFunction(button, cardId); // 更新按鈕功能為刪除
          } else {
            console.error("新增卡片失敗。");
          }
        })
        .catch((error) => {
          console.error("新增卡片過程中出現錯誤:", error);
        });
    };
  } else {
    button.onclick = function () {
      // 實現從背包中刪除卡片的邏輯
      fetch("/delete-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardId: cardId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("卡片已從收藏中刪除。");
            button.textContent = "新增到我的最愛";
            updateButtonFunction(button, cardId); // 更新按鈕功能為新增
          } else {
            console.error("刪除卡片失敗。");
          }
        })
        .catch((error) => {
          console.error("刪除卡片過程中出現錯誤:", error);
        });
    };
  }
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

function switchCon() {
  sMod = !sMod;
  document.getElementById("searchCondition").innerHTML =
    "Now Search Condition: " + "<span style='font-weight: bold;font-size: 30px;'>" + (sMod ? "AND" : "OR") + "</span>"; //update the text we show
}

function collectCheckboxStates() {
  let options = {};
  for (let i = 1; i <= 1021; i++) {
    if (i >= 235 && i < 1000) continue;
    let checkbox = document.getElementById(`option${i}`);
    if (checkbox) {
      options[`option${i}`] = checkbox.checked ? "true" : "false";
    }
  }
  return options;
}

// 確保點擊其他地方時隱藏 tooltipText
document.addEventListener(
  "click",
  function (event) {
    if (currentTooltip && event.target !== currentImage) {
      currentTooltip.style.display = "none";
      currentTooltip = null;
      currentImage = null;
    }
  },
  true
);

document.addEventListener("DOMContentLoaded", function () {
  // All other functions and code can be included here or defined outside and called here
  const checkboxes = document.querySelectorAll(
    '.options label input[type="checkbox"]'
  );
  const data = {};

  // Iterate over each checkbox to build the data object
  checkboxes.forEach((checkbox) => {
    // Get the label text associated with each checkbox
    const labelText = checkbox.parentNode.textContent.trim();
    data[checkbox.id] = labelText;
  });

  // Log the entire data object
  console.log("datas are:", data);
});

//for developer
function downloadObjectAsJson(data, exportName) {
  const dataStr =
    "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.getElementsByClassName("mainText").appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Usage
document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(
    '.options label input[type="checkbox"]'
  );
  const data = {};

  checkboxes.forEach((checkbox) => {
    const labelText = checkbox.parentNode.textContent.trim();
    data[checkbox.id] = labelText;
  });

  // Button to download the data
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download Data";
  downloadBtn.onclick = function () {
    downloadObjectAsJson(data, "checkboxData");
  };

  //document.getElementsByClassName("mainText").appendChild(downloadBtn);
});
