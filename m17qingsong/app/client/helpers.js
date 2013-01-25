

if (typeof QS === 'undefined') {
  QS = {};
}

QS.renderPage = function (page) {
  $('#main').html('');
  page = page ? page: "home";
  var frag = Meteor.render(function () {
    var i = Template[page] ? Template[page]() : "";
    // console.log(i);
    return i;
  });
  $('#main').html(frag);
};