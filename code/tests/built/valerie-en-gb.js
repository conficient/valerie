/**
 * The top-level valerie namespace.
 * @namespace valerie
 */
var valerie = {};

(function () {
    "use strict";

    /**
     * Contains general purpose utilities.
     * @namespace valerie.utils
     */
    valerie.utils = {};

    // Shortcuts.
    var utils = valerie.utils;

    /**
     * Creates a function that returns the given value as an array of one item, or simply returns the given value if it
     * is already an array.
     * @memberof valerie.utils
     * @param {*|Array} [valueOrArray] the value or function
     * @return {Array} a newly created array, or the array passed in
     */
    utils.asArray = function (valueOrArray) {
        if (utils.isArray(valueOrArray)) {
            return valueOrArray;
        }

        return [valueOrArray];
    };

    /**
     * Creates a function that returns the given value, or simply returns the given value if it is already a function.
     * @memberof valerie.utils
     * @param {*|function} [valueOrFunction] the value or function
     * @return {function} a newly created function, or the function passed in
     */
    utils.asFunction = function (valueOrFunction) {
        if (utils.isFunction(valueOrFunction)) {
            return valueOrFunction;
        }

        return function () { return valueOrFunction; };
    };

    /**
     * Tests whether the given value is an array.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an array
     */
    utils.isArray = function (value) {
        //noinspection JSValidateTypes
        return {}.toString.call(value) === "[object Array]";
    };

    /**
     * Tests whether the given value is an array or object.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an array or an object
     */
    utils.isArrayOrObject = function (value) {
        if (value === null) {
            return false;
        }

        return typeof value === "object";
    };

    /**
     * Tests whether the given value is a function.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is a function
     */
    utils.isFunction = function (value) {
        if (value == null) {
            return false;
        }

        return (typeof value === "function");
    };

    /**
     * Tests whether the given value is "missing".
     * <code>undefined</code>, <code>null</code>, an empty string or an empty array are considered to be "missing".
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the value is missing
     */
    utils.isMissing = function (value) {
        if (value == null) {
            return true;
        }

        if(utils.isString(value)) {
            return value.length === 0;
        }

        return false;
    };

    /**
     * Tests whether the given value is an object.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is an object
     */
    utils.isObject = function (value) {
        if (value === null) {
            return false;
        }

        if (utils.isArray(value)) {
            return false;
        }

        return typeof value === "object";
    };

    /**
     * Tests whether the give value is a string.
     * @memberof valerie.utils
     * @param {*} value the value to test
     * @return {boolean} whether the given value is a string
     */
    utils.isString = function (value) {
        //noinspection JSValidateTypes
        return {}.toString.call(value) === "[object String]";
    };

    /**
     * Merges the given default options with the given options.
     * <ul>
     *     <li>either parameter can be omitted and a clone of the other parameter will be returned</li>
     *     <li>the merge is shallow</li>
     *     <li>array properties are shallow cloned</li>
     * </ul>
     * @memberof valerie.utils
     * @param {{}} defaultOptions the default options
     * @param {{}} options the options
     * @return {{}} the merged options
     */
    utils.mergeOptions = function (defaultOptions, options) {
        var mergedOptions = {},
            name,
            value;

        if (defaultOptions == null) {
            defaultOptions = {};
        }

        if (options == null) {
            options = {};
        }

        for (name in defaultOptions) {
            if (defaultOptions.hasOwnProperty(name)) {
                value = defaultOptions[name];

                if (utils.isArray(value)) {
                    value = value.slice(0);
                }

                mergedOptions[name] = value;
            }
        }

        for (name in options) {
            if (options.hasOwnProperty(name)) {
                mergedOptions[name] = options[name];
            }
        }

        return mergedOptions;
    };
})();

(function () {
    "use strict";

    /**
     * Contains utilities for formatting strings.
     * @namespace valerie.formatting
     */
    valerie.formatting = {};

    // Shortcuts.
    var formatting = valerie.formatting;

    /**
     * Adds thousands separators to the given number string.
     * @memberof valerie.formatting
     * @param {string} numberString a string representation of a number
     * @param {string} thousandsSeparator the character to use to separate the thousands
     * @param {string} decimalSeparator the character used to separate the whole part of the number from its
     * fractional part
     * @return {string} the number string with separators added if required
     */
    formatting.addThousandsSeparator = function (numberString, thousandsSeparator, decimalSeparator) {
        var wholeAndFractionalParts = numberString.toString().split(decimalSeparator),
            wholePart = wholeAndFractionalParts[0];

        wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        wholeAndFractionalParts[0] = wholePart;

        return wholeAndFractionalParts.join(decimalSeparator);
    };

    /**
     * Pads the front of the given string to the given width using the given character.
     * @memberof valerie.formatting
     * @param {string} stringToPad the string to pad
     * @param {string} paddingCharacter the character to use to pad the string
     * @param {number} width the width to pad the string to
     * @return {string} the string padded, if required, to the given width
     */
    formatting.pad = function (stringToPad, paddingCharacter, width) {
        stringToPad = stringToPad.toString();

        if (stringToPad.length >= width) {
            return stringToPad;
        }

        return (new Array(width + 1 - stringToPad.length)).join(paddingCharacter) + stringToPad;
    };

    /**
     * Replaces placeholders in the given string with the given replacements.
     * @memberof valerie.formatting
     * @param {string} stringToFormat the string to format
     * @param {object|array} replacements a dictionary or array holding the replacements to use
     * @return {string} the formatted string with placeholders replaced where replacements have been specified
     */
    formatting.replacePlaceholders = function (stringToFormat, replacements) {
        if (replacements == null) {
            replacements = {};
        }

        return stringToFormat.replace(/\{(\w+)\}/g, function (match, subMatch) {
            var replacement = replacements[subMatch];

            if (replacement == null) {
                return match;
            }

            return replacement.toString();
        });
    };
})();

(function () {
    "use strict";

    /**
     * Contains utilities for working with the HTML document object model.
     * @namespace
     * @inner
     */
    valerie.dom = {};

    var classNamesSeparatorExpression = /\s+/g,
        trimWhitespaceExpression = /^\s+|\s+$/g,
    // Shortcuts.
        dom = valerie.dom;

    /**
     * Builds and returns a CSS class-names string using the keys in the given dictionary which have <code>true</code>
     * values.
     * @memberof valerie.dom
     * @param {object} dictionary the dictionary of CSS class-names
     * @return {string} the CSS class-names
     */
    dom.classNamesDictionaryToString = function (dictionary) {
        var name,
            array = [];

        for (name in dictionary) {
            if (dictionary.hasOwnProperty(name)) {
                if (dictionary[name]) {
                    array.push(name);
                }
            }
        }

        array.sort();

        return array.join(" ");
    };

    /**
     * Builds and returns a dictionary of <code>true</code> values, keyed on the CSS class-names found in the given
     * string.
     * @memberof valerie.dom
     * @param {string} classNames the CSS class-names
     * @return {object} the dictionary
     */
    dom.classNamesStringToDictionary = function (classNames) {
        var array,
            dictionary = {},
            index;

        if (classNames == null) {
            return dictionary;
        }

        classNames = classNames.replace(trimWhitespaceExpression, "");

        if (classNames.length === 0) {
            return dictionary;
        }

        array = classNames.split(classNamesSeparatorExpression);

        for (index = 0; index < array.length; index++) {
            dictionary[array[index]] = true;
        }

        return dictionary;
    };

    /**
     * Sets the visibility of the given HTML element.
     * @memberof valerie.dom
     * @param {HTMLElement} element the element to set the visibility of
     * @param {boolean} newVisibility
     */
    dom.setElementVisibility = function (element, newVisibility) {
        var currentVisibility = (element.style.display !== "none");
        if (currentVisibility === newVisibility) {
            return;
        }

        element.style.display = (newVisibility) ? "" : "none";
    };
})();

