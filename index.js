
const fs = require('fs');
const source = '$remote_addr - $remote_user [$time_local] "$request  $status $body_bytes_sent $request_time $d "$http_referer" "$http_user_agent" "$http_x_forwarded_for" "$upstream_response_time" $x "$http_msisdn" "$upstream_http_X_Upstream" "$upstream_http_Session_Id"\n';
const parser = require('nginx-log-parser')(source);

var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('access.log-2018-09-22-1537552801');
var data = [];


lr.on('error', function (err) {
	// 'err' contains error object
});

lr.on('line', function (line) {
    // 'line' contains the current line without the trailing newline character.
    let temp= parser(line);
    


    data.push(temp);
});

lr.on('end', function () {
    // All lines are read, file is closed now.
    console.log(data);


});

// const outPut = fs.readFileSync('access.log-2018-09-22-1537552801', 'utf8')






