import { Genoma } from './genoma.js'
import { Sinapsis } from './sinapsis.js'
import { Neurona } from './neurona.js'
import { ambiente_run } from './ambiente.js'
import { Individuo } from './individuo.js'

const NUM_INPUTS = 4
const NUM_OUTPUTS = 3

export class Population {
    constructor(population_size, fitness) {
        this.individuos = []
        for (let i = 0; i < population_size; i++) {
            let new_individuo = new Individuo(this.new_genoma(), fitness)
            this.individuos.push(new_individuo)
        }
    }
    init(color, board, time = 20000) {
        this.color = color
        this.time = time
        this.size = board.length
    }

    new_genoma() {
        let genoma = new Genoma(NUM_INPUTS, NUM_OUTPUTS)
        //añadir las neuronas inputs
        for (let neuron_id = 0; neuron_id < NUM_INPUTS; neuron_id++) {
            let new_neurona = new Neurona(neuron_id, 1 - Math.floor(Math.random()), 1 - Math.floor(Math.random()));
            genoma.add_neurona()
        }
        //añadir las neuronas outputs
        for (let neuron_id = NUM_INPUTS; neuron_id < NUM_INPUTS + NUM_OUTPUTS; neuron_id++) {
            let new_neurona = new Neurona(neuron_id, 1 - Math.floor(Math.random()), 1 - Math.floor(Math.random()));
            genoma.add_neurona()
        }

        //conectar todo con todo
        for (let input_id = 0; input_id < NUM_INPUTS; input_id++) {
            for (let output_id = NUM_INPUTS; output_id < NUM_INPUTS + NUM_OUTPUTS; output_id++) {
                let new_link = new Sinapsis(input_id, output_id)
                genoma.add_link()
            }
        }
        return genoma
    }
    calc_fitness(fitness, agent1, agent2, size) {
        return ambiente_run(agent1, agent2, size)
    }
    run(fitness, generaciones, size) {
        for (let i = 0; i < generaciones; i += 2) {
            let a = this.calc_fitness(fitness, this.individuos[i], this.individuos[i + 1], size)
            console.log(a)
            if (a == 0) {
                return this.individuos[i]
            } else {
                return this.individuos[i + 1]
            }

        }
    }
    reproduce() {

    }

}