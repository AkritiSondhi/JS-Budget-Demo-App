// Budget Controller
var budgetController = (function () {
  return {};
})();

// UI Controller
var UIController = (function () {
  var _domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
  };

  var _getInput = function () {
    var type = document.querySelector(_domStrings.inputType).value;
    var description = document.querySelector(_domStrings.inputDescription)
      .value;
    var value = document.querySelector(_domStrings.inputValue).value;

    return {
      type: type,
      description: description,
      value: value,
    };
  };

  var _getDomStrings = function () {
    return _domStrings;
  };

  // Public methods
  return {
    getInput: _getInput,
    getDomStrings: _getDomStrings,
  };
})();

//Global App Controller
var appController = (function (_budgetController, _UIController) {
  var _setUpEventListeners = function () {
    var _domStrings = _UIController.getDomStrings();

    document
      .querySelector(_domStrings.inputButton)
      .addEventListener("click", addItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        addItem();
      }
    });
  };

  var _init = function () {
    _setUpEventListeners();
  };

  var addItem = function () {
    /**
     * TODO
     * 1. Get input field
     * 2. Add item to budget controller
     * 3. Add item to UI
     * 4. Calculate budget
     * 5. Display the budget on UI
     */
    var input = _UIController.getInput();
    console.log(input);
  };

  return {
    init: _init,
  };
})(budgetController, UIController);

appController.init();
