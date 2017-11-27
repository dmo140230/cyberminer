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

exports.insertUrlDesc = function(params){
    var entries = db.getCollection("entries");
    entries.insert(params);
    console.log('done')
}


// example method with any bootstrap logic to run after database initialized
function runProgramLogic() {
    var entryCount = db.getCollection("entries").count();
    console.log("number of entries in database : " + entryCount);
}


