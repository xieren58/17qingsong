var RSS = require('rss');

/* lets create an rss feed */
var feed = new RSS({
        title: 'title',
        description: 'description',
        feed_url: 'http://example.com/rss.xml',
        site_url: 'http://example.com',
        image_url: 'http://example.com/icon.png',
        author: 'Dylan Greene'
    });

/* loop over data and add to feed */
feed.item({
    title:  'item title',
    description: 'use this for the content. It can include html.',
    url: 'http://example.com/article4?this&that', // link to the item
    guid: '1123', // optional - defaults to url
    author: 'Guest Author', // optional - defaults to feed author property
    date: 'May 27, 2012' // any format that js Date can parse.
});

// cache the xml
var xml = feed.xml();
console.log(xml);