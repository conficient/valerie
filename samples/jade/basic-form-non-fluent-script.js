function RunSample() {

    var viewModel = {
            "firstName": ko.observable(),
            "surname": ko.observable(),
            "submit": function () {
                viewModel.validation().touched(true);
            },
            "reset": function () {
                viewModel.firstName("");
                viewModel.surname("");
                viewModel.validation().touched(false);
            }
        },
        viewModelValidationState = valerie.validatableModel(viewModel);

    viewModel.firstName.validate({
        // The passThrough converter is the default converter,
        // set here to illustrate the non-fluent interface.
        "converter": valerie.converters.passThrough,
        "required": true,
        "rules": [
            new valerie.rules.StringLength(2, null)
        ]
    });

    viewModel.surname.validate({
        "converter": valerie.converters.passThrough,
        "required": true,
        "rules": [
            new valerie.rules.StringLength(2, null)
        ]
    });

    viewModelValidationState.validateAll();

    ko.bindingHandlers.validationCss.classNames.failed = "error";
    ko.bindingHandlers.validationCss.classNames.passed = "success";

    ko.applyBindings(viewModel, document.getElementById("sample"));

    return viewModel;
}