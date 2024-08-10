import { Genoma } from './genoma.js'
import { Sinapsis } from './sinapsis.js'
import { Neurona } from './neurona.js'
import { ambiente_run } from './ambiente.js'
import { Individuo } from './individuo.js'
import { NUM_POBLACION, NUM_INPUTS, NUM_OUTPUTS, SOBREVIVIENTES, max_size, save, NOMBRE_ARCHIVO, limit_sup, limit_inf } from './main.js'
import { mutate } from './mutations.js'
import { Configuracion } from './configuracion.js'

export class Population {
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
            //console.log(max_size)
            let size = 10
            for (let i = 0; i < this.individuos.length; i += 2) {
                ambiente_run(this.individuos[i], this.individuos[i + 1], size)
                ambiente_run(this.individuos[i + 1], this.individuos[i], size)

                /*
                for (let z = i + 1; z < this.individuos.length; z++) {
                    ambiente_run(this.individuos[i], this.individuos[z], size)
                    ambiente_run(this.individuos[z], this.individuos[i], size)
                }
                */
            }
            this.sort_by_fitness()
            this.reproduce()
            console.log("GENERATION: %d", gen++)
            save(this.individuos, NOMBRE_ARCHIVO)
        }
        return this.individuos
    }
    reproduce() {
        let ind = new Individuo()
        this.individuos.splice(SOBREVIVIENTES)
        let spawn_size = NUM_POBLACION - 1
        let nueva_poblacion = []
        console.log("hidden: ", this.individuos[0].genoma.num_hidden())
        console.log(this.individuos[0].fitness)
        this.individuos[0].fitness = 0
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