(function () {
    "use strict";

    /**
     * Contains functions that add extra functionality to KnockoutJS.
     * @namespace
     */
    valerie.koExtras = {};

    /**
     * Creates a binding handler where the <code>update</code> method is only invoked if one of its observable
     * or computed dependencies is updated. Unlike normal bindings, the <code>update</code> method is not invoked if a
     * sibling binding is updated.
     * @memberof valerie.koExtras
     * @param {function} initOrUpdateFunction the function to initialise or update the binding
     * @param {function} updateFunction the function to update the binding
     * @return {{}} an isolated binding handler
     */
    valerie.koExtras.isolatedBindingHandler = function (initOrUpdateFunction, updateFunction) {
        var initFunction = (arguments.length === 1) ? function () {
        } : initOrUpdateFunction;

        updateFunction = (arguments.length === 2) ? updateFunction : initOrUpdateFunction;

        return {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                initFunction(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

                //noinspection JSCheckFunctionSignatures
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

    /**
     * Creates a Knockout computed whose computation can be paused and resumed.
     * @memberof valerie.koExtras
     * @param {function} evaluatorFunction the function to be evaluated as the computed
     * @param {object} [evaluatorFunctionTarget] the object which will act as <code>this</code> when the function is
     * executed
     * @param {object} [options] options to use when creating the computed
     * @param {function} [pausedValueOrObservableOrComputed] a value, observable or computed used to control whether
     * the computed is paused. This parameter could be used to control the state of numerous pausable computeds using
     * a single observable or computed.
     * @return {function} the computed
     */
    valerie.koExtras.pausableComputed = function (evaluatorFunction, evaluatorFunctionTarget, options,
        pausedValueOrObservableOrComputed) {

        var lastValue,
            paused,
            computed;

        if (pausedValueOrObservableOrComputed == null) {
            //noinspection JSCheckFunctionSignatures
            paused = ko.observable(false);
        } else {
            //noinspection JSCheckFunctionSignatures
            paused = ko.utils.isSubscribable(pausedValueOrObservableOrComputed) ?
                pausedValueOrObservableOrComputed :
                ko.observable(pausedValueOrObservableOrComputed);
        }

        //noinspection JSCheckFunctionSignatures
        computed = ko.computed(function () {
            if (paused()) {
                return lastValue;
            }

            return evaluatorFunction.call(evaluatorFunctionTarget);
        }, evaluatorFunctionTarget, options);

        //noinspection JSCheckFunctionSignatures
        /**
         * Gets and sets whether the computed is paused.
         */
        computed.paused = ko.computed({
            "read": function () {
                return paused();
            },
            "write": function (value) {
                if (value) {
                    value = true;
                }

                if (value === paused()) {
                    return;
                }

                if (value) {
                    lastValue = computed();
                }

                paused(value);
            }
        });

        /**
         * Refreshes the value of a pausable computed, but leaves the computed's paused state in its original state.
         */
        computed.refresh = function () {
            if (!paused()) {
                return;
            }

            paused(false);
            lastValue = computed();
            paused(true);
        };

        return computed;
    };
})();

(function () {
    "use strict";

    /**
     * Contains converters, always singletons.
     * @namespace
     * @see valerie.IConverter
     */
    valerie.converters = {};

    /**
     * A converter which formats and parses strings.
     * Used as the default converter in numerous places throughout the library.
     * @name valerie.converters~passThrough
     * @type valerie.IConverter
     */
    valerie.converters.passThrough = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parse": function (value) {
            return value;
        }
    };
})();

(function () {
    "use strict";

    var states = {
        "failed": {},
        "passed": {},
        "pending": {}
    };

    /**
     * Constructs the result of a validation activity.
     * @constructor
     * @param {object} state the result state
     * @param {string} [message] a message from the activity
     * @property {object} state the result state
     * @property {boolean} failed - true if the activity failed validation
     * @property {boolean} passed - true if the activity passed validation
     * @property {boolean} pending - true if the activity hasn't yet completed
     * @property {string} message - a message from the activity
     */
    valerie.ValidationResult = function (state, message) {
        if (message == null) {
            message = "";
        }

        this.state = state;
        this.message = message;

        this.failed = state === states.failed;
        this.passed = state === states.passed;
        this.pending = state === states.pending;
    };

    /**
     * The possible states of a ValidationResult.
     * @name ValidationResult.states
     * @static
     */
    valerie.ValidationResult.states = states;

    /**
     * A validation result for when validation has passed.
     * @type {valerie.ValidationResult}
     */
    valerie.ValidationResult.passedInstance = new valerie.ValidationResult(states.passed);

    /**
     * A validation result for when validation hasn't yet completed.
     * @type {valerie.ValidationResult}
     */
    valerie.ValidationResult.pendingInstance = new valerie.ValidationResult(states.pending);

    /**
     * Creates a validation result for when validation has failed.
     * @param {string} [message] a message from the activity
     * @return {valerie.ValidationResult}
     */
    valerie.ValidationResult.createFailedResult = function (message) {
        return new valerie.ValidationResult(states.failed, message);
    };
})();

(function () {
    "use strict";

    /**
     * Contains utilities for working with validation states.
     * @namespace
     */
    valerie.validationState = {};

    var getValidationStateMethodName = "validation",
        utils = valerie.utils;

    /**
     * Finds and returns the validation states of:
     * <ul>
     *     <li>immediate properties of the given model</li>
     *     <li>immediate sub-models of the given model, if specified</li>
     *     <li>descendant properties of the given model, if specified</li>
     *     <li>descendant sub-models of the given model, if specified</li>
     * </ul>
     * @param {object} model the model to find validation states in
     * @param {boolean} [includeSubModels = true] whether to return the validation states of child
     * sub-models
     * @param {boolean} [recurse = false] whether to inspect the descendant properties and, if specified,
     * descendant sub-models of child sub-models
     * @param {array.<valerie.IValidationState>} [validationStates] the already inspected validation states; this
     * parameter is used in recursive invocations
     */
    valerie.validationState.findIn = function (model, includeSubModels, recurse, validationStates) {
        if (!(1 in arguments)) {
            includeSubModels = true;
        }

        if (!(2 in arguments)) {
            recurse = false;
        }

        if (!(3 in arguments)) {
            //noinspection JSValidateTypes
            validationStates = [];
        }

        var name,
            validationState,
            value;

        for (name in model) {
            if (model.hasOwnProperty(name)) {
                value = model[name];

                if (value == null) {
                    continue;
                }

                validationState = valerie.validationState.getFor(value);

                if (ko.isObservable(value)) {
                    value = value.peek();
                }

                if (utils.isFunction(value)) {
                    continue;
                }

                if (validationState) {
                    if (validationState instanceof valerie.PropertyValidationState) {
                        //noinspection JSUnresolvedFunction
                        validationStates.push(validationState);
                    }

                    else if (includeSubModels) {
                        //noinspection JSUnresolvedFunction
                        validationStates.push(validationState);

                    }
                }

                if (recurse && utils.isArrayOrObject(value)) {
                    //noinspection JSValidateTypes
                    valerie.validationState.findIn(value, includeSubModels, true, validationStates);
                }
            }
        }

        return validationStates;
    };

    /**
     * Gets the validation state for the given model, observable or computed.<br>
     * If the model is known to have a validation state, the construct <code>model.validation()</code> can also be used
     * retrieve it.<br/>
     * <i>This function is useful when developing binding handlers.</i>
     * @param {object|function} modelOrObservableOrComputed the thing to get the validation state for
     * @return {null|valerie.IValidationState} the validation state or <code>null</code> if the given thing does not
     * have a validation state.
     */
    valerie.validationState.getFor = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return null;
        }

        if (!modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName)) {
            return null;
        }

        return modelOrObservableOrComputed[getValidationStateMethodName]();
    };

    /**
     * Informs if the given model, observable or computed has a validation state.<br/>
     * <i>This function is useful when developing binding handlers.</i>
     * @param {object|function} modelOrObservableOrComputed the thing to test
     * @return {boolean} whether the given thing has a validation state
     */
    valerie.validationState.has = function (modelOrObservableOrComputed) {
        if (modelOrObservableOrComputed == null) {
            return false;
        }

        return modelOrObservableOrComputed.hasOwnProperty(getValidationStateMethodName);
    };

    /**
     * Sets the validation state for the given model, observable or computed.
     * @param {object|function} modelOrObservableOrComputed the thing to set the validation state on
     * @param {valerie.IValidationState} state the validation state to use
     */
    valerie.validationState.setFor = function (modelOrObservableOrComputed, state) {
        modelOrObservableOrComputed[getValidationStateMethodName] = function () {
            return state;
        };
    };
})();

