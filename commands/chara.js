const { fetchData } = require("./util");
const { MessageEmbed } = require("discord.js");
const GENDER = {
    male: "男性",
    female: "女性",
    secret: "ないしょ",
};
const UNIT = {
    light_sound: "Leo/need",
    idol: "MORE MORE JUMP!",
    street: "Vivid BAD SQUAD",
    theme_park: "ワンダーランズ×ショウタイム",
    school_refusal: "25時ナイトコードで。",
    piapro: "VIRTUAL SINGER",
};
const EMOJI_UNIT = {
    light_sound: "<:unit_ts_1_penlight:800616246651256862>",
    idol: "<:unit_ts_2_penlight:800616246575497226>",
    street: "<:unit_ts_3_penlight:800616246496198746>",
    theme_park: "<:unit_ts_4_penlight:800616246529097748>",
    school_refusal: "<:unit_ts_5_penlight:800616246235627542>",
    piapro: "<:unit_ts_6_penlight:800616246646800394>",
};

exports.CHARA = async (client, message, args) => {
    const MESSAGE_AUTHOR_ID = message.author.id;
    const CHARACTER_PROFILE = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/characterProfiles.json");
    const CHARACTER_NAME = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/gameCharacters.json");
    const CHARACTER_COLOR = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/gameCharacterUnits.json");
    var charaId = 0;
    var charaBox = [];
    // Asume given name shall not named with others
    for (chara of CHARACTER_NAME) {
        if (args.join(" ").toUpperCase().endsWith(chara.givenName) || args.join(" ").endsWith(chara.givenNameRuby)) {
            charaId = chara.id;
            charaBox = [];
            break;
        } else if (args.join(" ").startsWith(chara.firstName) || args.join(" ").startsWith(chara.firstNameRuby)) {
            charaId = chara.id;
            if (!charaBox.includes(chara.id)) {
                charaBox.push(chara.id);
            }
        }
    }
    if (charaId == 0) {
        return message.channel.send("そのキャラは存在しません");
    }
    if (charaBox.length > 1) {
        let wait_description = [];
        for (let i = 0; i < charaBox.length; i++) {
            wait_description.push(`***${charaBox[i]}***.${CHARACTER_NAME[charaBox[i] - 1].firstName === undefined ? "" : CHARACTER_NAME[charaBox[i] - 1].firstName} ${CHARACTER_NAME[charaBox[i] - 1].givenName}`);
        }
        try {
            let wait_embed = new MessageEmbed().setColor("GREEN").setTitle("表示したいキャラの番号を入力してください。").setDescription(wait_description);
            message.channel.send(wait_embed);
            function filter(message) {
                if (message.author.id !== MESSAGE_AUTHOR_ID) {
                    return false;
                }
                const pattern = /^[0-9]{1,2}(\s*,\s*[0-9]{1,2})*$/g;
                return pattern.test(message.content);
            }
            message.channel.activeCollector = true;
            const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
            const reply = response.first().content;
            charaId = reply;
        } catch (error) {
            message.channel.send(new MessageEmbed().setColor("RED").setTitle("タイムアウト"));
            message.channel.activeCollector = false;
            return;
        }
    }
    const CHARA_POS = charaId - 1;
    let chara_embed = new MessageEmbed()
        .setColor(CHARACTER_COLOR[CHARA_POS].colorCode)
        .setThumbnail(`https://github.com/Sekai-World/sekai-viewer/blob/main/src/assets/chara_icons/chr_ts_${charaId}.png?raw=true`)
        .setTitle(
            `${EMOJI_UNIT[CHARACTER_COLOR[CHARA_POS].unit]} | ${CHARACTER_NAME[CHARA_POS].firstName === undefined ? "" : CHARACTER_NAME[CHARA_POS].firstName} ${CHARACTER_NAME[CHARA_POS].givenName} (${
                CHARACTER_NAME[CHARA_POS].firstNameRuby === undefined ? "" : CHARACTER_NAME[CHARA_POS].firstNameRuby
            } ${CHARACTER_NAME[CHARA_POS].givenNameRuby})`
        )
        .setDescription(CHARACTER_PROFILE[CHARA_POS].introduction)
        .addField("ユニット", UNIT[CHARACTER_COLOR[CHARA_POS].unit], true)
        .addField("テーマカラー", CHARACTER_COLOR[CHARA_POS].colorCode, true)
        .addField("性別", GENDER[CHARACTER_NAME[CHARA_POS].gender], true)
        .addField("身長", CHARACTER_NAME[CHARA_POS].height + "cm", true)
        .addField("誕生日", CHARACTER_PROFILE[CHARA_POS].birthday, true);
    CHARACTER_PROFILE[CHARA_POS].school === undefined ? null : chara_embed.addField("学校", `${CHARACTER_PROFILE[CHARA_POS].school}、${CHARACTER_PROFILE[CHARA_POS].schoolYear}`, true);
    CHARACTER_PROFILE[CHARA_POS].hobby === undefined ? null : chara_embed.addField("趣味", `${CHARACTER_PROFILE[CHARA_POS].hobby}`, true);
    CHARACTER_PROFILE[CHARA_POS].specialSkill === undefined ? null : chara_embed.addField("特技", `${CHARACTER_PROFILE[CHARA_POS].specialSkill}`, true);
    CHARACTER_PROFILE[CHARA_POS].favoriteFood === undefined ? null : chara_embed.addField("好きな食べ物", `${CHARACTER_PROFILE[CHARA_POS].favoriteFood}`, true);
    CHARACTER_PROFILE[CHARA_POS].hatedFood === undefined ? null : chara_embed.addField("嫌いな食べ物", `${CHARACTER_PROFILE[CHARA_POS].hatedFood}`, true);
    CHARACTER_PROFILE[CHARA_POS].weak === undefined ? null : chara_embed.addField("苦手なこと", `${CHARACTER_PROFILE[CHARA_POS].weak}`, true);
    message.channel.send(chara_embed);
    charaId = 0;
};
