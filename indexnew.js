const fs = require("fs");

function readRDHtml(file){
    // var html = '';
    return fs.readFileSync(file, 'utf8');
}

var html = readRDHtml('Raindrop.html');
console.log(html);