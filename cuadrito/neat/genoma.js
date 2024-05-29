var num_genomas = 0

export class Genoma {
    /***
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
        this.neuronas = this.neuronas.concat(neurona)
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
        this.links = this.links.concat(link)
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
        return this.neuronas.length - (this.num_inputs - this.num_outputs)

    }
    get_hidden() {
        if (this.num_hidden == 0) {
            return;
        }
        let index = Math.floor(Math.random() * (this.neuronas.length - this.num_inputs - this.num_outputs))
        return this.neuronas[index + this.num_inputs + this.num_outputs]

    }
}