const http = require('http');
http
  .createServer(function(req, res) {
    res.write('動いてりゅよฅ(＾・ω・＾ฅ)');
    res.end();
  })
  .listen(8080);
const chalk = require("chalk")
const discord = require('discord.js');
const client = new discord.Client();
const owners = require('./owner.json');
const { PREFIX } = require('./config.json');
const prefix = PREFIX;
const { ReactionController } = require('discord.js-reaction-controller');
const handleReaction = async (channelID, messageID, callback) => {
  const channel = await client.channels.fetch(channelID);
  const message = await channel.messages.fetch(messageID);
  const collector = message.createReactionCollector(() => true);
  collector.on('collect', (reaction, user) => callback(reaction, user));
};
const cron = require('node-cron');
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fetch = require('node-fetch');
var asciiFaces = require('cool-ascii-faces');
const config = require('./config.json');
const sendtime = {};
const { fetchData } = require("./commands/util");

client.on('ready', async ready => {
  
  console.log(chalk.red("ready"));
  sendtime[client.channels.cache.get('766162642682511400')] = Date.now();
  const logchannel = client.channels.cache.get('766162642682511400');
  logchannel.send('pinging...').then(function(t) {
    t.edit(
      new discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle('再起動')
        .setDescription(
          `ping:${Date.now() -
          sendtime[client.channels.cache.get('766162642682511400')]} ms`
        )
        .setFooter(`${client.user.tag} ディレクトリ:ProsekaBot`)
    );
  });
  sendtime[client.channels.cache.get('777400049893113876')] = Date.now();
  const logchannel2 = client.channels.cache.get('777400049893113876');
  logchannel2.send('pinging...').then(function(t) {
    t.edit(
      new discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle('再起動')
        .setDescription(
          `ping:${Date.now() -
          sendtime[client.channels.cache.get('777400049893113876')]} ms`
        )
        .setFooter(`${client.user.tag} ディレクトリ:ProsekaBot(本体部分)`)
    );
  });
});

