const { fetchData } = require("./util");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const { ReactionController } = require("discord.js-reaction-controller");
const TRAINING_RARELITY = {
    1: "<:rarity_star_normal:800616036910104606>",
    2: "<:rarity_star_normal:800616036910104606><:rarity_star_normal:800616036910104606>",
    3: "<:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200>",
    4: "<:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200><:rarity_star_afterTraining:800616092611379200>",
};

//--------------------
exports.CARDSTORY = async (client, message, args) => {
    if (!args[1]) {
        return message.reply("閲覧したいストーリーを指定してください。\n前編:`ps!cardstory カード名 1` (***__スペースは半角__***)\n後編:`ps!cardstory カード名 2`(***__スペースは半角__***)");
    }
    const MESSAGE_AUTHOR_ID = message.author.id;
    const CARD_STORY = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/cardEpisodes.json");
    const CARD_PREFIX = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/cards.json");
    const CHARACTER_NAME = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/gameCharacters.json");
    const CARD_SKILL = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/skills.json");
    var cardId = 0;
    var CARD_POS = -1;
    var cardBox = [];
    var charaId = 0;
    var charaBox1 = [];
    var charaBox2 = [];

    for (let i = 0; i < CARD_PREFIX.length; i++) {
        if (CARD_PREFIX[i].prefix.toLowerCase().endsWith(args[0].toLowerCase())) {
            cardId = CARD_PREFIX[i].id;
            CARD_POS = i;
            if (!cardBox.includes(i)) {
                cardBox.push(i);
            }
        } else if (CARD_PREFIX[i].prefix.toLowerCase().startsWith(args[0].toLowerCase())) {
            cardId = CARD_PREFIX[i].id;
            CARD_POS = i;
            if (!cardBox.includes(i)) {
                cardBox.push(i);
            }
        }
    }

    if (cardId == 0) {
        for (chara of CHARACTER_NAME) {
            if (args[0].toUpperCase().endsWith(chara.givenName) || args[0].endsWith(chara.givenNameRuby)) {
                charaId = chara.id;
                charaBox1 = [];
                break;
            } else if (args[0].startsWith(chara.firstName) || args[0].startsWith(chara.firstNameRuby)) {
                charaId = chara.id;
                if (!charaBox1.includes(chara.id)) {
                    charaBox1.push(chara.id);
                }
            }
        }
        if (charaId !== 0) {
            if (charaBox1.length > 1) {
                let wait_description = [];
                for (let i = 0; i < charaBox1.length; i++) {
                    wait_description.push(`***${charaBox1[i]}***.${CHARACTER_NAME[charaBox1[i] - 1].firstName === undefined ? "" : CHARACTER_NAME[charaBox1[i] - 1].firstName} ${CHARACTER_NAME[charaBox[i] - 1].givenName}`);
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
                    const response = await message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 30000,
                        errors: ["time"],
                    });
                    const reply = response.first().content;
                    charaId = reply;
                } catch (error) {
                    message.channel.send(new MessageEmbed().setColor("RED").setTitle("タイムアウト"));
                    message.channel.activeCollector = false;
                    return;
                }
            }
            for (let i = 0; i < CARD_PREFIX.length; i++) {
                if (CARD_PREFIX[i].characterId === charaId) {
                    charaBox2.push(i);
                }
            }
            if (charaBox2.length > 1) {
                cardBox = charaBox2;
            }
        } else {
            return message.channel.send("そのカードは存在しません");
        }
    }

    if (cardBox.length > 1) {
        let wait_description = [];

        for (let i = 0; i < cardBox.length; i++) {
            for (let j = 0; j < CHARACTER_NAME.length; j++) {
                if (CARD_PREFIX[cardBox[i]].characterId === CHARACTER_NAME[j].id) {
                    wait_description.push(
                        `***${cardBox[i]}***.${CARD_PREFIX[cardBox[i]].prefix} (${CHARACTER_NAME[j].firstName === undefined ? "" : CHARACTER_NAME[j].firstName} ${CHARACTER_NAME[j].givenName}) | ${
                            TRAINING_RARELITY[CARD_PREFIX[cardBox[i]].rarity]
                        }`
                    );
                }
            }
        }
        try {
            let wait_embed = new MessageEmbed().setColor("GREEN").setTitle("表示したいカードの番号を入力してください。").setDescription(wait_description);
            message.channel.send(wait_embed);
            function filter(message) {
                if (message.author.id !== MESSAGE_AUTHOR_ID) {
                    return false;
                }
                const pattern = /^[0-9]{1,3}(\s*,\s*[0-9]{1,3})*$/g;
                return pattern.test(message.content);
            }
            message.channel.activeCollector = true;
            const response = await message.channel.awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ["time"],
            });
            const reply = response.first().content;
            CARD_POS = reply;
        } catch (error) {
            message.channel.send(new MessageEmbed().setColor("RED").setTitle("タイムアウト"));
            message.channel.activeCollector = false;
            return;
        }
    }
    const CARD_ID = CARD_PREFIX[CARD_POS].id;
    var STORY_POS = -1;
    for (let i = 0; i < CARD_STORY.length; i++) {
        if (CARD_ID === CARD_STORY[i].cardId) {
            if (args[1] == 1) {
                STORY_POS = i;
                const ASSETBUNDLE_NAME = await CARD_STORY[STORY_POS].assetbundleName;
                const SCENARIO_ID = await CARD_STORY[STORY_POS].scenarioId;
                const STORY_DATA = await fetchData(`https://sekai-res.dnaroma.eu/file/sekai-assets/character/member/${ASSETBUNDLE_NAME}_rip/${SCENARIO_ID}.asset`);
                var STORY = [];
                STORY_DATA.TalkData.forEach((d) => STORY.push(new MessageEmbed().setTitle(d.WindowDisplayName).setDescription(d.Body)));
                const controller = new ReactionController(client);
                controller.addPages(STORY);

                controller.send(message).catch(console.error);
                break;
            } else if (args[1] == 2) {
                STORY_POS = i + 1;
                const ASSETBUNDLE_NAME = await CARD_STORY[STORY_POS].assetbundleName;
                const SCENARIO_ID = await CARD_STORY[STORY_POS].scenarioId;
                const STORY_DATA = await fetchData(`https://sekai-res.dnaroma.eu/file/sekai-assets/character/member/${ASSETBUNDLE_NAME}_rip/${SCENARIO_ID}.asset`);
                var STORY = [];
                STORY_DATA.TalkData.forEach((d) => STORY.push(new MessageEmbed().setTitle(d.WindowDisplayName).setDescription(d.Body)));
                const controller = new ReactionController(client);
                controller.addPages(STORY);

                controller.send(message).catch(console.error);
                break;
            } else {
                STORY_POS = i;
                const ASSETBUNDLE_NAME = await CARD_STORY[STORY_POS].assetbundleName;
                const SCENARIO_ID = await CARD_STORY[STORY_POS].scenarioId;
                const STORY_DATA = await fetchData(`https://sekai-res.dnaroma.eu/file/sekai-assets/character/member/${ASSETBUNDLE_NAME}_rip/${SCENARIO_ID}.asset`);
                var STORY = [];
                STORY_DATA.TalkData.forEach((d) => STORY.push(new MessageEmbed().setTitle(d.WindowDisplayName).setDescription(d.Body)));
                const controller = new ReactionController(client);
                controller.addPages(STORY);

                controller.send(message).catch(console.error);
                break;
            }
        }
    }
};
