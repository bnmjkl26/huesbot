var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var request = require('sync-request');

var definition=21;
var textChunk;

function getDefinition (word) {
        var api_url = 'http://opendict.korean.go.kr/api/search?key=EBB6815467FEB26F04D5AE64788C96B7&q=' + encodeURI(word);
        var a = 123;
//======async로 바꾸기 (이벤트리스너 사용해서 사전검색결과 도착하면 이벤트 쏘고 봇에서 이벤트받으면 대답하게끔)===============================================
        var res = request('GET', api_url);
        if (res.statusCode == 200) {
            parser.parseString(res.body.toString('utf8'), function (err, result) {
                definition = result.channel.item[0].sense[0].definition;
            });
        } else {
            console.log('error = ' + res.statusCode);
        }
//============================================================================================================================================================
//        console.log(definition);
        return definition;
}


module.exports = getDefinition;