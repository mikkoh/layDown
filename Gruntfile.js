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

		nodeunit: {
			all: ['tests/*.js']
		},

		watch: {
			example: {
				files: [ 'example/main.js', 'src/**/*.js' ],
				tasks: [ 'browserify:example', 'nodeunit:all' ],
				options: { 
					livereload: true
				}
			},

			test: {
				files: [ 'src/**/*.js', 'tests/**/*.js' ],
				tasks: [ 'nodeunit:all' ],
				options: { 
					livereload: true
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-browserify' );

	grunt.registerTask( 'test', [ 'watch:test' ] );
	grunt.registerTask( 'default', [ 'watch:example' ] );
	grunt.registerTask( 'buildExample', [ 'browserify:example' ] );
};