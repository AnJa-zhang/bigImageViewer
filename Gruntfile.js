module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      bigImageViewer :{
        options: {
          preserveComments: 'some',
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + 
                  '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        },
        files: {
          'dist/bigImageViewer.js': ['src/bigImageViewer.js']
        }
      }
    },
    concat: {
      bigImageViewer: {
        options: {
          process: function(src, filepath) {
            src = src.replace(/(^|\n)\/\/!import '(.+\.js)'/g, function(m, m1, m2) {
                return m1 + grunt.file.read(m2);
              });
            src = src.replace(/(^|\n)\/\/!import '(.+\.tpl)'/g, function(m, m1, m2) {
                var tpl = grunt.file.read(m2);
                tpl = tpl.replace(/\n/g, '\\\r');
                return m1 + "var _TPL_ = '" + tpl + "';";
              });
            return src;
          }
        },
        files: {
          'dist/bigImageViewer.min.js': ['dist/bigImageViewer.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify', 'concat']);

};