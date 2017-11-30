//Load Express Framework and necessary modules
var express = require('express');
//Load the Mustache Template Engine
var mustachex = require('mustachex');
//Create an express app
var app = express();
//use a json body parser
var bodyParser = require('body-parser');
//include the crawler api
var crawler = require('./util/crawler')
//include the result formatter
var format = require('./util/format')
//include the autocorrect module
var spellcheck = require('./util/spellcheck')
//initialize the database
var db = require('./util/db')
//initialize the database, and then start the server once it's done
db.initialize(startServer)

exports.entries = function(){
    return db.getCollection("entries");
}
//Set Global App Settings
app.engine('html', mustachex.express);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/crawler', function(req, res) {
    res.render('crawler');
});

app.post('/crawl', function(req, res) {
    console.log(req.body);
    data = {};

    data.crawl_word = req.body.crawl_word;
    data.crawl_url = req.body.crawl_url;
    data.crawl_limit = req.body.crawl_limit;
    if(!data.crawl_word || !data.crawl_url){
        res.json({word: 'Please fill out all the required fields'});
    }
    else{
        crawler.start(data, function(result){
            res.json(result);
        });
    }
});

app.post('/correct', function(req, res) {
    console.log(req.body);
    var word = req.body.word;
    if(word){
        var fixed = spellcheck.getCorrection(word);
        var returnString;
        if (fixed === word) {
            fixed = "";
        } else if (typeof fixed === "undefined") {
            fixed = "";
        }
        res.send(fixed);
    }
    else{
        res.send('');
    }
});

app.post('/search', function(req, res){
    var start = req.body.start;
    var end = start + req.body.length;

    var f = req.body.search.value.split('<-!@!->')
    var input = f[0];
    var operator = f[1];
    if( input ) {
        if(operator){
            if(operator === 'OR'){
                var result = db.orFind(input);     
            }
            else if(operator === 'AND'){
                var result = db.andFind(input);                    
            }
            else if(operator === 'NOT'){
                var result = db.notFind(input);                    
            }
        }
        else{
            var result = db.find(input);            
        }
    }
    else{
        var result = [];
    }
    var formattedResults = format.formatDbResults(result, input, operator, function(final){
        res.json(
            {
                draw: req.body.draw,
                recordsTotal: final.length,
                recordsFiltered: final.length,
                data: final.slice(start, end)
            }
        );
    });
})

app.post('/auto', function(req, res){
    var input = req.body.q;
    if( input ) {
        var results = db.find(input);
    }
    else{
        var results = [];
    }
    var formattedResults = format.formatAutoResults(results, input, function(final){
        res.send(final);
    });
})

function startServer(){
    //Create Server
    var port = Number(process.env.PORT || 80 || 55001);
    app.listen(port, function() {
        console.log("Listening on " + port);
    });
}


