'use strict';

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer({ name: 'hrassistant-services'});
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());


// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector);

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                //builder.Prompts.text(session, 'Hi ' + message.user.name + '. You have 365 VL Credits. How awesome is that!');
                //message.send('What do you want to do next?');
                bot.beginDialog(message.address, '/');
            }
        });
    }
});


/*bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, 'Hi ' + session.message.user.name + '. You have 365 VL Credits. How awesome is that!');
        //builder.Prompts.text(session, 'You have 365 VL Credits. How great is that!');
        session.send('What do you want to do next?')
    },
    function (session, results) {
        session.endDialog(`Hello ${results.response}!`);
    }
]);*/

bot.dialog('/', function (session) {
    var msg = new builder.Message(session);

    builder.Prompts.text(session, 'Hi ' + session.message.user.name + '. You have 365 VL Credits. How awesome is that!');
    session.send('What do you want to do next?')
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Vacation Leave")
            //.subtitle("100% Soft and Luxurious Cotton")
            .text("File a vacation leave")
            //.images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "File VL", "File VL")
            ]),
        new builder.HeroCard(session)
            .title("Approval")
            //.subtitle("100% Soft and Luxurious Cotton")
            .text("Approve VL requests.")
            //.images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "Approve VL", "Approve VL")
            ])
    ]);
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });
