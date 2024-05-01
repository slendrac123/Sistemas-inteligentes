import { Sinapsis } from "./sinapsis.js"

export class Genoma {
    /***
     * genome_id := int
     * num_inputs := int
     * num_outputs := int
     * neuronas := List<Neurona>
     * links := List<Sinapsis>
    ***/
    constructor(genome_id, num_inputs, num_outputs, neuronas = [], links = []) {
        this.genome_id = genome_id
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
                console.log("found it")
                return link
            }
        }
        return false
    }
    add_link(link) {
        this.links = this.links.concat(link)
    }
    mutate_add_link(genoma) {
        let input_id = genoma.neuronas[Math.floor(Math.random() * genoma.neuronas.length)].neuron_id
        let output_id = genoma.neuronas[Math.floor(Math.random() * genoma.neuronas.length)].neuron_id

        let busqueda = genoma.find_link(input_id, output_id)
        if (busqueda == false) {
            /* Falta revisar que no se creen ciclos */
            if (this.revisar_ciclos(genoma.links, input_id, output_id)) {
                return
            }
            let new_link = new Sinapsis(input_id, output_id, 1 - Math.random(), true)
            genoma.add_link(new_link)
        } else {
            busqueda.is_enabled = true
        }
    }
    revisar_ciclos(links, input_id, output_id) {
        /***
         * IMPLEMENTACION
         ***/
        return false

    }
    mutate_remove_link(genoma) {
        if (genoma.links.length == 0) {
            return
        }
        let remover = genoma.links.splice([Math.floor(Math.random() * genoma.links.length)], 1)
        return remover
    }
}