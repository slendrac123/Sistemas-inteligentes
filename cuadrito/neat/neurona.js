export var num_neuronas = 0
export function raise_cap_neuronas() {
    num_neuronas++
}
export class Neurona {
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