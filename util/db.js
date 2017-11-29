var loki = require('lokijs')
var db;

exports.initialize = function(callback){
    db = new loki('index.db', {
        autoload: true,
        autoloadCallback : databaseInitialize,
        autosave: true, 
        autosaveInterval: 4000
    });
    
    // implement the autoloadback referenced in loki constructor
    function databaseInitialize() {
        entries = db.getCollection("entries");
        if (entries === null) {
            entries = db.addCollection("entries");
        }
        callback();
    }    
}

exports.find = function(query){
    var entries = db.getCollection("entries");
    var result = entries.find({'descriptor': { '$regex': query }});
    return result;
}

exports.orFind = function(query){
    var re = generateOrRegex(query);
    var entries = db.getCollection("entries");
    var result = entries.find({'descriptor': { '$regex': re }});
    return result;
}

exports.andFind = function(query){
    var and = generateAndList(query);
    var entries = db.getCollection("entries");    
    var result = entries.find({'$and': and});
    return result;
}

exports.notFind = function(query){
    //var values = query.split(' ');
    var re = generateOrRegex(query);
    var entries = db.getCollection("entries");    
    var result = entries.where(function(obj) {
        return obj.descriptor.indexOf(query) == -1;
    });
    return result;
}

exports.removeUrl = function(query){
    //remove any matching entries from the result set and the main collection
    //use $eq strict equality because regex wipes out all with the same domain
    console.log('removing: ' + query);
    var entries = db.getCollection("entries");
    var result = entries.chain().find({'url': { '$eq': query }}).remove();
    console.log('removed: ' + query);
    return result;
    
}

exports.insertUrlDesc = function(params){
    var entries = db.getCollection("entries");
    entries.insert(params);
    console.log('done inserting into db')
}

// example method with any bootstrap logic to run after database initialized
function runProgramLogic() {
    var entryCount = db.getCollection("entries").count();
    console.log("number of entries in database : " + entryCount);
}

function generateAndList(query){
    var and = [];
    var pieces = query.split(' ');
    for (var i = 0; i < pieces.length; i++) {
        and.push({'descriptor': { '$regex': pieces[i] }})
    }
    return and;
}

function generateOrRegex(query){
    var pattern = query.replace(' ', '|');
    var re = new RegExp(pattern)
    return re;
}