client.on('message', async message => {
  if (message.content.includes(client.token)) {
    message.channel.bulkDelete(2);
  }
  const URL_PATTERN = /http(?:s)?:\/\/(?:.*)?discord(?:app)?\.com\/channels\/(?:\d{17,19})\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})/g;
  let result;

  while ((result = URL_PATTERN.exec(message.content)) !== null) {
    const group = result.groups;
    const ch = await client.channels.fetch(group.channelId)
    if (ch.parentID === "805331833348816906") {
      return
    }

    client.channels
      .fetch(group.channelId)
      .then(channel => channel.messages.fetch(group.messageId))
      .then(targetMessage => {
        if (targetMessage.attachments.size <= 0) {
          if (!targetMessage.content) {
            message.channel.send(
              new discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`[リンク](${message.content})`)
                .setAuthor(
                  targetMessage.author.tag,
                  targetMessage.author.displayAvatarURL({ dynamic: true })
                )
                .setFooter(`${targetMessage.channel.name}で送信された埋め込み`)
                .setTimestamp()
            );
          } else {
            message.channel.send(
              new discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(targetMessage.content)
                .setAuthor(
                  targetMessage.author.tag,
                  targetMessage.author.displayAvatarURL({ dynamic: true })
                )
                .setFooter(
                  `${targetMessage.channel.name}で送信された通常メッセージ`
                )
                .setTimestamp()
            );
          }
        } else {
          var targetembed = new discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription(
              `[リンク](${message.content})`
            )
            .addField('メッセージ内容:', targetMessage.content)
            .setImage(targetMessage.attachment)
            .setAuthor(
              targetMessage.author.tag,
              targetMessage.author.displayAvatarURL({ dynamic: true })
            )
            .setFooter(
              `${targetMessage.channel.name}で送信されたファイル付きメッセージ`
            )
            .setTimestamp();

          message.channel.send(targetembed);
        }
      })
      .catch(error =>
        message
          .reply(error)
          .then(message => message.delete({ timeout: 10000 }))
          .catch(console.error)
      );
  }
  if (!message.content.startsWith(prefix)) return;



  const [command, ...args] = message.content.slice(prefix.length).split(' ');
  switch (command) {
    case "特殊":
    if(message.author.id !== "475304856018616340") return;
    let cranke = message.guild.roles.cache.get("772094706996740116")
    let dance = message.guild.roles.cache.get("761779004830777355")
    let leak = message.guild.roles.cache.get("805334164978532372")
      message.channel.send(new discord.MessageEmbed().setTitle("特殊役職申請:scroll:")
      .setDescription(`\n${cranke} <#772094528240091136>で話せるようになります。\n${dance} <#760785558678536215>で話せるようになります\n${leak} <#805336981500461066>で話せるようになります。\n\n申請はこのチャンネルか、<@!475304856018616340>のDMまで`)
      .addField("なぜ申請制？","<#782552363231215636>で間違って付けてしまうのを防ぐためです。")
      .addField("隔離病棟","病み話がしたい人用")
      .addField("r-18","名前の通りなチャンネル")
      .addField("リーク情報","プロセカ公式がまだ発表していない情報を共有するチャンネル。\n使う際は<#805337415971504159>をよく読んで使ってください。")
      .setFooter("申請したメッセージが削除されていたら、役職がついてます。 | 最終更新")
      .setTimestamp()
      )

      break
    case 'test':
      message.channel.send('test');
      break;
    case 'simplepoll':
    case 'spoll':
    case 'simpoll':
      const [title, ...choices] = args;
      if (!title) return message.channel.send('タイトルを指定してください');
      const emojis = [
        '1️⃣',
        '2️⃣',
        '3️⃣',
        '4️⃣',
        '5️⃣',
        '6️⃣',
        '7️⃣',
        '8️⃣',
        '9️⃣',
        '🔟'
      ];
      if (choices.length < 2 || choices.length > emojis.length)
        return message.channel.send(
          `選択肢は2から${emojis.length}の範囲で指定してください`
        );
      const poll = await message.channel.send({
        embed: {
          color: 'RANDOM',
          title: title,
          description: choices.map((c, i) => `${emojis[i]} ${c}`).join('\n')
        }
      });
      emojis.slice(0, choices.length).forEach(emoji => poll.react(emoji));
      break;

    case 'trans':
    case 'translate':
      const source = encodeURIComponent(args.shift());
      const target = encodeURIComponent(args.shift());
      const text = encodeURIComponent(args.join(' '));

      const content = await fetch(
        `https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec?text=${text}&source=${source}&target=${target}`
      ).then(res => res.text());
      message.channel.send(
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('result')
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(content)
      );
      break;

    case 'role-info':
    case 'role-i':
      const role = message.guild.roles.cache.get(args.join(' '));
      let roleembed = new discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('役職表示')
        .setDescription(
          `<@&${args.join(' ')}>の情報\n人数:${
          role.members.size
          }人\nポジション:${role.position}\nID:\`${args.join(' ')}\``
        )
        .setTimestamp();
      message.channel.send(roleembed);
      break;

    case 'eval':
      const { eval } = require('./commands/eval.js');
      eval(client, message, args);
      break;

    case 'vote':
    case 'v':
      const { vote } = require('./commands/vote.js');
      vote(client, message, args);
      break;

    case '協力募集':
      if (!message.channel.id === '761783096428593163') {
        message.reply('ここでは募集できないよ');
      } else if (!args[0]) {
        message.reply('ルーム番号を貼ってね(ps!協力募集 [ルーム番号])');
      } else {
        var msg = await message.channel.send(
          `<@&${'761876263165755443'}> <@${
          message.author.id
          }>が協力ライブ募集中だよ\nルーム番号:${
          args[0]
          }\n(30秒間)！(仮(今度ちゃんとした募集機能つけます))`
        );
        setTimeout(() => {
          message.delete({ timeout: 500 });
          msg.edit('募集終了');
        }, 30000);
      }
      break;

    case 'ライブ募集':
      if (!message.channel.id === '761783096428593163') {
        message.reply('ここでは募集できないよ');
      } else if (!args[0]) {
        message.reply('ルーム番号を貼ってね(ps!ライブ募集 [ルーム番号])');
      } else {
        var msg = await message.channel.send(
          `<@&${'761876162880077845'}> <@${
          message.author.id
          }>がライブ募集中だよ\nルーム番号:${
          args[0]
          }\n(30秒間)！(仮(今度ちゃんとした募集機能つけます))`
        );
        setTimeout(() => {
          message.delete({ timeout: 500 });
          msg.edit('募集終了');
        }, 30000);
      }
      break;

    case 'ベテラン募集':
      if (!message.channel.id === '761783096428593163') {
        message.reply('ここでは募集できないよ');
      } else if (!args[0]) {
        message.reply('ルーム番号を貼ってね(ps!ベテラン募集 [ルーム番号])');
      } else {
        var msg = await message.channel.send(
          `<@&${'777393145436569610'}> <@${
          message.author.id
          }>が協力募集中だよ\nルーム番号:${
          args[0]
          }\n(30秒間)！(仮(今度ちゃんとした募集機能つけます))`
        );
        setTimeout(() => {
          message.delete({ timeout: 500 });
          msg.edit('募集終了');
        }, 30000);
      }
      break;

    case 'help':
    case 'h':
      if (message.author.bot) return;
      const helpcontroller = new ReactionController(client);
      helpcontroller.addReactionHandler('❌', reaction => {
        reaction.message.delete({ timeout: 500 }).catch(console.error);
      });
      helpcontroller.addPages([
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('ヘルプ')
          .setDescription('このbotのヘルプだよ(1/3)')
          .addFields(
            {
              name: '**prefix**',
              value: 'prefixは「' + prefix + '」だよ！コマンドの前につけてね'
            },
            {
              name: '**コマンド**',
              value: '↓コマンド一覧'
            },
            {
              name: '**ps!help**',
              value: 'これ'
            },
            {
              name: '**ps!charahelp**',
              value: 'キャラヘルプ'
            },
            {
              name: '**ps!gamehelp**',
              value: 'ゲームヘルプ'
            },
            {
              name: '次ページ',
              value: 'helpの続き'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('ヘルプ')
          .setDescription('このbotのヘルプだよ(2/3)')
          .addFields(
            {
              name: '**ps!test**',
              value: 'testって返事くるよ(は？)'
            },
            {
              name: '**ps!協力募集 [ルーム番号]**',
              value: '協力募集ができるよ'
            },
            {
              name: '**ps!マルチ募集 [ルーム番号]**',
              value: 'マルチ募集ができるよ'
            },
            {
              name: '**ps!ベテラン募集 [ルーム番号]**',
              value: 'ベテランに協力募集できるよ'
            },
            {
              name: '次ページ',
              value: 'helpの続き'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('ヘルプ')
          .setDescription('このbotのヘルプだよ(3/3)')
          .addFields(
            {
              name: '**ps!chara [キャラクター名]**',
              value: 'キャラ図鑑が見れるよ(更新中)'
            },
            {
              name: '**ps!play [曲名]**',
              value: '音楽が聴けるよ(バグ多め)'
            },
            {
              name: '次ページ',
              value: '追加予定'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除')
      ]);

      helpcontroller.send(message).catch(console.error);

      break;

    case 'charahelp':
    case 'charah':
      if (message.author.bot) return;
      const charahelpcontroller = new ReactionController(client);
      charahelpcontroller.addReactionHandler('❌', reaction => {
        reaction.message.delete({ timeout: 500 }).catch(console.error);
      });
      charahelpcontroller.addPages([
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('キャラヘルプ')
          .setDescription('このbotのキャラヘルプだよ(VIRTUAL SINGER)(1/6)')
          .addFields(
            {
              name: '**ps!chara ミク**',
              value: '初音ミク'
            },
            {
              name: '**ps!chara リン**',
              value: '鏡音リン'
            },
            {
              name: '**ps!chara レン**',
              value: '鏡音レン'
            },
            {
              name: '**ps!chara ルカ**',
              value: '巡音ルカ'
            },
            {
              name: '**ps!chara MEIKO**',
              value: 'MEIKO'
            },
            {
              name: '**ps!chara KAITO**',
              value: 'KAITO'
            },
            {
              name: '次ページ',
              value: 'Leo/need'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('キャラヘルプ')
          .setDescription('このbotのキャラヘルプだよ(Leo/need)(2/6)')
          .addFields(
            {
              name: '**ps!chara 一歌**',
              value: '星乃一歌'
            },
            {
              name: '**ps!chara 咲希**',
              value: '天馬咲希'
            },
            {
              name: '**ps!chara 穂波**',
              value: '望月穂波'
            },
            {
              name: '**ps!chara 志歩**',
              value: '日野森志歩'
            },
            {
              name: '次ページ',
              value: 'MORE MORE JUMP!'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('キャラヘルプ')
          .setDescription('このbotのキャラヘルプだよ(MORE MORE JUMP)(3/6)')
          .addFields(
            {
              name: '**ps!chara みのり**',
              value: '花里みのり'
            },
            {
              name: '**ps!chara 遥**',
              value: '桐谷遥'
            },
            {
              name: '**ps!chara 愛莉**',
              value: '桃井愛莉'
            },
            {
              name: '**ps!chara 雫**',
              value: '日野森雫'
            },
            {
              name: '次ページ',
              value: 'Vivid BAD SQUAD'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('キャラヘルプ')
          .setDescription('このbotのキャラヘルプだよ(Vivid BAD SQUAD)(4/6)')
          .addFields(
            {
              name: '**ps!chara こはね**',
              value: '小豆沢こはね'
            },
            {
              name: '**ps!chara 杏**',
              value: '白石杏'
            },
            {
              name: '**ps!chara 彰人**',
              value: '東雲彰人'
            },
            {
              name: '**ps!chara 冬弥**',
              value: '青柳冬弥'
            },
            {
              name: '次ページ',
              value: 'ワンダーランズ×ショウタイム'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('キャラヘルプ')
          .setDescription(
            'このbotのキャラヘルプだよ(ワンダーランズ×ショウタイム)(5/6)'
          )
          .addFields(
            {
              name: '**ps!chara 司**',
              value: '天馬司'
            },
            {
              name: '**ps!chara 類**',
              value: '神代類'
            },
            {
              name: '**ps!chara 寧々**',
              value: '草薙寧々'
            },
            {
              name: '**ps!chara えむ**',
              value: '鳳えむ'
            },
            {
              name: '次ページ',
              value: '25時、ナイトコードで。'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除'),
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('キャラヘルプ')
          .setDescription(
            'このbotのキャラヘルプだよ(25時、ナイトコードで。)(5/6)'
          )
          .addFields(
            {
              name: '**ps!chara 奏**',
              value: '宵崎奏'
            },
            {
              name: '**ps!chara 瑞希**',
              value: '暁山瑞希'
            },
            {
              name: '**ps!chara 絵名**',
              value: '東雲絵名'
            },
            {
              name: '**ps!chara まふゆ**',
              value: '朝比奈まふゆ'
            },
            {
              name: '次ページ',
              value: '制作中'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除')
      ]);

      charahelpcontroller.send(message).catch(console.error);

      break;

    case 'gamehelp':
    case 'gameh':
      if (message.author.bot) return;
      const gamehelpcontroller = new ReactionController(client);
      gamehelpcontroller.addReactionHandler('❌', reaction => {
        reaction.message.delete({ timeout: 500 }).catch(console.error);
      });
      gamehelpcontroller.addPages([
        new discord.MessageEmbed()
          .setColor('RANDOM')
          .setTitle('ヘルプ')
          .setDescription('このbotのゲームヘルプだよ')
          .addFields(
            {
              name: '**ゲーム一覧**',
              value:
                'ブラックジャック(ps!blackjack)\n~~ルーレット(ps!roulette)~~\nスロット(ps!slot)'
            },
            {
              name: '**その他コマンド**',
              value: 'コイン確認(ps!coin)\nコインランキング(ps!coinranking)'
            },
            {
              name: '次ページ',
              value: '追加予定'
            }
          )
          .setFooter('◀:前ページ/▶:次ページ/⏹:固定/❌:削除')
      ]);

      gamehelpcontroller.send(message).catch(console.error);

      break;

    case 'chara':
    case 'c':
      if (!args[0]) {
        return message.channel.send('キャラクター名を入力してね');
      }
      const { CHARA } = require('./commands/chara.js');
      CHARA(client, message, args);
      break;

    case 'card':
    case 'ca':
      if (!args[0]) {
        return message.channel.send("カード名を入力してね");
      }
      const { CARD } = require('./commands/card.js');
      CARD(client, message, args);
      break;

    case 'cardstory':
    case 'castory':
      if (!args[0]) {
        return message.channel.send("カード名を入力してね");
      }
      const { CARDSTORY } = require('./commands/cardstory.js');
      CARDSTORY(client, message, args);
      break;
    //-------------------------------曲
    //-------------------------------曲
    //-------------------------------曲

    case 'music':
    case 'm':
      if (!args[0]) {
        return message.channel.send('曲名を入力してね');
      }
      const { MUSIC } = require('./commands/music.js');
      MUSIC(client, message, args);
      break;


    case 'event':
    case 'e':
      if (!args[0]) {
        return message.channel.send("イベント名を入力してね");
      }
      const { EVENT } = require('./commands/event.js');
      EVENT(client, message, args);
      break;
  }
});

client.login(process.env.token);
