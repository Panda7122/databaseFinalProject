DROP TABLE IF EXISTS have_teamtag;
DROP TABLE IF EXISTS have_tag;
DROP TABLE IF EXISTS bond;
DROP TABLE IF EXISTS have_skill;
DROP TABLE IF EXISTS have_teamskill;
DROP TABLE IF EXISTS belong_series;
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS backpack;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS series;
DROP TABLE IF EXISTS skill;
DROP TABLE IF EXISTS teamskill;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS card;
DROP TABLE IF EXISTS leader_skill;
DROP TABLE IF EXISTS leader_part;
DROP TABLE IF EXISTS object;
DROP TABLE IF EXISTS taglimit;
DROP TABLE IF EXISTS leader_skill_part_tag;
DROP TABLE IF EXISTS leader_skill_part_object;
DROP TABLE IF EXISTS leader_skill_part_limit;
DROP TABLE IF EXISTS have_leader_skill;
DROP TABLE IF EXISTS board;
create table card (
    card_id INTEGER,
    name TEXT not null,
    star INTEGER not null check (
        star >= 0
        and star < 9
    ),
    race TEXT check (
        race in (
            '人類',
            '龍類',
            '獸類',
            '妖精類',
            '神族',
            '機械族',
            '進化素材',
            '強化素材',
            '魔族',
            ''
        )
    ) not null,
    attribute TEXT check (
        attribute in ('水', '火', '木', '光', '暗', '')
    ) not null,
    primary key (card_id)
);
create table user (
    u_id INTEGER,
    nickname TEXT not null,
    username TEXT not null,
    password TEXT not null,
    admin INTEGER check (admin in (0, 1)) not null,
    primary key (u_id)
);
create table teamskill(
    skill_id INTEGER not null,
    description TEXT not null,
    activate TEXT not null,
    primary key (skill_id)
);
create table skill (
    skill_id INTEGER not null,
    name TEXT not null,
    type TEXT not null,
    description TEXT not null,
    charge TEXT not null,
    charge_time INTEGER not null,
    changeto INTEGER,
    primary key (skill_id)
);
create table series (
    series_id INTEGER PRIMARY KEY,
    name TEXT not null
    /* primary key (series_id) */
);
create table tag (
    tag_id INTEGER NOT NULL,
    name TEXT not null,
    primary key (tag_id)
);
create table feedback (
    ID INTEGER not null,
    time TEXT not null,
    context TEXT not null,
    u_id INTEGER,
    primary key (ID),
    foreign key (u_id) references user (u_id)
);
create table backpack (
    u_id INTEGER,
    card_id INTEGER,
    primary key (u_id, card_id),
    foreign key (u_id) references user (u_id),
    foreign key (card_id) references card (card_id)
);
create table favorite (
    u_id INTEGER,
    card_id INTEGER,
    primary key (u_id, card_id),
    foreign key (u_id) references user (u_id),
    foreign key (card_id) references card (card_id)
);
create table belong_series (
    card_id INTEGER,
    series_id INTEGER,
    primary key (card_id, series_id),
    foreign key (card_id) references card (card_id),
    foreign key (series_id) references series (series_id)
);
create table have_teamskill (
    card_id INTEGER,
    skill_id INTEGER,
    /* primary key (card_id, skill_id), */
    foreign key (card_id) references card (card_id),
    foreign key (skill_id) references teamskill (skill_id)
);
create table have_skill (
    card_id INTEGER,
    skill_id INTEGER,
    /* primary key (card_id, skill_id), */
    foreign key (card_id) references card (card_id),
    foreign key (skill_id) references skill (skill_id)
);
create table bond (
    c_id1 INTEGER,
    c_id2 INTEGER,
    s_id INTEGER,
    primary key (c_id1, c_id2),
    foreign key (c_id1) references card (card_id),
    foreign key (c_id2) references card (card_id),
    foreign key (s_id) references skill (skill_id)
);
create table have_tag (
    skill_id INTEGER,
    tag_id INTEGER,
    time INTEGER,
    /* primary key (skill_id, tag_id), */
    foreign key (skill_id) references skill (skill_id),
    foreign key (tag_id) references tag (tag_id)
);
create table have_teamtag (
    skill_id INTEGER,
    tag_id INTEGER,
    time INTEGER,
    /* primary key (skill_id, tag_id), */
    foreign key (skill_id) references teamskill (skill_id),
    foreign key (tag_id) references tag (tag_id)
);
create table leader_skill(
    skill_id INTEGER,
    name TEXT,
    description TEXT,
    primary key (skill_id)
);
create table leader_part(
    part_id INTEGER,
    skill_id INTEGER,
    primary key(part_id) foreign key(skill_id) references leader_skill(skill_id)
);
create table object(
    obj_id INTEGER,
    name TEXT,
    primary key(obj_id)
);
create table taglimit(
    limit_id INTEGER,
    name TEXT,
    primary key(limit_id)
);
create table leader_skill_part_tag(
    part_id INTEGER,
    tag_id INTEGER,
    foreign key (part_id) references leader_part (part_id),
    foreign key (tag_id) references tag (tag_id)
);
create table leader_skill_part_object(
    part_id INTEGER,
    obj_id INTEGER,
    foreign key (part_id) references leader_part (part_id),
    foreign key (obj_id) references object (obj_id)
);
create table leader_skill_part_limit(
    part_id INTEGER,
    limit_id INTEGER,
    foreign key(part_id) references leader_part(part_id),
    foreign key(limit_id) references taglimit(limit_id)
);
create table have_leader_skill(
    card_id INTEGER,
    skill_id INTEGER,
    foreign key(card_id) references card(card_id),
    foreign key(skill_id) references leader_skill(skill_id)
);
create table board (
    board_id INT PRIMARY KEY,
    name TEXT not null
    /* primary key (series_id) */
);