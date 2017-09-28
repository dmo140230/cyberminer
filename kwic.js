//Load Express Framework
var express = require('express');
var Circular = require('./modules/circular')
var Alpha = require('./modules/alpha')
//Load Mustache Template Engine
var mustachex = require('mustachex');

//Call express
var app = express();

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
    var err_msg = '';
    console.log(req.body);
    console.log(req.body.lines);
    //var lines = req.body.lines;
    var circular = new Circular(req.body.lines);
    circular.ciruclarShift(function(){
        var c = circular.getShiftedLines();
        if(c.length > 0){
            var alpha = new Alpha(c).getAlphaLines();
            //alpha.alphabetize(c, function(alpha){
                if(alpha.length > 0){
                    var circular_lines = c.join('\n')
                    var alpha_lines = alpha.join('\n')
                    console.log(circular_lines);
                    console.log(alpha_lines)
                    console.log("FINISHED");
                    res.json(
                        {
                            input: req.body.lines,
                            circular: circular_lines,
                            alpha: alpha_lines,
                            error: err_msg
                        }
                    );
                }
                else{
                    err_msg = 'An error occured during the alphabetization'
                    res.json(
                    {
                        circular: '',
                        alpha: '',
                        error: err_msg
                    })
                }
            //});
        }
        else{
            err_msg = 'An error occured during the circular shift'
            res.json(
            {
                circular: '',
                alpha: '',
                error: err_msg
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

