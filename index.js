
const fs = require('fs');
const source = '$remote_addr - $remote_user [$time_local] "$request  $status $body_bytes_sent $request_time $d "$http_referer" "$http_user_agent" "$http_x_forwarded_for" "$upstream_response_time" $x "$http_msisdn" "$upstream_http_X_Upstream" "$upstream_http_Session_Id"\n';
const parser = require('nginx-log-parser')(source);
const _= require('underscore');
const Json2csvParser = require('json2csv').Parser;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('access.log-2018-09-22-1537552801');
var data = [];


lr.on('error', function (err) {
	// 'err' contains error object
});

lr.on('line', function (line) {
    // 'line' contains the current line without the trailing newline character.
    let temp= parser(line);
    let uri=temp.request.split(" ");
    
    
    if(  uri[1] != "/generate_log" ){
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
        
        
        if( temp.upstream_http_X_Upstream==='"-"'){
            data[process.name].count=data[process.name].count+1
            
        }
        else{
            
            data[process.name].session.push(temp.upstream_http_X_Upstream);
            
        }
   
        // console.log(temp.upstream_http_Session_Id)
        
        // console.log(process)    
    }
    
    
});

lr.on('end', function () {
    
    let csvWriterArr=[];
    for(let i in data){
       data[i].session = _.uniq(data[i].session);
       data[i].count = data[i].session.length

       csvWriterArr.push(
           {url:i, count:data[i].count}
       )
    }
    const fields = ['url', 'count'];

    const csvWriter = createCsvWriter({
        path: 'file.csv',
        header: [
            {id: 'url', title: 'URL'},
            {id: 'count', title: 'COUNT'}
        ]
    });
    csvWriter.writeRecords(csvWriterArr)       // returns a promise
    .then(() => {
        console.log('...Done');
    });
    
});

// const outPut = fs.readFileSync('access.log-2018-09-22-1537552801', 'utf8')






