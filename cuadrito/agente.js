const max_size = 20
//export const SIZE = 5
//cada una de las casillas, el tiempo y el tamaño 
const NUM_INPUTS = max_size * max_size + 2
const NUM_OUTPUTS = 3
class Configuracion {
    constructor(init_mean = 0.0, init_stdev = 1.0, min = -2.0, max = 2.0, mutation_rate = 0.2, mutate_power = 1.2, replace_rate = 0.05) {
        this.init_mean = init_mean
        this.init_stdev = init_stdev
        this.min = min
        this.max = max
        this.mutation_rate = mutation_rate
        this.mutate_power = mutate_power
        this.replace_rate = replace_rate

    }
    clamp(val, min = this.min, max = this.max) {
        return Math.min(Math.max(val, min), max)
    }
    //nuevo valor siguiendo una distribucion normal
    gaussianRandom(mean = this.init_mean, stdev = this.init_stdev) {
        const u = 1 - Math.random() // Converting [0,1) to (0,1]
        const v = Math.random()
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
        // Transform to the desired mean and standard deviation:
        return this.clamp(z * stdev + mean)
    }

    mutate_delta(value) {
        let delta = this.clamp(this.gaussianRandom(0.0, this.mutate_power))
        return this.clamp(value + delta)
    }

}
var num_genomas = 0

class Genoma {
    /**
     * genome_id := int
     * num_inputs := int
     * num_outputs := int
     * neuronas := List<Neurona>
     * links := List<Sinapsis>
    ***/
    constructor(num_inputs, num_outputs, neuronas = [], links = [], id_genoma = num_genomas) {
        if (id_genoma == num_genomas) {
            num_genomas++
        }
        this.genome_id = id_genoma
        this.num_inputs = num_inputs
        this.num_outputs = num_outputs
        this.neuronas = neuronas
        this.links = links
    }
    find_neurona(neuron_id) {
        for (let neurona of this.neuronas) {
            if (neuron_id == neurona.neuron_id) {
                return neurona
            }
        }
        return false
    }
    add_neurona(neurona) {
        this.neuronas.push(neurona)
        //console.log("añadida neurona %d al genoma %d", neurona.neuron_id, this.genome_id)
    }
    find_link(input_id, output_id) {
        for (let link of this.links) {
            if (input_id == link.input_id && output_id == link.output_id) {
                return link
            }
        }
        return false
    }
    add_link(link) {
        this.links.push(link)
        //console.log("añadido enlade de neurona %d a neurona en el genoma %d", link.input_id, link.output_id, this.genome_id)
    }
    get_hidden_or_input() {
        let index = Math.floor(Math.random() * (this.neuronas.length - this.num_outputs))
        //si es una de input
        if (index < this.neuronas.num_inputs) {
            return this.neuronas[index]
        } else {
            //saltarse las de output
            return this.neuronas[index + this.num_outputs]
        }

    }
    get_hidden_or_output() {
        //solo de las output o hidden [los primeros siempre seran inputs las siguientes outputs]
        let index = Math.floor(Math.random() * (this.neuronas.length - this.num_inputs))
        return this.neuronas[index + this.num_inputs]
    }
    num_hidden() {
        return this.neuronas.length - (this.num_inputs + this.num_outputs)

    }
    get_hidden() {
        if (this.neuronas.length == this.num_inputs + this.num_outputs) {
            return;
        }
        let index = Math.floor(Math.random() * (this.neuronas.length - this.num_inputs - this.num_outputs))
        return this.neuronas[index + this.num_inputs + this.num_outputs]

    }
    order_by_layers(genoma) {
        //deepcopy
        let neuronas = [...genoma.neuronas]
        let layers = 2
        //console.log(neuronas)
        let layer = neuronas.splice(0, genoma.num_inputs + genoma.num_outputs)
        while (neuronas.length != 0) {
            layers++
            let new_layer = []
            for (let i = 0; i < neuronas.length; i++) {
                let neurona = neuronas[i]
                //console.log(neurona.neuron_id)
                let flag = true
                for (let link of genoma.links) {
                    if (link.is_enabled == false) {
                        continue
                    }
                    if (link.output_id != neurona.neuron_id) {
                        continue
                    }
                    //console.log(link)
                    if (layer.indexOf(this.find_neurona(link.input_id)) == -1) {
                        flag = false
                        break
                    }
                }
                if (flag == true) {
                    neuronas.splice(i, 1)
                    new_layer.push(neurona)
                    i--
                }
            }
            if (new_layer.length == 0) {
                console.log(genoma)
                console.log(neuronas)
                throw ("aa")
            }
            layer = layer.concat(new_layer)
        }
        //console.log(`genoma id: ${genoma.genome_id}: layers ${layers}`)
        return layer
    }
}

