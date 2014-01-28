module.exports = function( grunt ) {

	grunt.initConfig({

		browserify: {
			example: {
				files: {
					'example/page/bundled.js': [ 'example/page/main.js' ],
					'example/pong/bundled.js': [ 'example/pong/main.js' ]
				},
				options: {
					debug: true
				}
			},

			standalone: {

				files: {

					'bin/layDown.js': [ 'src/LayDown.js' ]
				},

				options: {

					standalone: 'LayDown'
				}
			}
		},

		nodeunit: {
			all: ['tests/*.js']
		},

		watch: {
			example: {
				files: [ 'example/**/main.js', 'src/**/*.js' ],
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
	grunt.registerTask( 'buildExample', [ 'browserify:example' ] );
	grunt.registerTask( 'build', [ 'browserify:standalone' ] );
	grunt.registerTask( 'default', [ 'watch:example' ] );
};