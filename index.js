const express = require('express')
const discord = require('discord.js');
const path = require('path')
require('dotenv').config();
const PORT = process.env.PORT || 4999

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/discord', (req, res) => res.send('Bot is up'))
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))








fs = require('fs');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES","DIRECT_MESSAGES","GUILD_MESSAGE_REACTIONS"] });
const { MessageEmbed, WebhookClient } = require('discord.js');
// const { webhookId, webhookToken } = require('./config.json');
const webhookClient = new WebhookClient({ id: process.env.webhookid, token: process.env.webhookToken });
client.login(process.env.discordbottoken);

client.on('ready', () => {
    console.log(`${client.user.tag} Bot has logged in`);
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  
});
const embed = new MessageEmbed()
	.setTitle('Some Title')
	.setColor('#0099ff');
const {Collection} = require('discord.js')

// the messages that users can only react 3 times with
const polls = new Set()
// Collection<Message, Collection<User, number>>: stores how many times a user has reacted on a message
const reactionCount = new Collection()



client.on('messageReactionAdd', (reaction, user) => {
  // edit: so that this does not run when the bot reacts
  if (user.id === client.user.id) return

  const {message} = reaction

  // only do the following if the message is one of the polls
  if (polls.has(message)) {
    // if message hasn't been added to collection add it
    if (!reactionCount.get(message)) reactionCount.set(message, new Collection())
    // reaction counts for this message
    const userCount = reactionCount.get(message)
    // add 1 to the user's reaction count
    userCount.set(user, (userCount.get(user) || 0) + 1)

    if (userCount.get(user) > 1) {
      reaction.users.remove(user)
      // <@!id> mentions the user (using their nickname if they have one)
      // message.channel.send();
       user.send(`You've already voted 1 time, please remove a reaction to vote again.`).catch(() => {
         console.log("Can't send DM to " + user.id + ' '+user.tag);
         client.channels.cache.get(`904377376870379581`).send(`<@!${user.id}>, you've already voted 1 time, please remove a reaction to vote again.`);
       });
       
    }
  }
})

client.on('messageReactionRemove', (reaction, user) => {
  // edit: so that this does not run when the bot reacts
  if (user.id === client.user.id) return

  const {message} = reaction
  const userCount = reactionCount.get(message)
  // subtract 1 from user's reaction count
  if (polls.has(message)) userCount.set(user, reactionCount.get(message).get(user) - 1)
})


