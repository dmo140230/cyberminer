'use strict'
var async = require('async');
var Alpha = require('./alpha')
var noise_words = require('../../config/settings').noise_words;

function Circular(lines) {
    this.split_lines = lines.split(".");
    this.circ_lines = [];
    this.alpha_lines = [];
    
}

function keyword(s) {
    var re = new RegExp('\\b(' + noise_words.join('|') + ')\\b', 'gi');
    return (s || '').replace(re, '').replace(/[ ]{2,}/, ' ');
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
                //filter the noise words and then add the filtered line to the collection of shifted lines
                shifts.push(keyword(words.join(' ')))
                var current = words.shift();
            }while(current != first);
            result = result.concat(shifts + '\r\n');
            each_callback();
        } catch (error) {
            console.log(error);
            each_callback(error);
        }
    }, function(err) {
        if(err){
            console.log("An error occured during the circular shift");
            console.log(err);
            call(err);
        }
        else{
            that.circ_lines = result;
            if(result.length > 0){
                that.alpha_lines = new Alpha(result).getAlphaLines();
                if(that.alpha_lines.length > 0){
                    call(null, {
                        circular_lines: that.circ_lines,
                        alpha_lines : that.alpha_lines
                    });
                }
                else{
                    call("Alphabetization produced no lines");                    
                }
            }
            else{
                call("Circular shift produced no lines");
            }
        }
    }); 
    
}

Circular.prototype.getShiftedLines = function(){
    return this.circ_lines;
}

module.exports = Circular;