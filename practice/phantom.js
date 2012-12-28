var page = require('webpage').create();

var url = 'http://www.17qingsong.com/news/8JP4335P00964JJM';

page.viewportSize = { width: 1170, height: 6608 };

page.open(url, function (status) {
    page.render('17.png');
    // page.render('17.pdf');
    phantom.exit();
});