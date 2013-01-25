// Source: https://github.com/tuupola/jquery_lazyload

Package.describe({
  summary: "Lazy Load Plugin for jQuery"
});

Package.on_use(function (api) {
  api.use('jquery', 'client');
  api.add_files('jquery.lazyload.min.js', 'client');
});