// Budget Controller
var budgetController = (function () {
  class Expense {
    constructor(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }

    calculatePercentge(totalInc) {
      if (totalInc > 0) {
        this.percentage = Math.round((this.value / totalInc) * 100);
      } else {
        this.percentage = -1;
      }
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
    budget: 0,
    percentage: -1,
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

  var _calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var _calculateBudget = function () {
    _calculateTotal("exp");
    _calculateTotal("inc");

    data.budget = data.totals.inc - data.totals.exp;

    if (data.totals.inc > 0) {
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    } else {
      data.percentage = -1;
    }
  };

  var _getBudget = function () {
    return {
      budget: data.budget,
      totalInc: data.totals.inc,
      totalExp: data.totals.exp,
      percentage: data.percentage,
    };
  };

  var _deleteItem = function (type, id) {
    var ids = data.allItems[type].map(function (current) {
      return current.id;
    });
    var index = ids.indexOf(id);

    if (index >= 0) {
      data.allItems[type].splice(index, 1);
    }
  };

  var _calculatePercentages = function () {
    data.allItems["exp"].forEach(function (current) {
      current.calculatePercentge(data.totals.inc);
    });
  };

  var _getPercentage = function () {
    var allPercentages = data.allItems["exp"].map(function (current) {
      return current.percentage;
    });
    return allPercentages;
  };

  // Public methods
  return {
    addItem: addItem,
    calculateBudget: _calculateBudget,
    getBudget: _getBudget,
    deleteItem: _deleteItem,
    calculatePercentges: _calculatePercentages,
    getPercentage: _getPercentage,
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
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercentageLabel: ".item__percentage",
  };

  var _getInput = function () {
    var type = document.querySelector(_domStrings.inputType).value;
    var description = document.querySelector(_domStrings.inputDescription)
      .value;
    var value = parseFloat(
      document.querySelector(_domStrings.inputValue).value
    );

    return {
      type: type,
      description: description,
      value: value,
    };
  };

  var _getDomStrings = function () {
    return _domStrings;
  };

  var _addListItem = function (obj, type) {
    var html, element;

    if (type === "inc") {
      element = _domStrings.incomeContainer;
      html =
        '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    } else {
      element = _domStrings.expenseContainer;
      html =
        '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    }

    html = html.replace("%id%", obj.id);
    html = html.replace("%description%", obj.description);
    html = html.replace("%value%", this.formatNumber(obj.value, type));

    document.querySelector(element).insertAdjacentHTML("beforeend", html);
  };

  var _clearFields = function () {
    var fields = document.querySelectorAll(
      _domStrings.inputDescription + "," + _domStrings.inputValue
    );
    var fieldsArray = Array.prototype.slice.call(fields);

    fieldsArray.forEach(function (element) {
      element.value = "";
    });

    fieldsArray[0].focus();
  };

  var _displayBudget = function (obj) {
    document.querySelector(_domStrings.budgetLabel).textContent = obj.budget;
    document.querySelector(_domStrings.incomeLabel).textContent = obj.totalInc;
    document.querySelector(_domStrings.expensesLabel).textContent =
      obj.totalExp;

    if (obj.percentage > 0) {
      document.querySelector(_domStrings.percentageLabel).textContent =
        obj.percentage + "%";
    } else {
      document.querySelector(_domStrings.percentageLabel).textContent = "---";
    }
  };

  var _deleteListItem = function (selectorId) {
    var element = document.getElementById(selectorId);
    element.parentNode.removeChild(element);
  };

  var _displayPercentages = function (percentArray) {
    var percentFields = document.querySelectorAll(
      _domStrings.expensesPercentageLabel
    );

    var nodeListForEach = function (list, callback) {
      for (var i = 0; i < list.length; i++) {
        callback(list[i], i);
      }
    };

    nodeListForEach(percentFields, function (current, index) {
      if (percentArray[index] != 0) {
        current.textContent = percentArray[index] + "%";
      } else {
        current.textContent = "---";
      }
    });
  };

  function formatNumber(num, type) {
    num = Math.abs(num).toFixed(2);
    var numSplit = num.splice(".");
    var integer = numSplit[0];
    var decimal = numSplit[1];

    if (integer.length > 3) {
      integer =
        integer.substr(0, integer.length - 3) +
        "," +
        integer.substr(integer.length - 3, 3);
    }

    return (type == "exp" ? "-" : "+") + " " + integer + "." + decimal;
  }

  // Public methods
  return {
    getInput: _getInput,
    getDomStrings: _getDomStrings,
    addListItem: _addListItem,
    clearFields: _clearFields,
    displayBudget: _displayBudget,
    deleteListItem: _deleteListItem,
    displayPercentages: _displayPercentages,
  };
})();

//Global App Controller
var appController = (function (_budgetController, _UIController) {
  var _setUpEventListeners = function () {
    var _domStrings = _UIController.getDomStrings();

    document
      .querySelector(_domStrings.inputButton)
      .addEventListener("click", _addItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        _addItem();
      }
    });

    var _deleteItem = function (event) {
      var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

      if (itemId) {
        var splitId = itemId.split("-");
        var type = splitId[0] == "income" ? "inc" : "exp";
        var id = splitId[1];

        _budgetController.deleteItem(type, parseInt(id));
        _UIController.deleteListItem(itemId);
        _updateBudget();
        _updatePercentages();
      }
    };

    document
      .querySelector(_domStrings.container)
      .addEventListener("click", _deleteItem);
  };

  var _init = function () {
    _setUpEventListeners();
    _UIController.displayBudget({
      budget: 0,
      totalInc: 0,
      totalExp: 0,
      percentage: 0,
    });
  };

  var _addItem = function () {
    var input, newItem;

    input = _UIController.getInput();

    if (input.description != "" && !isNaN(input.value) && input.value > 0) {
      newItem = _budgetController.addItem(
        input.type,
        input.description,
        input.value
      );
      _UIController.addListItem(newItem, input.type);
      _UIController.clearFields();
      _updateBudget();
      _updatePercentages();
    }
  };

  var _updateBudget = function () {
    _budgetController.calculateBudget();
    var budget = _budgetController.getBudget();
    _UIController.displayBudget(budget);
  };

  var _updatePercentages = function () {
    _budgetController.calculatePercentges();
    var percentages = _budgetController.getPercentage();
    _UIController.displayPercentages(percentages);
  };

  // Public methods
  return {
    init: _init,
  };
})(budgetController, UIController);

appController.init();
