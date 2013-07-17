describe("PropertyValidationState - Fluent Rules", function () {
    describe("during", function () {
        it("should add a Range rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .during(new Date(), null);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Range).toBeTruthy();
        });
    });

    describe("earliest", function () {
        it("should add a Range rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .earliest(new Date());

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Range).toBeTruthy();
        });
    });

    describe("expression", function () {
        it("should add an Expression rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .expression("{d}3");

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Expression).toBeTruthy();
        });
    });

    describe("latest", function () {
        it("should add a Range rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .latest(new Date());

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Range).toBeTruthy();
        });
    });

    describe("lengthBetween", function () {
        it("should add a Length rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .lengthBetween(1, 10);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Length).toBeTruthy();
        });
    });

    describe("matches", function () {
        it("should add a OneOf rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .matches("password");

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.OneOf).toBeTruthy();
        });
    });

    describe("maximum", function () {
        it("should add a Range rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .maximum(10);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Range).toBeTruthy();
        });
    });

    describe("maximumNumberOfItems", function () {
        it("should add a Length rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .maximumNumberOfItems(5);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Length).toBeTruthy();
        });
    });

    describe("maximumLength", function () {
        it("should add a StringLength rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .maximumLength(5);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Length).toBeTruthy();
        });
    });

    describe("minimum", function () {
        it("should add a Range rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .minimum(10);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Range).toBeTruthy();
        });
    });

    describe("minimumNumberOfItems", function () {
        it("should add a Length rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .minimumNumberOfItems(5);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Length).toBeTruthy();
        });
    });

    describe("minimumLength", function () {
        it("should add a Length rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .minimumLength(5);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Length).toBeTruthy();
        });
    });

    describe("noneOf", function () {
        it("should add a NoneOf rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .noneOf(["existing-user"]);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.NoneOf).toBeTruthy();
        });
    });

    describe("not", function () {
        it("should add a Not rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .not("existing-user");

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.NoneOf).toBeTruthy();
        });
    });


    describe("numberOfItems", function () {
        it("should add a Length rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .numberOfItems(5, 10);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Length).toBeTruthy();
        });
    });

    describe("oneOf", function () {
        it("should add a OneOf rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .oneOf(["choice1", "choice2"]);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.OneOf).toBeTruthy();
        });
    });

    describe("range", function () {
        it("should add a Range rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .range(1, 10);

            expect(propertyValidationState.settings.rules[0] instanceof valerie.rules.Range).toBeTruthy();
        });
    });

    describe("rule", function () {
        it("should add a ule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .rule(function () {
                    return null;
                });

            expect(propertyValidationState.settings.rules.length).toBe(1);
        });
    });

    describe("ruleMessage", function () {
        it("should set the failureMessageFormat for the last added rule", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .noneOf(["this", "that"])
                .not("other");

            propertyValidationState.ruleMessage("test");
            expect(propertyValidationState.settings.rules[0].settings.failureMessageFormat).not.toBe("test");
            expect(propertyValidationState.settings.rules[1].settings.failureMessageFormat).toBe("test");
        });

        it("should set all the failureMessageFormats for the last added rule", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .noneOf([1, 7])
                .range(1, 10);

            propertyValidationState.ruleMessage("test");
            expect(propertyValidationState.settings.rules[0].settings.failureMessageFormat).not.toBe("test");
            expect(propertyValidationState.settings.rules[1].settings.failureMessageFormat).toBe("test");
            expect(propertyValidationState.settings.rules[1].settings.failureMessageFormatForMaximumOnly).toBe("test");
            expect(propertyValidationState.settings.rules[1].settings.failureMessageFormatForMinimumOnly).toBe("test");
        });
    });
});