(function () {
    "use strict";

    // Shortcuts.
    var utils = valerie.utils,
        copyFunction = function (sourceModel, destinationModel, index, includeWrappedFunction, includeUnwrappedFunction) {
            var value = sourceModel[index];

            if (includeWrappedFunction(value, sourceModel, index)) {
                //noinspection JSUnresolvedFunction
                value = ko.utils.unwrapObservable(value);

                if (includeUnwrappedFunction(value, sourceModel, index)) {
                    if (utils.isArrayOrObject(value)) {
                        destinationModel[index] = valerie.mapModel(value, includeWrappedFunction, includeUnwrappedFunction);
                    }
                    else {
                        destinationModel[index] = value;
                    }
                }
            }
        },
        defaultIncludeFunction = function () {
            return true;
        };

    /**
     * Maps a source model to a destination model.
     * @param {Object|Array} sourceModel the source model
     * @param {valerie.includePropertyCallback} [includeWrappedFunction] a function called before each source model
     * property is unwrapped, the result of which determines if the property is included in the destination model
     * @param {valerie.includePropertyCallback} [includeUnwrappedFunction] a function called after each source
     * model property is unwrapped, the result of which determines if the property is included in the destination model
     * @return {*} the destination model
     */
    valerie.mapModel = function (sourceModel, includeWrappedFunction, includeUnwrappedFunction) {
        if (!utils.isArrayOrObject(sourceModel)) {
            throw "The source model must be an array or an object.";
        }

        includeWrappedFunction = includeWrappedFunction || defaultIncludeFunction;
        includeUnwrappedFunction = includeUnwrappedFunction || defaultIncludeFunction;

        var destinationModel,
            index;

        if (utils.isArray(sourceModel)) {
            destinationModel = [];

            for (index = 0; index < sourceModel.length; index++) {
                copyFunction(sourceModel, destinationModel, index, includeWrappedFunction, includeUnwrappedFunction);
            }
        }
        else {
            destinationModel = {};

            for (index in sourceModel) {
                if (sourceModel.hasOwnProperty(index)) {
                    copyFunction(sourceModel, destinationModel, index, includeWrappedFunction, includeUnwrappedFunction);
                }
            }
        }

        return destinationModel;
    };

    /**
     * Maps a source model to a destination model, including only applicable properties
     * @param {Object|Array} sourceModel the source model
     * @return {*} the destination model
     */
    valerie.mapApplicableModel = function (sourceModel) {
        return valerie.mapModel(sourceModel, function (value, sourceModel, index) {
            if (valerie.validationState.has(value)) {
                return value.validation().isApplicable();
            }

            return true;
        });
    };

    /**
     * Include callback used by valerie model mapping functions.
     * @callback valerie.includePropertyCallback
     * @param {*} value the value of the property
     * @param {Object|Array} sourceModel the source model the property belongs to
     * @param {string|Number} index the name or index of the property
     * @return {boolean} <code>true</code> if the property should be included in the destination model
     */
})();