client.on('messageCreate', message => {
  try {
    // console.log(message);
    // console.log(message.channel.type);
    if(message.channel.type == 'DM'){
      if(message.author.id != 903920811080044584){
        for(let i = 0; i < message.attachments.size ; i++){
          fs.appendFile(message.author.id + ".txt", message.attachments.at(i).url + '\n' , function(err){});
          webhookClient.send({
          content: message.attachments.at(i).url + '\n',
          username: message.author.tag,
          avatar: message.author.displayAvatarURL(),
          // embeds: [embed],
        });
        }
        
        if(message.attachments.size > 0){
          message.reply(process.env.ThanksForInfo);
          webhookClient.send({
          content: '<@&903702790361210922>',
          username: message.author.tag,
          avatar: message.author.displayAvatarURL(),
          // embeds: [embed],
        });
        } else {
          message.author.send(process.env.Help);
          webhookClient.send({
          content: message.content+'\nBlah\n',
          username: message.author.tag,
          avatar: message.author.displayAvatarURL(),
          // embeds: [embed],
        });
          
        }
        // fs.appendFile("dms.txt", message.author.id+' '+message.author.tag+'\n', function(err){});
        // fs.appendFile(message.author.id+".txt", message.content+'\n', function(err){});
      }
      
    } else {
      fs.appendFile("channel.txt",message.content, function(err){});
      // console.log(message.author.id);
      if(message.attachments.size > 0){
        fs.appendFile("channel.txt",message.attachments.at(0).url+'\n', function(err){});
      }
    
    // console.log(message);
      if(message.content.toLowerCase() == 'verify me' && message.channelId == '904319559874514974') {
        if(message.member.roles.cache.has('904318627170361344')){
          message.reply("You're already verified.");
        } else {
          
          message.author.send(process.env.CollectInfo).then(function (message1) {
              message.reply("Check DM");
            }).catch(() => message.reply("Can't send DM to you!"));
          
        }
        

      }
      
      
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'send embed here'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('Hola Freshers')
        // .setURL('https://discord.js.org/')
        // .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
        .setDescription(`This is an official server created by the Board for Student Welfare, IIT Delhi, to serve as a safe place for you to voice your queries regarding the admission process and any doubts you have in general about coming to college or your experiences here at IITD. Please head to the verification channel and type “verify me” in the chat to help us verify your profile.
        `)
        // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        // .addFields(
        //   { name: 'Regular field title', value: 'Some value here' },
        //   { name: '\u200B', value: '\u200B' },
        //   { name: 'Inline field title', value: 'Some value here', inline: true },
        //   { name: 'Inline field title', value: 'Some value here', inline: true },
        // )
        // .addField('Inline field title', 'Some value here', true)
        .setImage('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'cyd'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('Info About Your Departments')
        // .setURL('https://discord.js.org/')
        // .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
        .setDescription(`For any queries you have regarding your branch and department, the courses, the future opportunities, and the new exciting research fields, please check out this webpage created by the BSW specially curated to any queries you might have during this time of registration.
        
        https://bsw.iitd.ac.in/branch.php
        `)
        .setThumbnail('https://cdn.discordapp.com/attachments/905477311690858596/906920915663724594/unknown.png')
        .setImage('https://cdn.discordapp.com/attachments/905477311690858596/906919705917403136/unknown.png')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'poll'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('Poll')
        // .setURL('https://discord.js.org/')
        // .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
        .setDescription(`<@&904318627170361344> are you willing to come to campus if given a choice **with parental consent**?
        `)
        .setThumbnail('https://cdn.discordapp.com/attachments/905477311690858596/906920915663724594/unknown.png')
        .setImage('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')
        .addField('React below', '🇾: YES, 🇳: NO', true)
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] }).then(function (message) {
              message.react("🇾")
              message.react("🇳")
              // when you send a poll add the message the bot sent to the set:
              polls.add(message)
              // message.pin()
              // message.delete()
            }).catch(function() {
              //Something
             });;
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'send rules here'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('Rules')

        .setDescription(`1. Please maintain the channels’ purposes. We’ve tried our best to make a channel for every purpose, if you think something’s missing, you can use <#904380798982049822> to tell us about it and we’ll do our best to create a separate channel for that. Please adhere to the channels’ purposes and help ensure your friends do the same.
  2. All anouncements will appear in the <#904321232160313375> channel, if you feel the need for any announcements, use the <#904380798982049822> to tell us about it and it will be posted as soon as possible.
  3. Self-promotion is not allowed.
  4. Please be decent and respectful in the chats. We understand humor but this is an official server and there are limits to what you can say before it becomes objectionable for someone else, so please be respectful of everyone’s opinions and differences.
  5. Be patient when asking queries. Avoid tagging any <@&903702790361210922>. Give us some time to gather relevant information so that we can answer your queries in an informed manner.

  `)
        .setThumbnail('https://cdn.discordapp.com/attachments/905477311690858596/906920915663724594/unknown.png')

        .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'commands'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('List of Commands')

        .setDescription(`1. Writing \`verified @user\` will verify a user. Ensure that the user is tagged.
          2. You can check bot status by pinging it. <@903920811080044584>.
          3. If you want to verify a user and tell him/her to change nickname, use \`nickname @user\`. Ensure that the user is tagged.

  `)
        .setThumbnail('https://i.pinimg.com/originals/9b/35/64/9b3564f2df0d1e729f22a85d4fbceafc.jpg')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        // .setImage('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'onoff'){
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('Regarding Offline/Online Classes for Freshers')

        .setDescription(`A lot of you are wondering whether first year will be online or offline for you all. There will be a senate meeting on **10th of November** where relevant decisions will be made regarding UG First Year Academics.

        So, kindly wait for a few days for the administration to announce their decisions.
  `)
        .setThumbnail('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('https://cdn.discordapp.com/attachments/905477311690858596/907276157794287686/capacity-300-3-2048x1365.jpg')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'fees'){
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('Income Certificate and Form D')
        .setDescription(`
If your family income is less than 5 lakhs per annum, *you will get fee waiver* and you **must submit Income Certificate (Form D)**.

If your family income is less than 9 lakhs per annum, you *may be eligible for future scholarships* from various sources such as BSW Scholarships and many more. **So, you must also fill Form-D if you wish to be eligible for future scholarships**.
  `)
        .setThumbnail('https://cdn.discordapp.com/attachments/905477311690858596/906920915663724594/unknown.png')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('https://www.rsi.edu/wp-content/uploads/money-and-scholarship.jpg')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if(message.author.id === '707239651978510437' && message.content.toLowerCase() == 'nice beta'){
        message.channel.send('At your service, my lord.');
      }
      if(message.author.id === '456071956446314526' && message.content.toLowerCase() == 'nice beta'){
        message.channel.send('May we never sleep, till the lord shall wake again.');
      }
      if(message.author.id === '456071956446314526' && message.content.toLowerCase() == 'leave it to me'){
        message.channel.send('Come not between the Nazgûl and his prey! Or he will not slay thee in thy turn. He will bear thee away to the houses of lamentation, beyond all darkness, where thy flesh shall be devoured, and thy shriveled mind be left naked to the Lidless Eye.');
      }
      if(message.content.toLowerCase() == 'nazgul'){
        const exampleEmbed = new MessageEmbed()
        .setColor('#ffcd6c')
        .setTitle('Nazgûl')

        .setDescription(`*Nine he gave to Mortal Men, proud and great, and so ensnared them. Long ago they fell under the dominion of the One, and they became Ringwraiths, shadows under his great Shadow, his most terrible servants. Long ago. It is many a year since the Nine walked abroad. Yet who knows? As the Shadow grows once more, they too may walk again.*

        <@&907623517409923072> ("[The Ringwraiths](https://lotr.fandom.com/wiki/Black_Speech)") or Úlairi, also known as the **Black Riders** or simply **The Nine**, were the dreaded ring-servants of <@&907620967591841912> Sauron in Middle-earth throughout the Second and Third Ages, who in the later years of the Third Age dwelt in Minas Morgul and Dol Guldur.

  `)
        .setThumbnail('https://i.pinimg.com/originals/9b/35/64/9b3564f2df0d1e729f22a85d4fbceafc.jpg')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('https://th.bing.com/th/id/R.d4bc5d1591677e5cc99b5f35cf7aaf79?rik=lyL%2f8IwQhE3Iig&riu=http%3a%2f%2fgetwallpapers.com%2fwallpaper%2ffull%2f8%2f8%2f2%2f777933-free-nazgul-wallpaper-1920x1080-1080p.jpg&ehk=ulc0B9sl1Hs0CbWGqoq42XvccX4t88TOr8b%2bvrk6kAw%3d&risl=&pid=ImgRaw&r=0')
        // .setTimestamp()
        .addField('The Scriptures','<@&904398638619435109> leads thee to this ancient text on [The Nazgûl](https://lotr.fandom.com/wiki/Nazgûl).', true);
        message.channel.send({ embeds: [exampleEmbed] });
      }
      if(message.mentions.has(client.user.id)){
        if(message.member.roles.cache.has('903702790361210922')){
          message.channel.send(`The Eye never sleeps, the eye never weeps.
          Few can escape my terrible gaze.`);

        } else {
          message.reply('Hey there, young hobbit.\n If you’re facing some trouble, let us know on the <#904377376870379581> channel and we’ll get in touch with you to help resolve it.');
        }
        
      }
      
      if(message.author.id === '707239651978510437' && message.content.toLowerCase() == 'beta masti nhi'){
        message.channel.send('Mea Culpa, my lord.');
      }
      if(message.author.id === '707239651978510437' && message.content.toLowerCase() == 'hey' || message.content.toLowerCase() == 'hi'){
        message.channel.send('Trying to escape my gaze? Fear the fiery depths of Mount Doom and mend your ways, young hobbit.');
      }
      if(message.author.id === '761189697132298251' && (message.content.toLowerCase() == 'hey' || message.content.toLowerCase() == 'hi')){
        message.channel.send('Trying to escape my gaze? Fear the fiery depths of Mount Doom and mend your ways, young hobbit.');
      }
      if(message.content.toLowerCase() == 'describe the dark lord'){
        // message.channel.send('');
        const exampleEmbed = new MessageEmbed()
        .setColor('#f05f04')
        .setTitle('Sauron')

        .setDescription(`**Sauron**, <@&907620967591841912>, the eponymous **Lord of the Rings**, originally called **Mairon**, was a fallen Maia, creator of the One Ring, a gifted student of Vala Aulë the Smith and lieutenant of Melkor (Morgoth). After his master's defeat by the Valar, **Sauron** became the second Dark Lord and sought to conquer Middle-earth by creating the [Rings of Power](https://lotr.fandom.com/wiki/Rings_of_Power).

  `)
        .setThumbnail('https://i.pinimg.com/originals/9b/35/64/9b3564f2df0d1e729f22a85d4fbceafc.jpg')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/434799de-8462-404b-b81e-ee861a219363/d4j994p-8c891742-2b5e-4510-966c-063c9adf6c16.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwic3ViIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsImF1ZCI6WyJ1cm46c2VydmljZTpmaWxlLmRvd25sb2FkIl0sIm9iaiI6W1t7InBhdGgiOiIvZi80MzQ3OTlkZS04NDYyLTQwNGItYjgxZS1lZTg2MWEyMTkzNjMvZDRqOTk0cC04Yzg5MTc0Mi0yYjVlLTQ1MTAtOTY2Yy0wNjNjOWFkZjZjMTYuanBnIn1dXX0.yJ2nV4NhRCMzsnDvGl7p4L7h79ZC42nOZzZdlysbE5c')
        // .setTimestamp()
        .addField('The Scriptures','<@&904398638619435109> leads thee to this ancient text on [the dark lord](https://lotr.fandom.com/wiki/Sauron).', true);
        message.channel.send({ embeds: [exampleEmbed] });
        // message.delete();
      }
      if(message.author.id === '456071956446314526'&& message.content.toLowerCase() == 'beta masti nhi'){
        message.channel.send('My apologies, O Black Rider.');
      }
      if((message.author.id === '764496809136881667' || message.author.id==='767779319807344701' || message.author.id==='656150846458822670' || message.author.id==='771027155983400961' || message.author.id==='761189697132298251') && message.content.toLowerCase() == 'beta masti nhi'){
        message.channel.send('A creature of intoxicating beauty and undeniable wit approaches.');
      }
      if((message.author.id === '760170629261164544' || message.author.id==='760481544790867999') && message.content.toLowerCase() == 'beta masti nhi'){
        message.channel.send('It is he, he who can defeat the forces of darkness but with a smile. He who holds the true power of the Middle Earth');
      }
      if(message.author.id === '456071956446314526'&& message.content.toLowerCase() == 'i live to serve you my lord'){
        message.channel.send('Your trust in me will be rewarded, my faithful Nazgul.');
      }
      if(message.content.toLowerCase() === "nice bot"){
        message.reply('Blessings, young hobbit. The eye only serves <@&907620967591841912>.');
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'change nickname'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('Nickname == Your Name')

        .setDescription(`Please change your Nickname for this server to your Official Name. When addressing your queries, we’d very much like to refer to you by your name rather than Noobmaster69.

  `)
        .setThumbnail('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('https://home.iitd.ac.in/images/slider/slide1.jpg')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'verification'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        
        .setColor('#49759C')
        .setTitle('Verification Process')

        .setDescription(`For verification, you just need to type 'verify me' in the <#904319559874514974> channel. <@903920811080044584> will DM you and ask for your provisional seat allotment letter. You just need to send it and we will verify you in no time. 
        During the verification process please ensure that you can receive messages from server members as the bot needs to ask you for your details through Direct-Messaging (DM).

        Also, please change your server nickname to your name before verification.


  `)
        .setThumbnail('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('https://th.bing.com/th/id/R.3d4bc5c9ae001ad2b26e1ff347493644?rik=7HT55LTrtc9J3Q&riu=http%3a%2f%2fdigitallearning.eletsonline.com%2fwp-content%2fuploads%2f2017%2f03%2fIIT-Delhi.jpg&ehk=oHRYl9tVjuCwVgsaHUfr34u3Fk8WHqcpVxbxTRV4irY%3d&risl=&pid=ImgRaw&r=0')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'hola'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setURL('https://bsw.iitd.ac.in')
        .setColor('#49759C')
        .setTitle('Hello Freshers')

        .setDescription(`Feel free to raise your queries. We are here to answer them for you.

  `)
        .setThumbnail('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('http://bsw2020.herokuapp.com/images/carousel2.jpg')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'last'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        // .setURL('https://bsw.iitd.ac.in')
        .setColor('#49759C')
        .setTitle('Fee Payment Deadline')

        .setDescription(`Last date for fee payment is 30th of November.`)
        .setThumbnail('https://cdn.discordapp.com/attachments/905477311690858596/906920915663724594/unknown.png')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        // .setImage('http://bsw2020.herokuapp.com/images/carousel2.jpg')
        // .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'access'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        // .setURL('https://bsw.iitd.ac.in')
        .setColor('#49759C')
        .setTitle('Verification Status')

        .setDescription(`If you have access to other channels (that you could not see before) then that means that you have been verified and have been given the <@&904318627170361344> role. Your name should now appear in pink color to confirm your verification.

  `)
        .setThumbnail('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')

        // .addField('Cooldown', 'There is a cooldown on all text channels so its easier for us to hear to what everyone has to say.', true)
        .setImage('https://bsw.iitd.ac.in/freshers/images/main%20building.jpg')
        .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'whatsapp'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setColor('#49759C')
        .setTitle('No Official WhatsApp Group')

        .setDescription(`Many of you have been asking for the link of Freshers' WhatsApp group. We would like to clarify some things.

        Right now, **there is no official whatsapp group** so to speak. The people present in such groups aren't verified by any authority so we can't take any responsibility for the actions of the group members. Miscreants not even belonging to our institute can harrass any of you through irrelevant and toxic messages, stickers, images, etc. Such groups are vulnerable to raids and you should avoid joining such groups as raiders/spammers can get access to your personal details such as name and mobile number and can use them to spam messages or unwanted calls.

        We recommend you guys to be patient till the final rounds of counselling for the official groups to form. So, avoid asking for whatsapp group links for the time being and most importantly, avoid sharing your personal details such as mobile numbers, or any documents (relating to your admission) with anyone who does not belong to any authority. 

        People in this server are verified before granting access to these channels. This server and the [facebook group](https://www.facebook.com/groups/620994382247080) are the only official groups for now.

        

  `)
        .setThumbnail('https://cdn.discordapp.com/attachments/905477311690858596/906920915663724594/unknown.png')

        // .addField('People in this server are verified before granting access to these channels. This server and the facebook group (link: https://www.facebook.com/groups/620994382247080) are the only official groups for now.', true)
        .setImage('https://wallpapercave.com/wp/wp7819542.jpg')
        .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send({ embeds: [exampleEmbed] });
        message.delete();
      }
      if(message.member.roles.cache.has('903702790361210922') && message.content.split(' ')[0].toLowerCase() == 'verified'){
        let member = message.mentions.members.first();
        if(member.roles.cache.has('904318627170361344')){
          client.channels.cache.get('904372957256765481').send('<@'+message.author.id+'> The user '+message.content.split(' ')[1] + ' is already verified.');
          if(message.channelId != '904372957256765481'){
            message.delete();
          }

        } else {
          client.channels.cache.get(`904319559874514974`).send(message.content.split(' ')[1]+' has been verified.');
          
          let role = message.guild.roles.cache.find(r => r.id === "904318627170361344");

          // The member you want to add the role to
          

          // Add role to the member
          member.roles.add(role);
          message.delete();

        }    
      }
      if(message.member.roles != null && message.member.roles.cache.has('903702790361210922') && message.content.split('??')[0].toLowerCase() == 'vvv'){   
        client.channels.cache.get(`904319559874514974`).send(message.content.split('??')[1]);
        message.delete();
      }
      if(message.member.roles != null && message.member.roles.cache.has('903702790361210922') && message.content.split('??')[0].toLowerCase() == 'queries'){   
        client.channels.cache.get(`904320572698279987`).send(message.content.split('??')[1]);
        message.delete();
      }
      if(message.member.roles != null && message.member.roles.cache.has('903702790361210922') && message.content.toLowerCase() == 'try'){
        client.channels.cache.get(`904319559874514974`).send("Try `verify me`");
        // client.channels.cache.get(`903702790801596493`).send("Try `verify me`");
        message.delete();
      }
        if(message.member.roles != null && message.member.roles.cache.has('903702790361210922') && message.content.toLowerCase() == 'queries'){   
        client.channels.cache.get(`904320572698279987`).send(`Hold your horses, young hobbits.
Restrict the channel only to your queries.`);
        message.delete();
      }
      if(message.member.roles != null && message.member.roles.cache.has('903702790361210922') && message.content.split('??')[0].toLowerCase() == 'help'){   
        client.channels.cache.get(`904377376870379581`).send(message.content.split('??')[1]);
        message.delete();
      }
      if(message.member.roles != null && message.member.roles.cache.has('903702790361210922') && message.content.split('??')[0].toLowerCase() == 'test'){   
        console.log(message.content.split('??')[1]);
        message.delete();
      }
      if(message.member.roles != null && message.member.roles.cache.has('903702790361210922') && message.content.split(' ')[0].toLowerCase() == 'noname'){
        client.channels.cache.get(`904319559874514974`).send(message.content.split(' ')[1]+' It does not mention your name. You have been verified for now.');
        
        let role = message.guild.roles.cache.find(r => r.id === "904318627170361344");

        // The member you want to add the role to
        let member = message.mentions.members.first();

        // Add role to the member
        member.roles.add(role);
        message.delete();
      }
      if(message.member.roles != null && message.member.roles.cache.has('903702790361210922') && message.content.split(' ')[0].toLowerCase() == 'nickname'){
        client.channels.cache.get(`904319559874514974`).send(message.content.split(' ')[1]+' Change your server nickname to your name. You have been verified');
        let role = message.guild.roles.cache.find(r => r.id === "904318627170361344");
        // The member you want to add the role to
        let member = message.mentions.members.first();
        // Add role to the member
        member.roles.add(role);
        message.delete();
      }
      
      if(message.member.roles.cache.has('903702790361210922') && message.content.split(' ')[0].toLowerCase() == 'warn'){
        
        message.channel.send(message.content.split(' ')[1]+' has been warned.');
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'avatar'){
        // message.channel.send('Okay Papa');
        const exampleEmbed = new MessageEmbed()
        .setDescription(`Fetching Avatar`)
        .setThumbnail('https://cdn.discordapp.com/attachments/903702790801596487/904395920177762324/9e48888b-14c7-4a55-b806-c080799eb458.jpg')
        .setImage(message.author.displayAvatarURL({format : 'png'}))
        .setTimestamp()
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send(message.author.displayAvatarURL());
        message.delete();
      }
      if((message.author.id === '707239651978510437' || message.author.id === '456071956446314526') && message.content.toLowerCase() == 'help'){
        // .setFooter('Manas Uncle give me a footer', 'https://i.imgur.com/AfFp7pu.png');
        message.channel.send('Hey there, if you’re facing some trouble, let us know the issue on the <#904377376870379581> channel and we’ll get in touch with you to help resolve it.');
        // message.reply(message.author.displayAvatarURL({format : 'png'}));
        message.delete();
      }
    }
  } catch(e){
            console.log(e);
    }
  });

