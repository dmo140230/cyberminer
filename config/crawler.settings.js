var crawler = {};

crawler.start_url = 'http://www.arstechnica.com';
crawler.search_word = 'raxacoricofallapatorius';
crawler.max_pages = 50;

exports.crawler = crawler;

var customers = {
    'http://www.arstechnica.com': 500,
    'http://www.msn.com/': 250,
    'http://www.yahoo.com/': 100,
};

exports.customers = customers;