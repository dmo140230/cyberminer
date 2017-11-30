var crawler = {};

crawler.start_url = 'http://www.arstechnica.com';
crawler.search_word = 'raxacoricofallapatorius';
crawler.max_pages = 50;

exports.crawler = crawler;

exports.customers = {
    'https://www.arstechnica.com': 500,
    'https://global.astonmartin.com/en-us/': 2000,
    'http://global.astonmartin.com/en-us/': 2000,
    'http://www.utdallas.edu/~chung/SA/syllabus.htm': 700
};

//other values are 'descriptor' or 'freq';
exports.sort_method = 'paid';

exports.noise_words  = ["the", "it", "is", "we", "all", "a", "an", "by", "to", "you", "me", "he", "she", "they", "we", "how", "it", "i", "are", "to", "for", "of"];