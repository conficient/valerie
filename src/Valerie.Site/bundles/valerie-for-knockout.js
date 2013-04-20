﻿///#source 1 1 ../bundles/valerie-for-knockout.license.js
"valerie for knockout (c) 2013 egrove Ltd. License: MIT (http://www.opensource.org/licenses/mit-license.php)";
///#source 1 1 ../sources/valerie.utils.js
// valerie.utils
// - general purpose utilities
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
var valerie = valerie || {};

(function () {
    "use strict";

    var utils = valerie.utils = valerie.utils || {};

    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };

    utils.formatString = function (format, replacements) {
        if (replacements === undefined || replacements === null) {
            replacements = {};
        }

        return format.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];
            return typeof replacement === "string" ? replacement : match;
        });
    };

    utils.isArray = function (value) {
        return {}.toString.call(value) === "[object Array]";
    };

    utils.isFunction = function (value) {
        if (value === undefined || value === null) {
            return false;
        }

        return (typeof value === "function");
    };

    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

    utils.mergeOptions = function (defaultOptions, options) {
        var mergedOptions = {},
            name;

        if (defaultOptions === undefined || defaultOptions === null) {
            defaultOptions = {};
        }

        if (options === undefined || options === null) {
            options = {};
        }

        for (name in defaultOptions) {
            if (defaultOptions.hasOwnProperty(name)) {
                mergedOptions[name] = defaultOptions[name];
            }
        }

        for (name in options) {
            if (options.hasOwnProperty(name)) {
                mergedOptions[name] = options[name];
            }
        }

        return mergedOptions;
    };

    utils.isMissing = function (value) {
        if (value === undefined || value === null) {
            return true;
        }

        if (value.length === 0) {
            return true;
        }

        return false;
    };
})();

///#source 1 1 ../sources/valerie.knockout.extras.js
// valerie.knockout.extras
// - extra functionality for KnockoutJS
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global ko: false, valerie: true */
if (typeof ko === "undefined") throw "KnockoutJS is required.";
var valerie = valerie || {};

(function () {
    "use strict";

    var knockout = valerie.knockout = valerie.knockout || {},
        extras = knockout.extras = knockout.extras || {};

    // isolatedBindingHandler factory function
    // - creates a binding handler in which update is called only when a dependency changes and not when another
    //   binding changes
    extras.isolatedBindingHandler = function (initOrUpdateFunction, updateFunction) {
        var initFunction = (arguments.length === 1) ? function () {
        } : initOrUpdateFunction;
        updateFunction = (arguments.length === 2) ? updateFunction : initOrUpdateFunction;

        return {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                initFunction(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

                ko.computed({
                    "read": function () {
                        updateFunction(element, valueAccessor, allBindingsAccessor, viewModel,
                            bindingContext);
                    },
                    "disposeWhenNodeIsRemoved": element
                });
            }
        };
    };

    // pausableComputed factory function
    // - creates a computed whose evaluation can be paused and resumed
    extras.pausableComputed = function (evaluatorFunction, evaluatorFunctionTarget, options) {
        var lastValue,
            paused = ko.observable(false),
            computed = ko.computed(function () {
                if (paused()) {
                    return lastValue;
                }

                return evaluatorFunction.call(evaluatorFunctionTarget);
            }, evaluatorFunctionTarget, options);

        computed.pause = function () {
            lastValue = this();
            paused(true);
        }.bind(computed);

        computed.resume = function () {
            paused(false);
        };

        return computed;
    };
})();

///#source 1 1 ../sources/valerie.dom.js
// valerie.dom
// - utilities for working with the document object model
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
var valerie = valerie || {};

(function () {
    "use strict";

    var dom = valerie.dom = valerie.dom || {};

    dom.setElementVisibility = function (element, newVisibility) {
        var currentVisibility = (element.style.display !== "none");
        if (currentVisibility === newVisibility) {
            return;
        }

        element.style.display = (newVisibility) ? "" : "none";
    };
})();

///#source 1 1 ../sources/valerie.converters.js
// valerie.converters
// - general purpose converters
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/*global valerie: true */
var valerie = valerie || {};

