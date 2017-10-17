//Load Express Framework and necessary modules
var express = require('express');
//Load the Mustache Template Engine
var mustachex = require('mustachex');
var Alpha = require('./modules/alpha')
var Circular = require('./modules/circular')

//Create an express app
var app = express();
//use a json body parser
var bodyParser = require('body-parser');

//Set Global App Settings
app.engine('html', mustachex.express);
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.render('kwic', 
        {
            input: 'Please enter the lines you wish to index here.',
            circular: 'Circular shift results will appear here',
            alpha: 'Alphabetization results will appear here.',
            error: ''
        }
    );
  });

app.post('/index', function(req, res) {
    console.log(req.body);
    console.log(req.body.lines);
    var circular = new Circular(req.body.lines);
    circular.ciruclarShift(function(err, result){
        if(err){
            res.json(
            {
                circular: '',
                alpha: '',
                error: err
            });
        }
        else{
            console.log(result.circular_lines);
            console.log(result.alpha_lines)
            console.log("FINISHED");
            res.json(
                {
                    input: req.body.lines,
                    circular: result.circular_lines.join('\n'),
                    alpha: result.alpha_lines.join('\n'),
                    error: ''
                }
            );
        }
    });
});

//Create Server
var port = Number(process.env.PORT || 80 || 55001);
 app.listen(port, function() {
     console.log("Listening on " + port);
});

