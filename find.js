const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
// const json = require('json');
// const re = require('re');
const currentTime = new Date();
const year = currentTime.getFullYear();
const month = currentTime.getMonth() + 1; // Months are zero-based, so we add 1
const date = currentTime.getDate();
const hour = currentTime.getHours();
const minute = currentTime.getMinutes();
const second = currentTime.getSeconds();
var donecnt = 0
FIND = []
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

async function DownloadIMGData() {
    for (var i = 1; i < 3002; i += 300) {
        FIND.push(i.toString() + '-' + (i + 300 - 1).toString())
    }
    for (var i = 10001; i < 10602; i += 300) {
        FIND.push(i.toString() + '-' + (i + 300 - 1).toString())
    }
    FIND.push('其它A-Z')
    var urls = []
    var id = []
    var name = []
    for (const f of FIND) {
        const url = ('https://tos.fandom.com/zh/wiki/圖鑒/' + f.toString() + '?variant=zh-tw').toString()
        const pageHTML = await axios.get(url)

        var web = cheerio.load(pageHTML.data)
        var links = web('a')
        links.each((index, value) => {
            if (web(value).attr("title") !== undefined) {
                var str = web(value).attr("title")
                if (str.substring(0, 3) == 'No.' || ['S', 'P', 'V', 'N', 'M'].includes(str[0])) {
                    var idstr = web(value).find('img').attr('data-image-name')
                    idstr = idstr.substring(0, idstr.length - 5)
                    id.push(idstr)
                    name.push(str)
                    urls.push('https://tos.fandom.com' + web(value).attr("href").toString())
                }
            }
        })

    }
    var c = 0
    console.log('start downloading')
    output = []
    for (var i = 0; i < urls.length; ++i) {

        if (id[i] < 10400) {
            ++c
            continue
        }


        var url = urls[i];
        console.log(url)
        // var web = cheerio.load(getPageHTML)

        try {
            const pageHTML = await axios.get(url)
            var web = cheerio.load(pageHTML.data)
            var imageLarge = web('.image').find('img')
            var imageURL = null;
            var thumb = null;
            imageLarge.each((index, value) => {
                var str = web(value).attr('alt')
                if (str == 'Pet' + id[c].toString()) {
                    // console.log(str)
                    datatype = web('.image').find('img').attr('data-image-name')
                    datatype = datatype.substring(datatype.length - 4, datatype.length)
                    // if (imageLarge == 'Pet' + id[c].toString()) {
                    imageURL = web('.image').find('img').attr('data-src')
                    console.log(str, imageURL)
                    downloadIMG(imageURL, './image/' + id[c].toString() + datatype, function () {
                        console.log("done " + str)
                        ++donecnt;
                    })
                }
            })
            // console.log(parseInt(id[c]).toString())
            if (!isNaN(parseInt(id[c]))) {
                downloadIMG('https://tinghan33704.com/tos_tool_data/img/monster/' + parseInt(id[c]).toString() + '.png', './dbpic/' + id[c].toString() + '.png', function () {
                    console.log("done " + parseInt(id[c]).toString());
                    ++donecnt;
                });
            }
            var imageSmall = web('.image').find('img')
            var havethumb = false
            imageSmall.each((index, value) => {
                var str = web(value).attr('alt')
                if (str == id[c].toString() + 'i' && havethumb == false) {
                    thumb = web(value).attr('data-src')
                    // console.log(web(value).attr('alt'), thumb)

                    datatype = web(value).attr('data-image-name')
                    datatype = datatype.substring(datatype.length - 4, datatype.length)
                    downloadIMG(thumb, './thumbnail/' + id[c].toString() + datatype, function () {
                        console.log("done " + str)
                        ++donecnt;
                    })
                    havethumb = true
                }
            })

            output.push({ 'id': id[c], 'picture': imageURL, 'thumbnail': thumb, 'wiki': url })
            console.log('done    ' + c.toString() + '/' + id.length.toString())

        } catch (error) {
            console.error(error)
        }
        ++c
    }
    // fs.writeFileSync('./charactor.json', '', { encoding: 'utf8', flag: 'w+' });

    fs.writeFileSync('./character.json', JSON.stringify(output), { encoding: 'utf8', flag: 'w+' });
}
// main()
module.exports = { DownloadIMGData }