(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {};

    converters.integer = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            // ToDo: Change this very noddy, permissive implementation.
            var parsedValue = parseInt(value, 10);

            if (isNaN(parsedValue)) {
                return undefined;
            }

            return parsedValue;
        }
    };

    converters.passThrough = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value.toString();
        },
        "parser": function (value) {
            return value;
        }
    };

    converters.string = {
        "formatter": function (value) {
            if (value === undefined || value === null) {
                return "";
            }

            return value;
        },

        "parser": function (value) {
            if (value === undefined || value === null) {
                return undefined;
            }

            return value;
        }
    };
})();

///#source 1 1 ../sources/valerie.rules.js
// valerie.rules
// - general purpose rules
// - used by other parts of the valerie library
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="valerie.utils.js"/>

/*global valerie: false */
if (typeof valerie === "undefined" || !valerie.utils) throw "valerie.utils is required.";

(function () {
    "use strict";

    var rules = valerie.rules = valerie.rules || {},
        utils = valerie.utils;

    // ToDo: During (Range for dates and times).

    rules.passThrough = {
        "test": function () {
            return rules.successfulTestResult;
        }
    };

    rules.Range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "2 or 3 arguments expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.options = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    rules.Range.defaultOptions = {
        "failureMessageFormatForMinimumOnly": "The value must be no less than {minimum}.",
        "failureMessageFormatForMaximumOnly": "The value must be no greater than {maximum}.",
        "failureMessageFormatForRange": "The value must be between {minimum} and {maximum}.",
        "valueFormatter": valerie.converters.passThrough.formatter
    };

    rules.Range.prototype = {
        "test": function (value) {
            var failureMessage,
                failureMessageFormat = this.options.failureMessageFormatForRange,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum !== undefined && maximum !== null,
                haveMinimum = minimum !== undefined && minimum !== null,
                haveValue = value !== undefined && value !== null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return rules.successfulTestResult;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.options.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.options.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return rules.successfulTestResult;
            }

            failureMessage = utils.formatString(
                failureMessageFormat, {
                    "maximum": this.options.valueFormatter(maximum),
                    "minimum": this.options.valueFormatter(minimum),
                    "value": this.options.valueFormatter(value)
                });

            return {
                "failed": true,
                "failureMessage": failureMessage
            };
        }
    };

    rules.successfulTestResult = {
        "failed": false,
        "failureMessage": ""
    };
})();

///#source 1 1 ../sources/valerie.knockout.js
// valerie.knockout
// - the class and functions that validate a view-model constructed using knockout observables and computeds
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="valerie.knockout.extras.js"/>
/// <reference path="valerie.utils.js"/> 
/// <reference path="valerie.converters.js"/>
/// <reference path="valerie.rules.js"/>

/*global ko: false, valerie: false */
if (typeof ko === "undefined") throw "KnockoutJS is required.";
if (typeof valerie === "undefined" || !valerie.utils) throw "valerie.utils is required.";
if (!valerie.converters) throw "valerie.converters is required.";
if (!valerie.rules) throw "valerie.rules is required.";
if (!valerie.knockout || !valerie.knockout.extras) throw "valerie.knockout.extras is required.";

