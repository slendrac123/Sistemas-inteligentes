class Neurona {
    /***
     * neuron_id := int
     * bias := double
     * activation := function
    ***/
    constructor(neuron_id, bias, activation) {
        this.neuron_id = neuron_id
        this.bias = bias
        this.activation = activation
    }
    /***
     * mezcla el bias y la función de activación 
     * de dos genes con mismo id de dos redes
     * PROBABILIDAD BIAS: 50%
     * PROBABILIDAD ACTIVATION: 50%
    ***/
    crossover(neurona_a, neurona_b) {
        if (neurona_a.neuron_id != neurona_b.neuron_id) {
            throw ('Error, enlaces no iguales')
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
        return new Neurona(neuron_id, bias, activation)
    }
}

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