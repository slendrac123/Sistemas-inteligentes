
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
                console.log(neuronas)
                throw ("aa")
            }
            layer = layer.concat(new_layer)
        }
        //console.log(`genoma id: ${genoma.genome_id}: layers ${layers}`)
        return layer
    }
}