const fs = require('fs');
function strcompress(str) {
    str = str.replace(/(?<!\\)\\(?!n|t|'|")/g, '\\\\')
    str = str.replace(/\n/g, '\\n')
    str = str.replace(/\t/g, '    ')
    str = str.replace(/'/g, '\\\'')
    str = str.replace(/"/g, '\\\"')
    str = str.replace(/<[^>]+>/g, '');
    return str
}
function boardtostr(b) {
    var str = ""
    var row = 5, col = 6


    if (Array.isArray(b)) {
        for (let i = 0; i < row; ++i) {
            for (let j = 0; j < col; ++j) {
                if (b[i * col + j] === 'undefined') {
                    str = str + '-'
                } else {
                    str = str + b[i * col + j];
                }
                if (j != col - 1)
                    str = str + ','
            }

            if (i != row - 1)
                str = str + '\\n'
        }
    } else {
        if (b.row) {
            row = b.row;
        }

        if (b.column) {
            col = b.column;
        }
        for (let i = 0; i < row; ++i) {
            for (let j = 0; j < col; ++j) {
                if (b[i * col + j] === 'undefined') {
                    str = str + '-'
                } else {
                    str = str + b['board'][i * col + j];
                }
                if (j != col - 1)
                    str = str + ','
            }
            if (i != row - 1)
                str = str + '\\n'
        }
    }
    return str; s
}
function getSQL() {

    const monster_data = require('./monster')
    const leader_skill_data = require('./leader_skill_data')
    try {

        var sql = [];
        var tag = {};
        var series = {};
        var skill = {};
        var fusion = {};
        var teamskill = {};
        var obje = {};
        var limit = {};
        var genboard = {};
        var offset = 0;
        for (var i = 1; i < monster_data.length; ++i) {
            var id = monster_data[i].id
            var name = monster_data[i].name
            if (name == '') continue
            var attribute = monster_data[i].attribute
            var race = monster_data[i].race
            if (race == '') {
                race = '獸類';
            }
            var star = monster_data[i].star
            var mseries = monster_data[i].monsterTag
            for (var j = 0; j < mseries.length; ++j) {
                if (!series.hasOwnProperty(mseries[j])) {
                    series[mseries[j]] = Object.keys(series).length + 1
                    sql.push('insert into series values (' + series[mseries[j]] + ',\'' + mseries[j] + '\');')
                }
                mseries[j] = series[mseries[j]]
            }
            var mskill = monster_data[i].skill
            var mtskill = monster_data[i].teamSkill
            var board = '';
            board = monster_data[i].board
            // if (id == 10067)
            //     console.log(board);
            if (typeof board === 'undefined')
                board = 'null'
            else {
                for (let i = 0; i < board.length; ++i) {
                    let s = boardtostr(board[i])
                    if (!genboard.hasOwnProperty(s)) {
                        genboard[s] = Object.keys(genboard).length + 1
                        sql.push('insert into board values (' + genboard[s] + ',\'' + s + '\');')
                    }
                    board[i] = genboard[s];
                }
            }

            for (var j = 0; j < mskill.length; ++j) {
                var skname = mskill[j].name
                skname = strcompress(skname)
                var sktype = mskill[j].type
                var skcharge = mskill[j].charge
                var skchargetime = mskill[j].num
                var skdis = mskill[j].description
                if (board != null) {
                    skdis = skdis.replace(/<board>/g, '<board 1>')
                    skdis = skdis.replace(/<board ([0-9]*)>/g, (match, x) => `board{${board[x - 1]}}`);
                    skdis = skdis.replace(/<\/board>/g, '');

                }
                skdis = strcompress(skdis)
                var sktag = mskill[j].tag
                var sktagtime = []
                for (var k = 0; k < sktag.length; ++k) {
                    if (typeof (sktag[k]) == 'object') {
                        sktagtime.push(sktag[k][1]);
                        if (typeof (sktagtime[k]) === 'undefined') {
                            sktagtime[k] = 'null';
                        }
                        sktag[k] = sktag[k][0];
                    } else {
                        sktagtime.push('null');
                    }
                    if (!tag.hasOwnProperty(sktag[k])) {
                        tag[sktag[k]] = Object.keys(tag).length + 1
                        sql.push('insert into tag values (' + tag[sktag[k]] + ',\'' + sktag[k] + '\');')
                    }
                    sktag[k] = tag[sktag[k]]
                }
                if (skname == "合體") {
                    if (!fusion.hasOwnProperty(mskill[j].combine.out)) {
                        fusion[mskill[j].combine.out] = Object.keys(skill).length + 1 + offset;
                        ++offset;
                        skdis = strcompress(skdis)
                        sql.push('insert into skill values (' + fusion[mskill[j].combine.out] + ',\'' + skname + '\',\'' + sktype + '\',\'' + skdis + '\',\'' + skcharge + '\',' + skchargetime + ',' + mskill[j].combine.out + ');')
                        for (var k = 0; k < sktag.length; ++k) {
                            sql.push('insert into have_tag values (' + fusion[mskill[j].combine.out] + ',' + sktag[k] + ',' + sktagtime[k] + ');')
                        }
                    }
                    mskill[j] = fusion[mskill[j].combine.out]
                } else {
                    if (!skill.hasOwnProperty(skname)) {
                        skill[skname] = Object.keys(skill).length + 1 + offset
                        skdis = strcompress(skdis)
                        sql.push('insert into skill values (' + skill[skname] + ',\'' + skname + '\',\'' + sktype + '\',\'' + skdis + '\',\'' + skcharge + '\',' + skchargetime + ',null);')
                        for (var k = 0; k < sktag.length; ++k) {
                            sql.push('insert into have_tag values (' + skill[skname] + ',' + sktag[k] + ',' + sktagtime[k] + ');')

                        }

                    }
                    mskill[j] = skill[skname]
                }

            }

            for (var j = 0; j < mtskill.length; ++j) {
                dis = mtskill[j].description
                dis = strcompress(dis)

                act = mtskill[j].activate
                act = strcompress(act)

                st = mtskill[j].skill_tag
                stt = []
                at = mtskill[j].activate_tag
                if (!teamskill.hasOwnProperty(dis)) {
                    teamskill[dis] = Object.keys(teamskill).length + 1
                    for (var k = 0; k < st.length; ++k) {
                        if (typeof (st[k]) == 'object') {
                            stt.push(st[k][1]);
                            st[k] = st[k][0];
                        } else {
                            stt.push('null');
                        }
                        if (!tag.hasOwnProperty(st[k])) {
                            tag[st[k]] = Object.keys(tag).length + 1
                            sql.push('insert into tag values (' + tag[st[k]] + ',\'' + st[k] + '\');')
                        }
                        st[k] = tag[st[k]]
                    }
                    for (var k = 0; k < at.length; ++k) {
                        if (typeof (at[k]) == 'object') {
                            at[k] = at[k][0];
                        }
                        if (!tag.hasOwnProperty(at[k])) {
                            tag[at[k]] = Object.keys(tag).length + 1
                            sql.push('insert into tag values (' + tag[at[k]] + ',\'' + at[k] + '\');')
                        }
                        at[k] = tag[at[k]]
                    }
                    sql.push('insert into teamskill values (' + teamskill[dis] + ',\'' + dis + '\',\'' + act + '\');')
                    for (var k = 0; k < st.length; ++k) {
                        sql.push('insert into have_teamtag values (' + teamskill[dis] + ',' + st[k] + ',' + stt[k] + ');')

                    }
                    for (var k = 0; k < at.length; ++k) {
                        sql.push('insert into have_teamtag values (' + teamskill[dis] + ',' + at[k] + ',null);')
                    }
                }
                mtskill[j] = teamskill[dis]
            }
            sql.push('insert into card values (' + id + ',\'' + name + '\',' + star + ',\'' + race + '\',\'' + attribute + '\');')
            for (var j = 0; j < mskill.length; ++j) {
                sql.push('insert into have_skill values (' + id + ',' + mskill[j] + ');')
            }
            for (var j = 0; j < mtskill.length; ++j) {
                sql.push('insert into have_teamskill values (' + id + ',' + mtskill[j] + ');')
            }
            for (var j = 0; j < mseries.length; ++j) {
                sql.push('insert into belong_series values (' + id + ',' + mseries[j] + ');')
            }
        }
        var cnt = 1;
        for (var i = 1; i < leader_skill_data.length; ++i) {
            var skillName = leader_skill_data[i].name
            var skillDes = leader_skill_data[i].description
            var skillTag = leader_skill_data[i].tag
            skillName = strcompress(skillName)
            skillDes = strcompress(skillDes)
            sql.push('insert into leader_skill values (' + i + ',\'' + skillName + '\',\'' + skillDes + '\');')
            for (var j = 0; j < skillTag.length; ++j) {
                // console.log(skillTag[j])
                if (typeof skillTag[j] === 'undefined') {
                    continue;
                }
                var tg = skillTag[j].name;
                var obj = skillTag[j].object;
                var lim = skillTag[j].limit;
                sql.push('insert into leader_part values (' + cnt + ',' + i + ');')
                if (typeof (tg) == 'object') {

                    for (var k = 0; k < tg.length; ++k) {
                        if (!tag.hasOwnProperty(tg[k])) {
                            tag[tg[k]] = Object.keys(tag).length + 1
                            sql.push('insert into tag values (' + tag[tg[k]] + ',\'' + tg[k] + '\');')
                        }
                        sql.push('insert into leader_skill_part_tag values (' + cnt + ',' + tag[tg[k]] + ');')

                    }
                } else {
                    if (!tag.hasOwnProperty(tg)) {
                        tag[tg] = Object.keys(tag).length + 1
                        sql.push('insert into tag values (' + tag[tg] + ',\'' + tg + '\');')
                    }
                    sql.push('insert into leader_skill_part_tag values (' + cnt + ',' + tag[tg] + ');')
                }
                if (typeof (obj) == 'object') {
                    for (var k = 0; k < obj.length; ++k) {
                        if (!obje.hasOwnProperty(obj[k])) {
                            obje[obj[k]] = Object.keys(obje).length + 1
                            sql.push('insert into object values (' + obje[obj[k]] + ',\'' + obj[k] + '\');')
                        }
                        sql.push('insert into leader_skill_part_object values (' + cnt + ',' + obje[obj[k]] + ');')
                    }
                } else {
                    if (!obje.hasOwnProperty(obj)) {
                        obje[obj] = Object.keys(obje).length + 1
                        sql.push('insert into object values (' + obje[obj] + ',\'' + obj + '\');')
                    }
                    sql.push('insert into leader_skill_part_object values (' + cnt + ',' + obje[obj] + ');')
                }
                if (typeof (lim) == 'object') {
                    for (var k = 0; k < lim.length; ++k) {
                        if (!limit.hasOwnProperty(lim[k])) {
                            limit[lim[k]] = Object.keys(limit).length + 1
                            sql.push('insert into taglimit values (' + limit[lim[k]] + ',\'' + lim[k] + '\');')
                        }
                        sql.push('insert into leader_skill_part_limit values (' + cnt + ',' + limit[lim[k]] + ');')

                    }
                } else {
                    if (!limit.hasOwnProperty(lim)) {
                        limit[lim] = Object.keys(limit).length + 1
                        sql.push('insert into limit values (' + limit[lim] + ',\'' + lim + '\');')
                    }
                    sql.push('insert into leader_skill_part_limit values (' + cnt + ',' + limit[lim] + ');')
                }

                ++cnt;
            }
        }
        fs.writeFileSync('./data/insert.sql', '', { encoding: 'utf8', flag: 'w+' });
        for (var i = 0; i < sql.length; ++i) {
            fs.writeFileSync('./data/insert.sql', sql[i] + '\n', { encoding: 'utf8', flag: 'a+' });

        }
    } catch (err) {
        console.error('An error occurred:', err);
    }

}
module.exports = { getSQL };
// getSQL();