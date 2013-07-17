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
    });

    describe("passed", function () {
        it("should be true when the property does not require a value and does not have one", function () {
            var property = ko.observable(),
                validationState = new valerie.PropertyValidationState(property, {
                    "converter": valerie.converters.integer,
                    "required": false,
                    "rules": [
                        new valerie.rules.Range(10, 50)
                    ]
                });

            expect(validationState.passed()).toBeTruthy();
        });

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

    describe("result", function () {
        it("should be affected by the converter attached to the validation state", function () {
            var property = ko.observable("123"),
                validationState = new valerie.PropertyValidationState(property, {
                    "converter": valerie.converters.postcode,
                    "required": true
                });

            expect(validationState.result().state).toEqual(ValidationResult.states.failed);

            property("RM10 7XL");
            expect(validationState.result().state).toEqual(ValidationResult.states.passed);
        });

        it("should be affected by the rules attached to the validation state", function () {
            var property = ko.observable("123"),
                validationState = new valerie.PropertyValidationState(property, {
                    "required": true,
                    "rules": [
                        new valerie.rules.StringLength(5, null)
                    ]
                });

            expect(validationState.result().state).toEqual(ValidationResult.states.failed);

            property("12345");
            expect(validationState.result().state).toEqual(ValidationResult.states.passed);
        });
    });

    describe("showMessage", function () {
        it("should return true if the property has an invalid state, is applicable and touched", function () {
            var property = ko.observable(),
                validationState = new valerie.PropertyValidationState(property, {
                    "required": true
                });

            validationState.touched(true);
            expect(validationState.showMessage()).toBeTruthy();
        });

        it("should always return false if the property is inapplicable", function () {
            var property = ko.observable(),
                validationState = new valerie.PropertyValidationState(property, {
                    "applicable": false,
                    "required": true
                });

            validationState.touched(true);
            expect(validationState.showMessage()).toBeFalsy();
        });
    });

    describe("validatableProperty", function () {
        it("should make the passed in property validatable", function () {
            var property = ko.observable();

            valerie.validatableProperty(property);
            expect(property.validation()).not.toBeNull();

        });
    });

    describe("fluent methods", function () {
        describe("addRule", function () {
            it("should append the given rule to the list of rules held against the validation state", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable());

                expect(validationState.settings.rules.length).toEqual(0);

                validationState.addRule(new valerie.rules.StringLength(5, null));
                expect(validationState.settings.rules[0].prototype === valerie.rules.StringLength.prototype);

                validationState.addRule(new valerie.rules.ArrayLength(5, null));
                expect(validationState.settings.rules[0].prototype === valerie.rules.StringLength.prototype);
                expect(validationState.settings.rules[1].prototype === valerie.rules.ArrayLength.prototype);
            });
        });

        describe("applicable", function () {
            it("should set the function used to determine the applicability of the property", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable());

                expect(validationState.settings.applicable()).toBeTruthy();

                validationState.applicable(false);
                expect(validationState.settings.applicable()).toBeFalsy();
            });
        });

        describe("end", function () {
            it("should return the property", function() {
                var property = ko.observable(),
                    validationState = new valerie.PropertyValidationState(property);

                expect(validationState.end() === property);
            });

            it("should set the value format for all rules attached to the validation state", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable(), {
                    "required": true,
                    "rules": [
                        new valerie.rules.ArrayLength(5, null),
                        new valerie.rules.StringLength(5, null)
                    ],
                    "valueFormat": "test"
                });

                expect(validationState.settings.rules[0].settings.valueFormat === null &&
                    validationState.settings.rules[1].settings.valueFormat === null).toBeTruthy();

                validationState.end();

                expect(validationState.settings.rules[0].settings.valueFormat === "test" &&
                    validationState.settings.rules[1].settings.valueFormat === "test").toBeTruthy();
            });
        });

        describe("entryFormat", function () {
            it("should set the entryFormat setting", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable());

                validationState.entryFormat("test");
                expect(validationState.settings.entryFormat).toEqual("test");
            });
        });

        describe("excludeFromSummary", function () {
            it("should set the excludeFromSummary setting", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable());
                expect(validationState.settings.excludeFromSummary).toBeFalsy();

                validationState.excludeFromSummary();
                expect(validationState.settings.excludeFromSummary).toBeTruthy();
            });
        });

        describe("name", function () {
            it("should set the name setting", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable());
                expect(validationState.settings.name()).toBeUndefined();

                validationState.name("test");
                expect(validationState.settings.name()).toEqual("test");
            });
        });

        describe("required", function () {
            it("should set the required setting", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable());
                expect(validationState.settings.required()).toBeFalsy();

                validationState.required(function() { return true; });
                expect(validationState.settings.required()).toBeTruthy();
            });

            it("should set the required setting to return true without a parameter", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable());
                expect(validationState.settings.required()).toBeFalsy();

                validationState.required();
                expect(validationState.settings.required()).toBeTruthy();
            });
        });

        describe("valueFormat", function () {
            it("should set the valueFormat setting", function () {
                var validationState = new valerie.PropertyValidationState(ko.observable());

                validationState.valueFormat("test");
                expect(validationState.settings.valueFormat).toEqual("test");
            });
        });
    })
});
