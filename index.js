const fs = require("fs");

// group by baseurl
// fetch files (.jpg)
// fetch texts
// open in browser, make a todo for each file

function readFile(htmlFile){
    return fs.readFileSync(htmlFile, 'utf8');
}

function convertHtmlToJson(htmlStr, filetype){
    // console.log("htmlStr: ", htmlStr);
    var json = {};
    var items = [];
    var array = htmlStr.split("<DT>");
    // console.log(array[3]);
    var csv = "Description; URL; Domain;\n";

    for (var i = 3; i <= array.length; i++){
        var url = '';
        var domain = '';
        var description = '';

        var regexFullUrl = /HREF="(HTTPS?:\/\/)?[A-Za-z0-9\.\/\-\#?&=_!§%\(\){}\[\]]*"/ig;
        var matchesFullUrl = regexFullUrl.exec(array[i]);
        if (matchesFullUrl != null)     
            url = matchesFullUrl[0].replace('HREF=', '').replace('"', '');

        var regexDomain = /href="(https?:\/\/)?[A-Za-z0-9\.-]*/ig;
        var matchesDomain = regexDomain.exec(array[i]);
        if (matchesDomain != null)
            domain = matchesDomain[0].replace('HREF=', '').replace('"', '');

        var regexText = /<DD>.*\s/ig;
        var matchesText = regexText.exec(array[i]);
        if (matchesText != null)
            description = matchesText[0].replace('<DD>', '').replace('<DT>', '').replace(',','').replace(';','').replace('\n','');
        
        var itemObject = {
            url, domain, description
        }

        if ( filetype == 'csv' )
            csv += description + ';' + url + ';' + domain + ';\n';
        else if ( filetype == 'json' )
            items.push(itemObject);
    }

    if ( filetype == 'csv' ) return csv;
    else if ( filetype == 'json' ) return json;
    else return null;
}

function writeToFile(data, path, filetype){
    console.log(path + '.' + filetype);
    fs.writeFile(path + '.' + filetype, data, 'utf8', function (err){
        if ( err ) {
            console.log(err);
        } else {
            console.log('saved');
        }
    });
}

var filetype = 'csv';
var path = './rdconvert';

var html = readFile('Raindrop2.html'); // read html
var data = convertHtmlToJson(html, filetype); // convert html to json
var report = writeToFile(data, path, filetype);