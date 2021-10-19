const {Client,Intents} = require('discord.js');
const ytdl = require('ytdl-core');
const config = require("./config.json")
const { getVoiceConnection, joinVoiceChannel, AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, StreamType} = require('@discordjs/voice');
const streamOptions = {seek:0,volume:1}
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});
const fila = new Array()
const url;
client.login(config.token);
client.once('ready', ()=> {
    console.log('estou pronto!!');
});

    
    client.on("messageCreate", async message => {
    if (message.author.bot) return;
    if (message.member.voice.channel == null){
        message.channel.send("Você precisa estar conectado a um canal de voz!")
        return;
    }
    const connection =joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
    })
    const player = createAudioPlayer();
    
    if( message.content.toLowerCase().startsWith("?play")) {
        let args = message.content.split(' ');
        let youtubeLink = args[1];
        const stream= ytdl(youtubeLink,{filter:'audioonly'})
        const resource = createAudioResource(stream,streamOptions)
        player.play(resource)
        connection.subscribe(player)
        
        message.reply("hey, I played.");
        player.on(AudioPlayerStatus.Idle, ()=>connection.destroy())
        
    };
    if(message.content.toLowerCase().startsWith("?stop")){
        connection.disconnect()
    }
    else if(message.content.toLowerCase().startsWith("?comandos")){
      await message.channel.send("Comandos Mecicareca:")
      await message.channel.send("?play+link para dar play")
    }
  
});

    
