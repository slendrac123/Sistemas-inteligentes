import { Neurona } from "./neurona.js"
import { Sinapsis } from "./sinapsis.js"

var num_genomas = 0
export class Genoma {
    /***
     * genome_id := int
     * num_inputs := int
     * num_outputs := int
     * neuronas := List<Neurona>
     * links := List<Sinapsis>
    ***/
    constructor(id_genoma = num_genomas, num_inputs, num_outputs, neuronas = [], links = []) {
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
    get_hidden_or_input(genoma) {
        let index = Math.floor(Math.random() * (genoma.neuronas.length - this.num_outputs))
        //si es una de input
        if (index < genoma.neuronas.num_inputs) {
            return genoma.neuronas[index]
        } else {
            //saltarse las de output
            return genoma.neuronas[index + this.num_outputs]
        }

    }
    get_hidden_or_output(genoma) {
        //solo de las output o hidden [los primeros siempre seran inputs las siguientes outputs]
        let index = Math.floor(Math.random() * (genoma.neuronas.length - genoma.num_inputs))
        return genoma.neuronas[index + this.num_inputs]
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
    mutate_add_link(genoma) {
        //solo de las hidden o input 
        let input_id = genoma.get_hidden_or_input(genoma)?.neuron_id
        let output_id = genoma.get_hidden_or_output(genoma)?.neuron_id
        let busqueda = genoma.find_link(input_id, output_id)
        if (busqueda == false) {
            /* Falta revisar que no se creen ciclos */
            if (genoma.revisar_ciclos(genoma.links, input_id, output_id)) {
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
         * TODO: IMPLEMENTACION
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
    mutate_add_neuron(genoma) {
        if (genoma.links.length == 0) {
            return
        }
        let enlace_para_dividir = genoma.links[Math.floor(Math.random() * genoma.links.length)]
        //
        enlace_para_dividir.is_enabled = false

        // HABRIA QUE PENSAR QUE FUNCIONES COLOCAR PARA LA ACTIVACION
        let new_neurona = new Neurona(1 - Math.random(), (x) => x)
        genoma.add_neurona(new_neurona)

        let enlace_input_id = enlace_para_dividir.input_id
        let enlace_output_id = enlace_para_dividir.output_id
        let peso = enlace_para_dividir.peso
        let new_link1 = new Sinapsis(enlace_input_id, new_neurona.neuron_id, 1.0, true)
        let new_link2 = new Sinapsis(new_neurona.neuron_id, enlace_output_id, peso, true)
        genoma.add_link(new_link1)
        genoma.add_link(new_link2)

    }
    mutate_remove_neuron(genoma) {
        //verificar que hayan hidden 
        if (genoma.num_hidden == 0) {
            return;
        }
        //obtener neurona hidden al azar
        let neurona = genoma.get_hidden()
        //borrar todos los enlaces a la neurona
        for (let i = genoma.enlaces.length; i >= 0; i++) {
            if (genoma.enlaces[i].input_id == neurona.neuron_id
                || genoma.enlaces[i].output_id == neurona.neuron_id
            ) {
                genoma.enlaces.splice(i, 1)
            }
        }
        // encontrar el indice y borrarlo
        let index = genoma.neuronas.indexOf(neurona)
        genoma.neuronas.splice(index, 1)

    }
}