(function () {
    "use strict";
    var deferEvaluation = { "deferEvaluation": true },
    // Shortcuts.
        utils = valerie.utils,
        passedValidationResult = valerie.ValidationResult.passedInstance,
        pendingValidationResult = valerie.ValidationResult.pendingInstance,
        koObservable = ko.observable,
        koComputed = ko.computed,

    // Functions for computeds.
        failedFunction = function () {
            return this.result().failed;
        },
        failedStatesFunction = function () {
            var failedStates = [],
                validationStates = this.validationStates(),
                validationState,
                result,
                index;

            for (index = 0; index < validationStates.length; index++) {
                validationState = validationStates[index];

                if (validationState.isApplicable()) {
                    result = validationState.result();

                    if (result.failed) {
                        failedStates.push(validationState);
                    }
                }
            }

            return failedStates;
        },
        messageFunction = function () {
            return this.result().message;
        },
        passedFunction = function () {
            return this.result().passed;
        },
        pendingFunction = function () {
            return this.result().pending;
        },
        pendingStatesFunction = function () {
            var pendingStates = [],
                validationStates = this.validationStates(),
                validationState,
                index;

            for (index = 0; index < validationStates.length; index++) {
                validationState = validationStates[index];

                if (validationState.isApplicable() && validationState.result().pending) {
                    pendingStates.push(validationState);
                }
            }

            return pendingStates;
        },
        resultFunction = function () {
            if (this.failedStates().length > 0) {
                return valerie.ValidationResult.createFailedResult(this.settings.failureMessageFormat);
            }

            if (this.pendingStates().length > 0) {
                return pendingValidationResult;
            }

            return passedValidationResult;
        },
        touchedReadFunction = function () {
            var index,
                validationStates = this.validationStates();

            for (index = 0; index < validationStates.length; index++) {
                if (validationStates[index].touched()) {
                    return true;
                }
            }

            return false;
        },
        touchedWriteFunction = function (value) {
            var index,
                validationStates = this.validationStates(),
                validationState;

            for (index = 0; index < validationStates.length; index++) {
                validationState = validationStates[index];
                if (validationState.isApplicable()) {
                    validationState.touched(value);
                }
            }
        };

    /**
     * An item in a model validation state summary.
     * @typedef {object} valerie.ModelValidationState.summaryItem
     * @property {string} name the name of the property or sub-model which has failed validation
     * @property {string} message a message describing why validation failed
     */

    /**
     * Construction options for a model validation state.
     * @typedef {object} valerie.ModelValidationState.options
     * @property {function} applicable the function used to determine if the model is applicable
     * @property {boolean} excludeFromSummary whether any validation failures for this model are excluded from a summary
     * @property {string} failureMessage the message shown when the model is in an invalid state
     * @property {function} name the function used to determine the name of the model; used in failure messages
     * @property {function} paused a value, observable or computed used to control whether the computation that updates
     * the result of this validation state is paused.
     */

    /**
     * Constructs the validation state for a model, which may comprise of simple properties and sub-models.
     * @param model the model the validation state is for
     * @param {valerie.ModelValidationState.options} [options = default options] the options to use when creating the
     * validation state
     * @constructor
     */
    valerie.ModelValidationState = function (model, options) {
        //noinspection JSValidateTypes
        options = utils.mergeOptions(valerie.ModelValidationState.defaultOptions, options);
        //noinspection JSUnresolvedVariable,JSUndefinedPropertyAssignment
        options.applicable = utils.asFunction(options.applicable);
        //noinspection JSUnresolvedVariable,JSUndefinedPropertyAssignment
        options.name = utils.asFunction(options.name);

        /**
         * Gets whether the model has failed validation.
         * @method
         * @return {boolean} <code>true</code> if validation has failed, <code>false</code> otherwise
         */
        this.failed = koComputed(failedFunction, this, deferEvaluation);

        /**
         * Gets the validation states that belong to the model that are in a failure state.
         * @method
         * @return {array.<valerie.IValidationState>} the states that are in failure state
         */
        this.failedStates = koComputed(failedStatesFunction, this, deferEvaluation);

        /**
         * Gets a message describing the validation state.
         * @method
         * @return {string} the message, can be empty
         */
        this.message = koComputed(messageFunction, this, deferEvaluation);

        /**
         * The model this validation state is for.
         * @type {*}
         */
        this.model = model;

        /**
         * Gets whether the model has passed validation.
         * @method
         * @return {boolean} <code>true</code> if validation has passed, <code>false</code> otherwise
         */
        this.passed = koComputed(passedFunction, this, deferEvaluation);

        /**
         * Gets whether validation for the model is pending.
         * @method
         * @return {boolean} <code>true</code> is validation is pending, <code>false</code> otherwise
         */
        this.pending = koComputed(pendingFunction, this, deferEvaluation);

        /**
         * Gets the validation states that belong to the model that are in a pending state.
         * @method
         * @return {array.<valerie.IValidationState>} the states that are in pending state
         */
        this.pendingStates = koComputed(pendingStatesFunction, this, deferEvaluation);

        //noinspection JSUnresolvedVariable
        /**
         * Gets the result of the validation.
         * @method
         * @return {valerie.ValidationResult} the result
         */
        this.result = valerie.koExtras.pausableComputed(resultFunction, this, deferEvaluation, options.paused);

        /**
         * Gets or sets whether the computation that updates the validation result has been paused.
         * @method
         * @param {boolean} [value] <code>true</code> if the computation should be paused, <code>false</code> if the
         * computation should not be paused
         * @return {boolean} <code>true</code> if the computation is paused, <code>false</code> otherwise
         */
        this.paused = this.result.paused;

        /**
         * Refreshes the validation result.
         * @method
         */
        this.refresh = this.result.refresh;

        /**
         * The settings for this validation state.
         * @type {valerie.PropertyValidationState.options}
         */
        this.settings = options;

        /**
         * Gets the name of the model.
         * @method
         * @return {string} the name of the model
         */
        this.getName = function () {
            return this.settings.name();
        };

        /**
         * Gets whether the model is applicable.
         * @method
         * @return {boolean} <code>true</code> if the model is applicable, <code>false</code> otherwise
         */
        this.isApplicable = function () {
            return this.settings.applicable();
        };

        //noinspection JSValidateJSDoc
        /**
         * Gets a static summary of the validation states are in a failure state.
         * @method
         * @return {array.<valerie.ModelValidationState.summaryItem>} the summary
         */
        this.summary = koObservable([]);

        /**
         * Gets or sets whether the model has been "touched" by a user action.
         * @method
         * @param {boolean} [value] <code>true</code> if the model should marked as touched, <code>false</code> if
         * the model should be marked as untouched
         * @return {boolean} <code>true</code> if the model has been "touched", <code>false</code> otherwise
         */
        this.touched = koComputed({
            "read": touchedReadFunction,
            "write": touchedWriteFunction,
            "deferEvaluation": true,
            "owner": this
        });

        /**
         * Gets the validation states that belong to this model.
         * @method
         * @return {array.<valerie.IValidationState>} the validation states
         */
        this.validationStates = ko.observableArray();
    };

    valerie.ModelValidationState.prototype = {
        /**
         * Adds validation states to this validation state.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#addValidationStates
         * @fluent
         * @param {object|array.<valerie.IValidationState>} validationStateOrStates the validation states to add
         * @return {valerie.ModelValidationState}
         */
        "addValidationStates": function (validationStateOrStates) {
            validationStateOrStates = utils.asArray(validationStateOrStates);

            //noinspection JSValidateTypes
            this.validationStates.push.apply(this.validationStates, validationStateOrStates);

            return this;
        },
        /**
         * Sets the value or function used to determine if the model is applicable.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#applicable
         * @fluent
         * @param {boolean|function} [valueOrFunction = true] the value or function to use
         * @return {valerie.ModelValidationState}
         */
        "applicable": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.applicable = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Clears the static summary of validation states that are in a failure state.<br/>
         * <i>[fluent]</i>
         * @name valerie.ModelValidationState#clearSummary
         * @fluent
         * @param {boolean} [clearSubModelSummaries = false] whether to clear the static summaries for sub-models
         * @return {valerie.ModelValidationState}
         */
        "clearSummary": function (clearSubModelSummaries) {
            var states,
                state,
                index;

            this.summary([]);

            if (clearSubModelSummaries) {
                states = this.validationStates();

                for (index = 0; index < states.length; index++) {
                    state = states[index];

                    if (state.clearSummary) {
                        state.clearSummary(true);
                    }
                }
            }

            return this;
        },
        /**
         * Ends a chain of fluent method calls on this model validation state.
         * @return {function} the model the validation state is for
         */
        "end": function () {
            return this.model;
        },
        /**
         * Includes any validation failures for this property in a validation summary.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "includeInSummary": function () {
            this.settings.excludeFromSummary = false;

            return this;

        },
        /**
         * Sets the value or function used to determine the name of the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string|function} valueOrFunction the value or function to use
         * @return {valerie.ModelValidationState}
         */
        "name": function (valueOrFunction) {
            this.settings.name = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Removes validation states.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {object|array.<valerie.IValidationState>} validationStateOrStates the validation states to remove
         * @return {valerie.ModelValidationState}
         */
        "removeValidationStates": function (validationStateOrStates) {
            validationStateOrStates = utils.asArray(validationStateOrStates);

            this.validationStates.removeAll(validationStateOrStates);

            return this;
        },
        /**
         * Stops validating the given sub-model by adding the validation state that belongs to it.
         * @param {*} validatableSubModel the sub-model to start validating
         * @return {valerie.ModelValidationState}
         */
        "startValidatingSubModel": function (validatableSubModel) {
            this.validationStates.push(validatableSubModel.validation());

            return this;
        },
        /**
         * Stops validating the given sub-model by removing the validation state that belongs to it.
         * @param {*} validatableSubModel the sub-model to stop validating
         * @return {valerie.ModelValidationState}
         */
        "stopValidatingSubModel": function (validatableSubModel) {
            this.validationStates.remove(validatableSubModel.validation());

            return this;
        },
        /**
         * Updates the static summary of validation states that are in a failure state.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean} [updateSubModelSummaries = false] whether to update the static summaries for sub-models
         * @return {valerie.ModelValidationState}
         */
        "updateSummary": function (updateSubModelSummaries) {
            var states = this.failedStates(),
                state,
                index,
                failures = [];

            for (index = 0; index < states.length; index++) {
                state = states[index];

                if (!state.settings.excludeFromSummary) {
                    failures.push({
                        "name": state.getName(),
                        "message": state.message()
                    });
                }
            }

            this.summary(failures);

            if (updateSubModelSummaries) {
                states = this.validationStates();

                for (index = 0; index < states.length; index++) {
                    state = states[index];

                    if (state.isApplicable() && state.updateSummary) {
                        state.updateSummary(true);
                    }
                }
            }

            return this;
        },
        /**
         * Adds the validation states for all the descendant properties and sub-models that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateAll": function () {
            var validationStates = valerie.validationState.findIn(this.model, true, true);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the descendant properties that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateAllProperties": function () {
            var validationStates = valerie.validationState.findIn(this.model, false, true);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the child properties that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateChildProperties": function () {
            var validationStates = valerie.validationState.findIn(this.model, false, false);
            this.addValidationStates(validationStates);

            return this;
        },
        /**
         * Adds the validation states for all the child properties and sub-models that belong to the model.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.ModelValidationState}
         */
        "validateChildPropertiesAndSubModels": function () {
            var validationStates = valerie.validationState.findIn(this.model, true, false);
            this.addValidationStates(validationStates);

            return this;
        }
    };

    /**
     * The default options used when constructing a model validation state.
     * @name valerie.ModelValidationState.defaultOptions
     * @lends valerie.ModelValidationState.options
     */
    valerie.ModelValidationState.defaultOptions = {
        "applicable": utils.asFunction(true),
        "excludeFromSummary": true,
        "failureMessageFormat": "",
        "name": utils.asFunction("(?)"),
        "paused": null
    };

    /**
     * Makes the passed-in model validatable. After invocation the model will have a validation state.
     * <br/><b>fluent</b>
     * @param {object|function} model the model to make validatable
     * @param {valerie.ModelValidationState.options} [options] the options to use when creating the model's validation
     * state
     * @return {valerie.ModelValidationState} the validation state belonging to the model
     */
    valerie.validatableModel = function (model, options) {
        var validationState = new valerie.ModelValidationState(model, options);

        valerie.validationState.setFor(model, validationState);

        return validationState;
    };
})();

(function () {
    "use strict";

    var deferEvaluation = { "deferEvaluation": true },
    // Shortcuts.
        utils = valerie.utils,
        formatting = valerie.formatting,
        koExtras = valerie.koExtras,
        koObservable = ko.observable,
        koComputed = ko.computed,
        passedValidationResult = valerie.ValidationResult.passedInstance,

    // Functions used by computeds.
        missingFunction = function (validationState) {
            var value = validationState.observableOrComputed(),
                missing = validationState.settings.missingTest(value),
                required = validationState.settings.required();

            if (missing && required) {
                return -1;
            }

            if (missing && !required) {
                return 0;
            }

            return 1;
        },
        rulesResultFunction = function (validationState) {
            var value = validationState.observableOrComputed(),
                rules = validationState.settings.rules,
                rule,
                result,
                index;

            for (index = 0; index < rules.length; index++) {
                rule = rules[index];

                result = rule.test(value);

                if (result.failed || result.pending) {
                    return result;
                }
            }

            return passedValidationResult;
        },
    // Functions for computeds.
        failedFunction = function () {
            return this.result().failed;
        },
        messageFunction = function () {
            var message = this.result().message;

            message = formatting.replacePlaceholders(message, { "name": this.settings.name() });

            return message;
        },
        passedFunction = function () {
            return this.result().passed;
        },
        pendingFunction = function () {
            return this.result().pending;
        },
        resultFunction = function () {
            var missingResult,
                result;

            result = this.boundEntry.result();
            if (result.failed) {
                return result;
            }

            missingResult = missingFunction(this);

            if (missingResult === -1) {
                return valerie.ValidationResult.createFailedResult(this.settings.missingFailureMessage);
            }

            if (missingResult === 0) {
                return result;
            }


            return rulesResultFunction(this);
        },
        showMessageFunction = function () {
            if (!this.settings.applicable()) {
                return false;
            }

            return this.touched() && this.result().failed;
        };

    /**
     * Construction options for a property validation state.
     * @typedef {object} valerie.PropertyValidationState.options
     * @property {function} applicable the function used to determine if the property is applicable
     * @property {valerie.IConverter} converter the converter used to parse user
     * entries and format display of the property's value
     * @property {string} entryFormat the string used to format the property's value for display in a user entry
     * @property {boolean} excludeFromSummary whether any validation failures for this property are excluded from a summary
     * @property {string} invalidFailureMessage the message shown when the user has entered an invalid value
     * @property {string} missingFailureMessage the message shown when a value is required but is missing
     * @property {function} name the function used to determine the name of the property; used in failure messages
     * @property {function} required the function used to determine if a value is required
     * @property {valerie.array<IRule>} rules the chain of rules used to validate the property's value
     * @property {string} valueFormat the string use to format the property's value for display in a message
     */

    /**
     * Constructs the validation state for a simple, single, observable or computed property.
     * @constructor
     * @param {function} observableOrComputed the observable or computed the validation state is for
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to use when creating the
     * validation state
     */
    valerie.PropertyValidationState = function (observableOrComputed, options) {
        //noinspection JSValidateTypes
        options = utils.mergeOptions(valerie.PropertyValidationState.defaultOptions, options);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.applicable = utils.asFunction(options.applicable);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.name = utils.asFunction(options.name);
        //noinspection JSUndefinedPropertyAssignment,JSUnresolvedVariable
        options.required = utils.asFunction(options.required);

        // Available, but not for "consumer" use.
        this.boundEntry = {
            "focused": koObservable(false),
            "result": koObservable(passedValidationResult),
            "textualInput": false
        };

        /**
         * Gets whether the value held by or entered for the property fails validation.
         * @method
         * @return {boolean} <code>true</code> if validation has failed, <code>false</code> otherwise
         */
        this.failed = koComputed(failedFunction, this, deferEvaluation);

        /**
         * Gets a message describing the validation state.
         * @method
         * @return {string} the message, can be empty
         */
        this.message = koExtras.pausableComputed(messageFunction, this, deferEvaluation);

        /**
         * Gets whether the value held by or entered for the property passes validation.
         * @method
         * @return {boolean} <code>true</code> if validation has passed, <code>false</code> otherwise
         */
        this.passed = koComputed(passedFunction, this, deferEvaluation);

        /**
         * The observable or computed this validation state is for.
         * @type {function}
         */
        this.observableOrComputed = observableOrComputed;

        /**
         * Gets whether validation for the property hasn't yet completed.
         * @method
         * @return {boolean} <code>true</code> is validation is pending, <code>false</code> otherwise
         */
        this.pending = koComputed(pendingFunction, this, deferEvaluation);

        /**
         * Gets the result of the validation.
         * @method
         * @return {valerie.ValidationResult} the result
         */
        this.result = koComputed(resultFunction, this, deferEvaluation);

        /**
         * The settings for this validation state.
         * @type {valerie.PropertyValidationState.options}
         */
        this.settings = options;

        /**
         * Gets the name of the property.
         * @method
         * @return {string} the name of the property
         */
        this.getName = function () {
            return this.settings.name();
        };

        /**
         * Gets whether the property is applicable.
         * @method
         * @return {boolean} <code>true</code> if the property is applicable, <code>false</code> otherwise
         */
        this.isApplicable = function () {
            return this.settings.applicable();
        };

        /**
         * Gets whether the message describing the validation state should be shown.
         * @method
         * @return {boolean} <code>true</code> if the message should be shown, <code>false</code> otherwise
         */
        this.showMessage = koExtras.pausableComputed(showMessageFunction, this, deferEvaluation);

        /**
         * Gets or sets whether the property has been "touched" by a user action.
         * @method
         * @param {boolean} [value] <code>true</code> if the property should marked as touched, <code>false</code> if
         * the property should be marked as untouched
         * @return {boolean} <code>true</code> if the property has been "touched", <code>false</code> otherwise
         */
        this.touched = koObservable(false);
    };

    valerie.PropertyValidationState.prototype = {
        /**
         * Adds a rule to the chain of rules used to validate the property's value.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {valerie.IRule} rule the rule to add
         * @return {valerie.PropertyValidationState}
         */
        "addRule": function (rule) {
            this.settings.rules.push(rule);

            return this;
        },
        /**
         * Sets the value or function used to determine if the property is applicable.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean|function} [valueOrFunction = true] the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "applicable": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.applicable = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Ends a chain of fluent method calls on this property validation state.<br/>
         * Applies the <b>options.valueFormat</b> format string to all the rules in the rule chain.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {function} the observable or computed the validation state is for
         */
        "end": function () {
            var index,
                settings = this.settings,
                valueFormat = settings.valueFormat,
                rules = settings.rules,
                ruleSettings;

            for (index = 0; index < rules.length; index++) {
                ruleSettings = rules[index].settings;

                ruleSettings.valueFormat = valueFormat;
            }

            return this.observableOrComputed;
        },
        /**
         * Sets the format string used to format the display of the value in an entry.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string} format the format string to use
         * @return {valerie.PropertyValidationState}
         */
        "entryFormat": function (format) {
            this.settings.entryFormat = format;

            return this;
        },
        /**
         * Excludes any validation failures for this property from a validation summary.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @return {valerie.PropertyValidationState}
         */
        "excludeFromSummary": function () {
            this.settings.excludeFromSummary = true;

            return this;

        },
        /**
         * Sets the value or function used to determine the name of the property.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string|function} valueOrFunction the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "name": function (valueOrFunction) {
            this.settings.name = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Sets the value or function used to determine the if the property is required.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {boolean|function} [valueOrFunction = false] the value or function to use
         * @return {valerie.PropertyValidationState}
         */
        "required": function (valueOrFunction) {
            if (valueOrFunction == null) {
                valueOrFunction = true;
            }

            this.settings.required = utils.asFunction(valueOrFunction);

            return this;
        },
        /**
         * Sets the format string used to format the display of the value.<br/>
         * <i>[fluent]</i>
         * @fluent
         * @param {string} format the format string to use
         * @return {valerie.PropertyValidationState}
         */
        "valueFormat": function (format) {
            this.settings.valueFormat = format;

            return this;
        }
    };

    /**
     * The default options used when constructing a property validation state.
     * @name valerie.PropertyValidationState.defaultOptions
     * @lends valerie.PropertyValidationState.options
     */
    valerie.PropertyValidationState.defaultOptions = {
        "applicable": utils.asFunction(true),
        "converter": valerie.converters.passThrough,
        "entryFormat": null,
        "excludeFromSummary": false,
        "invalidEntryFailureMessage": "",
        "missingFailureMessage": "",
        "missingTest": utils.isMissing,
        "name": utils.asFunction(),
        "required": utils.asFunction(false),
        "rules": [],
        "valueFormat": null
    };

    /**
     * Makes the passed-in property validatable. After invocation the property will have a validation state.
     * <br/><b>fluent</b>
     * @param {function} observableOrComputed the Knockout observable or computed to make validatable
     * @param {valerie.PropertyValidationState.options} [options] the options to use when creating the property's
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the property
     * @throws {string} Only observables or computeds can be made validatable properties.
     */
    valerie.validatableProperty = function (observableOrComputed, options) {
        if (!ko.isSubscribable(observableOrComputed)) {
            throw "Only observables or computeds can be made validatable properties.";
        }

        var validationState = new valerie.PropertyValidationState(observableOrComputed, options);

        valerie.validationState.setFor(observableOrComputed, validationState);

        return validationState;
    };
})();

(function () {
    "use strict";

    /**
     * Creates and sets a validation state on a Knockout computed.<br/>
     * <i>[fluent]</i>
     * @name ko.computed#validate
     * @method
     * @fluent
     * @param {valerie.PropertyValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the computed
     */
    ko.computed.fn.validate = function(validationOptions) {
        return valerie.validatableProperty(this, validationOptions);
    };
})();

(function () {
    "use strict";

    /**
     * Creates and sets a property validation state on a Knockout observable.<br/>
     * <i>[fluent]</i>
     * @name ko.observable#validate
     * @method
     * @fluent
     * @param {valerie.PropertyValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state belonging to the observable
     */
    ko.observable.fn.validate = function(validationOptions) {
        return valerie.validatableProperty(this, validationOptions);
    };

    /**
     * Creates and sets a model validation state on a Knockout observable array.<br/>
     * <i>[fluent]</i>
     * @name ko.observableArray#validateAsModel
     * @method
     * @fluent
     * @param {valerie.ModelValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.ModelValidationState} the validation state belonging to the observable array
     */
    ko.observableArray.fn.validateAsModel = function(validationOptions) {
        return valerie.validatableModel(this, validationOptions);
    };

    /**
     * Creates and returns a property validation state on a Knockout observable array.<br/>
     * <i>[fluent]</i>
     * @name ko.observableArray#propertyValidationState
     * @method
     * @fluent
     * @param {valerie.PropertyValidationState.options} [validationOptions] the options to use when creating the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state created for the observable array
     */
    ko.observableArray.fn.propertyValidationState = function(validationOptions) {
        return new valerie.PropertyValidationState(this, validationOptions);
    };
})();

(function () {
    "use strict";

    // Shortcuts.
    var passedValidationResult = valerie.ValidationResult.passedInstance,
        utils = valerie.utils,
        dom = valerie.dom,
        setElementVisibility = dom.setElementVisibility,
        converters = valerie.converters,
        getValidationState = valerie.validationState.getFor,
        koBindingHandlers = ko.bindingHandlers,
        koRegisterEventHandler = ko.utils.registerEventHandler,
        isolatedBindingHandler = valerie.koExtras.isolatedBindingHandler;

    // Define validatedChecked and validatedValue binding handlers.
    (function () {
        var checkedBindingHandler = koBindingHandlers.checked,
            valueBindingHandler = koBindingHandlers.value,
            blurHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed);

                validationState.touched(true);
                validationState.boundEntry.focused(false);
                validationState.message.paused(false);
                validationState.showMessage.paused(false);
            },
            textualInputBlurHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed),
                    value;

                if (validationState.boundEntry.result.peek().failed) {
                    return;
                }

                value = observableOrComputed.peek();
                element.value = validationState.settings.converter.format(value,
                    validationState.settings.entryFormat);
            },
            textualInputFocusHandler = function (element, observableOrComputed) {
                var validationState = getValidationState(observableOrComputed);

                validationState.boundEntry.focused(true);
                validationState.message.paused(true);
                validationState.showMessage.paused(true);
            },
            textualInputKeyUpHandler = function (element, observableOrComputed) {
                var enteredValue = ko.utils.stringTrim(element.value),
                    parsedValue,
                    validationState = getValidationState(observableOrComputed),
                    settings = validationState.settings,
                    result = passedValidationResult;

                if (enteredValue.length === 0) {
                    observableOrComputed(null);

                    if (settings.required()) {
                        result = valerie.ValidationResult.createFailedResult(settings.missingFailureMessage);
                    }
                } else {
                    parsedValue = settings.converter.parse(enteredValue);
                    observableOrComputed(parsedValue);

                    if (parsedValue == null) {
                        result = valerie.ValidationResult.createFailedResult(settings.invalidEntryFailureMessage);
                    }
                }

                validationState.boundEntry.result(result);
            },
            textualInputUpdateFunction = function (observableOrComputed, validationState, element) {
                // Get the value so this function becomes dependent on the observable or computed.
                var value = observableOrComputed();

                // Prevent a focused element from being updated by the model.
                if (validationState.boundEntry.focused.peek()) {
                    return;
                }

                validationState.boundEntry.result(passedValidationResult);

                element.value = validationState.settings.converter.format(value,
                    validationState.settings.entryFormat);
            };

        /**
         * Validates entries that can be checked, i.e. check boxes and radio buttons.
         * Functions in the same way as the <b>ko.bindingHandlers.checked</b> binding handler, with the following
         * alterations:
         * <ul>
         *     <li>registers a blur event handler so validation messages for missing selections can be displayed</li>
         * </ul>
         * @name ko.bindingHandlers.validatedValue
         */
        koBindingHandlers.validatedChecked = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = getValidationState(observableOrComputed);

                checkedBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);

                if (validationState) {
                    koRegisterEventHandler(element, "blur", function () {
                        blurHandler(element, observableOrComputed);
                    });

                    // Use the name of the bound element if a property name has not been specified.
                    if (validationState.settings.name() == null) {
                        validationState.settings.name = utils.asFunction(element.name);
                    }
                }
            },
            "update": checkedBindingHandler.update
        };

        /**
         * Validates entries that can be keyed or selected.
         * Functions in the same way as the <b>ko.bindingHandlers.value</b> binding handler, with the following
         * alterations:
         * <ul>
         *     <li>registers a blur event handler:
         *     <ul>
         *         <li>to display validation messages as entries or selections lose focus</li>
         *         <li>to reformat successfully parsed textual entries</li>
         *     </ul>
         *     </li>
         *     <li>
         *         registers a focus event handler to pause the update of any existing visible validation message
         *     </li>
         *     <li>
         *         registers a key-up event handler which validates the entry as it's being entered; this allows other
         *         entries that are shown conditionally to be available before the user tabs out of this entry
         *     </li>
         * </ul>
         * @name ko.bindingHandlers.validatedValue
         */
        koBindingHandlers.validatedValue = {
            "init": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = getValidationState(observableOrComputed),
                    tagName,
                    textualInput;

                if (!validationState) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                if (validationState.settings.name() == null) {
                    validationState.settings.name = utils.asFunction(element.name);
                }

                koRegisterEventHandler(element, "blur", function () {
                    blurHandler(element, observableOrComputed);
                });

                tagName = element.tagName.toLowerCase();
                textualInput = (tagName === "input" && element.type.toLowerCase() === "text") || tagName === "textarea";

                if (!textualInput) {
                    valueBindingHandler.init(element, valueAccessor, allBindingsAccessor, viewModel,
                        bindingContext);

                    return;
                }

                validationState.boundEntry.textualInput = true;

                koRegisterEventHandler(element, "blur", function () {
                    textualInputBlurHandler(element, observableOrComputed);
                });

                koRegisterEventHandler(element, "focus", function () {
                    textualInputFocusHandler(element, observableOrComputed);
                });

                koRegisterEventHandler(element, "keyup", function () {
                    textualInputKeyUpHandler(element, observableOrComputed);
                });

                // Rather than update the textual input in the "update" method we use a computed to ensure the textual
                // input's value is changed only when the observable or computed is changed, not when another binding is
                // changed.
                //noinspection JSCheckFunctionSignatures
                ko.computed({
                    "read": function () {
                        textualInputUpdateFunction(observableOrComputed, validationState, element);
                    },
                    "disposeWhenNodeIsRemoved": element
                });
            },
            "update": function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var observableOrComputed = valueAccessor(),
                    validationState = getValidationState(observableOrComputed);

                if (validationState && validationState.boundEntry.textualInput) {
                    return;
                }

                valueBindingHandler.update(element, valueAccessor, allBindingsAccessor, viewModel,
                    bindingContext);
            }
        };
    })();

    // Define binding handlers which control the display of element based on a validation state.
    (function () {
        var applyForValidationState =
            function (functionToApply, element, valueAccessor, allBindingsAccessor, viewModel) {
                var bindings = allBindingsAccessor(),
                    value = valueAccessor(),
                    validationState;

                if (value === true) {
                    value = bindings.value || bindings.checked ||
                        bindings.validatedValue || bindings.validatedChecked ||
                        viewModel;
                }

                validationState = getValidationState(value);

                if (validationState) {
                    functionToApply(validationState, value, bindings);
                }
            };

        /**
         * Disables the element when the chosen property or model has failed or is pending validation, enabled
         * otherwise.
         * @name ko.bindingHandlers.disabledWhenNotValid
         */
        koBindingHandlers.disabledWhenNotValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.passed();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Disables the element when the chosen property or model has been touched and has failed or is pending
         * validation, enabled otherwise.<br/>
         * @name ko.bindingHandlers.disabledWhenTouchedAndNotValid
         */
        koBindingHandlers.disabledWhenTouchedAndNotValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = validationState.touched() && !validationState.passed();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Enables the element when the chosen property or model is applicable, disabled otherwise.
         * @name ko.bindingHandlers.enabledWhenApplicable
         */
        koBindingHandlers.enabledWhenApplicable = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    element.disabled = !validationState.settings.applicable();
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Sets the text of the element to be a formatted representation of the specified property.
         * @name ko.bindingHandlers.formattedText
         */
        koBindingHandlers.formattedText = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor) {
                var bindings = allBindingsAccessor(),
                    observableOrComputedOrValue = valueAccessor(),
                    value = ko.utils.unwrapObservable(observableOrComputedOrValue),
                    validationState = getValidationState(observableOrComputedOrValue),
                    formatter = converters.passThrough.format,
                    valueFormat;

                if (validationState) {
                    formatter = validationState.settings.converter.format;
                    valueFormat = validationState.settings.valueFormat;
                }

                //noinspection JSUnresolvedVariable
                formatter = bindings.formatter || formatter;
                if (valueFormat == null) {
                    valueFormat = bindings.valueFormat;
                }

                ko.utils.setTextContent(element, formatter(value, valueFormat));
            });

        /**
         * Sets CSS classes on the element based on the validation state of the chosen property or model.</br>
         * The names of the CSS classes used are held in the <b>ko.bindingHandlers.validationCss.classNames</b> object,
         * by default they are:
         * <ul>
         *     <li><b>failed</b> - if validation failed</li>
         *     <li><b>focused</b> - if the element is in focus</li>
         *     <li><b>passed</b> - if validation passed</li>
         *     <li><b>pending</b> - if validation is pending</li>
         *     <li><b>touched</b> - set if the element has been "touched"</li>
         *     <li><b>untouched</b> - set if the element has not been "touched"</li>
         * </ul>
         * @name ko.bindingHandlers.validationCss
         */
        koBindingHandlers.validationCss = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    var classNames = koBindingHandlers.validationCss.classNames,
                        elementClassNames = element.className,
                        dictionary = dom.classNamesStringToDictionary(elementClassNames),
                        failed = validationState.failed(),
                        focused = false,
                        passed = validationState.passed(),
                        pending = validationState.pending(),
                        touched = validationState.touched(),
                        untouched = !touched;

                    if (validationState.boundEntry && validationState.boundEntry.focused()) {
                        focused = true;
                    }

                    dictionary[classNames.failed] = failed;
                    dictionary[classNames.focused] = focused;
                    dictionary[classNames.passed] = passed;
                    dictionary[classNames.pending] = pending;
                    dictionary[classNames.touched] = touched;
                    dictionary[classNames.untouched] = untouched;

                    element.className = dom.classNamesDictionaryToString(dictionary);
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * The class names used by the <b>ko.bindingHandlers.validationCss</b> binding.
         */
        koBindingHandlers.validationCss.classNames = {
            "failed": "failed",
            "focused": "focused",
            "passed": "passed",
            "pending": "pending",
            "touched": "touched",
            "untouched": "untouched"
        };

        /**
         * Makes the element behave like a validation message for the chosen property or model:
         * <ul>
         *     <li>makes the element visible if the value is invalid</li>
         *     <li>sets the text of the element to be the underlying validation state's message</li>
         * </ul>
         * @name ko.bindingHandlers.validationMessage
         */
        koBindingHandlers.validationMessage = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.showMessage());
                    ko.utils.setTextContent(element, validationState.message());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Sets the text of the element to be the underlying validation state's message.
         * @name ko.bindingHandlers.validationMessageText
         */
        koBindingHandlers.validationMessageText = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    ko.utils.setTextContent(element, validationState.message());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible if the chosen property or model is applicable, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenApplicable
         */
        koBindingHandlers.visibleWhenApplicable = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.isApplicable());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible when the entry bound to the chosen property is in focus, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenFocused
         */
        koBindingHandlers.visibleWhenFocused = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.focused());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible when the chosen property or model has failed validation, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenInvalid
         */
        koBindingHandlers.visibleWhenInvalid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.failed());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible when the summary for the chosen model is not empty, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenSummaryNotEmpty
         */
        koBindingHandlers.visibleWhenSummaryNotEmpty = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.summary().length > 0);
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible if the chosen property or model has been touched, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenTouched
         */
        koBindingHandlers.visibleWhenTouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible if the chosen property or model is untouched, invisible otherwise.
         * @name ko.bindingHandlers.visibleWhenUntouched
         */
        koBindingHandlers.visibleWhenUntouched = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, !validationState.touched());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });

        /**
         * Makes the element visible if the chosen property or model has passed validation.
         * @name ko.bindingHandlers.visibleWhenValid
         */
        koBindingHandlers.visibleWhenValid = isolatedBindingHandler(
            function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var functionToApply = function (validationState) {
                    setElementVisibility(element, validationState.passed());
                };

                applyForValidationState(functionToApply, element, valueAccessor, allBindingsAccessor, viewModel);
            });
    })();
})();

