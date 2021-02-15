const Discord = require('discord.js');

const bot = new Discord.Client();

const ytdl = require("ytdL-core");

const token = 'tentacle-porn';

const PREFIX = '!';

var servers = {};


bot.on('ready', () =>{
    console.log('Loaded - Ready');
})

bot.on('message', message=>{

    let args = message.content.substring(PREFIX.length).split(" ");
    
    switch(args[0]){
        case 'sudo':
            if(args[1] === 'su'){
                message.channel.sendMessage('root Music Maker#')
            }else{
                message.channel.sendMessage('Specify usage')
            }
            break;
            
        case 'p':

            function play(connection, message){
                var server = servers[message.guild.id];
                
                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }
                });


            }


            if(!args[1]){
                message.channel.send("Paste the link (No keywords)");
                return;
            }

            if(!message.member.voiceChannel){
                message.channel.send("Go in to a channel");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            })



            
            break;




            case 's':
                var server = servers[message.guild.id];
                if(server.dispatcher) server.dispatcher.end();
                message.channel.send("Skipping song")
            break;


            case 'l':
                var server = servers[message.guild.id];
                if(message.guild.voiceConnection){
                    for(var i = server.queue.length -1; i >=0; i--){
                        server.queue.splice(i, 1);
                    }

                    server.dispatcher.end();
                    message.channel.send("Left channel")
                    console.log('Queue stopped')
                }

                if(message.guild.connection) message.guild.voiceConnection.disconnect();
            break;
            



            



    }
})

bot.login(token);
