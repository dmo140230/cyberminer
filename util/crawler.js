var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var async = require('async');
var kwic = require('../kwic/kwic');
var config = require('../config/crawler.settings').crawler;

var START_URL = "http://www.arstechnica.com";
var SEARCH_WORD = "raxacoricofallapatorius";
var MAX_PAGES_TO_VISIT = 10;
var FOUND  = false;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;
var db = require('../util/db')
var returning;

pagesToVisit.push(START_URL);
//crawl();

var crawl = function(callback_one) {
    console.log(numPagesVisited);
    if (numPagesVisited >= MAX_PAGES_TO_VISIT || FOUND) {
        console.log("Reached max limit of number of pages to visit.");
        console.log('Word found? ' + FOUND);
        if(FOUND){
            console.log('Found the keyword: ' + SEARCH_WORD);
        }
        //db.find('r');  
        console.log('----FINISHED CRAWLING----');
        callback_one(FOUND);
    }
    else{
        var nextPage = pagesToVisit.pop();
        if (nextPage in pagesVisited) {
            // We've already visited this page, so repeat the crawl
            crawl(callback_one);
        } else {
            // New page we haven't visited
            visitPage(nextPage, function(){
                console.log('again')
                crawl(callback_one);
            });
        }
    }
}

function visitPage(url, callback) {
    // Add page to our set
    

    // Make the request
    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
        pagesVisited[url] = true;
        numPagesVisited++;
        // Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        //If the url returns a status code that isn't a success
        if (response.statusCode !== 200) {
            //remove this url if it's in the database
            db.removeUrl(url);
            callback();
        }
        // Parse the document body
        var $ = cheerio.load(body);
        //remove head
        $('head').remove();
        //remove the meta tag
        $('meta').remove();
        //remove footers
        $('footer').remove();
        //remove inline javascript
        $('script').remove();
        //remove inline css
        $('style').remove();
        searchForWord($, SEARCH_WORD, url, function(isWordFound){
            if (isWordFound) {
                console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
                FOUND = true;
                callback()
            } else {
                collectInternalLinks($, function () {
                    // In this short program, our callback is just calling crawl()
                    callback();
                });
    
            }
        });
        
    });
}

function searchForWord($, word, url, callback) {
    var bodyText = $('html > body').text();
    console.log()
    console.log(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1 );
    kwic.kwicIndex(bodyText, function(result){
        try {
            //console.log(result.alpha);
            db.insertUrlDesc({url:url, descriptor: result.alpha});
            callback(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1);
        } catch (error) {
            console.log(error);
            callback(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1);
        }
    })
}

function collectInternalLinks($, callback) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    var counter = 0;
    async.forEach(relativeLinks, function (link, each_callback){ 
        pagesToVisit.push(baseUrl + $(link).attr('href'));
        each_callback();
    }, function(err) {
        if(err){
            callback(err);
        }
        else{
            callback();
        }
    }); 
}

var start = function(params, callback) {
    console.log(config);
    SEARCH_WORD  = (data.crawl_word) ? data.crawl_word: config.crawler.search_word;
    START_URL = (data.crawl_url) ? data.crawl_url: config.crawler.start_url;
    MAX_PAGES_TO_VISIT = (data.crawl_limit) ? data.crawl_limit: config.crawler.max_pages;

    console.log(SEARCH_WORD);
    crawl(function(results){
        if(results){
            var t = {
                word: 'Found the keyword: ' + SEARCH_WORD,
                num: 'Visited : ' + numPagesVisited + ' pages',
                pages: pagesVisited,
            }
            callback(t);
        }
        else{
            var t = {
                word: 'Did not find the keyword: ' + SEARCH_WORD,
                num: 'Visited : ' + numPagesVisited + ' pages',
                pages: pagesVisited,
            }
            callback(t);
        }
    });

}
exports.start = start;
