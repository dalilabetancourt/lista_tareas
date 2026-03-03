class Tarea {
    constructor(id, descripcion, fechaLimite) {
        this.id = id;
        this.descripcion = descripcion;
        this.fechaLimite = fechaLimite;
        this.estado = false;
        this.fechaCreacion = new Date().toLocaleDateString();
    }


    cambiarEstado() {
        this.estado = !this.estado;
    }
}


// CLASE GESTOR


class GestorTareas {


    constructor() {
        this.tareas = this.cargarLocalStorage();
        this.listaUI = document.getElementById("listaTareas");
        this.renderizar();
    }


    cargarLocalStorage() {
        const data = JSON.parse(localStorage.getItem("mis_tareas")) || [];
        return data.map(t => Object.assign(new Tarea(), t));
    }


    guardarLocalStorage() {
        localStorage.setItem("mis_tareas", JSON.stringify(this.tareas));
    }


    async agregarTarea(descripcion, fecha) {


        // Simulación asincronía
        await new Promise(resolve => setTimeout(resolve, 500));


        const nuevaTarea = new Tarea(Date.now(), descripcion, fecha);
        this.tareas = [...this.tareas, nuevaTarea];


        await this.guardarEnAPI(nuevaTarea);


        this.guardarLocalStorage();
        this.renderizar();
    }


    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardarLocalStorage();
        this.renderizar();
    }


    cambiarEstado(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.cambiarEstado();
            this.guardarLocalStorage();
            this.renderizar();
        }
    }


    editarTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);


        const nuevaDescripcion = prompt("Editar tarea:", tarea.descripcion);


        if (nuevaDescripcion && nuevaDescripcion.trim() !== "") {
            tarea.descripcion = nuevaDescripcion.trim();
            this.guardarLocalStorage();
            this.renderizar();
        }
    }


    async guardarEnAPI(tarea) {
        try {
            await fetch("https://jsonplaceholder.typicode.com/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: tarea.descripcion,
                    completed: tarea.estado
                })
            });
        } catch (error) {
            console.error("Error al guardar en API");
        }
    }


    renderizar() {
        this.listaUI.innerHTML = "";


        this.tareas.forEach(tarea => {


            const li = document.createElement("li");


            li.innerHTML = `
                <div style="text-decoration:${tarea.estado ? "line-through" : "none"}">
                    <strong>${tarea.descripcion}</strong><br>
                    <small>Creada: ${tarea.fechaCreacion}</small><br>
                    <small>Límite: ${tarea.fechaLimite}</small>
                </div>


                <div class="tarea-botones">
                    <button class="btnCompletar">Completar</button>
                    <button class="btnEditar">Editar</button>
                    <button class="btnEliminar">Eliminar</button>
                </div>
            `;


            li.querySelector(".btnCompletar")
                .addEventListener("click", () => this.cambiarEstado(tarea.id));


            li.querySelector(".btnEditar")
                .addEventListener("click", () => this.editarTarea(tarea.id));


            li.querySelector(".btnEliminar")
                .addEventListener("click", () => this.eliminarTarea(tarea.id));


            this.listaUI.appendChild(li);
        });
    }
}


// INICIALIZACIÓN


const gestor = new GestorTareas();


document.getElementById("formTareas")
    .addEventListener("submit", async (e) => {


        e.preventDefault();


        const descripcion = document.getElementById("tareaNueva").value.trim();
        const fecha = document.getElementById("fechaNueva").value;


        if (!descripcion || !fecha) return;


        await gestor.agregarTarea(descripcion, fecha);


        e.target.reset();
    });