(function () {
    "use strict";

    var
        koCheckedBindingHandler = ko.bindingHandlers.checked,
        koValueBindingHandler = ko.bindingHandlers.value;

    /**
     * Contains helper functions for working with valerie's Knockout binding handlers.
     * @namespace
     */
    valerie.koBindingsHelper = {
        /**
         * Restores the original <b>checked</b> and <b>value</b> binding handlers.
         * @name valerie.koBindingsHelper#useOriginalBindingHandlers
         * @function
         */
        "useOriginalBindingHandlers": function () {
            ko.bindingHandlers.checked = koCheckedBindingHandler;
            ko.bindingHandlers.value = koValueBindingHandler;
        },
        /**
         * Replaces the <b>checked</b> and <b>value</b> binding handlers with the validating equivalents.
         * @name valerie.koBindingsHelper#useValidatingBindingHandlers
         * @function
         */
        "useValidatingBindingHandlers": function () {
            ko.bindingHandlers.checked = ko.bindingHandlers.validatedChecked;
            ko.bindingHandlers.value = ko.bindingHandlers.validatedValue;
        }
    };
})();
(function () {
    "use strict";

    var formatting = valerie.formatting,
        formatStringAsOptions = function (numericHelper, format) {
            var includeCurrencySign = format.indexOf("C") > -1,
                includeThousandsSeparator = format.indexOf(",") > -1,
                decimalPlaceIndex = format.indexOf("."),
                numberOfDecimalPlaces = 0;

            if (decimalPlaceIndex === format.length - 1) {
                numberOfDecimalPlaces = null;
            } else {
                if (decimalPlaceIndex > -1) {
                    if (format.charAt(decimalPlaceIndex + 1) === "c") {
                        numberOfDecimalPlaces = numericHelper.settings.currencyMinorUnitPlaces;
                    } else {
                        numberOfDecimalPlaces = Number(format.substr(decimalPlaceIndex + 1));
                    }
                }
            }

            return {
                "includeCurrencySign": includeCurrencySign,
                "includeThousandsSeparator": includeThousandsSeparator,
                "numberOfDecimalPlaces": numberOfDecimalPlaces
            };
        };

    /**
     * A helper for parsing and formatting numeric values.<br/>
     * <i>[full]</i>
     * @constructor
     */
    valerie.NumericHelper = function () {
    };

    valerie.NumericHelper.prototype = {
        /**
         * Initialises the helper.<br/>
         * <i>[fluent]</i>
         * @param {string} decimalSeparator the character or string to use as the decimal separator
         * @param {string} thousandsSeparator the character or string to use as the thousands separator
         * @param {string} currencySign the character or string to use as the currency sign
         * @param {number} currencyMinorUnitPlaces the number of decimal places to use when parsing and formatting the
         * currency's minor units
         * @returns {valerie.NumericHelper}
         */
        "init": function (decimalSeparator, thousandsSeparator, currencySign, currencyMinorUnitPlaces) {
            var integerExpression = "\\d+(\\" + thousandsSeparator + "\\d{3})*",
                currencyMajorExpression = "(\\" + currencySign + ")?" + integerExpression,
                currentMajorMinorExpression = currencyMajorExpression + "(\\" +
                    decimalSeparator + "\\d{" + currencyMinorUnitPlaces + "})?",
                floatExpression = integerExpression + "(\\" + decimalSeparator + "\\d+)?";

            this.settings = {
                "decimalSeparator": decimalSeparator,
                "thousandsSeparator": thousandsSeparator,
                "currencySign": currencySign,
                "currencyMinorUnitPlaces": currencyMinorUnitPlaces
            };

            this.expressions = {
                "currencyMajor": new RegExp("^" + currencyMajorExpression + "$"),
                "currencyMajorMinor": new RegExp("^" + currentMajorMinorExpression + "$"),
                "float": new RegExp("^" + floatExpression + "$"),
                "integer": new RegExp("^" + integerExpression + "$")
            };

            return this;
        },
        /**
         * Adds thousands separators to the given numeric string.
         * @param {string} numericString the numeric string to add separators to
         * @return {string} a numeric string with thousands separators
         */
        "addThousandsSeparator": function (numericString) {
            var settings = this.settings;

            return formatting.addThousandsSeparator(numericString, settings.thousandsSeparator,
                settings.decimalSeparator);
        },
        /**
         * Formats the given numeric value as a string.<br/>
         * Permitted format strings are:
         * <ul>
         *     <li><code>C,.c</code></li>
         *     <li><code>C,.1</code></li>
         *     <li><code>C,.n</code></li>
         *     <li><code>C.c</code></li>
         *     <li><code>C.1</code></li>
         *     <li><code>C.n</code></li>
         *     <li><code>.c</code></li>
         *     <li><code>.1</code></li>
         *     <li><code>.n</code></li>
         * </ul>
         * The formatting characters have the following directives:
         * <ul>
         *     <li><code>C</code> - include the currency sign in the formatted string</li>
         *     <li><code>,</code> - include thousands separators in the formatted string</li>
         *     <li><code>.</code> - include the decimal separator in the formatted string</li>
         *     <li><code>.c</code> - include the default number of digits after the decimal separator</li>
         *     <li><code>.1</code> - include 1 digit after the decimal separator</li>
         *     <li><code>.n</code> - include [n] digits after the decimal separator</li>
         * </ul>
         * @param {number} value the value to format
         * @param {string} format the format to use
         * @return {string} the formatted string
         */
        "format": function (value, format) {
            if (value == null) {
                return "";
            }

            if (format == null) {
                format = "";
            }

            var settings = this.settings,
                formatOptions = formatStringAsOptions(this, format),
                numberOfDecimalPlaces = formatOptions.numberOfDecimalPlaces,
                negative = value < 0;

            if (negative) {
                value = -value;
            }

            if (numberOfDecimalPlaces != null) {
                //noinspection JSValidateTypes
                value = value.toFixed(numberOfDecimalPlaces);
            } else {
                value = value.toString();
            }

            //noinspection JSUnresolvedFunction
            value = value.replace(".", settings.decimalSeparator);

            if (formatOptions.includeThousandsSeparator) {
                //noinspection JSValidateTypes
                value = this.addThousandsSeparator(value);
            }

            return (negative ? "-" : "") +
                (formatOptions.includeCurrencySign ? settings.currencySign : "") +
                value;
        },
        /**
         * Informs whether the given numeric string represents a currency value with major units only.
         * @param {string} numericString the numeric string to test
         * @return {boolean} <code>true</code> if the given numeric string represents a currency value,
         * <code>false</code> otherwise
         */
        "isCurrencyMajor": function (numericString) {
            return this.expressions.currencyMajor.test(numericString);
        },
        /**
         * Informs whether the given numeric string represents a currency value with major units and optionally minor units.
         * @param {string} numericString the numeric string to test
         * @return {boolean} <code>true</code> if the given numeric string represents a currency value,
         * <code>false</code> otherwise
         */
        "isCurrencyMajorMinor": function (numericString) {
            return this.expressions.currencyMajorMinor.test(numericString);
        },
        /**
         * Informs whether the given numeric string represents a non-integer numeric value.
         * @param {string} numericString the numeric string to test
         * @return {boolean} <code>true</code> if the given numeric string represents a non-integer numeric value,
         * <code>false</code> otherwise
         */
        "isFloat": function (numericString) {
            return this.expressions.float.test(numericString);
        },
        /**
         * Informs whether the given numeric string represents an integer value.
         * @param {string} numericString the numeric string to test
         * @return {boolean} <code>true</code> if the given numeric string represents a integer value,
         * <code>false</code> otherwise
         */
        "isInteger": function (numericString) {
            return this.expressions.integer.test(numericString);
        },
        /**
         * Attempts to parse the given numeric string as a number value. The string is unformatted first.
         * @param numericString
         * @returns {NaN|number}
         */
        "parse": function (numericString) {
            numericString = this.unformat(numericString);

            return Number(numericString);
        },
        /**
         * Unformats a numeric string; removes currency signs, thousands separators and normalises decimal separators.
         * @param {string} numericString the numeric string to unformat
         * @returns {string} the unformatted string
         */
        "unformat": function (numericString) {
            var settings = this.settings;

            numericString = numericString.replace(settings.currencySign, "");
            numericString = numericString.replace(settings.thousandsSeparator, "");
            numericString = numericString.replace(settings.decimalSeparator, ".");

            return numericString;
        }
    };
})();

