//Load Express Framework and necessary modules
var express = require('express');
//Load the Mustache Template Engine
var mustachex = require('mustachex');
//Create an express app
var app = express();
//use a json body parser
var bodyParser = require('body-parser');
//include the crawler api
var crawler = require('./routes/crawler')
//include the result formatter
var format = require('./util/format')
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

app.post('/crawl', function(req, res) {
    console.log(req.body);
    crawler.crawl();
    res.json(
        {
            data: 'Hello World',
            input: req.body.lines
        }
    );
});

app.post('/search', function(req, res){
    var input = req.body.search.value;
    if( input ) {
        var result = db.find(input);
    }
    else{
        var result = [];
    }
    var formattedResults = format.formatDbResults(result, input, function(final){
        res.json(
            {
                draw: req.body.draw,
                recordsTotal: final.length,
                recordsFiltered: final.length,
                data: final
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


