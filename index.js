
const fs = require('fs');
const source = '$remote_addr - $remote_user [$time_local] "$request  $status $body_bytes_sent $request_time $d "$http_referer" "$http_user_agent" "$http_x_forwarded_for" "$upstream_response_time" $x "$http_msisdn" "$upstream_http_X_Upstream" "$upstream_http_Session_Id"\n';
const parser = require('nginx-log-parser')(source);
const _= require('underscore');
const Json2csvParser = require('json2csv').Parser;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const exec = require('child_process').exec;


var runShellCommand = exec('sh combine_data.sh',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
                process.exit();
            }else{
                console.log('fetch and combined: data lb1 and lb2 to /combined/log_file.txt');
                console.log('remove: all files from /todays_log_file/lb1* && lb2*');
                runLogToCsv();
            }
        });

        

const runLogToCsv = () => {
    console.log('Start Processing: log_file.txt to csv.......');

    var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('combined/log_file.txt');

    var data = [];

    lr.on('error', function (err) {
        // 'err' contains error object
    });

    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        let temp= parser(line);
        let uri=temp.request.split(" ");
        
        
        if( uri[1] != "/generate_log" && uri[1] != "/favicon.ico" ){
            let process={
                name:"",
                count: 0,
                session: []
            };
            process.name=uri[1];

            if(typeof data[process.name] == "undefined" ){
                data[process.name]={
                    count:0,
                    session:[]
                }
            }
            // console.log(temp);
            if( temp.upstream_http_X_Upstream === '"-"'){
                data[process.name].count=data[process.name].count+1
                
            }
            else if( temp.upstream_http_X_Upstream === '"web-2"' || temp.upstream_http_X_Upstream === '"web-1"'){
                data[process.name].session.push(temp.upstream_http_Session_Id);
                
            }
            else{
                data[process.name].session.push(temp.upstream_http_X_Upstream);
            }
    
            // console.log(temp.upstream_http_Session_Id)
            
            // console.log(process)    
        }
        
        
    });

    lr.on('end', function () {
        // console.log(data);
        let csvWriterArr=[];
        for(let i in data){
            data[i].session = _.uniq(data[i].session);
            data[i].count += data[i].session.length

            csvWriterArr.push(
                {url:i, count:data[i].count}
            )
        }
        const fields = ['url', 'count'];


        var date = new Date();
        date.setDate(date.getDate() - 1);
        var lastDate = date.toISOString().slice(0,10);


        const fileName = `DAILY_UNIQUE_VISITOR_LOG_${lastDate}`
        const csvWriter = createCsvWriter({
            path: `all_csv_file/${fileName}.csv`,
            header: [
                {id: 'url', title: 'URL'},
                {id: 'count', title: 'COUNT'}
            ]
        });


        csvWriter.writeRecords(csvWriterArr)       // returns a promise
        .then(() => {
            console.log('Done: completed converting file to csv');
        });
        
    });
}


// const outPut = fs.readFileSync('access.log-2018-09-22-1537552801', 'utf8')






