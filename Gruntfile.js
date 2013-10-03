module.exports = function( grunt ) {

	grunt.initConfig({

		browserify: {
			example: {
				files: {
					'example/bundled.js': [ 'example/main.js' ]
				},
				options: {
					debug: true
				}
			}
		},

		watch: {
			example: {
				files: [ 'example/main.js', 'src/**/*.js' ],
				tasks: [ 'browserify:example' ],
				options: { 
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-browserify' );

	grunt.registerTask( 'default', [ 'watch:example' ] );
};