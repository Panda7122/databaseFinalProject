// 將 database.js 中的 executeQuery 函數導入
const { query } = require("express");
const { executeQuery } = require("./database");
const fs = require("fs");
async function TestScripts() {
  try {
    // Test query here
    // await executeQuery('SELECT * FROM tag'); // Replace 'tablename' with your actual table name
    // await executeQuery('SELECT * FROM card');
    // await executeQuery('SELECT * FROM have_skill');
    //await executeQuery('(SELECT * FROM card where attribute=\'水\') natural join (select * from have_skill as Hs,skill as S where Hs.s_id==skill.skill_id )');
    // await executeQuery('SELECT * FROM card as C,have_skill as H,skill as S where C.card_id==H.c_id and S.skill_id=H.s_id and C.name like \'%尼祿%\' and C.race=\'獸類\'');
    //suppose tags are "十字盾"、"指定形狀盾"
    //const tagsResult = await executeQuery('SELECT * FROM have_tag natural join tag'); // Replace 'tablename' with your actual table name

    //後端 SQL 生成示範語句
    var querySentence = `
      SELECT 
          card.*, 
          card.name AS c_name 
      FROM 
          card 
      NATURAL JOIN 
          have_skill 
      NATURAL JOIN 
          (SELECT 
              skill_id, 
              name AS s_name 
          FROM 
              have_tag 
          NATURAL JOIN 
              tag) AS subquery 
      WHERE 
          s_name = "無視十字盾";
      `;
    await executeQuery(querySentence);
    querySentence = `
SELECT * 
FROM 
    (SELECT 
        *, 
        card.name AS c_name 
     FROM 
        card 
     NATURAL JOIN 
        have_skill 
     NATURAL JOIN 
        (SELECT 
            skill_id, 
            name AS s_name 
         FROM 
            have_tag 
         NATURAL JOIN 
            tag
        ) AS subquery 
     WHERE 
        s_name = '無視十字盾'
    ) AS T, 
    skill AS S 
WHERE 
    S.skill_id = T.skill_id;
`;
    await executeQuery(querySentence);
  } catch (err) {
    console.error("Failed to execute scripts", err);
  }
}

TestScripts();
