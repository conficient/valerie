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
        "type": "string",
        "required": true,
        "rules": [
            new valerie.rules.StringLength(2, null)
        ]
    });

    viewModel.surname.validate({
        "type": "string",
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