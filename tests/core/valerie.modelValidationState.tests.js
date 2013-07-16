describe("ModelValidationState", function () {
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

    var pendingRule = {
        "test": function () {
            return valerie.ValidationResult.pendingInstance;
        }
    };


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
});