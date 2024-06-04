import { Sinapsis } from "./sinapsis.js"
import { Neurona } from "./neurona.js"
import { Configuracion } from "./configuracion.js"
const MUTATION_RATE = 0.2

function mutate_add_link(genoma) {
    //solo de las hidden o input 
    let input_id = genoma.get_hidden_or_input().neuron_id
    let output_id = genoma.get_hidden_or_output().neuron_id
    let busqueda = genoma.find_link(input_id, output_id)
    if (busqueda == false) {
        if (revisar_ciclos(genoma.links, input_id, output_id)) {
            return
        }
        let new_link = new Sinapsis(input_id, output_id, 1 - Math.random(), true)
        genoma.add_link(new_link)
    } else {
        busqueda.is_enabled = true
    }
}
function revisar_ciclos(links, input_id, output_id) {

    //que no salga y entre a si misma
    if (input_id == output_id) {
        return true
    }
    // Crear un "mapa de adyacencia"
    let adjList = new Map();
    for (let sinapsis of links) {
        if (!adjList.has(sinapsis.input_id)) {
            adjList.set(sinapsis.input_id, []);
        }
        adjList.get(sinapsis.input_id).push(sinapsis.output_id);
    }

    // A�adir el nuevo enlace
    if (!adjList.has(input_id)) {
        adjList.set(input_id, []);
    }
    adjList.get(input_id).push(output_id);

    // Funci�n DFS (busqueda en profundidad) para detectar ciclos
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

    return false;  // No se detecta ning�n ciclo
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

    let new_neurona = new Neurona(1 - Math.random())

    let enlace_input_id = enlace_para_dividir.input_id
    let enlace_output_id = enlace_para_dividir.output_id
    let peso = enlace_para_dividir.peso
    let new_link1 = new Sinapsis(enlace_input_id, new_neurona.neuron_id, 1.0, true)
    let new_link2 = new Sinapsis(new_neurona.neuron_id, enlace_output_id, peso, true)
    genoma.add_link(new_link1)
    genoma.add_link(new_link2)
    genoma.add_neurona(new_neurona)

}
function mutate_remove_neuron(genoma) {
    //verificar que hayan hidden 
    if (genoma.num_hidden() == 0) {
        return;
    }
    //obtener neurona hidden al azar
    let neurona = genoma.get_hidden()
    //borrar todos los enlaces a la neurona
    for (let i = genoma.links.length - 1; i >= 0; i--) {
        if (genoma.links[i].input_id == neurona.neuron_id
            || genoma.links[i].output_id == neurona.neuron_id
        ) {
            genoma.links.splice(i, 1)
        }
    }
    // encontrar el indice y borrarlo
    let index = genoma.neuronas.indexOf(neurona)
    genoma.neuronas.splice(index, 1)
}
function mutate_peso(genoma, config) {
    let enlace = genoma.links[Math.floor(Math.random() * genoma.links.length)]
    enlace.peso = config.mutate_delta(enlace.peso)
}
function mutate_bias(genoma, config) {
    let neurona = genoma.neuronas[Math.floor(Math.random() * genoma.neuronas.length)]
    neurona.bias = config.mutate_delta(neurona.bias)

}
export function mutate(individuo) {
    if (Math.random() < MUTATION_RATE) {
        mutate_add_link(individuo.genoma)
    }
    if (Math.random() < MUTATION_RATE) {
        mutate_remove_link(individuo.genoma)
    }

    if (Math.random() < MUTATION_RATE) {
        mutate_add_neuron(individuo.genoma)
    }
    if (Math.random() < MUTATION_RATE) {
        mutate_remove_neuron(individuo.genoma)
    }
    let config = new Configuracion
    if (Math.random() < config.mutation_rate) {
        mutate_bias(individuo.genoma, config)
    }
    if (Math.random() < config.mutation_rate) {
        mutate_peso(individuo.genoma, config)
    }
}