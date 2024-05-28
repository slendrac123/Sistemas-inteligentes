function mutate_add_link(genoma) {
    //solo de las hidden o input 
    let input_id = genoma.get_hidden_or_input()?.neuron_id
    let output_id = genoma.get_hidden_or_output()?.neuron_id
    let busqueda = genoma.find_link(input_id, output_id)
    if (busqueda == false) {
        /* Falta revisar que no se creen ciclos */
        if (genoma.revisar_ciclos(genoma.links, input_id, output_id)) {
            return
        }
        let new_link = new Sinapsis(input_id, output_id, 1 - Math.random(), true)
        genoma.add_link(new_link)
    } else {
        busqueda.is_enabled = true
    }
}
function revisar_ciclos(links, input_id, output_id) {
    // Crear un "mapa de adyacencia"
    let adjList = new Map();
    for (let sinapsis of links) {
        if (!adjList.has(sinapsis.input_id)) {
            adjList.set(sinapsis.input_id, []);
        }
        adjList.get(sinapsis.input_id).push(sinapsis.output_id);
    }

    // Añadir el nuevo enlace
    if (!adjList.has(input_id)) {
        adjList.set(input_id, []);
    }
    adjList.get(input_id).push(output_id);

    // Función DFS (busqueda en profundidad) para detectar ciclos
    let visited = new Set();
    let recStack = new Set();

    const dfs = (node) => {
        if (recStack.has(node)) return true;  // Se detecta un ciclo
        if (visited.has(node)) return false;  // node en visited y no en recstack => no hay ciclo

        visited.add(node);
        recStack.add(node);

        let neighbors = adjList.get(node) || [];    //si no esta node en adjLis: neighbors = []
        for (let neighbor of neighbors) {
            if (dfs(neighbor)) return true;   // Se detecta un ciclo 
        }

        recStack.delete(node);
        return false;
    };

    // Ejecutar DFS para cada nodo
    for (let node of adjList.keys()) {
        if (dfs(node)) return true;  // Se detecta un ciclo
    }

    return false;  // No se detecta ningún ciclo
}

function mutate_remove_link(genoma) {
    if (genoma.links.length == 0) {
        return
    }
    let remover = genoma.links.splice([Math.floor(Math.random() * genoma.links.length)], 1)
    return remover
}
function mutate_add_neuron(genoma) {
    if (genoma.links.length == 0) {
        return
    }
    let enlace_para_dividir = genoma.links[Math.floor(Math.random() * genoma.links.length)]
    //
    enlace_para_dividir.is_enabled = false

    // HABRIA QUE PENSAR QUE FUNCIONES COLOCAR PARA LA ACTIVACION
    let new_neurona = new Neurona(1 - Math.random(), (x) => x)
    genoma.add_neurona(new_neurona)

    let enlace_input_id = enlace_para_dividir.input_id
    let enlace_output_id = enlace_para_dividir.output_id
    let peso = enlace_para_dividir.peso
    let new_link1 = new Sinapsis(enlace_input_id, new_neurona.neuron_id, 1.0, true)
    let new_link2 = new Sinapsis(new_neurona.neuron_id, enlace_output_id, peso, true)
    genoma.add_link(new_link1)
    genoma.add_link(new_link2)

}
function mutate_remove_neuron(genoma) {
    //verificar que hayan hidden 
    if (genoma.num_hidden == 0) {
        return;
    }
    //obtener neurona hidden al azar
    let neurona = genoma.get_hidden()
    //borrar todos los enlaces a la neurona
    for (let i = genoma.enlaces.length; i >= 0; i++) {
        if (genoma.enlaces[i].input_id == neurona.neuron_id
            || genoma.enlaces[i].output_id == neurona.neuron_id
        ) {
            genoma.enlaces.splice(i, 1)
        }
    }
    // encontrar el indice y borrarlo
    let index = genoma.neuronas.indexOf(neurona)
    genoma.neuronas.splice(index, 1)
}