const request = require('request');
const fs = require('fs');
const url = 'https://tinghan33704.com/tos_tool_data/js/monster_data.js';
function getDataOnWeb() {

    request(url, function (error, response, body) {

        if (!error) {
            // console.log(body);
            fs.writeFileSync('monster.js', '\ufeff' + body + '\n module.exports = monster_data', 'utf8');
        }
        else throw new Error(error);
    });
    const url2 = 'https://tinghan33704.com/tos_tool_data/js/leader_skill_data.js';
    request(url2, function (error, response, body) {

        if (!error) {
            // console.log(body);
            // fs.writeFileSync('monster.js', '\ufeff' + body + '\n module.exports = monster_data', 'utf8');
            fs.writeFileSync('leader_skill_data.js', '\ufeff' + body + '\n module.exports = leader_skill_data', 'utf8');
        }
        else throw new Error(error);
    });
}
module.exports = { getDataOnWeb }
// getDataOnWeb();