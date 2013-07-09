module.exports = function (grunt) {
    grunt.initConfig({
        "pkg": grunt.file.readJSON("package.json"),
        "clean": {
            "apidocs": [
                "apiDocs"
            ],
            "build": [
                "build"
            ]
        },
        "compress": {
            "apidocs": {
                "options": {
                    "archive": "apiDocs.zip",
                    "mode": "zip"
                },
                "files": [
                    {
                        "src": ["apiDocs/**"],
                        "dest": "/"
                    }
                ]
            }
        },
        "concat": {
            "core": {
                "src": [
                    "lib/core/valerie.namespace.js",
                    "lib/core/valerie.utils.js",
                    "lib/core/valerie.formatting.js",
                    "lib/core/valerie.dom.js",
                    "lib/core/valerie.koExtras.js",
                    "lib/core/valerie.converters.js",
                    "lib/core/valerie.validationResult.js",
                    "lib/core/valerie.validationState.js",
                    "lib/core/valerie.modelValidationState.js",
                    "lib/core/valerie.propertyValidationState.js",
                    "lib/core/ko.computed.fn.js",
                    "lib/core/ko.observable.fn.js",
                    "lib/core/valerie.koBindingsHelper.js",
                    "lib/core/ko.bindingHandlers.js"
                ],
                "dest": "build/valerie-core.js"
            },
            "full": {
                "src": [
                    "build/valerie-core.js",
                    "lib/full/valerie.numericHelper.js",
                    "lib/full/valerie.converters.full.js",
                    "lib/full/valerie.rules.js",
                    "lib/full/valerie.propertyValidationState-fluentConverters.js",
                    "lib/full/valerie.propertyValidationState-fluentRules.js"
                ],
                "dest": "build/valerie.js"
            },
            "en": {
                "src": [
                    "build/valerie.js",
                    "lib/localisation/en/core-en.js",
                    "lib/localisation/en/full-en.js"
                ],
                "dest": "build/valerie-en.js"
            },
            "en-gb": {
                "src": [
                    "build/valerie-en.js",
                    "lib/localisation/en-gb/full-en-gb.js",
                    "lib/localisation/en-gb/valerie.converters-en-gb.js",
                    "lib/localisation/en-gb/valerie.propertyValidationState-fluentConverters-en-gb.js"
                ],
                "dest": "build/valerie-en-gb.js"
            },
            "en-us": {
                "src": [
                    "build/valerie-en.js",
                    "lib/localisation/en-us/full-en-us.js"
                ],
                "dest": "build/valerie-en-us.js"
            }
        },
        "jasmine": {
            "build": {
                "src": "build/valerie-en-gb.js",
                "options": {
                    "keepRunner": true,
                    "specs": [
                        "tests/core/*.tests.js",
                        "tests/full/*.tests.js"
                    ],
                    "vendor": [
                        "thirdParty/knockout-2.2.1.js",
                        "thirdParty/jquery-1.9.1.min.js"
                    ]
                }
            }
        },
        "jshint": {
            "options": {
                "eqnull": true
            },
            "files": {
                "src": [
                    "build/*.js"
                ]
            }
        },
        "shell": {
            "apidocs": {
                "command": "jsdoc -c jsdoc.conf.json -t ../docstrap/template",
                "stdout": true,
                "stderr": true
            }
        },
        "uglify": {
            "options": {
                "banner": '/* valerie - MIT license - (c) egrove Ltd (egrove.co.uk) */\n'
            },
            "build": {
                "files": [
                    {
                        "expand": true,
                        "cwd": "build",
                        "src": "*.js",
                        "dest": "build/",
                        "ext": ".min.js"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-shell");

    grunt.registerTask("default", [
        "build"
    ]);

    grunt.registerTask("build", [
        "concatAndHint",
        "uglify"
    ]);

    grunt.registerTask("concatAndHint", [
        "clean:build",
        "concat:core",
        "concat:full",
        "concat:en",
        "concat:en-gb",
        "concat:en-us",
        "jshint"
    ]);

    grunt.registerTask("tests", [
        "build",
        "jasmine"
    ]);

    grunt.registerTask("apidocs", [
        "clean:apidocs",
        "shell:apidocs",
        "compress:apidocs"
    ]);
};
