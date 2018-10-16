var newTask=document.getElementById("newTask");//Add a new task.
var newCategory=document.getElementById("newCategory");//Add a category
var addButton=document.getElementsByTagName("button")[0];
var tasksHolder=document.getElementById("tasks");
var categoriesHolder = document.getElementById("categoriesSection");
var taskCategoriesSelect = document.getElementById("taskCategoriesSelect");

var tasks = [
    {
        'id': 1,
        'name': 'Fix car',
        'completed': false,
        'category_id': 1
    },
    {
        'id': 2,
        'name': 'See doctor',
        'completed': false,
        'category_id': 1
    }
];

var categories = [
    {
        'id': 1,
        'name': 'To Do'
    },
    {
        'id': 2,
        'name': 'Doing'
    },
    {
        'id': 3,
        'name': 'Done'
    }
]

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
    
    var removeButton = document.createElement("button");
    removeButton.className = "btn btn-link"
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
}

var addTask = function () {
    task = {};
    task.id = tasks.length;
    task.name = newTask.value;
    task.category_id = taskCategoriesSelect.options[taskCategoriesSelect.selectedIndex].value;

    tasks.push(task);
    updateData();
}

var removeTask = function(event) {
    strId = event.target.id;
    realId = parseInt(strId.split("-").pop());

    for (var i = 0; i < tasks.length; i++) {
        if (realId == tasks[i].id) {
            tasks.splice(i, 1);
        }
    }

    updateData();
}

var addCategory = function() {
    category = {};
    category.id = categories.length;
    category.name = newCategory.value;

    categories.push(category);

    updateData();
}

var removeCategory = function() {
    strId = event.target.id;
    realId = parseInt(strId.split("-").pop());

    for (var i = 0; i < categories.length; i++) {
        if (realId == categories[i].id) {
            categories.splice(i, 1);
        }
    }

    updateData();
}

//Clean the page data
var cleanData = function() {
    newTask.value = "";
    taskCategoriesSelect.innerHTML = "";
    categoriesHolder.innerHTML = "";
}

//Populate categories card and tasks dropdown
var updateData = function() {
    cleanData(); 
    for (var i = 0; i < categories.length; i++) {
        categorySection = createNewCategoryElement(categories[i]);
        for (var j = 0; j < tasks.length; j++) {
            if (tasks[j].category_id == categories[i].id) {
                categorySection.children[0].children[1].appendChild(createTask(tasks[j]));
            }
        }
    
        categoriesHolder.appendChild(categorySection);
    
        taskCategoriesSelect.options.add(createCategoryOnDropdown(categories[i]));
    }
}

updateData();