(function () {
    "use strict";

    var converters = valerie.converters,
        utils = valerie.utils,
        rules = valerie.rules,
        knockout = valerie.knockout;

    (function () {
        // ValidationResult
        // - the result of a validation test
        knockout.ValidationResult = function (failed, failureMessage) {
            this.failed = failed;
            this.failureMessage = failureMessage;
        };

        knockout.ValidationResult.success = new knockout.ValidationResult(false, "");

        // PropertyValidationState
        // - validation state for a single observable or computed property
        (function () {
            var missingResultFunction = function () {
                var value = this.observableOrComputed();

                if (!this.options.required() || !this.options.missingTest(value)) {
                    return knockout.ValidationResult.success;
                }

                return {
                    "failed": true,
                    "failureMessage": this.options.missingFailureMessage
                };
            },
                ruleResultFunction = function () {
                    var value = this.observableOrComputed();

                    return this.options.rule.test(value);
                },
                resultFunction = function () {
                    var result;

                    result = this.boundEntry.result();
                    if (result.failed) {
                        return result;
                    }

                    result = missingResultFunction.apply(this);
                    if (result.failed) {
                        return result;
                    }

                    result = ruleResultFunction.apply(this);
                    if (result.failed) {
                        return result;
                    }

                    return knockout.ValidationResult.success;
                },
                failedFunction = function () {
                    var result = resultFunction.apply(this);

                    return result.failed;
                },
                messageFunction = function () {
                    var result = resultFunction.apply(this);

                    return result.failureMessage;
                },
                passedFunction = function () {
                    var result = resultFunction.apply(this);

                    return !result.failed;
                },
                showState = function () {
                    return this.boundEntry.result().failed ||
                        (this.touched() && failedFunction.apply(this));
                },
                statePropertyName = "__valerie.knockout.PropertyValidationState";

            // Constructor Function
            // - options can be modified using a fluent interface
            knockout.PropertyValidationState = function (observableOrComputed, options) {
                options = utils.mergeOptions(knockout.PropertyValidationState.defaultOptions, options);
                options.applicable = utils.asFunction(options.applicable);
                options.required = utils.asFunction(options.required);

                this.boundEntry = {
                    "focused": ko.observable(false),
                    "result": ko.observable(knockout.ValidationResult.success),
                    "textualInput": false
                };

                this.failed = ko.computed(failedFunction, this, { "deferEvaluation": true });
                this.message = knockout.extras.pausableComputed(messageFunction, this, { "deferEvaluation": true });
                this.observableOrComputed = observableOrComputed;
                this.options = options;
                this.passed = ko.computed(passedFunction, this, { "deferEvaluation": true });
                this.result = ko.computed(resultFunction, this, { "deferEvaluation": true });
                this.showState = knockout.extras.pausableComputed(showState, this, { "deferEvaluation": true });
                this.touched = ko.observable(false);
            };

            // Add methods for modifying state in a fluent manner.
            knockout.PropertyValidationState.prototype = {
                "applicable": function (valueOrFunction) {
                    if (valueOrFunction === undefined) {
                        valueOrFunction = true;
                    }

                    this.options.applicable = utils.asFunction(valueOrFunction);

                    return this;
                },
                "between": function (minimumValueOrFunction, maximumValueOrFunction) {
                    this.options.rule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction);

                    return this;
                },
                "end": function () {
                    return this.observableOrComputed;
                },
                "integer": function () {
                    this.options.converter = converters.integer;

                    return this;
                },
                "required": function (valueOrFunction) {
                    if (valueOrFunction === undefined) {
                        valueOrFunction = true;
                    }

                    this.options.required = utils.asFunction(valueOrFunction);

                    return this;
                }
            };

            // Define default options.
            knockout.PropertyValidationState.defaultOptions = {
                "applicable": utils.asFunction(true),
                "converter": converters.passThrough,
                "invalidEntryFailureMessage": "The value entered is invalid.",
                "missingFailureMessage": "A value is required.",
                "missingTest": utils.isMissing,
                "required": utils.asFunction(false),
                "rule": rules.passThrough,
                "valueFormat": undefined
            };

            // Define functions for getting, setting and testing the existence of the underlying validation state.
            knockout.PropertyValidationState.getState = function (observableOrComputed) {
                return observableOrComputed[statePropertyName];
            };

            knockout.PropertyValidationState.hasState = function (observableOrComputed) {
                return observableOrComputed.hasOwnProperty(statePropertyName);
            };


            knockout.PropertyValidationState.setState = function (observableOrComputed, state) {
                observableOrComputed[statePropertyName] = state;
            };
        })();

        var extensionFunctionName = "validation";

        ko.observable.fn[extensionFunctionName] = ko.computed.fn[extensionFunctionName] = function (validationOptions) {
            var state = knockout.PropertyValidationState.getState(this);

            // Return any existing validation state.
            if (state) {
                return state;
            }

            state = new knockout.PropertyValidationState(this, validationOptions);
            knockout.PropertyValidationState.setState(this, state);

            // Return the validation state after creation, so it can be modified fluently.
            return state;
        };
    })();
})();

///#source 1 1 ../sources/valerie.knockout.bindings.js
// valerie.knockout.bindings
// - knockout bindings for:
//   - validating user entries
//   - showing the validation state of a view-model
// (c) 2013 egrove Ltd.
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

