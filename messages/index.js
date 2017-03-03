"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

//Korean Dictionary
var kordic = require('./koreanDic');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/^국어사전/i, [
    function (session) {
        session.beginDialog('/question');
    },
    function (session, results) {
        session.send(session.userData.question);
    }
]);

intents.onDefault([
    function (session) {
        session.send('국어사전 또는 영어사전을 선택하세요');
    }
]);

bot.dialog('/question', [
    function (session) {
        builder.Prompts.text(session, '찾고싶은 단어를 입력하세요.');
    },
    function (session, results) {
        session.userData.question = kordic(results.response);
        session.endDialog();
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
console.log(useEmulator);