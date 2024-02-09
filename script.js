// Получение ссылок на элементы DOM
const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const clearAll = document.querySelector(".clear-btn");
const filters = document.querySelectorAll(".filters span");

// Инициализация переменных
let editId = null;
let isEditedTask = false;

// Загрузка списка задач из локального хранилища или создание пустого массива
let todos = JSON.parse(localStorage.getItem("todo-list")) || [];

// Установка обработчиков событий для фильтров
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Удаление класса "active" у предыдущего активного фильтра
    document.querySelector("span.active").classList.remove("active");
    // Добавление класса "active" к выбранному фильтру
    btn.classList.add("active");
    // Отображение задач в соответствии с выбранным фильтром
    showTodo();
  });
});

// Функция для отображения задач в соответствии с выбранным фильтром
function showTodo() {
  // Получение ID выбранного фильтра
  let filter = document.querySelector("span.active").id;
  let filteredTodos = todos;

  // Фильтрация задач в соответствии с выбранным фильтром
  if (filter !== "all") {
    filteredTodos = todos.filter((todo) => todo.status === filter);
  }

  let li = "";
  if (filteredTodos.length > 0) {
    // Генерация HTML для каждой задачи
    filteredTodos.forEach((todo, id) => {
      let isCompleted = todo.status === "completed" ? "checked" : "";
      li += `<li class="task">
        <label for="${id}">
          <input onclick='updateStatus(this)' type="checkbox" id="${id}" ${isCompleted} />
          <p class="task-name ${isCompleted}">${todo.name}</p>
        </label>
        <div class="settings">
          <i onclick='showMenu(this)' class="fa-solid fa-ellipsis"></i>
          <ul class="task-menu">
            <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen-to-square"></i>Edit</li>
            <li onclick='deleteTask(${id})'><i class="fa-solid fa-trash-can"></i>Delete</li>
          </ul>
        </div>
      </li>`;
    });
  } else {
    li = `<span>You don't have any task here</span>`;
  }

  // Вставка сгенерированного HTML в контейнер задач
  taskBox.innerHTML = li;
}

// Первоначальное отображение задач
showTodo();

// Функция для показа контекстного меню задачи
function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.toggle("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName !== "I" || e.target !== selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

// Функция для удаления задачи
function deleteTask(deleteId) {
  // Удаление задачи из массива
  todos.splice(deleteId, 1);
  // Обновление списка задач в локальном хранилище
  localStorage.setItem("todo-list", JSON.stringify(todos));
  // Обновление отображения задач
  showTodo();
}

// Обработчик события для кнопки очистки списка
clearAll.addEventListener("click", () => {
  // Очистка массива задач
  todos = [];
  // Обновление списка задач в локальном хранилище
  localStorage.setItem("todo-list", JSON.stringify(todos));
  // Обновление отображения задач
  showTodo();
});

// Функция для редактирования задачи
function editTask(taskId, taskName) {
  isEditedTask = true;
  editId = taskId;
  taskInput.value = taskName;
}

// Функция для обновления статуса задачи
function updateStatus(selectedTask) {
  let taskId = parseInt(selectedTask.id);
  let taskName = selectedTask.parentElement.lastElementChild;

  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[taskId].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[taskId].status = "pending";
  }

  // Обновление списка задач в локальном хранилище
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Обработчик события для поля ввода задачи
taskInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    let userTask = taskInput.value.trim();
    if (userTask) {
      if (!isEditedTask) {
        // Добавление новой задачи в массив
        let taskInfo = { name: userTask, status: "pending" };
        todos.push(taskInfo);
      } else {
        // Редактирование существующей задачи
        todos[editId].name = userTask;
        isEditedTask = false;
      }
      // Очистка поля ввода
      taskInput.value = "";
      // Обновление списка задач в локальном хранилище
      localStorage.setItem("todo-list", JSON.stringify(todos));
      // Обновление отображения задач
      showTodo();
    }
  }
});