/// <reference path="../frameworks/knockout-2.2.1.debug.js"/>
/// <reference path="~/sources/valerie.knockout.extras.js"/>
/// <reference path="valerie.dom.js"/>
/// <reference path="valerie.knockout.js"/>

/*global ko: false, valerie: false */
if (typeof ko === "undefined") throw "KnockoutJS is required.";
if (typeof valerie === "undefined" || !valerie.dom) throw "valerie.dom is required.";
if (!valerie.knockout) throw "valerie.knockout is required.";
if (!valerie.knockout.extras) throw "valerie.knockout.extras is required.";

(function () {
    "use strict";

    var knockout = valerie.knockout;

    // Define validatedChecked and validatedValue binding handlers.
    (function () {
        var checkedBindingHandler = ko.bindingHandlers.checked,
            validatedCheckedBindingHandler,
            valueBindingHandler = ko.bindingHandlers.value,
            validatedValueBindingHandler,
            blurHandler = function (element, observableOrComputed) {
                var validationState = knockout.PropertyValidationState.getState(observableOrComputed);

                validationState.touched(true);
                validationState.boundEntry.focused(false);
                validationState.message.resume();
                validationState.showState.resume();
            },
            textualInputBlurHandler = function (element, observableOrComputed) {
                var validationState = knockout.PropertyValidationState.getState(observableOrComputed);

                if (validationState.boundEntry.result.peek().failed) {
                    return;
                }

                element.value = validationState.options.converter.formatter(observableOrComputed.peek());
            },
            textualInputFocusHandler = function (element, observableOrComputed) {
                var validationState = knockout.PropertyValidationState.getState(observableOrComputed);

                validationState.boundEntry.focused(true);
                validationState.message.pause();
                validationState.showState.pause();
            },
            textualInputKeyUpHandler = function (element, observableOrComputed) {
                var enteredValue = ko.utils.stringTrim(element.value),
                    parsedValue,
                    validationState = knockout.PropertyValidationState.getState(observableOrComputed),
                    options = validationState.options;

                if (enteredValue.length === 0 && options.required()) {
                    observableOrComputed(undefined);

                    validationState.boundEntry.result(new knockout.ValidationResult(true,
                        options.missingFailureMessage));

                    return;
                }

                parsedValue = options.converter.parser(enteredValue);
                observableOrComputed(parsedValue);

                if (parsedValue === valerie.invalid) {
                    validationState.boundEntry.result(new knockout.ValidationResult(true,
                        options.invalidEntryFailureMessage));

                    return;
                }

                validationState.boundEntry.result(knockout.ValidationResult.success);
            },
            textualInputUpdateFunction = function (observableOrComputed, validationState, element) {
                // Get the value so this function becomes dependent on the observable or computed.
                var value = observableOrComputed();

                // Prevent a focused element from being updated by the model.
                if (validationState.boundEntry.focused.peek()) {
                    return;
                }

                validationState.boundEntry.result(knockout.ValidationResult.success);

                element.value = validationState.options.converter.formatter(value, validationState.options.valueFormat);
            };

        // validatedChecked binding handler
        // - functions in the same way as the "checked" binding handler
        // - registers a blur event handler so validation messages for missing selections can be displayed
        validatedCheckedBindingHandler = ko.bindingHandlers.validatedChecked = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor();

                checkedBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);

                if (knockout.PropertyValidationState.hasState(observableOrComputed)) {
                    ko.utils.registerEventHandler(element, "blur", function () {
                        blurHandler(element, observableOrComputed);
                    });
                }
            },
            "update": checkedBindingHandler.update
        };

        // validatedValue binding handler
        // - with the exception of textual inputs, functions in the same way as the "value" binding handler
        // - registers a blur event handler so validation messages for completed entries or selections can be displayed
        // - registers a blur event handler to reformat parsed textual entries
        validatedValueBindingHandler = ko.bindingHandlers.validatedValue = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    tagName = ko.utils.tagNameLower(element),
                    textualInput,
                    validationState = knockout.PropertyValidationState.getState(observableOrComputed);

                if (!validationState) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                ko.utils.registerEventHandler(element, "blur", function () {
                    blurHandler(element, observableOrComputed);
                });

                textualInput = (tagName === "input" && element.type.toLowerCase() === "text") || tagName === "textarea";

                if (!textualInput) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                validationState.boundEntry.textualInput = true;

                ko.utils.registerEventHandler(element, "blur", function () {
                    textualInputBlurHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "focus", function () {
                    textualInputFocusHandler(element, observableOrComputed);
                });

                ko.utils.registerEventHandler(element, "keyup", function () {
                    textualInputKeyUpHandler(element, observableOrComputed);
                });

                // Rather than update the textual input in the "update" method we use a compued to ensure the textual
                // input's value is changed only when the observable or computed is changed, not when another binding is
                // changed.
                ko.computed({
                    "read": function () {
                        textualInputUpdateFunction(observableOrComputed, validationState, element);
                    },
                    "disposeWhenNodeIsRemoved": element
                });
            },
            "update": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = knockout.PropertyValidationState.getState(observableOrComputed);

                if (validationState && validationState.boundEntry.textualInput) {
                    return;
                }

                valueBindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);
            }
        };

        // Record the original binding handlers
        knockout.originalBindingHandlers = {
            "checked": checkedBindingHandler,
            "value": valueBindingHandler
        };

        // Explicitly make available the validating binding handlers.
        knockout.validatingBindingHandlers = {
            "checked": validatedCheckedBindingHandler,
            "value": validatedValueBindingHandler
        };

        ko.bindingHandlers.validatedChecked = validatedCheckedBindingHandler;
        ko.bindingHandlers.validatedValue = validatedValueBindingHandler;

        // Replaces the original "checked" and "value" binding handlers with validating equivalents.
        knockout.useValidatingBindingHandlers = function () {
            ko.bindingHandlers.checked = validatedCheckedBindingHandler;
            ko.bindingHandlers.value = validatedValueBindingHandler;
            ko.bindingHandlers.koChecked = checkedBindingHandler;
            ko.bindingHandlers.koValue = valueBindingHandler;
        };

        // Restores the original "checked" and "value" binding handlers.
        knockout.useOriginalBindingHandlers = function () {
            ko.bindingHandlers.checked = checkedBindingHandler;
            ko.bindingHandlers.value = valueBindingHandler;
        };
    })();

    // applicability binding handlers
    ko.bindingHandlers.enabledWhenApplicable = knockout.extras.isolatedBindingHandler(
        function (element, valueAccessor, allBindingsAccessor) {
            var bindings,
                value = valueAccessor(),
                validationState;

            if (value === true) {
                bindings = allBindingsAccessor();
                value = bindings.value || bindings.checked || bindings.validatedValue || bindings.validatedChecked;
            }

            validationState = knockout.PropertyValidationState.getState(value);

            if (validationState) {
                element.disabled = !validationState.options.applicable();
            }
        });

    // visibility binding handlers
    (function () {
        var visibleDependingOnValidity = function (element, valueAccessor, determineVisibilityFunction) {
            var newVisibility,
                observableOrComputed = valueAccessor(),
                validationState = knockout.PropertyValidationState.getState(observableOrComputed);

            if (validationState) {
                newVisibility = determineVisibilityFunction(validationState);
                valerie.dom.setElementVisibility(element, newVisibility);
            }
        };

        // visibleWhenInvalid binding handler
        // - makes the bound element visible if the value is invalid, invisible otherwise
        ko.bindingHandlers.visibleWhenInvalid = knockout.extras.isolatedBindingHandler(
            function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.failed();
                });
            });

        // visibleWhenValid binding handler
        // - makes the bound element visible if the value is valid, invisible otherwise
        ko.bindingHandlers.visibleWhenValid = knockout.extras.isolatedBindingHandler(
            function (element, valueAccessor) {
                visibleDependingOnValidity(element, valueAccessor, function (validationState) {
                    return validationState.passed();
                });
            });
    })();

    // validationMessageFor binding handler
    // - makes the bound element visible if the value is invalid
    // - sets the text of the bound element to be the validation message
    ko.bindingHandlers.validationMessageFor = knockout.extras.isolatedBindingHandler(
        function (element, valueAccessor) {
            var observableOrComputed = valueAccessor(),
                validationState = knockout.PropertyValidationState.getState(observableOrComputed);

            if (validationState) {
                valerie.dom.setElementVisibility(element, validationState.showState());
                ko.utils.setTextContent(element, validationState.message());
            }
        });
})();

