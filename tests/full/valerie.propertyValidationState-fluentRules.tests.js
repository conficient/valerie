describe("PropertyValidationState - Fluent Rules", function () {
    describe("during", function () {
        it("should add a During rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .during(new Date(), null);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.During.prototype);
        });
    });

    describe("earliest", function () {
        it("should add a During rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .earliest(new Date());

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.During.prototype);
        });
    });

    describe("expression", function () {
        it("should add an Expression rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .expression("{d}3");

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.Expression.prototype);
        });
    });

    describe("latest", function () {
        it("should add a During rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .latest(new Date());

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.During.prototype);
        });
    });

    describe("lengthBetween", function () {
        it("should add a StringLength rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .lengthBetween(1, 10);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.StringLength);
        });
    });

    describe("matches", function () {
        it("should add a Matches rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .matches("password");

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.Matches.prototype);
        });
    });

    describe("maximum", function () {
        it("should add a Range rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .maximum(10);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.Range.prototype);
        });
    });

    describe("maximumNumberOfItems", function () {
        it("should add a ArrayLength rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .maximumNumberOfItems(5);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.ArrayLength.prototype);
        });
    });

    describe("maximumLength", function () {
        it("should add a StringLength rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .maximumLength(5);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.StringLength.prototype);
        });
    });

    describe("minimum", function () {
        it("should add a Range rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .minimum(10);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.Range.prototype);
        });
    });

    describe("minimumNumberOfItems", function () {
        it("should add a ArrayLength rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .minimumNumberOfItems(5);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.ArrayLength.prototype);
        });
    });

    describe("minimumLength", function () {
        it("should add a StringLength rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .minimumLength(5);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.StringLength.prototype);
        });
    });

    describe("noneOf", function () {
        it("should add a NoneOf rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .matches(["existing-user"]);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.NoneOf.prototype);
        });
    });

    describe("not", function () {
        it("should add a Not rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .not("existing-user");

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.Not.prototype);
        });
    });

    describe("noneOf", function () {
        it("should add a NoneOf rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .matches("existing-user");

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.NoneOf.prototype);
        });
    });

    describe("numberOfItems", function () {
        it("should add a ArrayLength rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .numberOfItems(5, 10);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.ArrayLength.prototype);
        });
    });

    describe("oneOf", function () {
        it("should add a OneOf rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .oneOf(["choice1", "choice2"]);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.OneOf.prototype);
        });
    });

    describe("oneOf", function () {
        it("should add a OneOf rule to the property validation state", function () {
            var propertyValidationState = new valerie.PropertyValidationState(ko.observable())
                .oneOf(["choice1", "choice2"]);

            expect(propertyValidationState.settings.rules[0].constructor.prototype)
                .toEqual(valerie.rules.OneOf.prototype);
        });
    });
});