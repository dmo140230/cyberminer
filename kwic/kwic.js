
var Alpha = require('./modules/alpha')
var Circular = require('./modules/circular')
var fs = require('fs');

exports.kwicIndex = function(lines, callback) {
    //console.log(lines);
    var circular = new Circular(lines);
    circular.ciruclarShift(function(err, result){
        if(err){
            callback(
            {
                circular: undefined,
                alpha: undefined,
                error: err
            });
        }
        else{
            //console.log(result.circular_lines);
            //console.log(result.alpha_lines)
            console.log("FINISHED KWIC");
            //fs.appendFileSync('./message.txt', result.alpha_lines + '\r\n');
            //here is where the database insertion takes place.
            //callback after adding to db
            callback(
                {
                    input: lines,
                    circular: result.circular_lines.join('\n'),
                    alpha: result.alpha_lines.join('\n'),
                    error: undefined
                }
            );
        }
    });
};

