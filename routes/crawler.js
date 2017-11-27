var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var async = require('async');
var kwic = require('../kwic/kwic');

var START_URL = "http://www.arstechnica.com";
var SEARCH_WORD = "Aston Martin";
var MAX_PAGES_TO_VISIT = 1;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;
var db = require('../util/db')

pagesToVisit.push(START_URL);
//crawl();

var crawl = function() {
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        db.find('r');        
        return;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
    } else {
        // New page we haven't visited
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        if (response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        //remove footers
        $('footer').remove();
        //remove inline javascript
        $('script').remove();
        //remove inline css
        $('style').remove();
        var isWordFound = searchForWord($, SEARCH_WORD, url);
        if (isWordFound) {
            console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
        } else {
            collectInternalLinks($, function () {
                // In this short program, our callback is just calling crawl()
                callback();
            });

        }
    });
}

function searchForWord($, word, url) {
    var bodyText = $('html > body').text();
    kwic.kwicIndex(bodyText, function(result){
        try {
            console.log(result.alpha);
            db.insertUrlDesc({url:url, descriptor: result.alpha});
        } catch (error) {
            console.log(error);
        }
    })
}

function collectInternalLinks($, callback) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    var counter = 0;
    relativeLinks.each(function () {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
        counter = counter + 1;
        if (counter == relativeLinks.length) {
            // No tasks left, good to go
            callback();
        }
    });
}

exports.crawl = crawl;