function JSON_to_neuronas(object) {
    let neuronas = []
    for (let neurona of object) {
        let new_neurona = new Neurona(neurona.bias, neurona.activation, neurona.neuron_id)
        neuronas.push(new_neurona)
    }
    return neuronas
}
function JSON_to_enlaces(object) {
    let enlaces = []
    for (let enlace of object) {
        let new_enlace = new Sinapsis(enlace.input_id, enlace.output_id, enlace.peso, enlace.is_enabled)
        enlaces.push(new_enlace)
    }
    return enlaces
}
function JSON_to_genoma(object) {
    return new Genoma(object.num_inputs, object.num_outputs, JSON_to_neuronas(object.neuronas), JSON_to_enlaces(object.links), object.genome_id)

}
class Individuo extends Agent {
    /***
     * genoma := Genoma
     * fitness := int (sujeto a cambios)
    ***/
    constructor() {
        super()

        let poblacion = new Population(1)
        this.genoma = poblacion.individuos[0].genoma
        this.fitness = 0
        this.board = new Board()
    }
    func_fitness(board, length, color) {
        let fitness = this.fitness
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (board[i][j] == color) {
                    fitness++
                }
            }
        }
        return fitness
    }
    crossover(dominante, recesivo) {
        let offspring = new Genoma(dominante.genoma.num_inputs, dominante.genoma.num_outputs);
        let length_neuronas = dominante.genoma.neuronas.length
        for (let i = 0; i < length_neuronas; i++) {
            let neurona_dom = dominante.genoma.neuronas[i]
            let neuron_id = neurona_dom.neuron_id
            let neurona_rec = recesivo.genoma.find_neurona(neuron_id);
            if (neurona_rec == false) {
                offspring.add_neurona(neurona_dom)
            } else {
                let new_neurona = neurona_rec.crossover(neurona_dom, neurona_rec)
                offspring.add_neurona(new_neurona)
            }
        }

        let length_links = dominante.genoma.links.length
        for (let i = 0; i < length_links; i++) {
            let enlace_dom = dominante.genoma.links[i]
            let link_input_id = enlace_dom.input_id
            let link_output_id = enlace_dom.output_id
            let enlace_rec = recesivo.genoma.find_link(link_input_id, link_output_id)
            if (enlace_rec == false) {
                offspring.add_link(enlace_dom)
            } else {
                let new_enlace = enlace_rec.crossover(enlace_dom, enlace_rec)
                offspring.add_link(new_enlace)
            }

        }
        return offspring
    }
    compute(board, time = 0) {
        // Always cheks the current board status since opponent move can change several squares in the board
        let neuronas = this.genoma.order_by_layers(this.genoma)
        let values = new Map()
        for (let i = 0; i < NUM_INPUTS - 2; i++) {
            //si no existe en el tablero la neurona dira 0
            let a = board[Math.floor(i / max_size)]
            if (a == undefined) {
                values.set(i, 0)
                continue
            }
            let b = a[i % max_size]
            if (b == undefined) {
                values.set(i, 0)
                continue
            }
            values.set(i, b)

        }
        values.set(NUM_INPUTS - 2, time)
        values.set(NUM_INPUTS - 1, this.board.length)
        for (let i = NUM_INPUTS; i < NUM_INPUTS + NUM_OUTPUTS; i++) {
            values.set(i, 0)
        }
        for (let i = NUM_INPUTS + NUM_OUTPUTS; i < neuronas.length; i++) {
            let value = 0
            for (let link of this.genoma.links) {
                if (link.is_enabled == false) {
                    continue
                }
                if (link.output_id != neuronas[i].neuron_id) {
                    continue
                }
                value += values.get(link.input_id) * link.peso
            }
            value += neuronas[i].bias
            value = neuronas[i].get_activation(value, neuronas[i].activation)
            values.set(neuronas[i].neuron_id, value)
        }
        let outputs = []
        for (let i = NUM_INPUTS; i < NUM_INPUTS + NUM_OUTPUTS; i++) {
            let value = 0
            for (let link of this.genoma.links) {
                if (link.is_enabled == false) {
                    continue
                }
                if (link.output_id != neuronas[i].neuron_id) {
                    continue
                }
                value += values.get(link.input_id) * link.peso
            }
            values.set(neuronas[i].neuron_id, value)
            outputs.push(Math.floor(value))
        }
        //console.log(outputs)
        //console.log(values)
        for (let i = 0; i < 3; i++) {
            if (isNaN(outputs[i])) {
                console.log(values)
                console.log(this.board.length)
                this.fitness -= 100
            }
            if (outputs[i] < 0) {
                this.fitness += 10 * outputs[i]
            }
            if (outputs[i] >= this.board.length) {
                this.fitness -= 10 * outputs[i]
            }
        }
        var moves = this.board.valid_moves(board)
        if (moves.indexOf(outputs) == -1) {
            //this.fitness -= 10
            var index = Math.floor(moves.length * Math.random())
            return moves[index]
        }
        return outputs
        // Randomly picks one available move
    }
}


