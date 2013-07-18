describe("ko.bindingHandlers", function () {
    var element,
        $element;

    beforeEach(function () {
        $(document.body)
            .empty()
            .html("<div class='test'></div>");

        $element = $(".test");
        element = $element[0];
    });

    describe("validatedChecked", function () {
        it("should make the validation state touched after the element is blurred", function () {
            $element.append($("<input type='radio' name='test' value='test' data-bind='validatedChecked: aValue'>"));

            var viewModel = {"aValue": ko.observable().validate().end()},
                $radio = $element.find("input");

            ko.applyBindings(viewModel, element);

            expect(viewModel.aValue.validation().touched()).toBeFalsy();

            $radio.focus();
            $radio.blur();
            expect(viewModel.aValue.validation().touched()).toBeTruthy();
        });

        it("should set the value of the model property if the element is clicked", function () {
            $element.append($("<input type='radio' name='test' value='1' data-bind='validatedChecked: aValue'>"));

            var viewModel = {"aValue": ko.observable().validate().number().end()},
                $radio = $element.find("input");

            ko.applyBindings(viewModel, element);

            expect(viewModel.aValue()).toBeUndefined();

            $radio.simulate("click");
            expect(viewModel.aValue()).toBe("1");
        });
    });

    describe("validatedValue", function () {
        it("should make the validation state touched after the element is blurred", function () {
            $element.append($("<input type='text' name='test' value='test' data-bind='validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable().validate().end()},
                $text = $element.find("input");

            ko.applyBindings(viewModel, element);

            expect(viewModel.aValue.validation().touched()).toBeFalsy();

            $text.simulate("focus");
            $text.simulate("blur");
            expect(viewModel.aValue.validation().touched()).toBeTruthy();
        });

        it("should set a failure result if an entry is empty and required", function () {
            $element.append($("<input type='text' name='test' data-bind='validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable(2).validate().required().number().end()},
                $text = $element.find("input");

            ko.applyBindings(viewModel, element);

            expect(viewModel.aValue.validation().failed()).toBeFalsy();

            $text.val("");
            $text.simulate("keyup");

            expect(viewModel.aValue()).toBeNull();
            expect(viewModel.aValue.validation().failed()).toBeTruthy();
        });

        it("should set a failure result if an entry is whitespace only and required", function () {
            $element.append($("<input type='text' name='test' data-bind='validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable(2).validate().required().number().end()},
                $text = $element.find("input");

            ko.applyBindings(viewModel, element);

            expect(viewModel.aValue.validation().failed()).toBeFalsy();

            $text.val("    ");
            $text.simulate("keyup");

            expect(viewModel.aValue()).toBeNull();
            expect(viewModel.aValue.validation().failed()).toBeTruthy();
        });

        it("should set the value of the model property if a key is released", function () {
            $element.append($("<input type='text' name='test' data-bind='validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable().validate().number().end()},
                $text = $element.find("input");

            ko.applyBindings(viewModel, element);

            expect(viewModel.aValue()).toBeUndefined();

            $text.val("5");
            $text.simulate("keyup");

            expect(viewModel.aValue()).toBe(5);
        });

        it("should set the text of an input element if the property value is changed", function () {
            $element.append($("<input type='text' name='test' data-bind='validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable(1).validate().number().end()},
                $text = $element.find("input");

            ko.applyBindings(viewModel, element);

            expect($text.val()).toBe("1");

            viewModel.aValue(5);
            expect($text.val()).toBe("5");
        });

        it("should set a failure result if the text of an input element could not be parsed", function () {
            $element.append($("<input type='text' name='test' data-bind='validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable(2).validate().required().number().end()},
                $text = $element.find("input");

            ko.applyBindings(viewModel, element);

            $text.val("abc");
            $text.simulate("keyup");

            expect(viewModel.aValue()).toBeNull();
            expect(viewModel.aValue.validation().failed()).toBeTruthy();
        });
    });

    describe("disabledWhenNotValid", function () {
        it("should set the disabled attribute on the bound element when the validation state is not valid", function () {
            $element.append($("<input type='text' name='test' data-bind='disabledWhenNotValid: true, validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable("abc").validate().required().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find(":disabled").length).toEqual(0);

            viewModel.aValue("");
            expect($element.find(":disabled").length).toEqual(1);
        });
    });

    describe("disabledWhenTouchedAndNotValid", function () {
        it("should set the disabled attribute on the bound element when the validation state is touched and not valid", function () {
            $element.append($("<input type='text' name='test' data-bind='disabledWhenTouchedAndNotValid: true, validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable("abc").validate().required().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find(":disabled").length).toEqual(0);

            viewModel.aValue("");
            expect($element.find(":disabled").length).toEqual(0);

            viewModel.aValue.validation().touched(true);
            expect($element.find(":disabled").length).toEqual(1);
        });
    });

    describe("enabledWhenApplicable", function () {
        it("should set the disabled attribute on the bound element when the validation state is inapplicable", function () {
            $element.append($("<input type='text' name='test' data-bind='enabledWhenApplicable: true, validatedValue: aValue'>"));

            var applicable = ko.observable(true),
                viewModel = {"aValue": ko.observable("abc").validate().applicable(applicable).end()};

            ko.applyBindings(viewModel, element);

            expect($element.find(":disabled").length).toEqual(0);

            applicable(false);
            expect($element.find(":disabled").length).toEqual(1);
        });
    });

    describe("formattedText", function () {
        it("should set the text of the bound element to a formatted representation of the model property", function () {
            $element.append($("<span data-bind='formattedText: aValue'>"));

            var viewModel = {"aValue": ko.observable(123).validate().currencyMajor().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find("span").text()).toEqual("£123");
        });
    });

    describe("validationCss", function () {
        it("should set class names on the bound element depending on the validation state", function () {
            $element.append($("<input type='text' data-bind='validationCss: aValue, validatedValue: aValue'>"));

            var viewModel = {"aValue": ko.observable(123).validate().currencyMajor().required().end()},
                $input = $($element.find("input")[0]);

            ko.applyBindings(viewModel, element);

            expect($input.hasClass("failed")).toBeFalsy();
            expect($input.hasClass("focused")).toBeFalsy();
            expect($input.hasClass("passed")).toBeTruthy();
            expect($input.hasClass("pending")).toBeFalsy();
            expect($input.hasClass("touched")).toBeFalsy();
            expect($input.hasClass("untouched")).toBeTruthy();

            viewModel.aValue.validation().touched(true);
            expect($input.hasClass("touched")).toBeTruthy();
            expect($input.hasClass("untouched")).toBeFalsy();

            viewModel.aValue(null);
            expect($input.hasClass("failed")).toBeTruthy();
            expect($input.hasClass("passed")).toBeFalsy();
            expect($input.hasClass("pending")).toBeFalsy();

            $input.simulate("focus");
            expect($input.hasClass("focused")).toBeTruthy();

            $input.simulate("blur");
            expect($input.hasClass("focused")).toBeFalsy();
        });
    });

    describe("validationMessage", function () {
        it("should set the visibility and text of the bound element to the validation message", function () {
            $element.append($("<span data-bind='validationMessage: aValue'>"));

            var viewModel = {"aValue": ko.observable("abc").validate().required().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find("span:visible").length).toEqual(0);
            expect($element.find("span").text().length).toEqual(0);

            viewModel.aValue("");
            expect($element.find("span:visible").length).toEqual(0);
            expect($element.find("span").text()).toEqual("A value is required.");
        });
    });

    describe("validationMessageText", function () {
        it("should set the text of the bound element to the validation message", function () {
            $element.append($("<span data-bind='validationMessageText: aValue'>"));

            var viewModel = {"aValue": ko.observable().validate().required().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find("span").text()).toEqual("A value is required.");
        });
    });

    describe("validationName", function () {
        it("should set the text of the bound element to the validation name of the property", function () {
            $element.append($("<span data-bind='validationName: aValue'>"));

            var viewModel = {"aValue": ko.observable().validate().name("aValue").end()};

            ko.applyBindings(viewModel, element);

            expect($element.find("span").text()).toEqual("aValue");
        });
    });

    describe("visibleWhenApplicable", function () {
        it("should make the bound element visible when the state is applicable", function () {
            $element.append($("<span data-bind='visibleWhenApplicable: aValue'>OOK</span>"));

            var applicable = ko.observable(true),
                viewModel = {"aValue": ko.observable("abc").validate().applicable(applicable).end()};

            ko.applyBindings(viewModel, element);

            expect($element.find(":visible").length).toEqual(1);

            applicable(false);
            expect($element.find(":visible").length).toEqual(0);
        });
    });

    describe("visibleWhenFocused", function () {
        it("should make the bound element visible when the state is focused", function () {
            $element.append($(
                "<span data-bind='visibleWhenFocused: aValue'>OOK</span>" +
                    "<input type='text' data-bind='validatedValue: aValue'/>"
            ));

            var viewModel = {"aValue": ko.observable("abc").validate().end()},
                $input = $($element.find("input")[0]);

            ko.applyBindings(viewModel, element);

            expect($element.find("span:visible").length).toEqual(0);

            $input.simulate("focus");
            expect($element.find("span:visible").length).toEqual(1);
        });
    });

    describe("visibleWhenInvalid", function () {
        it("should make the bound element visible when the state is invalid", function () {
            $element.append($("<span data-bind='visibleWhenInvalid: aValue'>OOK</span>"));

            var viewModel = {"aValue": ko.observable("abc").validate().required().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find("span:visible").length).toEqual(0);

            viewModel.aValue("");
            expect($element.find("span:visible").length).toEqual(1);
        });
    });

    describe("visibleWhenSummaryNotEmpty", function () {
        it("should make the bound element visible when the summary is not empty", function () {
            $element.append($("<span data-bind='visibleWhenSummaryNotEmpty: true'>OOK</span>"));

            var viewModel = valerie.validatableModel(
                {"aValue": ko.observable("abc").validate().required().end()}
            ).end();

            ko.applyBindings(viewModel, element);

            expect($element.find("span:visible").length).toEqual(0);

            viewModel.validation().updateSummary();
            expect($element.find("span:visible").length).toEqual(0);

            viewModel.aValue("");
            viewModel.validation().updateSummary();
            expect($element.find("span:visible").length).toEqual(0);
        });
    });

    describe("visibleWhenTouched", function () {
        it("should make the bound element visible when the state is touched", function () {
            $element.append($("<span data-bind='visibleWhenTouched: aValue'>OOK</span>"));

            var viewModel = {"aValue": ko.observable("abc").validate().required().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find("span:visible").length).toEqual(0);

            viewModel.aValue.validation().touched(true);
            expect($element.find("span:visible").length).toEqual(1);
        });
    });

    describe("visibleWhenUntouched", function () {
        it("should make the bound element visible when the state is untouched", function () {
            $element.append($("<span data-bind='visibleWhenUntouched: aValue'>OOK</span>"));

            var viewModel = {"aValue": ko.observable("abc").validate().required().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find("span:visible").length).toEqual(1);

            viewModel.aValue.validation().touched(true);
            expect($element.find("span:visible").length).toEqual(0);
        });
    });

    describe("visibleWhenValid", function () {
        it("should make the bound element visible when the state is valid", function () {
            $element.append($("<span data-bind='visibleWhenValid: aValue'>OOK</span>"));

            var viewModel = {"aValue": ko.observable("abc").validate().required().end()};

            ko.applyBindings(viewModel, element);

            expect($element.find("span:visible").length).toEqual(1);

            viewModel.aValue("");
            expect($element.find("span:visible").length).toEqual(0);
        });
    });
});
