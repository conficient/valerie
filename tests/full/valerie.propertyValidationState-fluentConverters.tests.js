describe("PropertyValidationState - Fluent Converters", function () {
    describe("currencyMajor", function () {
        it("should change the property validation state to use the currencyMajor converter", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable()).currencyMajor();

            expect(propertyValidationState.settings.converter).toEqual(valerie.converters.currencyMajor);
        });
    });

    describe("currencyMajorMinor", function () {
        it("should change the property validation state to use the currencyMajorMinor converter", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable()).currencyMajorMinor();

            expect(propertyValidationState.settings.converter).toEqual(valerie.converters.currencyMajorMinor);
        });
    });

    describe("date", function () {
        it("should change the property validation state to use the date converter", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable()).date();

            expect(propertyValidationState.settings.converter).toEqual(valerie.converters.date);
        });
    });

    describe("email", function () {
        it("should change the property validation state to use the email converter", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable()).email();

            expect(propertyValidationState.settings.converter).toEqual(valerie.converters.email);
        });
    });

    describe("float", function () {
        it("should change the property validation state to use the float converter", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable()).float();

            expect(propertyValidationState.settings.converter).toEqual(valerie.converters["float"]);
        });
    });

    describe("integer", function () {
        it("should change the property validation state to use the integer converter", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable()).integer();

            expect(propertyValidationState.settings.converter).toEqual(valerie.converters.integer);
        });
    });

    describe("number", function () {
        it("should change the property validation state to use the number converter", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable()).number();

            expect(propertyValidationState.settings.converter).toEqual(valerie.converters.number);
        });
    });

    describe("string", function () {
        it("should change the property validation state to use the passThrough converter", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable()).string();

            expect(propertyValidationState.settings.converter).toEqual(valerie.converters.passThrough);
        });
    });
});