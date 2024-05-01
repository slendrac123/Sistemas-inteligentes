class Individuo {
    constructor(genoma, fitness = 0) {
        this.genoma = genoma
        this.fitness = fitness
    }
    crossover(dominante, recesivo) {
        const fs = require("fs")
        let indices = fs.readFileSync("indices.txt").toString().split(',')
        indices[1] = parseInt(indices[1]) + 1
        fs.writeFileSync("indices.txt", indices.toString())
        let offspring = new Genoma(indices[1], dominante.genoma.num_inputs(), dominante.genoma.num_outputs);
        for (let neurona_dom of dominante.genoma.neuronas) {
            let neuron_id = neurona_dom.neuron_id
            let neurona_rec = recesivo.genoma.find_neurona(neuron_id);
            if (neurona_rec == false) {
                offspring.add_neuron(neurona_dom)
            } else {
                offspring.add_neuron(neurona_dom.crossover(neurona_dom, neurona_rec))
            }
        }

        for (let enlace_dom of dominante.genoma.links) {
            let link_input_id = enlace_dom.input_id
            let link_output_id = enlace_dom.output_id
            let enlace_rec = recesivo.genoma.find_link(link_input_id, link_output_id)
            if (enlace_rec == false) {
                offspring.add_link(enlace_dom)
            } else {
                offspring.add_link(recesivo.crossover(enlace_dom, enlace_rec))
            }

        }
        return offspring
    }
}
