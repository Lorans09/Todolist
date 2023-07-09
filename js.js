const dom = {
    new:document.getElementById(`new`),
    add:document.getElementById(`add`),
    tasks:document.getElementById(`tasks`),
    count:document.getElementById(`count`)
}
let tasks = [];

if (localStorage.getItem(`tasks`)) {
    tasks = JSON.parse(localStorage.getItem(`tasks`));
}

tasks.forEach(function (task) {
    const cls = task.isComplete
        ? `todo_task todo_task_complete`
        : `todo_task`
    const checked = task.isComplete ? 'checked' : ''

    const taskHtml = `
        <div id="${task.id}" class="${cls}">
            <label class = "todo_checkbox">
                <input type ="checkbox" ${checked}>
                <div class ="todo_checkbox-div"></div>
            </label>
            <div class="todo_task-text">${task.text}</div>
            <div class="todo_task-del">-</div>
        </div>
        `
    tasksRender(tasks)
})

//Отслеживаем клик по кнопке
dom.add.onclick = () => {
    const newTaskText = dom.new.value
    if(newTaskText && isNotHaveTask(newTaskText, tasks)){
        addTask(newTaskText, tasks)
        dom.new.value = ``
        tasksRender(tasks)
    }
}

// Функция добавления задачи

function addTask(text, list) {
    const timestamp = Date.now()
    const task = {
        id:timestamp,
        text,
        IsComplete: false
    }
    list.push(task)
    saveToLocalStorage()

}

// Проверка дублирования в массиве задач

function isNotHaveTask(text, list) {
    let isNotHave = true

    list.forEach((task) => {
        if(task.text === text) {
            alert(`Задача уже есть дебик`)
            isNotHave = false
        }
    })
    return isNotHave
}

//функция вывода задач

function tasksRender(list) {
    let htmlList = ``

    list.forEach((task) => {
        const cls = task.isComplete
            ? `todo_task todo_task_complete`
            : `todo_task`
        const checked = task.isComplete ? 'checked' : ''

        const taskHtml = `
        <div id="${task.id}" class="${cls}">
            <label class = "todo_checkbox">
                <input type ="checkbox" ${checked}>
                <div class ="todo_checkbox-div"></div>
            </label>
            <div class="todo_task-text">${task.text}</div>
            <div class="todo_task-del">-</div>
        </div>
        `
        htmlList = htmlList + taskHtml
        renderTasksCount(list)
        saveToLocalStorage()
    })

    dom.tasks.innerHTML = htmlList

}

// Отслеживаем клик чекбокса

dom.tasks.onclick = (event) => {
    const target = event.target
    const isCheckboxEl = target.classList.contains(`todo_checkbox-div`)
    const isDeleteEl = target.classList.contains(`todo_task-del`)

    if (isCheckboxEl) {
        const task = target.parentElement.parentElement
        const taskId= task.getAttribute(`id`);
        changeTaskStatus(taskId, tasks)
        tasksRender(tasks)

    }
    if(isDeleteEl){
        const task = target.parentElement
        const taskId= task.getAttribute(`id`);
        deleteTask(taskId, tasks)
        tasksRender(tasks)
        saveToLocalStorage()
    }
}

//функция изменения статуса задач

function changeTaskStatus (id, list) {
    list.forEach((task) => {
        if (task.id == id) {
            task.isComplete = !task.isComplete
        }
    })
    saveToLocalStorage()
}

// функция удаления

function deleteTask(id, list) {
    list.forEach((task, idx) => {
        if(task.id == id) {
            list.splice(idx, 1 )
        }
    })
    saveToLocalStorage()
}

// функция счетчик

function renderTasksCount(list) {
    dom.count.innerHTML = list.length
    saveToLocalStorage()
}

function saveToLocalStorage () {
    localStorage.setItem(`tasks`, JSON.stringify(tasks))
}