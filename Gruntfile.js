'use strict';

var paths = {
    js: ['*.js', 'server/**/*.js', 'public/**/*.js', 'test/**/*.js', '!test/coverage/**', '!public/system/lib/**', 'packages/**/*.js', '!packages/**/node_modules/**'],
    html: ['public/**/views/**', 'server/views/**', 'packages/**/public/**/views/**', 'packages/**/server/views/**'],
    css: ['public/**/css/*.css', '!public/system/lib/**', 'packages/**/public/**/css/*.css']
};

module.exports = function(grunt) {

    if (process.env.NODE_ENV !== 'production') {
        require('time-grunt')(grunt);
    }

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('server/config/assets.json'),
        clean: ['public/build'],
        watch: {
            js: {
                files: paths.js,
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: paths.html,
                options: {
                    livereload: true
                }
            },
            css: {
                files: paths.css,
                tasks: ['csslint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: paths.js,
                options: {
                    jshintrc: true
                }
            }
        },
        uglify: {
            core: {
                options: {
                    mangle: false
                },
                files: '<%= assets.core.js %>'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            src: paths.css
        },
        cssmin: {
            core: {
                files: '<%= assets.core.css %>'
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['public/**', 'node_modules/**'],
                    ext: 'js,html',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'server.js'
            },
            src: ['test/mocha/**/*.js', 'packages/**/test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        },
        jasmine_node: {
            options: {
              forceExit: true,
              match: '.',
              matchall: false,
              extensions: 'js',
              specNameMatcher: 'spec',
              jUnit: {
                report: true,
                savePath : './test/reports/jasmine/',
                useDotNotation: true,
                consolidate: true
              }
            },
            all: ['spec/']
        },
	shell: {
            mongodb: {
                command: 'mongod --dbpath ./data/db',
                options: {
                    async: true,
                    stdout: false,
                    stderr: true,
                    failOnError: true,
                    execOptions: {
                        cwd: '.'
                    }
                }
            }
        }
    });

    //Load NPM tasks
    require('load-grunt-tasks')(grunt);

    //Default task(s).
    if (process.env.NODE_ENV === 'production') {
        grunt.registerTask('default', ['clean','cssmin', 'uglify', 'concurrent']);
    } else {
        grunt.loadNpmTasks('grunt-jasmine-node');
        grunt.loadNpmTasks('grunt-shell-spawn');
        grunt.registerTask('default', ['shell:mongodb', 'clean', 'jshint', 'csslint', 'concurrent', 'jasmine_node']);
    }

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

};
