import { Genoma } from './genoma.js'
import { Sinapsis } from './sinapsis.js'

const NUM_INPUTS = 4
const NUM_OUTPUTS = 3

export class Population {
    constructor(population_size) {
        this.individuals = []
        for (let i = 0; i < population_size; i++) {
            this.individuals.push(new_genoma())
        }
    }
    new_genoma() {
        let genoma = new Genoma(NUM_INPUTS, NUM_OUTPUTS)
        //añadir las neuronas inputs
        for (let neuron_id = 0; neuron_id < NUM_INPUTS; neuron_id++) {
            let new_neurona = new Neurona(neuron_id);
            genoma.add_neurona()
        }
        //añadir las neuronas outputs
        for (let neuron_id = NUM_INPUTS; neuron_id < NUM_INPUTS + NUM_OUTPUTS; neuron_id++) {
            let new_neurona = new Neurona(neuron_id);
            genoma.add_neurona()
        }

        //conectar todo con todo
        for (let input_id = 0; input_id < NUM_INPUTS; input_id++) {
            for (let output_id = NUM_INPUTS; output_id < NUM_INPUTS + NUM_OUTPUTS; output_id++) {
                let new_link = Sinapsis(input_id, output_id)
                genoma.add_link()
            }
        }
        return genoma
    }
    run(fitness, generations) {

    }

}