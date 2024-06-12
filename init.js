const fs = require("fs");

// 資料夾名稱
const directories = ["./image", "./dbpic", "./thumbnail"];

directories.forEach((dir) => {
  // 檢查資料夾是否存在
  if (!fs.existsSync(dir)) {
    // 如果資料夾不存在，創建資料夾
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory ${dir} is created.`);
  } else {
    console.log(`Directory ${dir} already exists.`);
  }
});
