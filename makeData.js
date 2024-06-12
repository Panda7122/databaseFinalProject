const js2sql = require('./jstosql')
const db = require('./database')
const getMS = require('./getMonster')
const getIMG = require('./find')
const getIcon = require('./getIconImg')
console.log('get image data')
getIMG.DownloadIMGData();
console.log('get icon image')
getIcon.downloadICON();
console.log('get monster data')
getMS.getDataOnWeb();
console.log('convert data to sql')
js2sql.getSQL();
console.log('run sql')
db.runScripts();