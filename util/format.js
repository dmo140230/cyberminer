'use strict'

exports.formatDbResults = function(resultList, input, op, callback){
    var finalResults = [];
    var pagesVisited = {};
    var counter = 0;
    if(resultList.length > 0){
        resultList.forEach(function(element) {
            var url = element.url
            counter = counter + 1;
            if(!pagesVisited[url]){
                pagesVisited[url] = true;
                if(op == 'AND' || op =='OR'){
                    var pieces = input.split(' ');
                    var finalDescriptor = getCorrectString(element, pieces[0]);
                }
                else{
                    var finalDescriptor = getCorrectString(element, input);
                }
                if(finalDescriptor){
                    var a_tag = makeHyperlink(url);
                    var f = {url: a_tag, descriptor: finalDescriptor};
                    finalResults = finalResults.concat(f);
                }
                else if(op == 'NOT'){
                    var a_tag = makeHyperlink(url);
                    var f = {url: a_tag, descriptor: "Keyword(s) '" + input + "' not found in this document"};
                    finalResults = finalResults.concat(f);
                }
                
            }
            if (counter == resultList.length) {
                // No tasks left, good to go
                callback(finalResults);
            }
        });
    }
    else{
        console.log("No results");
        callback(finalResults);
    }
    
};

exports.formatAutoResults = function(resultList, input, callback){
    var finalResults = [];
    var pagesVisited = {};
    var counter = 0;
    if(resultList.length > 0){
        resultList.forEach(function(element) {
            var desc = element.descriptor;
            var url = element.url
            var n = desc.match(new RegExp(input + '[a-zA-Z]*', "mg"));
            counter = counter + 1;
            if(n.length > 0){
                finalResults = finalResults.concat(n);
            }
            if (counter == resultList.length) {
                // No tasks left, good to go
                finalResults = unique(finalResults);
                callback(finalResults);
            }
        });
    }
    else{
        console.log("No results");
        callback(finalResults);
    }
    
};


function getCorrectString(record, input){
    var inputIndex = record.descriptor.indexOf(input);
    if(inputIndex != -1){
        var commaIndex = record.descriptor.indexOf(',', inputIndex);
        var sub = record.descriptor.substr(0, commaIndex); 
        var split = sub.split(',')
        var correct = split[split.length -1]
        return correct;
    }
    else{
        return false;
    }
}

//return a correctly formatted html anchor tag
function makeHyperlink(url){
    return '<a target="_blank" href="'+ url+ '">' + url + '</a>'
}

//return the provided array with only unique elements
function unique(arr) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
}