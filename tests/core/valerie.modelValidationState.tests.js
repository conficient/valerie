describe("ModelValidationState", function () {
    var ValidationResult = valerie.ValidationResult;

    function createTwoValidPropertyValidationStates() {
        return [
            new valerie.PropertyValidationState(ko.observable()),
            new valerie.PropertyValidationState(ko.observable())
        ];
    }

    function createAnInvalidAndAValidPropertyValidationStates() {
        return [
            new valerie.PropertyValidationState(ko.observable()),
            new valerie.PropertyValidationState(ko.observable(), {"required": true})
        ];
    }

    function createNestedModel() {
        return valerie.validatableModel({
            "property1": ko.observable().validate().end(),
            "subModel": valerie.validatableModel({
                "property2": ko.observable().validate().end()
            }).end()
        }).end();
    }

    var pendingRule = {
        "test": function () {
            return valerie.ValidationResult.pendingInstance;
        }
    };

    describe("failed, message, passed and pending", function () {
        it("should all derive from result", function () {
            var validationState = new valerie.ModelValidationState({}, {
                "failureMessageFormat": "failed"
            });

            validationState.addValidationStates(createTwoValidPropertyValidationStates());

            expect(validationState.result().state === ValidationResult.states.failed).toEqual(validationState.failed());
            expect(validationState.result().state === ValidationResult.states.passed).toEqual(validationState.passed());
            expect(validationState.result().state === ValidationResult.states.pending).toEqual(validationState.pending());
            expect(validationState.result().message === validationState.message());

            validationState.addValidationStates(createAnInvalidAndAValidPropertyValidationStates());
            expect(validationState.result().state === ValidationResult.states.failed).toEqual(validationState.failed());
            expect(validationState.result().state === ValidationResult.states.passed).toEqual(validationState.passed());
            expect(validationState.result().state === ValidationResult.states.pending).toEqual(validationState.pending());
            expect(validationState.result().message === validationState.message() === "failed");
        });
    });

    describe("failed", function () {
        it("should return true if any of the validation states have failed validation", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createAnInvalidAndAValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            expect(modelValidationState.failed()).toBeTruthy();
        });

        it("should return false if none of the validation states have failed validation", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createTwoValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            expect(modelValidationState.failed()).toBeFalsy();
        });
    });

    describe("failedStates", function () {
        it("should return the states that have failed validation", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createAnInvalidAndAValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            expect(modelValidationState.failedStates()[0]).toEqual(propertyValidationStates[1]);
        });
    });

    describe("passed", function () {
        it("should return true if all of the validation states have passed validation", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createTwoValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            expect(modelValidationState.passed()).toBeTruthy();
        });

        it("should return false if any of the validation states haven't passed validation", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createAnInvalidAndAValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            expect(modelValidationState.passed()).toBeFalsy();
        });
    });

    describe("message", function () {
        it("should contain a formatted message if any of the validation states have failed validation", function () {
            var modelValidationState = new valerie.ModelValidationState({}, {
                    "failureMessageFormat": "failed"
                }),
                propertyValidationStates = createAnInvalidAndAValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            expect(modelValidationState.message()).toEqual("failed");
        });

        it("should be empty if none of the validation states have failed validation", function () {
            var modelValidationState = new valerie.ModelValidationState({}, {
                    "failureMessageFormat": "failed"
                }),
                propertyValidationStates = createTwoValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            expect(modelValidationState.message()).toEqual("");
        });
    });

    describe("pending", function () {
        it("should return true of any of the validation states have a state of pending", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createTwoValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            modelValidationState.addValidationStates(new valerie.PropertyValidationState(ko.observable("jim"), {
                "rules": [pendingRule]}));

            expect(modelValidationState.pending()).toBeTruthy();
        });

        it("should return false if none of the validation states have a state of pending", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createAnInvalidAndAValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            expect(modelValidationState.pending()).toBeFalsy();
        });
    });

    describe("pendingStates", function () {
        it("should contain the validation states that have a state of pending", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createTwoValidPropertyValidationStates(),
                pendingValidationState = new valerie.PropertyValidationState(ko.observable("jim"), {
                    "rules": [pendingRule]});

            modelValidationState.addValidationStates(propertyValidationStates);
            modelValidationState.addValidationStates(pendingValidationState);

            expect(modelValidationState.pendingStates()[0]).toEqual(pendingValidationState);
        });
    });

    describe("touched", function () {
        it("should return false initially", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createTwoValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);

            expect(modelValidationState.touched()).toBeFalsy();
        });

        it("should return true if any one of the validation states are touched", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createTwoValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);

            expect(modelValidationState.touched()).toBeFalsy();

            modelValidationState.validationStates()[0].touched(true);

            expect(modelValidationState.touched()).toBeTruthy();
        });

        it("should set all of its validation states to be touched", function () {
            var modelValidationState = new valerie.ModelValidationState({}),
                propertyValidationStates = createTwoValidPropertyValidationStates();

            modelValidationState.addValidationStates(propertyValidationStates);
            modelValidationState.touched(true);

            expect(propertyValidationStates[0].touched() && propertyValidationStates[1]).toBeTruthy();
        });
    });

    describe("fluent methods", function () {
        describe("addValidationStates", function () {
            it("should be able to add a single or multiples validation state", function () {
                var validationState = new valerie.ModelValidationState({});

                expect(validationState.validationStates().length).toEqual(0);

                validationState.addValidationStates(new valerie.PropertyValidationState(ko.observable()));
                expect(validationState.validationStates().length).toEqual(1);

                validationState.addValidationStates(createTwoValidPropertyValidationStates());
                expect(validationState.validationStates().length).toEqual(3);
            });
        });

        describe("applicable", function () {
            it("should set the function used to determine the applicability of the model", function () {
                var validationState = new valerie.ModelValidationState({});

                expect(validationState.settings.applicable()).toBeTruthy();

                validationState.applicable(false);
                expect(validationState.settings.applicable()).toBeFalsy();
            });
        });

        describe("clearSummary", function () {
            it("should result in the summary for the model being cleared", function () {
                var validationState = new valerie.ModelValidationState({});
                validationState.addValidationStates(createAnInvalidAndAValidPropertyValidationStates());

                validationState.updateSummary();
                expect(validationState.summary().length).toEqual(1);

                validationState.clearSummary();
                expect(validationState.summary().length).toEqual(0);
            });

            it("if requested, it should result in the summary for the model and sub-models being cleared", function () {
                var model = valerie.validatableModel({}).end(),
                    subModel = valerie.validatableModel({}).end();

                model.validation().addValidationStates(subModel.validation());
                subModel.validation().addValidationStates(createAnInvalidAndAValidPropertyValidationStates());

                model.validation().updateSummary(true);
                expect(subModel.validation().summary().length).toEqual(1);

                model.validation().clearSummary();
                expect(subModel.validation().summary().length).toEqual(1);

                model.validation().clearSummary(true);
                expect(subModel.validation().summary().length).toEqual(0);
            });
        });

        describe("end", function () {
            it("should return the model", function () {
                var model = ko.observable(),
                    validationState = new valerie.ModelValidationState(model);

                expect(validationState.end() === model);
            });
        });

        describe("includeInSummary", function () {
            it("should set the excludeFromSummary setting", function () {
                var validationState = new valerie.ModelValidationState({});
                expect(validationState.settings.excludeFromSummary).toBeTruthy();

                validationState.includeInSummary();
                expect(validationState.settings.excludeFromSummary).toBeFalsy();
            });
        });

        describe("name", function () {
            it("should set the name setting", function () {
                var validationState = new valerie.ModelValidationState({});
                expect(validationState.settings.name()).toEqual("(?)");

                validationState.name("test");
                expect(validationState.settings.name()).toEqual("test");
            });
        });

        describe("removeValidationStates", function () {
            it("should be able to remove single or multiple validation states", function () {
                var validationState = new valerie.ModelValidationState({}),
                    singlePropertyValidationState = new valerie.PropertyValidationState(ko.observable()),
                    twoPropertyValidationStates = createTwoValidPropertyValidationStates();

                expect(validationState.validationStates().length).toEqual(0);

                validationState.addValidationStates(singlePropertyValidationState);
                validationState.addValidationStates(twoPropertyValidationStates);

                validationState.removeValidationStates(singlePropertyValidationState);
                expect(validationState.validationStates().length).toEqual(2);

                validationState.removeValidationStates(twoPropertyValidationStates);
                expect(validationState.validationStates().length).toEqual(0);
            });
        });

        describe("startValidatingSubModel", function () {
            it("should add the validation state of the given sub-model", function () {
                var model = valerie.validatableModel({}).end(),
                    subModel = valerie.validatableModel({}).end();

                expect(model.validation().validationStates().length).toEqual(0);

                model.validation().startValidatingSubModel(subModel);
                expect(model.validation().validationStates().length).toEqual(1);
            });
        });

        describe("stopValidatingSubModel", function () {
            it("should remove the validation state of the given sub-model", function () {
                var model = valerie.validatableModel({}).end(),
                    subModel = valerie.validatableModel({}).end();

                model.validation().startValidatingSubModel(subModel);
                expect(model.validation().validationStates().length).toEqual(1);

                model.validation().stopValidatingSubModel(subModel);
                expect(model.validation().validationStates().length).toEqual(0);
            });
        });

        describe("updateSummary", function () {
            it("should result in the summary for the model being update", function () {
                var validationState = new valerie.ModelValidationState({});
                validationState.addValidationStates(createAnInvalidAndAValidPropertyValidationStates());

                validationState.updateSummary();
                expect(validationState.summary().length).toEqual(1);
            });

            it("if requested, it should result in the summary for the model and sub-models being updated", function () {
                var model = valerie.validatableModel({}).end(),
                    subModel = valerie.validatableModel({}).end();

                model.validation().addValidationStates(subModel.validation());
                subModel.validation().addValidationStates(createAnInvalidAndAValidPropertyValidationStates());

                model.validation().updateSummary(true);
                expect(subModel.validation().summary().length).toEqual(1);
            });
        });

        describe("validateAll", function () {
            it("should add properties, sub-models and descendant property and model validation states", function() {
                var model = createNestedModel();

                model.validation().validateAll();
                expect(model.validation().validationStates()).toContain(model.property1.validation());
                expect(model.validation().validationStates()).toContain(model.subModel.validation());
                expect(model.validation().validationStates()).toContain(model.subModel.property2.validation());
            });
        });

        describe("validateAllProperties", function () {
            it("should add properties and descendant property validation states", function() {
                var model = createNestedModel();

                model.validation().validateAllProperties();
                expect(model.validation().validationStates()).toContain(model.property1.validation());
                expect(model.validation().validationStates()).not.toContain(model.subModel.validation());
                expect(model.validation().validationStates()).toContain(model.subModel.property2.validation());
            });
        });

        describe("validateChildProperties", function () {
            it("should add child property validation states", function() {
                var model = createNestedModel();

                model.validation().validateChildProperties();
                expect(model.validation().validationStates()).toContain(model.property1.validation());
                expect(model.validation().validationStates()).not.toContain(model.subModel.validation());
                expect(model.validation().validationStates()).not.toContain(model.subModel.property2.validation());
            });
        });

        describe("validateChildPropertiesAndSubModels", function () {
            it("should add child properties and sub-model validation states", function() {
                var model = createNestedModel();

                model.validation().validateChildPropertiesAndSubModels();
                expect(model.validation().validationStates()).toContain(model.property1.validation());
                expect(model.validation().validationStates()).toContain(model.subModel.validation());
                expect(model.validation().validationStates()).not.toContain(model.subModel.property2.validation());
            });
        });
    })
});