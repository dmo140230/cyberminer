'use strict'
var async = require('async');

function Circular(lines) {
    this.split_lines = lines.split("\n");
    this.circ_lines = [];
}

Circular.prototype.ciruclarShift = function(call){
    var result = [];
    var that = this;
    async.forEach(this.split_lines, function (line, each_callback){ 
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
            result = result.concat(shifts);
            each_callback();
        } catch (error) {
            console.log(error);
            each_callback(error);
        }
    }, function(err) {
        if(err){
            console.log("An error occured during the circular shift");
            console.log(err);
            call();
        }
        else{
            that.circ_lines = result;
            call();
        }
    }); 
    
}

Circular.prototype.getShiftedLines = function(){
    return this.circ_lines;
}

module.exports = Circular;