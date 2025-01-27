/*
    TODO list (front-end) - Cecire
*/

const todo = document.getElementById("todo");
const addButton = document.getElementById("add");
const activities = document.getElementById("activities");

const rowTemplate = '<tr id="row_$ID" class="$DONECLASS"><td>$TASK</td><td><button class="button btn btn-primary" type="button" id="done_$ID">$DONETEXT</button></td><td><button class="button btn btn-danger" type="button" id="delete_$ID">Elimina</button></td></tr>';

let currentId = 0;
let todosSave; // dizionario usato per salvare l'array con le todo e il currentId

const add = (todo) => {
    return new Promise((resolve, reject) => {
        fetch(
            "/todo/add",
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

const load = () => {
    return new Promise((resolve, reject) => {
        fetch("/todo")
        .then(response => response.json())
        .then(data => resolve(data));
    })
};

const complete = (todo) => {
    return new Promise((resolve, reject) => {
        fetch("/todo/complete", {
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
                const todo = todos.find((e) => e.id === parseInt(button.id.replace("done_", "")));
                todo.done = !todo.done;
                todosSave = {
                    "todos": todos,
                    "currentId": currentId
                };
                renderTodos();
                add();
            }
        }
        else if (button.id.includes("delete")) { // se l'id del pulsante inizia con "delete"
            button.onclick = () => { // aggiunge una funzione handler che rimuove l'attività dall'array coi todo, fa di nuovo la render e carica sul server le todo aggiornate
                const idx = todos.indexOf(todos.find((e) => e.id === parseInt(button.id.replace("delete_", ""))));
                todos.splice(idx, 1);
                todosSave = {
                    "todos": todos,
                    "currentId": currentId
                };
                renderTodos();
                saveTodos();
            }
        }
    });
};

addButton.onclick = () => {
    if (todo.value) {
        todos.unshift({ // aggiunge l'elemento in testa all'array delle attività
            id: currentId++, // setta l'id corrente e poi aumenta
            task: todo.value,
            done: false
        });

        todosSave = {
            "todos": todos,
            "currentId": currentId
        };

        todo.value = "";
        renderTodos();
        saveTodos();
    }
};

getTodos();