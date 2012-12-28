
module.exports = function(grunt) {

  grunt.initConfig({
    mincss: {
      compress: {
        files: {
          "./public/css/all.css": ["../assets/css/style.css"]
        }
      }
    },

    uglify: {
      options: {
        preserveComments: false
      },
      my_target: {
        files: {
          './public/js/all.js': ['../assets/js/bootstrap.min.js', '../assets/js/jquery.lazyload.min.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['mincss', 'uglify']);

};