(function () {
    "use strict";

    var
        defaultNumericHelper = new valerie.NumericHelper(),
        dateExpression = /^(\d\d?)(?:\-|\/|\.)(\d\d?)(?:\-|\/|\.)(\d\d\d\d)$/,
        emailExpression = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    // Shortcuts.
        pad = valerie.formatting.pad,
        converters = valerie.converters = valerie.converters || {};

    /**
     * A converter for dates.<br/>
     * By default date strings in <code>dd/mm/yyyy</code> or <code>dd-mm-yyyy</code> formats can be parsed.<br/>
     * By setting <b>valerie.converters.date.monthBeforeDate</b> to <code>true</code> date strings in
     * <code>mm/dd/yyyy</code> or <code>mm-dd-yyyy</code> can be parsed.</br>
     * <i>[full]</i>
     * @name valerie.converters~date
     * @type valerie.IConverter
     */
    converters.date = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            var firstPart,
                secondPart;
            
            if (converters.date.monthBeforeDate) {
                firstPart = value.getMonth() + 1;
                secondPart = value.getDate();
            } else {
                firstPart = value.getDate();
                secondPart = value.getMonth() + 1;
            }
            
            return pad(firstPart, "0", 2) + "/" + pad(secondPart, "0", 2) + "/" + value.getFullYear();
        },
        "parse": function (value) {
            if (value == null) {
                return null;
            }

            var matches = value.match(dateExpression);

            if (matches == null) {
                return null;
            }

            var firstPart = parseInt(matches[1], 10),
                secondPart = parseInt(matches[2], 10),
                date,
                month,
                year = parseInt(matches[3], 10);

            if (converters.date.monthBeforeDate) {
                date = secondPart;
                month = firstPart;
            } else {
                date = firstPart;
                month = secondPart;
            }

            month--;

            value = new Date(year, month, date);

            if (value.getFullYear() !== year || value.getMonth() !== month || value.getDate() !== date) {
                return null;
            }

            return value;
        },
        /**
         * Controls whether dd/mm/yyyy or mm/dd/yyyy are acceptable date formats.
         * @name valerie.converters.date#monthBeforeDate
         * @type {boolean}
         */
        "monthBeforeDate": false
    };

    /**
     * The default numerical helper used by converters.
     * @type {valerie.NumericHelper}
     */
    converters.defaultNumericHelper = defaultNumericHelper;

    /**
     * A converter for currency values with only major units, for example: <code>£1,093</code>, <code>$1093</code>,
     * <code>1.093</code>.<br/>
     * Currency string values are parsed into <code>float</code> values.<br/>
     * <b>valerie.converters.currency.numericHelper</b> is used to parse and format values; this is defaulted to
     * <b>valerie.converters.defaultNumericHelper</b>.<br/>
     * <i>[full]</i>
     * @name valerie.converters~currencyMajor
     * @type valerie.IConverter
     */
    converters.currencyMajor = {
        "format": function (value, format) {
            return converters.currency.numericHelper.format(value, format);
        },
        "parse": function (value) {
            var numericHelper = converters.currency.numericHelper;

            if (!numericHelper.isCurrencyMajor(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    /**
     * A converter for currency values with major and optionally minor units, for example: <code>£93</code>,
     * <code>$93.22</code>, <code>1,093.00</code>, <code>1.293,22</code>.<br/>
     * Currency string values are parsed into <code>float</code> values.<br/>
     * <b>valerie.converters.currency.numericHelper</b> is used to parse and format values; this is defaulted to
     * <b>valerie.converters.defaultNumericHelper</b>.<br/>
     * <i>[full]</i>
     * @name valerie.converters~currencyMajorMinor
     * @type valerie.IConverter
     */
    converters.currencyMajorMinor = {
        "format": function (value, format) {
            return converters.currency.numericHelper.format(value, format);
        },
        "parse": function (value) {
            var numericHelper = converters.currency.numericHelper;

            if (!numericHelper.isCurrencyMajorMinor(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    /**
     * The default numerical helper used by converters that convert currency values.
     * @type {valerie.NumericHelper}
     */
    converters.currency = { "numericHelper": defaultNumericHelper };

    /**
     * A converter for e-mail addresses.<br/>
     * <i>[full]</i>
     * @name valerie.converters~email
     * @type valerie.IConverter
     */
    converters.email = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value;
        },
        "parse": function (value) {
            if (value == null) {
                return null;
            }
            
            if (!emailExpression.test(value)) {
                return null;
            }

            return value.toLowerCase();
        }
    };

    /**
     * A converter for non-integer number values.<br/>
     * <i>[full]</i>
     * @name valerie.converters~float
     * @type valerie.IConverter
     */
    converters.float = {
        "format": function (value, format) {
            return converters.float.numericHelper.format(value, format);
        },
        "parse": function (value) {
            var numericHelper = converters.float.numericHelper;

            if (!numericHelper.isFloat(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    /**
     * The default numerical helper used by the <b>valerie.converters.float</b> converter.
     * @type {valerie.NumericHelper}
     */
    converters.float.numericHelper = defaultNumericHelper;

    /**
     * A converter for integer values.<br/>
     * <i>[full]</i>
     * @name valerie.converters~integer
     * @type valerie.IConverter
     */
    converters.integer = {
        "format": function (value, format) {
            return converters.integer.numericHelper.format(value, format);
        },
        "parse": function (value) {
            var numericHelper = converters.integer.numericHelper;

            if (!numericHelper.isInteger(value)) {
                return null;
            }

            return numericHelper.parse(value);
        }
    };

    /**
     * The default numerical helper used by the <b>valerie.converters.integer</b> converter.
     * @type {valerie.NumericHelper}
     */
    converters.integer.numericHelper = defaultNumericHelper;

    /**
     * A converter for Javascript Number values.<br/>
     * <i>[full]</i>
     * @name valerie.converters~number
     * @type valerie.IConverter
     */
    converters.number = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value.toString();
        },
        "parse": function (value) {
            if (value == null) {
                return null;
            }

            value = Number(value);

            if (isNaN(value)) {
                return null;
            }

            return value;
        }
    };
})();

(function() {
    "use strict";

    /**
     * Contains rule classes for validating models and properties.
     * @namespace
     * @see valerie.IRule
     */
    valerie.rules = {};

    // Shortcuts.
    var utils = valerie.utils,
        formatting = valerie.formatting,
        rules = valerie.rules,
        passedValidationResult = valerie.ValidationResult.passedInstance;

    /**
     * Constructs a rule to test whether an array's length is within a permitted range.<br/>
     * <i>[full]</i>
     * @name valerie.rules.ArrayLength
     * @type valerie.IRule
     * @constructor
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted length
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted length
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.ArrayLength = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.ArrayLength.defaultOptions, options);

        //noinspection JSValidateTypes
        return new rules.Length(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.ArrayLength.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.ArrayLength.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    /**
     * Constructs a rule to test whether a date value is within a permitted time-span.<br/>
     * <i>[full]</i>
     * @name valerie.rules.During
     * @type valerie.IRule
     * @constructor
     * @param {date|function} minimumValueOrFunction a value or function that specifies the earliest permitted date
     * @param {date|function} maximumValueOrFunction a value or function that specifies the latest permitted date
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.During = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.During.defaultOptions, options);

        //noinspection JSValidateTypes
        return new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.During.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.During.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    /**
     * Constructs a rule to test whether a string value matches the given regular expression.<br/>
     * <i>[full]</i>
     * @name valerie.rules.Expression
     * @type valerie.IRule
     * @constructor
     * @param {string|RegExp} regularExpressionObjectOrString the regular expression
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Expression = function(regularExpressionObjectOrString, options) {
        this.expression = utils.isString(regularExpressionObjectOrString) ?
            new RegExp(regularExpressionObjectOrString) :
            regularExpressionObjectOrString;

        this.settings = utils.mergeOptions(rules.Expression.defaultOptions, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Expression.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Expression.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    rules.Expression.prototype = {
        "test": function(value) {
            var failureMessage;

            if (value != null) {
                if (this.expression.test(value)) {
                    return passedValidationResult;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                this.settings.failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return valerie.ValidationResult.createFailedResult(failureMessage);
        }
    };

    /**
     * Constructs a rule to test whether an object's <code>length</code> property is within a permitted range.<br/>
     * <i>[full]</i>
     * @name valerie.rules.Length
     * @type valerie.IRule
     * @constructor
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted value
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Length = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.Length.defaultOptions, options);

        var rangeRule = new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options);

        this.test = function(value) {
            var length;

            if (value != null && value.hasOwnProperty("length")) {
                length = value.length;
            }

            return rangeRule.test(length);
        };

        this.settings = rangeRule.settings;
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Length.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Length.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    /**
     * Constructs a rule to test whether a value matches another.<br/>
     * <i>[full]</i>
     * @name valerie.rules.Matches
     * @type valerie.IRule
     * @constructor
     * @param {*} permittedValueOrFunction a value or function that specifies the permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Matches = function(permittedValueOrFunction, options) {
        options = utils.mergeOptions(rules.Matches.defaultOptions, options);

        return new rules.OneOf([permittedValueOrFunction], options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Matches.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Matches.defaultOptions = {
        "failureMessageFormat": "",
        "formatter": valerie.converters.passThrough.format,
        "valueFormat": null
    };

    //noinspection FunctionWithInconsistentReturnsJS
    /**
     * Constructs a rule to test whether a value is not in a list of forbidden values.<br/>
     * <i>[full]</i>
     * @name valerie.rules.NoneOf
     * @type valerie.IRule
     * @constructor
     * @param {array} forbiddenValuesOrFunction a value or function that specifies the forbidden values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.NoneOf = function(forbiddenValuesOrFunction, options) {
        this.forbiddenValues = utils.asFunction(forbiddenValuesOrFunction);
        this.settings = utils.mergeOptions(rules.NoneOf.defaultOptions, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.NoneOf.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.NoneOf.defaultOptions = {
        "failureMessageFormat": "",
        "formatter": valerie.converters.passThrough.format,
        "valueFormat": null
    };

    rules.NoneOf.prototype = {
        "test": function(value) {
            var failureMessage,
                index,
                values = this.forbiddenValues();

            for (index = 0; index < values.length; index++) {
                if (value === values[index]) {
                    failureMessage = formatting.replacePlaceholders(
                        this.settings.failureMessageFormat, {
                            "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                        });

                    return valerie.ValidationResult.createFailedResult(failureMessage);
                }
            }

            return passedValidationResult;
        }
    };

    /**
     * Constructs a rule to test whether a value does not match another.<br>
     * <i>[full]</i>
     * @name valerie.rules.Not
     * @type valerie.IRule
     * @constructor
     * @param {*} forbiddenValueOrFunction a value or function that specifies the forbidden value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Not = function(forbiddenValueOrFunction, options) {
        options = utils.mergeOptions(rules.Not.defaultOptions, options);

        return new rules.NoneOf([forbiddenValueOrFunction], options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Not.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Not.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    /**
     * Constructs a rule to test whether a value is in a list of permitted values.<br/>
     * <i>[full]</i>
     * @name valerie.rules.OneOf
     * @type valerie.IRule
     * @constructor
     * @param {array} permittedValuesOrFunction a value or function that specifies the permitted values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.OneOf = function(permittedValuesOrFunction, options) {
        this.permittedValues = utils.asFunction(permittedValuesOrFunction);
        this.settings = utils.mergeOptions(rules.OneOf.defaultOptions, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.OneOf.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.OneOf.defaultOptions = {
        "failureMessageFormat": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    rules.OneOf.prototype = {
        "test": function(value) {
            var failureMessage,
                index,
                values = this.permittedValues();

            for (index = 0; index < values.length; index++) {
                if (value === values[index]) {
                    return passedValidationResult;
                }
            }

            failureMessage = formatting.replacePlaceholders(
                this.settings.failureMessageFormat, {
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return valerie.ValidationResult.createFailedResult(failureMessage);
        }
    };

    /**
     * Constructs a rule to test whether an value is within a permitted range.<br/>
     * <i>[full]</i>
     * @name valerie.rules.Range
     * @type valerie.IRule
     * @constructor
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted value
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.Range = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2 || arguments.length > 3) {
            throw "At least 2 arguments are expected.";
        }

        this.minimum = utils.asFunction(minimumValueOrFunction);
        this.maximum = utils.asFunction(maximumValueOrFunction);
        this.settings = utils.mergeOptions(rules.Range.defaultOptions, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.Range.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.Range.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };

    rules.Range.prototype = {
        "test": function(value) {
            var failureMessage,
                failureMessageFormat = this.settings.failureMessageFormat,
                maximum = this.maximum(),
                minimum = this.minimum(),
                haveMaximum = maximum != null,
                haveMinimum = minimum != null,
                haveValue = value != null,
                valueInsideRange = true;

            if (!haveMaximum && !haveMinimum) {
                return passedValidationResult;
            }

            if (haveValue) {
                if (haveMaximum) {
                    valueInsideRange = value <= maximum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMinimumOnly;
                }

                if (haveMinimum) {
                    valueInsideRange = valueInsideRange && value >= minimum;
                } else {
                    failureMessageFormat = this.settings.failureMessageFormatForMaximumOnly;
                }
            } else {
                valueInsideRange = false;
            }

            if (valueInsideRange) {
                return passedValidationResult;
            }

            failureMessage = formatting.replacePlaceholders(
                failureMessageFormat, {
                    "maximum": this.settings.valueFormatter(maximum, this.settings.valueFormat),
                    "minimum": this.settings.valueFormatter(minimum, this.settings.valueFormat),
                    "value": this.settings.valueFormatter(value, this.settings.valueFormat)
                });

            return valerie.ValidationResult.createFailedResult(failureMessage);
        }
    };

    /**
     * Constructs a rule to test whether a string's length is within a permitted range.<br/>
     * <i>[full]</i>
     * @name valerie.rules.StringLength
     * @type valerie.IRule
     * @constructor
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted length
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted length
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     */
    rules.StringLength = function(minimumValueOrFunction, maximumValueOrFunction, options) {
        if (arguments.length < 2) {
            throw "At least 2 arguments are expected.";
        }

        options = utils.mergeOptions(rules.StringLength.defaultOptions, options);

        //noinspection JSValidateTypes
        return new rules.Length(minimumValueOrFunction, maximumValueOrFunction, options);
    };

    /**
     * The default options for the rule.
     * @name valerie.rules.StringLength.defaultOptions
     * @type {valerie.IRule.options}
     */
    rules.StringLength.defaultOptions = {
        "failureMessageFormat": "",
        "failureMessageFormatForMinimumOnly": "",
        "failureMessageFormatForMaximumOnly": "",
        "valueFormat": null,
        "valueFormatter": valerie.converters.passThrough.format
    };
})();

(function () {
    "use strict";

    // Shortcuts.
    var utils = valerie.utils,
        converters = valerie.converters,
        prototype = valerie.PropertyValidationState.prototype;

    /**
     * Validate the property using <b>valerie.converters.currencyMajor</b>.<br/>
     * <b>valerie.PropertyValidationState.prototype.currencyMajor.defaultOptions</b> holds the default options used by
     * this fluent method.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#currencyMajor
     * @method
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to apply to the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.currencyMajor = function (options) {
        options = utils.mergeOptions(this.currencyMajor.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.currencyMajor;

        return this;
    };

    prototype.currencyMajor.defaultOptions = {
        "entryFormat": null,
        "valueFormat": "C,"
    };

    /**
     * Validate the property using <b>valerie.converters.currencyMajorMinor</b>.<br/>
     * <b>valerie.PropertyValidationState.prototype.currencyMajorMinor.defaultOptions</b> holds the default options used
     * by this fluent method.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#currencyMajorMinor
     * @method
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to apply to the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.currencyMajorMinor = function (options) {
        options = utils.mergeOptions(this.currencyMajorMinor.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.currencyMajorMinor;

        return this;
    };

    prototype.currencyMajorMinor.defaultOptions = {
        "entryFormat": ".c",
        "valueFormat": "C,.c"
    };

    /**
     * Validate the property using <b>valerie.converters.date</b>.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#date
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.date = function () {
        this.settings.converter = converters.date;

        return this;
    };

    /**
     * Validate the property using <b>valerie.converters.email</b>.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#email
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.email = function () {
        this.settings.converter = converters.email;

        return this;
    };

    /**
     * Validate the property using <b>valerie.converters.float</b>.<br/>
     * <b>valerie.PropertyValidationState.prototype.float.defaultOptions</b> holds the default options used by this
     * fluent method.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#float
     * @method
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to apply to the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.float = function (options) {
        options = utils.mergeOptions(this.float.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.float;

        return this;
    };

    prototype.float.defaultOptions = {
        "entryFormat": null,
        "valueFormat": ",."
    };

    /**
     * Validate the property using <b>valerie.converters.integer</b>.<br/>
     * <b>valerie.PropertyValidationState.prototype.integer.defaultOptions</b> holds the default options used by this
     * fluent method.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#integer
     * @method
     * @param {valerie.PropertyValidationState.options} [options = default options] the options to apply to the
     * validation state
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.integer = function (options) {
        options = utils.mergeOptions(this.integer.defaultOptions, options);
        this.settings = utils.mergeOptions(this.settings, options);
        this.settings.converter = converters.integer;

        return this;
    };

    prototype.integer.defaultOptions = {
        "entryFormat": null,
        "valueFormat": ","
    };

    /**
     * Validate the property using <b>valerie.converters.number</b>.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#number
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.number = function () {
        this.settings.converter = converters.number;

        return this;
    };

    /**
     * Validate the property using <b>valerie.converters.passThrough</b>.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#string
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.string = function () {
        this.settings.converter = converters.passThrough;

        return this;
    };
})();

(function () {
    "use strict";

    // Shortcuts.
    var prototype = valerie.PropertyValidationState.prototype,
        rules = valerie.rules;

    /**
     * Validate the property further by checking its value falls between two permitted dates.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#during
     * @method
     * @param {date|function} earliestValueOrFunction a value or function that specifies the earliest permitted date
     * @param {date|function} latestValueOrFunction a value or function that specifies the latest permitted date
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.during = function (earliestValueOrFunction, latestValueOrFunction, options) {
        return this.addRule(new rules.During(earliestValueOrFunction, latestValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value is not before a permitted date.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#earliest
     * @method
     * @param {date|function} earliestValueOrFunction a value or function that specifies the earliest permitted date
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.earliest = function (earliestValueOrFunction, options) {
        return this.addRule(new rules.During(earliestValueOrFunction, null, options));
    };

    /**
     * Validate the property further by checking its value matches a regular expression.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#expression
     * @method
     * @param {string|RegExp} regularExpressionObjectOrString the regular expression
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.expression = function (regularExpressionObjectOrString, options) {
        return this.addRule(new rules.Expression(regularExpressionObjectOrString, options));
    };

    /**
     * Validate the property further by checking its value is not after a permitted date.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#latest
     * @method
     * @param {date|function} latestValueOrFunction a value or function that specifies the latest permitted date
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.latest = function (latestValueOrFunction, options) {
        return this.addRule(new rules.During(null, latestValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its length is within a certain range.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#lengthBetween
     * @method
     * @param {number|function} shortestValueOrFunction a value or function that specifies the shortest permitted length
     * @param {number|function} longestValueOrFunction a value or function that specifies the longest permitted length
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.lengthBetween = function (shortestValueOrFunction, longestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(shortestValueOrFunction, longestValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value matches another.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#matches
     * @method
     * @param {*} permittedValueOrFunction a value or function that specifies the permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.matches = function (permittedValueOrFunction, options) {
        return this.addRule(new rules.Matches(permittedValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value doesn't exceed a maximum.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#maximum
     * @method
     * @param {*|function} maximumValueOrFunction the value or function that specifies the permitted maximum
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.maximum = function (maximumValueOrFunction, options) {
        return this.addRule(new rules.Range(null, maximumValueOrFunction, options));
    };

    /**
     * Validate the property further by checking the number of items it has doesn't exceed a maximum.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#maximumNumberOfItems
     * @method
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum number of items
     * permitted
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.maximumNumberOfItems = function (maximumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(null, maximumValueOrFunction, options));
    };

    /**
     * Validate the property further by checking it isn't too long.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#maximumLength
     * @method
     * @param {number|function} longestValueOrFunction a value or function that specifies the maximum length permitted
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.maximumLength = function (longestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(null, longestValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value doesn't exceed a minimum.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#minimum
     * @method
     * @param {*|function} minimumValueOrFunction the value or function that specifies the permitted minimum
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.minimum = function (minimumValueOrFunction, options) {
        return this.addRule(new rules.Range(minimumValueOrFunction, null, options));
    };

    /**
     * Validate the property further by checking the number of items it has doesn't exceed a minimum.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#minimumNumberOfItems
     * @method
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum number of items
     * permitted
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.minimumNumberOfItems = function (minimumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(minimumValueOrFunction, null, options));
    };

    /**
     * Validate the property further by checking it isn't too short.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#minimumLength
     * @method
     * @param {number|function} shortestValueOrFunction a value or function that specifies the minimum length permitted
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.minimumLength = function (shortestValueOrFunction, options) {
        return this.addRule(new rules.StringLength(shortestValueOrFunction, null, options));
    };

    /**
     * Validate the property further by checking its value is not in a list of forbidden values.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#noneOf
     * @method
     * @param {array|function} forbiddenValuesOrFunction a value or function that specifies the forbidden values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.noneOf = function (forbiddenValuesOrFunction, options) {
        return this.addRule(new rules.NoneOf(forbiddenValuesOrFunction, options));
    };

    /**
     * Validate the property further by checking its value does not match another.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#not
     * @method
     * @param {*} forbiddenValueOrFunction a value or function that specifies the forbidden values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.not = function (forbiddenValueOrFunction, options) {
        return this.addRule(new rules.Not(forbiddenValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its number of items hasn't exceed a minimum or maximum number.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#numberOfItems
     * @method
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum number of items
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum number of items
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.numberOfItems = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        return this.addRule(new rules.ArrayLength(minimumValueOrFunction, maximumValueOrFunction, options));
    };

    /**
     * Validate the property further by checking its value is in a list of permitted values.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#oneOf
     * @method
     * @param {array|function} permittedValuesOrFunction a value or function that specifies the permitted values
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.oneOf = function (permittedValuesOrFunction, options) {
        return this.addRule(new rules.OneOf(permittedValuesOrFunction, options));
    };

    /**
     * Validate the property further by checking its value doesn't exceed a minimum or maximum value.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#range
     * @method
     * @param {number|function} minimumValueOrFunction a value or function that specifies the minimum permitted value
     * @param {number|function} maximumValueOrFunction a value or function that specifies the maximum permitted value
     * @param {valerie.IRule.options} [options] the options to use when constructing the rule
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.range = function (minimumValueOrFunction, maximumValueOrFunction, options) {
        return this.addRule(new rules.Range(minimumValueOrFunction, maximumValueOrFunction, options));
    };

    /**
     * Validate the property further by add an ad-hoc rule to the rule-chain.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#rule
     * @method
     * @param {function} testFunction the function to use to test the property's value
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.rule = function (testFunction) {
        return this.addRule({
            "settings": {
            },
            "test": function (value) {
                return testFunction(value);
            }
        });
    };

    /**
     * Sets the message to show if the rule last added to the validation state's rule-chain fails.<br/>
     * <i>[fluent, full]</i>
     * @name valerie.PropertyValidationState#ruleMessage
     * @method
     * @param {string} failureMessageFormat the format for the validation message
     * @return {valerie.PropertyValidationState} the validation state
     */
    prototype.ruleMessage = function (failureMessageFormat) {
        var stateRules = this.settings.rules,
            index = stateRules.length - 1,
            rule;

        if (index >= 0) {
            rule = stateRules[index];
            rule.settings.failureMessageFormat = failureMessageFormat;
        }

        return this;
    };
})();

(function () {
    "use strict";
    
    var defaultOptions;

    valerie.ModelValidationState.defaultOptions.failureMessageFormat = "There are validation errors.";

    defaultOptions = valerie.PropertyValidationState.defaultOptions;
    defaultOptions.invalidEntryFailureMessage = "The value entered is invalid.";
    defaultOptions.missingFailureMessage = "A value is required.";
})();

(function () {
    "use strict";

    var rules = valerie.rules,
        defaultOptions;

    defaultOptions = rules.ArrayLength.defaultOptions;
    defaultOptions.failureMessageFormat = "There must be between {minimum} and {maximum} items.";
    defaultOptions.failureMessageFormatForMinimumOnly = "There must be at least {minimum} items.";
    defaultOptions.failureMessageFormatForMaximumOnly = "There must be at most {maximum} items.";

    defaultOptions = rules.During.defaultOptions;
    defaultOptions.failureMessageFormat = "The value must be between {minimum} and {maximum}.";
    defaultOptions.failureMessageFormatForMinimumOnly = "The value must be {minimum} at the earliest.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The value must be {maximum} at the latest.";

    defaultOptions = rules.Expression.defaultOptions;
    defaultOptions.failureMessageFormat = "The value is invalid.";

    defaultOptions = rules.Length.defaultOptions;
    defaultOptions.failureMessageFormat = "The length must be between {minimum} and {maximum}.";
    defaultOptions.failureMessageFormatForMinimumOnly = "The length must be no less than {minimum}.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The length must be no greater than {maximum}.";

    defaultOptions = rules.Matches.defaultOptions;
    defaultOptions.failureMessageFormat = "The value does not match.";

    defaultOptions = rules.NoneOf.defaultOptions;
    defaultOptions.failureMessageFormat = "The value is not allowed.";

    defaultOptions = rules.Not.defaultOptions;
    defaultOptions.failureMessageFormat = "The value is not allowed.";

    defaultOptions = rules.OneOf.defaultOptions;
    defaultOptions.failureMessageFormat = "The value does not match.";

    defaultOptions = rules.Range.defaultOptions;
    defaultOptions.failureMessageFormat = "The value must be between {minimum} and {maximum}.";
    defaultOptions.failureMessageFormatForMinimumOnly = "The value must be no less than {minimum}.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The value must be no greater than {maximum}.";

    defaultOptions = rules.StringLength.defaultOptions;
    defaultOptions.failureMessageFormat = "The value must have between {minimum} and {maximum} characters.";
    defaultOptions.failureMessageFormatForMinimumOnly = "The value must have at least {minimum} characters.";
    defaultOptions.failureMessageFormatForMaximumOnly = "The value have at most {maximum} characters.";
})();

(function () {
    "use strict";

    valerie.converters.defaultNumericHelper.init(".", ",", "£", "2");
})();
(function () {
    "use strict";

    var converters = valerie.converters = valerie.converters || {},
        postcodeExpression = /^([A-Z][A-Z]?)((?:[0-9][A-Z])|(?:[0-9]{1,2}))\s*([0-9])([A-Z][A-Z])$/i;

    /**
     * A converter for postcodes.<br/>
     * <i>[full, en-gb]</i>
     * @name valerie.converters~postcode
     * @type valerie.IConverter
     */
    converters.postcode = {
        "format": function (value) {
            if (value == null) {
                return "";
            }

            return value;
        },
        "parse": function (value) {
            if (value == null) {
                return null;
            }

            var matches = value.match(postcodeExpression);

            if (matches == null) {
                return null;
            }

            return (matches[1] + matches[2] + " " + matches[3] + matches[4]).toUpperCase();
        }
    };
})();

(function () {
    "use strict";

    /**
     * Validate the property using <b>valerie.converters.postcode</b>.<br/>
     * <i>[fluent, full, en-gb]</i>
     * @name valerie.PropertyValidationState#postcode
     * @method
     * @return {valerie.PropertyValidationState} the validation state
     */
    valerie.PropertyValidationState.prototype.postcode = function () {
        this.settings.converter = valerie.converters.postcode;

        return this;
    };
})();
