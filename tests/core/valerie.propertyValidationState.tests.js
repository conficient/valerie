describe("PropertyValidationState", function () {
    var ValidationResult = valerie.ValidationResult;

    describe("applicable", function () {
        it("should be true be default", function () {
            var property = ko.observable(),
                validationState = new valerie.PropertyValidationState(property, {
                });

            expect(validationState.applicable()).toBeTruthy();
        });
    });

    describe("failed", function () {
        it("should be false when the property is in an invalid state", function () {
            var property = ko.observable("some value"),
                validationState = new valerie.PropertyValidationState(property, {
                    "required": true
                });

            expect(validationState.failed()).toBeFalsy();
        });

        it("should be true when the property is in an invalid state", function () {
            var property = ko.observable(),
                validationState = new valerie.PropertyValidationState(property, {
                    "required": true
                });

            expect(validationState.failed()).toBeTruthy();
        });
    });

    describe("failed, message, passed and pending", function () {
        it("should all derive from result", function () {
            var property = ko.observable("some value"),
                validationState = new valerie.PropertyValidationState(property, {
                    "missingFailureMessage": "value required",
                    "required": true
                });

            expect(validationState.result().state === ValidationResult.states.failed).toEqual(validationState.failed());
            expect(validationState.result().state === ValidationResult.states.passed).toEqual(validationState.passed());
            expect(validationState.result().state === ValidationResult.states.pending).toEqual(validationState.pending());
            expect(validationState.result().message === validationState.message());

            property("");
            expect(validationState.result().state === ValidationResult.states.failed).toEqual(validationState.failed());
            expect(validationState.result().state === ValidationResult.states.passed).toEqual(validationState.passed());
            expect(validationState.result().state === ValidationResult.states.pending).toEqual(validationState.pending());
            expect(validationState.result().message === validationState.message() === "value required");
        });

        it("should be true when the property is in an invalid state", function () {
            var property = ko.observable(),
                validationState = new valerie.PropertyValidationState(property, {
                    "required": true
                });

            expect(validationState.failed()).toBeTruthy();
        });
    });

    describe("passed", function () {
        it("should be true when the property is in a valid state", function () {
            var property = ko.observable("some value"),
                validationState = new valerie.PropertyValidationState(property, {
                    "required": true
                });

            expect(validationState.passed()).toBeTruthy();
        });

        it("should be false when the property is in an invalid state", function () {
            var property = ko.observable(),
                validationState = new valerie.PropertyValidationState(property, {
                    "required": true
                });

            expect(validationState.passed()).toBeFalsy();
        });
    });
});
