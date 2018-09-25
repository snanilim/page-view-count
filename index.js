const fs = require('fs');

const outPut = fs.readFileSync('access.log-2018-09-22-1537552801', 'utf8')
.trim()
.split('\n')
.map(line=>line.split('\t'));

console.log(outPut);
