var newTask=document.getElementById("newTask");//Add a new task.
var newCategory=document.getElementById("newCategory");//Add a category
var addButton=document.getElementsByTagName("button")[0];
var tasksHolder=document.getElementById("tasks");
var categoriesHolder = document.getElementById("categoriesSection");
var taskCategoriesSelect = document.getElementById("taskCategoriesSelect");

var loggedUser = {};

var createNewCategoryElement = function(category) {
    var categoryDiv = document.createElement("div");
    categoryDiv.className = "col";

    var categoryCard = document.createElement("div");
    categoryCard.className = "card";

    var categoryTitle  = document.createElement("div");
    categoryTitle.className = "card-header";

    var rowDiv = document.createElement("div");
    rowDiv.className = "row";

    var colDiv1 = document.createElement("div");
    colDiv1.className = "col";

    var colDiv2 = document.createElement("div");
    colDiv2.className = "col text-right";

    var removeButton = document.createElement("button");
    removeButton.className = "btn btn-link"
    removeButton.id = "category-" + category.id;
    removeButton.innerText = "Delete";
    removeButton.onclick = removeCategory;

    colDiv1.innerText = category.name;
    rowDiv.appendChild(colDiv1);
    colDiv2.appendChild(removeButton);
    rowDiv.appendChild(colDiv2);
    
    categoryTitle.appendChild(rowDiv);

    var categoryBody = document.createElement("div");
    categoryBody.className = "card-body";

    var categoryList = document.createElement("ul");

    categoryCard.id = "category-" + category.id;

    categoryCard.appendChild(categoryTitle);
    categoryCard.appendChild(categoryBody);
    categoryDiv.appendChild(categoryCard);

    return categoryDiv;
}

var createCategoryOnDropdown = function(category) {
    var option = document.createElement("option");
    option.className = "dropdown-item";
    option.innerHTML = category.name;
    option.value = category.id;

    return option;
}

var createTask = function(task) {
    var taskItem = document.createElement("li");
    taskItem.className = "list-group-item";

    var rowDiv = document.createElement("div");
    rowDiv.className = "row";

    var colDiv1 = document.createElement("div");
    colDiv1.className = "col";

    var colDiv2 = document.createElement("div");
    colDiv2.className = "col";

    var colDiv3 = document.createElement("div");
    colDiv2.className = "col-sm-1 text-right";

    var taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.className = "form-check-input";
    taskCheckbox.checked = task.completed === "true";
    taskCheckbox.addEventListener("change", updateTask);
    
    var removeButton = document.createElement("button");
    removeButton.className = "btn btn-link";
    removeButton.id = "task-" + task.id;
    removeButton.innerText = "Delete";
    removeButton.onclick = removeTask;

    colDiv1.innerText = task.name;
    rowDiv.appendChild(colDiv1);
    
    colDiv2.appendChild(taskCheckbox);
    rowDiv.appendChild(colDiv2);

    colDiv3.appendChild(removeButton);
    rowDiv.appendChild(colDiv3);
    taskItem.appendChild(rowDiv);

    return taskItem;
};

//Event to update task info
$(document).on('change', '[type=checkbox]', function(ev) {
    var checked = this.checked;
    var removeButton = $(this).parent().next().children("button");

    var taskId = removeButton.attr("id").split("-").pop();

    if (loggedUser.categories) {
        for (var i = 0; i < loggedUser.categories.length; i++) {

            if (loggedUser.categories[i].tasks) {
                for (var j = 0; j < loggedUser.categories[i].tasks.length; j++) {
                    if (loggedUser.categories[i].tasks[j].id === taskId) {
                        loggedUser.categories[i].tasks[j].completed = checked;
                    }
                }
            }
        }

    }

    updateUser();
});

var addTask = function () {
    task = {};
    task.id = Math.random().toString(36).substring(7);
    task.name = newTask.value;

    if (loggedUser.categories) {
        for (var i = 0; i < loggedUser.categories.length; i++) {
            if (loggedUser.categories[i].id === taskCategoriesSelect.options[taskCategoriesSelect.selectedIndex].value) {
                if (!loggedUser.categories[i].tasks) {
                    loggedUser.categories[i].tasks = [];
                }
                loggedUser.categories[i].tasks.push(task);
            }
        }
    }

    updateUser();
};

var updateTask = function() {

};

var removeTask = function(event) {
    strId = event.target.id;
    realId = strId.split("-").pop();
    console.log(realId);

    if (loggedUser.categories) {
        for (var i = 0; i < loggedUser.categories.length; i++) {
            if (loggedUser.categories[i].tasks) {
                for (var j = 0; j < loggedUser.categories[i].tasks.length; j++) {
                    if (loggedUser.categories[i].tasks[j].id === realId) {
                        loggedUser.categories[i].tasks.splice(j, 1);
                    }
                }
            }
        }
    }

    updateUser();
};

var addCategory = function() {
    task = {};
    task.id = Math.random().toString(36).substring(7);
    task.name = newTask.value;

    category = {};
    category.id = Math.random().toString(36).substring(7);
    category.name = newCategory.value;

    loggedUser.categories.push(category);

    updateUser();
};

var removeCategory = function() {
    strId = event.target.id;
    realId = strId.split("-").pop();

    for (var i = 0; i < loggedUser.categories.length; i++) {
        if (loggedUser.categories[i].id === realId) {
            loggedUser.categories.splice(i, 1);
        }
    }

    updateUser();
};

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
};

//Clean the page data
var cleanUI = function() {
    newTask.value = "";
    taskCategoriesSelect.innerHTML = "";
    categoriesHolder.innerHTML = "";
};

var updateUI = function() {
    cleanUI();

    if (loggedUser.categories) {
        for (var i = 0; i < loggedUser.categories.length; i++) {
            categorySection = createNewCategoryElement(loggedUser.categories[i]);

            if (loggedUser.categories[i].tasks) {
                for (var j = 0; j < loggedUser.categories[i].tasks.length; j++) {
                    categorySection.children[0].children[1].appendChild(createTask(loggedUser.categories[i].tasks[j]));
                }
            }

            categoriesHolder.appendChild(categorySection);
            taskCategoriesSelect.options.add(createCategoryOnDropdown(loggedUser.categories[i]));
        }
    }
};

//Populate loggedUser.categories card and tasks dropdown
var getUser = function() {
    $.ajax({
        method: 'POST',
        data: {username: $.urlParam('username')},
        withCredentials: true,
        url: '/user'
    }).done(function(user) {
        loggedUser = user;
        updateUI();
    });
};

var updateUser = function() {
    $.ajax({
        method: 'POST',
        data: {user: loggedUser},
        withCredentials: true,
        url: '/edit'
    }).done(function(user) {
        loggedUser = user;
        updateUI();
    });
};

getUser();