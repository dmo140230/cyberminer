'use strict'
var async = require('async');

exports.ciruclarShift = function(lines, call){
    //console.log(lines);
    var split_lines = lines.split("\n");
    var circ_lines = [];
    async.forEach(split_lines, function (line, each_callback){ 
        try {
            var line = line.replace(/[\n\r]/g, '')
            var shifts = [];
            var words = line.split(' ');
            var first = words[0];
            var current = words.shift();
            do{
                words.push(current);
                shifts.push(words.join(' '))
                var current = words.shift();
            }while(current != first);
            /* console.log("The shifts are: ")
            console.log(shifts); */
            circ_lines = circ_lines.concat(shifts);
            each_callback();
        } catch (error) {
            each_callback(error);
        }
    }, function(err) {
        if(err){
            console.log("An error occured during the circular shift");
            console.log(err);
            call(null);
        }
        else{
            /* console.log("The circular shifted lines are: ")
            console.log(circ_lines);
            console.log(circ_lines.length) */
            call(circ_lines);
        }
    }); 
    
}