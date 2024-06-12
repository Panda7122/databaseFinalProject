const express = require("express");
const cors = require("cors");
const app = express();
const port = 3300;
const session = require("express-session");
const { executeQuery } = require("./database"); // Ensure this is the correct path to your database module

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Configure session middleware
// Configure session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Use secure: true in production with HTTPS
  })
);

app.get("/check-session", (req, res) => {
  if (req.session.userId !== undefined) {
    res.json({
      loggedIn: true,
      nickname: req.session.nickname,
      username: req.session.username,
      admin: req.session.admin, // Include admin status
    });
  } else {
    console.log("server found No session");
    res.json({ loggedIn: false });
  }
});

app.post("/submitFeedback", (req, res) => {
  const username = req.session.username;
  const { subject, content, time } = req.body;

  // First, find the user_id for the given username
  const userSql = `SELECT u_id FROM user WHERE username = ?`;
  const userParams = [username];

  executeQuery(userSql, userParams)
    .then((users) => {
      if (users.length > 0) {
        const userId = users[0].u_id;

        // Insert feedback into the feedback table

        const feedbackSql = `INSERT INTO feedback (time,subject, content, u_id) VALUES (?, ?, ?, ?)`;
        const feedbackParams = [time, subject, content, userId];

        executeQuery(feedbackSql, feedbackParams)
          .then(() => {
            res.json({ success: true });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({
              success: false,
              message: "Database query error on feedback submission",
            });
          });
      } else {
        res.status(400).json({ success: false, message: "User not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Database query error on user lookup",
      });
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = `SELECT * FROM user WHERE username = ? AND password = ?`;
  const params = [username, password];

  executeQuery(sql, params)
    .then((user) => {
      if (user.length > 0) {
        req.session.userId = user[0].u_id;
        req.session.loggedIn = true;
        req.session.admin = user[0].admin;
        req.session.username = user[0].username;
        req.session.nickname = user[0].nickname;

        req.session.save((err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Session save error");
            return;
          }

          console.log("Login successful");
          console.log(req.session);

          // Check session here
          // if (req.session.userId!=undefined) {
          //   console.log("Session found");
          // } else {
          //   console.log("No session");
          //   console.log(req.session);
          //   console.log(req.session.userId);
          // }

          res.json({
            success: true,
            nickname: user[0].nickname,
            userId: user[0].u_id,
            admin: user[0].admin,
          });
        });
      } else {
        res.json({ success: false, message: "帳號或是密碼有誤" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Database query error on login");
    });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/index.html");
});

// 註冊路由
app.post("/register", (req, res) => {
  console.log(req.body);
  const { username, password, nickname } = req.body;

  // 檢查 username 或 nickname 是否已存在
  let checkParams = [username, nickname];
  let checkSql = `SELECT * FROM user WHERE username = ? OR nickname = ?`;

  executeQuery(checkSql, checkParams)
    .then((existingUsers) => {
      if (existingUsers.length > 0) {
        // 如果找到重複的 username 或 nickname，返回錯誤並打印重複的信息
        // console.log("重複的帳號或暱稱：", existingUsers);
        res.status(400).json({ success: false, message: "帳號或暱稱已存在" });
      } else {
        // 如果沒有重複，執行插入操作
        let insertSql = `INSERT INTO user (u_id,nickname, username, password, admin) VALUES (NULL, ?, ?, ?, 0)`;
        let insertParams = [nickname, username, password];

        executeQuery(insertSql, insertParams)
          .then(() => {
            res.json({ success: true });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Database query error on register");
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send("Database query error on checking username/nickname");
    });
});

app.post("/reset-password", (req, res) => {
  const { username, nickname, newPassword } = req.body;

  // 檢查帳號和暱稱是否存在
  let checkParams = [username, nickname];
  let checkSql = `SELECT * FROM user WHERE username = ? AND nickname = ?`;

  executeQuery(checkSql, checkParams)
    .then((users) => {
      if (users.length === 0) {
        // 如果沒有找到帳號和暱稱，返回錯誤
        res.status(400).json({ success: false, message: "沒有該帳號與暱稱" });
      } else {
        // 如果找到，執行更新密碼操作
        let updateSql = `UPDATE user SET password = ? WHERE username = ? AND nickname = ?`;
        let updateParams = [newPassword, username, nickname];

        executeQuery(updateSql, updateParams)
          .then(() => {
            res.json({ success: true, message: "更改成功" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Database query error on reset-password");
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send("Database query error on checking username/nickname");
    });
});

// 搜尋資料
app.get("/results", (req, res) => {
  // Get the search results from the query parameters
  const results = req.query.results;

  // Render the results page with the search results
  res.render("results", { results: results });
});

// security issue need to be fixed
app.get("/search", (req, res) => {
  const { query } = req.query; // From the frontend
  //if query is not empty
  console.log("query is:" + query);
  if (query) {
    // Initialize SQL queries and parameters
    let sql1 = `
    SELECT * , skill.name as skill_name 
    FROM ( (SELECT * FROM card WHERE card.name LIKE ?) as T
    NATURAL JOIN have_skill 
    JOIN skill ON have_skill.skill_id = skill.skill_id)
    `;
    // Trim and remove newline characters
    sql1 = sql1.replace(/\s+/g, " ").trim();
    let params1 = [`%${query}%`];

    //let sql2 = `SELECT * FROM card WHERE race LIKE ?`;
    let sql2 = `
    SELECT *, skill.name as skill_name 
    FROM ( (SELECT * FROM card WHERE card.race LIKE ?) as T
    NATURAL JOIN have_skill
    JOIN skill ON have_skill.skill_id = skill.skill_id)
    `;
    let params2 = [`%${query}%`];

    //let sql3 = `SELECT * FROM card WHERE card_id = ?`;
    let sql3 = `
    SELECT *, skill.name as skill_name 
    FROM ( (SELECT * FROM card WHERE card_id = ?) as T
    NATURAL JOIN have_skill
    JOIN skill ON have_skill.skill_id = skill.skill_id)
    `;
    //if query is number param3=query else param3=0
    let param3 = isNaN(query) ? 0 : query;

    // Execute first query
    executeQuery(sql1, params1)
      .then((nameQueryResults) => {
        // Execute second query inside the first query's resolution
        executeQuery(sql2, params2)
          .then((raceQueryResults) => {
            executeQuery(sql3, param3).then((idQueryResults) => {
              res.json({
                nameResults: nameQueryResults,
                raceResults: raceQueryResults,
                IdResults: idQueryResults,
              });
            });
            // Send both results together as an array or an object
            // res.json({ nameResults: rows1, raceResults: rows2 });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Database query error on race search");
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Database query error on name search");
      });
  } else {
    console.log("Invalid query");
    console.log(req.query);
    // extract option in res.query
    //data is json object at data/Data.json
    let data = require("./data/Data.json");

    // let sql = `
    //   SELECT
    //     *,
    //     card.name as c_name
    //   FROM
    //     card
    //   NATURAL JOIN
    //     have_skill
    //   NATURAL JOIN
    //     (SELECT skill_id,name as s_name FROM have_tag natural join tag) AS subquery
    //   WHERE`;
    let sql = `SELECT  *,card.name as c_name FROM card NATURAL JOIN have_skill NATURAL JOIN (SELECT distinct skill_id,name as s_name FROM have_tag natural join tag) AS subquery WHERE`;
    var searchMode = req.query.searchMode;
    console.log(searchMode);
    var invalid = false;
    let attributeI = [];
    let raceI = [];
    let starI = [];
    let s_nameI = [];
    for (let key in req.query) {
      console.log(key, req.query[key]);
      console.log(data[key]);
      if (req.query[key] === "true") {
        var attribute = data[key];
        var race = data[key];
        var star = data[key];
        if (
          attribute == "水" ||
          attribute == "火" ||
          attribute == "木" ||
          attribute == "光" ||
          attribute == "暗"
        ) {
          attributeI.push(attribute);
        } else if (
          race == "神族" ||
          race == "魔族" ||
          race == "人族" ||
          race == "獸族" ||
          race == "龍族" ||
          race == "妖精族" ||
          race == "機械族" ||
          race == "強化素材" ||
          race == "進化素材" ||
          race == "獸類" ||
          race == "人類" ||
          race == "妖精類" ||
          race == "龍類"
        ) {
          if (race == "獸族") race = "獸類";
          if (race == "人族") race = "人類";
          if (race == "龍族") race = "龍類";
          if (race == "妖精族") race = "妖精類";
          raceI.push(race);
        } else if (
          star == "1" ||
          star == "2" ||
          star == "3" ||
          star == "4" ||
          star == "5" ||
          star == "6" ||
          star == "7" ||
          star == "8"
        ) {
          starI.push(star);
        } else {
          s_nameI.push(data[key]);
        }
      }
    }
    if (invalid == true) {
      res.status(400).send("Invalid query");
      return;
    }

    // 構建 SQL 查詢的條件部分
    let conditions = [];
    let attributeConditions = ""
    if (attributeI.length != 0) {
      attributeConditions = attributeConditions + 'attribute in ('
      for (var i = 0; i < attributeI.length; ++i) {
        attributeConditions = attributeConditions + '\'' + attributeI[i] + '\''
        if (i != attributeI.length - 1) {
          attributeConditions = attributeConditions + ','
        }
      }
      attributeConditions = attributeConditions + ')'
    }
    // let attributeConditions = attributeI
    //   .map((attr) => `attribute='${attr}'`)
    //   .join(" OR ");
    let raceConditions = ""
    if (raceI.length != 0) {
      raceConditions = raceConditions + 'race in ('
      for (var i = 0; i < raceI.length; ++i) {
        raceConditions = raceConditions + '\'' + raceI[i] + '\''
        if (i != raceI.length - 1) {
          raceConditions = raceConditions + ','
        }
      }
      raceConditions = raceConditions + ')'


    }

    let starConditions = ""
    if (starI.length != 0) {
      starConditions = starConditions + 'star in ('
      for (var i = 0; i < starI.length; ++i) {
        starConditions = starConditions + starI[i]
        if (i != starI.length - 1) {
          starConditions = starConditions + ','
        }
      }
      starConditions = starConditions + ')'
    }

    let s_nameConditions = ""
    if (s_nameI.length != 0) {
      s_nameConditions = s_nameConditions + 'tag_name in ('
      for (var i = 0; i < s_nameI.length; ++i) {
        s_nameConditions = s_nameConditions + '\'' + s_nameI[i] + '\''
        if (i != s_nameI.length - 1) {
          s_nameConditions = s_nameConditions + ','
        }
      }
      s_nameConditions = s_nameConditions + ')'

    }
    // let raceConditions = raceI.map((rc) => `race='${rc}'`).join(" OR ");
    // let starConditions = starI
    //   .map((st) => `star='${st.replace("*", "")}'`)
    //   .join(" OR "); // 假設星級在數據庫中不包含 '*'
    // let s_nameConditions = s_nameI.map((sn) => `tag_name='${sn}'`).join(` OR `);

    if (attributeConditions) {
      conditions.push(`(${attributeConditions})`);
    }
    if (raceConditions) {
      conditions.push(`(${raceConditions})`);
    }
    if (starConditions) {
      conditions.push(`(${starConditions})`);
    }
    if (s_nameConditions) {
      conditions.push(`(${s_nameConditions})`);
    }

    // 將所有條件組合成一個 SQL 查詢
    let conditionString = conditions.join(" AND ");
    let sql_fin = "";
    // if (searchMode === "OR") {
    sql_fin = `

      SELECT DISTINCT card_id,c_name,race,star,attribute,description,skill_name
      FROM card_skill_view
      WHERE ${conditionString}
      GROUP BY card_id,skill_name
      `;
    if (searchMode === "AND" && s_nameI.length > 0) {
      sql_fin = sql_fin + 'HAVING COUNT(DISTINCT(tag_name))=' + s_nameI.length + '\n'
    }
    sql_fin = sql_fin + 'ORDER BY card_id, skill_id;'
    console.log(sql_fin)
    // } else {
    //   // Handle the AND case for tags specifically
    //   let andTagConditions = s_nameI
    //     .map(
    //       (sn) => `
    //     card_id in (
    //       SELECT card_id
    //       FROM card_skill_view as c2
    //       WHERE card_skill_view.c_name = c2.c_name
    //         AND c2.tag_name = '${sn}'
    //     )
    //   `
    //     )
    //     .join(" AND ");
    //   console.log("andtag" + andTagConditions);
    //   sql_fin = `
    //   SELECT DISTINCT card_id,c_name,race,star,attribute,description,skill_name
    //   FROM card_skill_view
    //   WHERE ${attributeI.length > 0 ? `(${attributeConditions}) ` : ""}
    //         ${(attributeI.length > 0 && raceI.length > 0) ||
    //       (attributeI.length > 0 && starI.length > 0) ||
    //       (attributeI.length > 0 && andTagConditions.length > 0)
    //       ? `AND`
    //       : ""
    //     }

    //         ${raceI.length > 0 ? ` (${raceConditions})` : ""}

    //         ${(raceI.length > 0 && starI.length > 0) ||
    //       (raceI.length > 0 && andTagConditions.length > 0)
    //       ? `AND`
    //       : ""
    //     }
    //         ${starI.length > 0 ? ` (${starConditions})` : ""}

    //         ${starI.length > 0 && andTagConditions.length > 0 ? `AND` : ""}
    //         ${andTagConditions.length > 0 ? `${andTagConditions}` : ""};
    //   `;
    // }
    // let sql_fin = `   //OLD
    // SELECT DISTINCT card.*, card.name as c_name, skill.*
    // FROM card
    // JOIN have_skill ON card.card_id = have_skill.card_id
    // JOIN skill ON have_skill.skill_id = skill.skill_id
    // JOIN (
    //     SELECT DISTINCT have_tag.skill_id, tag.name as s_name
    //     FROM have_tag
    //     JOIN tag ON have_tag.tag_id = tag.tag_id
    // ) AS subquery ON skill.skill_id = subquery.skill_id
    // WHERE ${conditionString};
    // `;
    // 移除換行符並執行查詢


    sql_fin = sql_fin.replace(/\n/g, " ");
    executeQuery(sql_fin, [])
      .then((rows) => {
        res.json(rows);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Database query error");
      });
    // executeQuery(sql_tmp, [])
    //   .then((rows) => {
    //     res.json(rows);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     res.status(500).send("Database query error");
    //   });
    //res.status(400).send('Invalid query');
  }
});

// 新增卡片到用戶的收藏夾
app.post("/add-card", (req, res) => {
  // 確保用戶已登入
  if (req.session.userId) {
    const cardId = req.body.cardId;
    const userId = req.session.userId;

    // 構建 SQL 語句來插入收藏記錄
    const sql = `INSERT INTO favorite (u_id, card_id) VALUES (?, ?)`;
    const params = [userId, cardId];

    // 執行 SQL 語句
    executeQuery(sql, params)
      .then(() => {
        res.json({ success: true, message: "卡片已成功新增到收藏。" });
      })
      .catch((err) => {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "將卡片新增到收藏時發生錯誤。" });
      });
  } else {
    // 如果用戶未登入，返回錯誤
    res.status(403).json({ success: false, message: "用戶未登入。" });
  }
});

// 讀取用戶的最愛列表
app.get("/read-card", (req, res) => {
  if (req.session.userId) {
    const userId = req.session.userId;
    // 構建 SQL 語句來查詢用戶的最愛列表
    // const sql = `SELECT * FROM favorite WHERE u_id = ?`;
    const sql = `SELECT card.*,card.name as c_name ,skill.*
                 FROM favorite
                 JOIN card ON favorite.card_id = card.card_id
                 JOIN have_skill ON card.card_id = have_skill.card_id
                 JOIN skill ON have_skill.skill_id = skill.skill_id
                 WHERE favorite.u_id = ?`;
    const params = [userId];

    executeQuery(sql, params)
      .then((favorites) => {
        res.json(favorites);
      })
      .catch((err) => {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "讀取最愛列表時發生錯誤。" });
      });
  } else {
    res.status(403).json({ success: false, message: "用戶未登入。" });
  }
});
app.get("/searchFeedback", (req, res) => {
  const sqlQuery = "SELECT * FROM feedback natural join user;";

  executeQuery(sqlQuery, [])
    .then((result) => {
      if (result.length > 0) {
        res.json({ success: true, feedback: result });
      } else {
        res.status(404).json({ success: false, message: "feedback not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Database query error" });
    });
});

app.get("/searchBoard/:id", (req, res) => {
  const boardId = req.params.id;
  const sqlQuery = "SELECT * FROM board WHERE board_id = ?;";

  executeQuery(sqlQuery, [boardId])
    .then((result) => {
      if (result.length > 0) {
        res.json({ success: true, board: result[0] });
      } else {
        res.status(404).json({ success: false, message: "Board not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Database query error" });
    });
});

app.post("/delete-card", (req, res) => {
  const cardId = req.body.cardId;
  const nickname = req.session.nickname;
  // 使用參數化查詢來避免SQL注入
  const sql = `
     DELETE favorite 
     FROM favorite 
     JOIN user ON favorite.u_id = user.u_id 
     WHERE favorite.card_id = ? AND user.nickname= ? ;
  `;
  const params = [cardId, nickname];
  // 執行參數化查詢
  executeQuery(sql, params)
    .then(() => {
      res.json({ success: true, message: "Card deleted from favorites." });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Database query error on delete" });
    });
});

// 檢查卡片是否在用戶的背包中
app.get("/check-card", (req, res) => {
  if (req.session.userId) {
    const cardId = req.query.cardId;
    const userId = req.session.userId;

    // 構建 SQL 語句來檢查卡片是否在背包中
    const sql = `SELECT * FROM favorite WHERE u_id = ? AND card_id = ?`;
    const params = [userId, cardId];

    // 執行 SQL 語句
    executeQuery(sql, params)
      .then((result) => {
        if (result.length > 0) {
          // 卡片在背包中
          res.json({ inBackpack: true });
        } else {
          // 卡片不在背包中
          res.json({ inBackpack: false });
        }
      })
      .catch((err) => {
        console.error(err);
        res
          .status(500)
          .json({ success: false, message: "Database query error" });
      });
  } else {
    res.status(403).json({ success: false, message: "用戶未登入。" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
