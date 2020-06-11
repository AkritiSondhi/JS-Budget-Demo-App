// Budget Controller
var budgetController = (function () {
  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }

  class Income {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
  }
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  var addItem = function (type, description, value) {
    var newItem;
    var id = 0;

    if (data.allItems[type].length > 0) {
      id = data.allItems[type][data.allItems[type].length - 1].id + 1;
    }

    if (type === "exp") {
      newItem = new Expense(id, description, value);
    } else {
      newItem = new Income(id, description, value);
    }

    data.allItems[type].push(newItem);

    return newItem;
  };

  // Public methods
  return {
    addItem: addItem,
    testing: function () {
      console.log(data);
    },
  };
})();

// UI Controller
var UIController = (function () {
  var _domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
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

  var addListItem = function (obj, type) {
    var html, element;

    if (type === "inc") {
      element = _domStrings.incomeContainer;
      html =
        '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    } else {
      element = _domStrings.expenseContainer;
      html =
        '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }

    html = html.replace("%id%", obj.id);
    html = html.replace("%description%", obj.description);
    html = html.replace("%value%", obj.value);

    document.querySelector(element).insertAdjacentHTML("beforeend", html);
  };

  // Public methods
  return {
    getInput: _getInput,
    getDomStrings: _getDomStrings,
    addListItem: addListItem,
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
    var input, newItem;

    input = _UIController.getInput();
    newItem = _budgetController.addItem(
      input.type,
      input.description,
      input.value
    );
    _UIController.addListItem(newItem, input.type);
  };

  // Public methods
  return {
    init: _init,
  };
})(budgetController, UIController);

appController.init();
