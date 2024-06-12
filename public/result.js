// 從 localStorage 獲取搜尋結果
var searchResults = JSON.parse(localStorage.getItem("searchResults"));
var resultsDiv = document.getElementById("results");
var row = 0;
// 清空現有的結果
resultsDiv.innerHTML = "";

// 根據搜尋結果的類型，選擇適當的渲染函數
if (searchResults.nameResults) {
  // 顯示 nameResults
  searchResults.nameResults.forEach((result) => {
    renderResult(result, resultsDiv);
    row++;
  });
}
if (searchResults.raceResults) {
  // 顯示 raceResults
  searchResults.raceResults.forEach((result) => {
    renderResult(result, resultsDiv);
    row++;
  });
}
if (searchResults.IdResults) {
  // 顯示 IdResults
  searchResults.IdResults.forEach((result) => {
    renderResult(result, resultsDiv);
    row++;
  });
}

// 如果 searchResults 不包含上述任何屬性，則假設它是一個結果數組
searchResults.forEach((result) => {
  renderResult(result, resultsDiv);
  row++;
});

// 確保 searchResults 對象存在
if (searchResults) {
  // 檢查 nameResults 和 raceResults 是否為 undefined，並檢查 IdResults 是否為空數組
  if (row === 0) {
    // 確保 resultsDiv 是一個有效的 DOM 元素
    if (resultsDiv) {
      resultsDiv.innerHTML = "<p>查無結果</p>";
    }
  }
  // 使用 console.log 輸出結果前，先檢查對應屬性是否存在
  if (searchResults.nameResults !== undefined) {
    console.log(searchResults.nameResults);
  }
  if (searchResults.raceResults !== undefined) {
    console.log(searchResults.raceResults);
  }
  if (searchResults.IdResults) {
    console.log(searchResults.IdResults.length);
  }
} else {
  console.log("searchResults 對象不存在");
}
