USE team2;

DROP TABLE IF EXISTS leader_skill_part_tag;

DROP TABLE IF EXISTS leader_skill_part_object;

DROP TABLE IF EXISTS leader_skill_part_limit;

DROP TABLE IF EXISTS have_leader_skill;

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

DROP TABLE IF EXISTS object;

DROP TABLE IF EXISTS taglimit;

DROP TABLE IF EXISTS leader_part;

DROP TABLE IF EXISTS leader_skill;

DROP TABLE IF EXISTS board;

CREATE TABLE card (
    card_id INT,
    name VARCHAR(1000) not null,
    star INT not null check (
        star >= 0
        and star < 9
    ),
    race VARCHAR(20) not null,
    attribute VARCHAR(6) not null,
    primary key (card_id)
);

CREATE TABLE user (
    u_id INT AUTO_INCREMENT,
    nickname VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    admin INT NOT NULL,
    PRIMARY KEY (u_id)
);
create table teamskill (

    skill_id INT not null,
    description VARCHAR(6000) not null,
    activate VARCHAR(2000) not null,
    primary key (skill_id)
);

create table skill (
    skill_id INT not null,
    name VARCHAR(1000) not null,
    type VARCHAR(10) not null,
    description VARCHAR(3000) not null,
    charge VARCHAR(6) not null,
    charge_time INT not null,
    changeto INT,
    primary key (skill_id)
);

create table board (
    board_id INT PRIMARY KEY,
    name VARCHAR(200) not null
    /* primary key (series_id) */
);

create table series (
    series_id INT PRIMARY KEY,
    name VARCHAR(1000) not null
    /* primary key (series_id) */
);

create table tag (
    tag_id INT NOT NULL,
    name VARCHAR(1000) not null,
    primary key (tag_id)
);

create table feedback (
    ID INT AUTO_INCREMENT not null,
    time VARCHAR(1000) not null,
    subject VARCHAR(1000) not null,
    content VARCHAR(1000) not null,
    u_id INT,
    primary key (ID),
    foreign key (u_id) references user (u_id)
);

create table backpack (
    u_id INT,
    card_id INT,
    primary key (u_id, card_id),
    foreign key (u_id) references user (u_id),
    foreign key (card_id) references card (card_id)
);

create table favorite (
    u_id INT,
    card_id INT,
    primary key (u_id, card_id),
    foreign key (u_id) references user (u_id),
    foreign key (card_id) references card (card_id)
);

create table belong_series (
    card_id INT,
    series_id INT,
    primary key (card_id, series_id),
    foreign key (card_id) references card (card_id),
    foreign key (series_id) references series (series_id)
);

create table have_teamskill (
    card_id INT,
    skill_id INT,
    /* primary key (card_id, skill_id), */
    foreign key (card_id) references card (card_id),
    foreign key (skill_id) references teamskill (skill_id)
);

create table have_skill (
    card_id INT,
    skill_id INT,
    /* primary key (card_id, skill_id), */
    foreign key (card_id) references card (card_id),
    foreign key (skill_id) references skill (skill_id)
);

create table bond (
    c_id1 INT,
    c_id2 INT,
    s_id INT,
    primary key (c_id1, c_id2),
    foreign key (c_id1) references card (card_id),
    foreign key (c_id2) references card (card_id),
    foreign key (s_id) references skill (skill_id)
);

create table have_tag (
    skill_id INT,
    tag_id INT,
    time INT,
    /* primary key (skill_id, tag_id), */
    foreign key (skill_id) references skill (skill_id),
    foreign key (tag_id) references tag (tag_id)
);

create table have_teamtag (
    skill_id INT,
    tag_id INT,
    time INT,
    /* primary key (skill_id, tag_id), */
    foreign key (skill_id) references teamskill (skill_id),
    foreign key (tag_id) references tag (tag_id)
);

create table leader_skill (
    skill_id INT,
    name VARCHAR(1000),
    description VARCHAR(3000),
    primary key (skill_id)
);

create table leader_part (
    part_id INT,
    skill_id INT,
    primary key (part_id),
    foreign key (skill_id) references leader_skill (skill_id)
);

create table object (
    obj_id INT,
    name VARCHAR(100),
    primary key (obj_id)
);

create table taglimit (
    limit_id INT,
    name VARCHAR(100),
    primary key (limit_id)
);

create table leader_skill_part_tag (
    part_id INT,
    tag_id INT,
    foreign key (part_id) references leader_part (part_id),
    foreign key (tag_id) references tag (tag_id)
);

create table leader_skill_part_object (
    part_id INT,
    obj_id INT,
    foreign key (part_id) references leader_part (part_id),
    foreign key (obj_id) references object (obj_id)
);

create table leader_skill_part_limit (
    part_id INT,
    limit_id INT,
    foreign key (part_id) references leader_part (part_id),
    foreign key (limit_id) references taglimit (limit_id)
);

create table have_leader_skill (
    card_id INT,
    skill_id INT,
    foreign key (card_id) references card (card_id),
    foreign key (skill_id) references leader_skill (skill_id)
);