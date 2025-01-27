/*
    TODO list (front-end) - Cecire
*/

const todoInput = document.getElementById("todo");
const addButton = document.getElementById("add");
const activities = document.getElementById("activities");

const rowTemplate = '<tr id="row_$ID" class="$DONECLASS"><td>$TASK</td><td><button class="button btn btn-primary" type="button" id="done_$ID">$DONETEXT</button></td><td><button class="button btn btn-danger" type="button" id="delete_$ID">Elimina</button></td></tr>';

let todos = [];

const addTodo = (todo) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/add",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(todo)
            }
        )
        .then(response => response.json())
        .then(data => resolve(data));
    })
};

const loadTodos = () => {
    return new Promise((resolve, reject) => {
        fetch("/todo")
        .then(response => response.json())
        .then(data => resolve(data));
    })
};

const changeTodoState = (todo) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/change", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(todo)
       })
       .then((response) => response.json())
       .then((json) => resolve(json));
    })
};

const deleteTodo = (id) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/" + id, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }
       })
       .then((response) => response.json())
       .then((json) => resolve(json));
    })
};

const renderTodos = () => { // funzione per fare il render dei todo
    let newHtml = "<thead><td><h2>Attività</h2></td></thead>";

    todos.forEach((e) => { // agiunge righe alla tabella
        let row = rowTemplate.replace("$TASK", e.task);
        row = row.replace("$ID", e.id);
        row = row.replace("$ID", e.id);
        row = row.replace("$ID", e.id);
        row = row.replace("$DONECLASS", (e.done ? "table-success" : "")); // aggiunge la classe bootsrap per far diventare la riga verde
        row = row.replace("$DONETEXT", (e.done ? "Riassegna" : "Completa"));

        newHtml += row;
    });
    activities.innerHTML = newHtml;

    const buttons = document.querySelectorAll(".button"); // cerca tutti i pulsanti con la classe button nella pagina

    buttons.forEach((button) => {
        if (button.id.includes("done")) { // se l'id del pulsante inizia con "done"
            button.onclick = () => { // aggiunge una funzione handler che setta il parametro "done" dell'attività nell'array coi todo a true, fa di nuovo la render e carica sul server le todo aggiornate
                const todo = todos.find((e) => e.id === button.id.replace("done_", ""));
                changeTodoState(todo).then(() => loadTodos()).then(data => {
                    todos = data.todos;
                    renderTodos();
                });
            }
        }
        else if (button.id.includes("delete")) { // se l'id del pulsante inizia con "delete"
            button.onclick = () => { // aggiunge una funzione handler che rimuove l'attività dall'array coi todo, fa di nuovo la render e carica sul server le todo aggiornate
                deleteTodo(button.id.replace("delete_", "")).then(() => loadTodos()).then(data => {
                    todos = data.todos;
                    renderTodos();
                });
            }
        }
    });
};

addButton.onclick = () => {
    if (todoInput.value) {
        const todo = {
            task: todoInput.value,
            done: false
        };

        addTodo(todo)
        .then(() => loadTodos())
        .then(data => {
            todos = data.todos;
            todoInput.value = "";
            renderTodos();
        });
    }
};

loadTodos()
.then(data => {
    todos = data.todos;
    renderTodos();
});

setInterval(() => {
    loadTodos()
    .then(data => {
        todos = data.todos;
        renderTodos();
    });
}, 30000);