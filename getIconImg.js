const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
var attr = ['l', 'w', 'd', 'f', 'e']
var race = ['h', 'g', 'b', 'd', 'm', 'e', 'r']
var raceFull = ['human', 'god', 'beast', 'demon', 'machina', 'elf', 'dragon', 'level_up', 'evolve']
var star = 8;
var bd = 6;
var downloadIMG = async function (uri, filename, callback) {

    await request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
}
function getPageHTML(url) {
    try {
        axios.get(url).then(response => {
            const pageHTML = response.data;
            return pageHTML;
        })
            .catch(error => {
                console.error(error);
            });
    } catch (error) {
        console.error(error);
    }
}
async function downloadICON() {
    downloadIMG('https://tinghan33704.com/tos_tool_data/img/rune/rune_u.png', './public/icon/rune_u.png', function () {
        console.log("done");

    });
    for (var i = 0; i < attr.length; ++i) {
        var str = attr[i];
        downloadIMG('https://tinghan33704.com/tos_tool_data/img/monster/icon_' + attr[i] + '.png', './public/icon/icon_' + attr[i] + '.png', function () {
            console.log("done");

        });
        downloadIMG('https://tinghan33704.com/tos_tool_data/img/rune/rune_' + attr[i] + '.png', './public/icon/rune_' + attr[i] + '.png', function () {
            console.log("done");

        });
        downloadIMG('https://tinghan33704.com/tos_tool_data/img/rune/rune_' + attr[i] + '_enc.png', './public/icon/rune_' + attr[i] + '_enc.png', function () {
            console.log("done");

        });
    }
    for (var i = 0; i < raceFull.length; ++i) {
        var str = attr[i];
        downloadIMG('https://tinghan33704.com/tos_tool_data/img/monster/icon_' + raceFull[i] + '.png', './public/icon/icon_' + raceFull[i] + '.png', function () {
            console.log("done");

        });
    }
    for (var i = 0; i < race.length; ++i) {
        var str = attr[i];
        downloadIMG('https://tinghan33704.com/tos_tool_data/img/rune/race_' + race[i] + '.png', './public/icon/rune_' + raceFull[i] + '.png', function () {
            console.log("done");

        });
    }
    for (var i = 1; i <= star; ++i) {
        var str = i.toString();
        downloadIMG('https://tinghan33704.com/tos_tool_data/img/monster/icon_' + str + '.png', './public/icon/icon_' + str + '.png', function () {
            console.log("done");

        });
    }
    for (var i = 1; i <= bd; ++i) {
        var str = i.toString();
        downloadIMG('https://tinghan33704.com/tos_tool_data/img/rune/rune_' + str + '.png', './public/icon/rune_' + str + '.png', function () {
            console.log("done");

        });
    }
}
module.exports = { downloadICON }

// downloadICON();