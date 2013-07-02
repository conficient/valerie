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
         * Sets the textual content for the given element.
         * @name valerie.koBindingsHelper#setInnerText
         * @param {string} text the text to use
         */
        "setTextContent": function (element, text) {
            ko.bindingHandlers.text.update(element, function () { return text; });
        },
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