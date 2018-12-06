
var fs = require('fs');
var source = '$remote_addr - $remote_user [$time_local] "$request  $status $body_bytes_sent $request_time $d "$http_referer" "$http_user_agent" "$http_x_forwarded_for" "$upstream_response_time" "$http_msisdn" "$upstream_http_X_Upstream" "$upstream_http_Session_Id"\n';
var parser = require('nginx-log-parser')(source);
var _= require('underscore');
var Json2csvParser = require('json2csv').Parser;
var createCsvWriter = require('csv-writer').createObjectCsvWriter;
var exec = require('child_process').exec;
var LineByLineReader = require('line-by-line');



console.log('Start Processing: log_file.txt to csv.......');


lr = new LineByLineReader('combined/access.log');

var data = [];

lr.on('error', function (err) {
    // 'err' contains error object
});

lr.on('line', function (line) {
    // 'line' contains the current line without the trailing newline character.
    var temp= parser(line);
    var uri=temp.request.split(" ");
    
    
    
    var newReport = {};
    var nameR = temp.request.replace(/(^")|("$)/g, "");
    var nameS = nameR.split('?');
    var nameF = nameS[1].split(' ');
    newReport.name = nameF[0];

    var timeR = temp.time_local.replace(/(^")|("$)/g, "");
    newReport.time = timeR;

    var msisdnR = temp.http_msisdn.replace(/(^")|("$)/g, "");
    newReport.msisdn = msisdnR;

    var sessionR = temp.upstream_http_Session_Id.replace(/(^")|("$)/g, "");
    newReport.session_id = sessionR;

    data.push(newReport);

    

    // console.log(timeR);
    
    // console.log('line', temp);
    // console.log('line', temp.http_msisdn);
    // console.log('uri', newReport);
    // console.log('uri', data);
    
    
});

lr.on('end', function () {
    // console.log('data', data);

    var date = new Date();
    date.setDate(date.getDate() - 0);
    var lastDate = date.toISOString().slice(0,10);

    var fileName = `DAILY_POPUP_CLICK_LOG_${lastDate}`
    
    var csvWriter = createCsvWriter({
        path: `all_csv_file/${fileName}.csv`,
        header: [
            {id: 'name', title: 'Name'},
            {id: 'msisdn', title: 'Msisdn'},
            {id: 'session_id', title: 'Session ID'},
            {id: 'time', title: 'Time'}
        ]
    });


    csvWriter.writeRecords(data)       // returns a promise
    .then(() => {
        console.log('Done: compvared converting file to csv');
    }).catch((e) => {
        console.log('error', e);
    });
});



// var outPut = fs.readFileSync('access.log-2018-09-22-1537552801', 'utf8')






