const { fetchData } = require("./util");
const { MessageEmbed } = require("discord.js");
const { humanizer } = require("humanize-duration");
const moment = require("moment-timezone");
require("ffmpeg-static")
require("@discordjs/opus")
//https://sekai-res.dnaroma.eu/file/sekai-assets/event/event_nocturne_2021/bgm_rip/event_nocturne_2021_top.mp3
const createBar = require("string-progressbar");
const ATTR = {
  cool: "<:icon_attribute_cool:800616145957945354>",
  cute: "<:icon_attribute_cute:800616146046550027>",
  happy: "<:icon_attribute_happy:800616145916395530>",
  mysterious: "<:icon_attribute_mysterious:800616145954275349>",
  pure: "<:icon_attribute_pure:800616145916919839>",
};

exports.EVENT = async (client, message, args) => {
  const MESSAGE_AUTHOR_ID = message.author.id;
  const EVENT_NAME = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/events.json");
  const EVENT_DECK = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/eventDeckBonuses.json");
  const EVENt_CARD = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/eventCards.json");

  var eventId = 0;
  var eventPos = -2;
  var eventBox = [];
  if (!isNaN(args.join(" "))) {
    eventId = args.join(" ");
    eventPos = EVENT_NAME.findIndex(e => e.id == args.join(" "))
  } else {
    for (let i = 0; i < EVENT_NAME.length; i++) {
      if (EVENT_NAME[i].name.toLowerCase().startsWith(args.join(" ").replace(/[\s_]/g, " ").toLowerCase()) || EVENT_NAME[i].name.toLowerCase().endsWith(args.join(" ").replace(/[\s_]/g, " ").toLowerCase())) {
        eventId = EVENT_NAME[i].id;
        eventPos = i;
      }
    }
  }

  if (eventId === 0 && eventPos === -1) {
    return message.channel.send("そのイベントは存在しません");
  }
    const THE_EVENT = EVENT_NAME[eventPos];
    const THE_EVENT_DECK = EVENT_DECK.find(e => e.eventId == eventId);
    let event_embed = new MessageEmbed()
      .setTitle(`${ATTR[THE_EVENT_DECK.cardAttr]} | ${THE_EVENT.name}`)
      .setImage(`https://sekai-res.dnaroma.eu/file/sekai-assets/home/banner/${EVENT_NAME[eventId - 1].assetbundleName}_rip/${EVENT_NAME[eventId - 1].assetbundleName}.webp`)
      .setDescription(
        `イベントタイプ: **${THE_EVENT.eventType}** `
        + `\nイベント開始時間: **${moment(THE_EVENT.startAt).tz("Asia/Tokyo").format("YYYY年MM月DD日 HH時mm分ss秒")}**`
        + `\nイベント終了時間: **${moment(THE_EVENT.aggregateAt).tz("Asia/Tokyo").format("YYYY年MM月DD日 HH時mm分ss秒")}**`
        + `\n報酬配布開始時間: **${moment(THE_EVENT.distributionStartAt).tz("Asia/Tokyo").format("YYYY年MM月DD日 HH時mm分ss秒")}**`
        + `\nイベント閉鎖時間: **${moment(THE_EVENT.closedAt).tz("Asia/Tokyo").format("YYYY年MM月DD日 HH時mm分ss秒")}**`
        + `\n報酬最終受け取り時間: **${moment(THE_EVENT.distributionEndAt).tz("Asia/Tokyo").format("YYYY年MM月DD日 HH時mm分ss秒")}**`
      );
    Date.now() < THE_EVENT.aggregateAt ? event_embed.addField("残り時間:", ` **${moment(moment(THE_EVENT.aggregateAt).diff(moment(Date.now()))).format("DD日HH時間mm分ss秒")}**
      \n[${createBar(THE_EVENT.aggregateAt - THE_EVENT.startAt, Date.now() - THE_EVENT.startAt, 15)[0]}]`) : null
    
    event_embed.setFooter("ボイスチャンネルに接続して🎵を押すと、イベントBGMを再生できます。")
    const msg = await message.channel.send(event_embed);
    msg.react("🎵")
    
    const filter = (reaction, user) => reaction.emoji.name === '🎵'&&user.id === MESSAGE_AUTHOR_ID
    const collect = await message.awaitReactions(filter, { time: 30000 })
    if(collect){
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel){
      return message.channel.send(
      "ボイスチャンネルに接続してください"
      );
    }else{
      if(message.client.voice.connections.size > 0){
        return message.reply("使用中です")
      }
      const connection = await voiceChannel.join();
      connection.play(`https://sekai-res.dnaroma.eu/file/sekai-assets/event/${THE_EVENT.assetbundleName}/bgm_rip/${THE_EVENT.assetbundleName}_top.mp3`);
      
      if(message.member.voice.channel!==voiceChannel){
        voiceChannel.disconnect();
      }
    }                 //https://sekai-res.dnaroma.eu/file/sekai-assets/event/event_nocturne_2021/bgm_rip/event_nocturne_2021_top.mp3
    }
  

};