function JSON_to_ind(object) {
    return new Individuo(JSON_to_genoma(object.genoma), object.fitness)

}

const MUTATION_RATE = 0.1

function mutate_add_link(genoma, config) {
    //solo de las hidden o input 
    let input_id = genoma.get_hidden_or_input().neuron_id
    let output_id = genoma.get_hidden_or_output().neuron_id
    let busqueda = genoma.find_link(input_id, output_id)
    if (busqueda == false) {
        if (revisar_ciclos(genoma.links, input_id, output_id)) {
            return
        }
        let new_link = new Sinapsis(input_id, output_id, config.gaussianRandom(), true)
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
function mutate_add_neuron(genoma, config) {
    if (genoma.links.length == 0) {
        return
    }
    let enlace_para_dividir = genoma.links[Math.floor(Math.random() * genoma.links.length)]
    //
    enlace_para_dividir.is_enabled = false

    let new_neurona = new Neurona(config.gaussianRandom())

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
function mutate(individuo) {
    let config = new Configuracion()
    if (Math.random() < MUTATION_RATE) {
        mutate_add_neuron(individuo.genoma, config)
    }
    if (Math.random() < MUTATION_RATE) {
        mutate_add_link(individuo.genoma, config)

    }
    if (Math.random() < MUTATION_RATE) {
        mutate_remove_link(individuo.genoma)
    }

    if (Math.random() < MUTATION_RATE) {
        return mutate_remove_neuron(individuo.genoma)
    }
    if (Math.random() < config.mutation_rate) {
        return mutate_bias(individuo.genoma, config)
    }
    if (Math.random() < config.mutation_rate) {
        return mutate_peso(individuo.genoma, config)
    }
}
var num_neuronas = 0
class Neurona {
    /***
     * neuron_id := int
     * bias := double
     * activation := function
    ***/
    constructor(bias, activation, neuron_id = num_neuronas) {
        if (num_neuronas == neuron_id) {
            num_neuronas++
        }
        this.neuron_id = neuron_id
        this.bias = bias
        this.activation = Math.floor(Math.random() * funcionActivacion.length)
    }
    /***
     * mezcla el bias y la función de activación 
     * de dos genes con mismo id de dos redes
     * PROBABILIDAD BIAS: 50%
     * PROBABILIDAD ACTIVATION: 50%
    ***/
    crossover(neurona_a, neurona_b) {
        if (neurona_a.neuron_id != neurona_b.neuron_id) {
            throw ('Error, neuronas no iguales')
        }
        let neuron_id = neurona_a.neuron_id
        let bias
        let activation
        if (Math.random() < 0.5) {
            bias = neurona_a.bias
        } else {
            bias = neurona_b.bias
        }
        if (Math.random() < 0.5) {
            activation = neurona_a.activation
        } else {
            activation = neurona_b.activation
        }
        return new Neurona(bias, activation, neuron_id)
    }
    get_activation(value, index) {
        let func = funcionActivacion[index]
        return func(value)
    }
}

// Funciones de activación

// Función sigmoide
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

// Función tanh (hiperbolica tangente)
const tanh = (x) => Math.tanh(x);

// Función ReLU (Rectified Linear Unit)
const relu = (x) => Math.max(0, x);

// Función leaky ReLU (ReLU con fuga)
const leakyRelu = (x) => (x > 0 ? x : 0.01 * x);

// Función ELU (Exponential Linear Unit)
//const elu = (x, alpha = 1.0) => (x > 0 ? x : alpha * (Math.exp(x) - 1));

// Función softplus
const softplus = (x) => Math.log(1 + Math.exp(x));

// Función lineal
const linear = (x) => x;

// Lista de funciones de activación
const funcionActivacion = [sigmoid, tanh, relu, leakyRelu, softplus, linear];

// Seleccionar una función de activación aleatoriamente


/*
let gen = new Gen(1, 0.3, (x) => x)
console.log(gen)
console.log(gen.activation(2))
let gen2 = new Gen(1, 0.4, (x) => x + 2)
console.log(gen2)
console.log(gen2.activation(2))

let result = gen.crossover(gen, gen2)
console.log(result)
console.log(result.activation(2))
*/

class Population {
    constructor(population_size) {
        this.individuos = []
        for (let i = 0; i < population_size; i++) {
            let new_individuo = new Individuo(this.new_genoma())
            this.individuos.push(new_individuo)
        }
    }
    init(color, board, time = 20000) {
        this.color = color
        this.time = time
        this.size = board.length
    }

    new_genoma() {
        let config = new Configuracion()
        let genoma = new Genoma(NUM_INPUTS, NUM_OUTPUTS)
        //añadir las neuronas inputs
        for (let neuron_id = 0; neuron_id < NUM_INPUTS; neuron_id++) {
            let new_neurona = new Neurona(config.gaussianRandom(), 1 - Math.random(), neuron_id);
            genoma.add_neurona(new_neurona)
        }
        //añadir las neuronas outputs
        for (let neuron_id = NUM_INPUTS; neuron_id < NUM_INPUTS + NUM_OUTPUTS; neuron_id++) {
            let new_neurona = new Neurona(config.gaussianRandom(), 1 - Math.random(), neuron_id);
            genoma.add_neurona(new_neurona)
        }

        //conectar todo con todo
        for (let input_id = 0; input_id < NUM_INPUTS; input_id++) {
            for (let output_id = NUM_INPUTS; output_id < NUM_INPUTS + NUM_OUTPUTS; output_id++) {
                let new_link = new Sinapsis(input_id, output_id, config.gaussianRandom())
                genoma.add_link(new_link)
            }
        }
        return genoma
    }
    sort_by_fitness() {
        this.individuos.sort((a, b) => b.fitness - a.fitness)
    }
    run(generaciones) {
        let gen = 1
        for (let i = 0; i < generaciones; i++) {
            this.size = gen
            console.log(max_size)
            for (let i = 0; i < this.individuos.length; i += 2) {
                ambiente_run(this.individuos[i], this.individuos[i + 1], (max_size))//- 2 - 17)) + 3)
            }
            this.sort_by_fitness()
            for (let individuo of this.individuos) {
                console.log(individuo.genoma.num_hidden())
                console.log(individuo.fitness)
            }
            console.log("GENERATION: %d", gen++)
            this.reproduce()
            save(this.individuos, NOMBRE_ARCHIVO)
        }
        return this.individuos
    }
    reproduce() {
        let ind = new Individuo()
        this.individuos.splice(SOBREVIVIENTES)
        let spawn_size = NUM_POBLACION - 1
        let nueva_poblacion = []
        nueva_poblacion.push(this.individuos[0])
        while (spawn_size-- > 0) {
            let padre = this.individuos[Math.floor(Math.random() * this.individuos.length)]
            let madre = this.individuos[Math.floor(Math.random() * this.individuos.length)]
            let hijo = ind.crossover(padre, madre)
            let new_individuo = new Individuo(hijo)
            mutate(new_individuo)
            nueva_poblacion.push(new_individuo)
        }
        this.individuos = nueva_poblacion
    }
}

class Sinapsis {
    /***
     * input_id := int
     * output_id := int
     * peso := double 
     * is_enabled := bool
    ***/
    constructor(input_id, output_id, peso, is_enabled = true) {
        this.input_id = input_id
        this.output_id = output_id
        this.peso = peso
        this.is_enabled = is_enabled
    }
    crossover(sin_a, sin_b) {
        if (sin_a.input_id != sin_b.input_id || sin_a.output_id != sin_b.output_id) {
            throw ('Error, enlaces no iguales')
        }
        let input_id = sin_a.input_id
        let output_id = sin_a.output_id
        let peso
        if (Math.random() < 0.5) {
            peso = sin_a.peso
        } else {
            peso = sin_b.peso
        }
        let is_enabled
        if (Math.random() < 0.5) {
            is_enabled = sin_a.is_enabled
        } else {
            is_enabled = sin_b.is_enabled
        }
        return new Sinapsis(input_id, output_id, peso, is_enabled)
    }
}