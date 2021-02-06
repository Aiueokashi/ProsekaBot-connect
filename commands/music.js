const { fetchData } = require("./util");
const { MessageEmbed } = require("discord.js");

exports.MUSIC = async (client, message, args) => {
    const MESSAGE_AUTHOR_ID = message.author.id;
    const MUSIC_TITLE = await fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/musics.json");

    var musicId = 0;
    var musicPos = -1;
    var musicBox = [];
    var musicPosBox = [];
    for (let i = 0; i < MUSIC_TITLE.length; i++) {
        if (MUSIC_TITLE[i].title.toLowerCase().startsWith(args.join(" ").replace(/[\s_]/g, " ").toLowerCase()) || MUSIC_TITLE[i].title.toLowerCase().endsWith(args.join(" ").replace(/[\s_]/g, " ").toLowerCase())) {
            musicId = MUSIC_TITLE[i].id;
            musicPos = i;
            if (!musicBox.includes(MUSIC_TITLE[i].id)) {
                let musicid = MUSIC_TITLE[i].id;
                musicBox.push({ id: MUSIC_TITLE[i].id, pos: i });
                musicPosBox.push({ musicid: i });
            }
        }
    }
    if (musicId === 0 && musicPos === -1) {
        return message.channel.send("その曲は存在しません");
    }
    if(MUSIC_TITLE[musicPos].publishedAt > Date.now()&&!["805028729457868800","805336981500461066"].includes(message.channel.id)){
      return message.channel.send("この曲はまだゲーム内で公開されてないため表示できません。")
    }

    fetchData("https://raw.githubusercontent.com/Sekai-World/sekai-master-db-diff/master/musicDifficulties.json").then((musicData) => {
        if (!musicData) return;

        let music_embed = new MessageEmbed()
            .setTitle(`${MUSIC_TITLE[musicPos].title}`)
            .setThumbnail(`https://sekai-res.dnaroma.eu/file/sekai-assets/music/jacket/jacket_s_${String(musicId).padStart(3, "0")}_rip/jacket_s_${String(musicId).padStart(3, "0")}.webp`)
            .setDescription(`作詞: **${MUSIC_TITLE[musicPos].lyricist}** \n作曲: **${MUSIC_TITLE[musicPos].composer}** \n編曲: **${MUSIC_TITLE[musicPos].arranger}** `);
        let MUSIC_DIFFS = musicData.filter((d) => d.musicId === musicId);
        MUSIC_DIFFS.forEach((m) => music_embed.addField(`**${m.musicDifficulty}**`, `難易度:**${m.playLevel}**\nノーツ数:**${m.noteCount}**`, true));
        message.channel.send(music_embed);
    });

    delete musicId, musicPos, musicBox;
};
