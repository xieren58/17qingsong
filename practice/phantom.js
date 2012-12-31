var page = require('webpage').create();

var url = 'http://www.17qingsong.com/news/8JTND98F00964JJM';

page.viewportSize = {width: 1170, height: 7824};

page.open(url, function (status) {
    // var height = page.evaluate(function() { return document.body.clientHeight; });
    // var width = page.evaluate(function() { return document.body.clientWidth; });
    // console.log(height);
    // page.viewportSize = {width: 1170, height: height};
    page.render('17.jpg');
    // page.render('17.pdf');
    phantom.exit();
});