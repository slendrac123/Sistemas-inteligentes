import { Genoma } from "./genoma.js"
import { Agent, Board } from "./ambiente.js"
import { NUM_INPUTS, NUM_OUTPUTS } from "./main.js"

export class Individuo extends Agent {
    /***
     * genoma := Genoma
     * fitness := int (sujeto a cambios)
    ***/
    constructor(genoma) {
        super()
        this.genoma = genoma
        this.fitness = 0
        this.board = new Board()
    }
    func_fitness(board, length, color) {
        let fitness = this.fitness
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (board[i][j] == color) {
                    fitness++
                }
            }
        }
        return fitness
    }
    crossover(dominante, recesivo) {
        let offspring = new Genoma(dominante.genoma.num_inputs, dominante.genoma.num_outputs);
        let length_neuronas = dominante.genoma.neuronas.length
        for (let i = 0; i < length_neuronas; i++) {
            let neurona_dom = dominante.genoma.neuronas[i]
            let neuron_id = neurona_dom.neuron_id
            let neurona_rec = recesivo.genoma.find_neurona(neuron_id);
            if (neurona_rec == false) {
                offspring.add_neurona(neurona_dom)
            } else {
                let new_neurona = neurona_rec.crossover(neurona_dom, neurona_rec)
                offspring.add_neurona(new_neurona)
            }
        }

        let length_links = dominante.genoma.links.length
        for (let i = 0; i < length_links; i++) {
            let enlace_dom = dominante.genoma.links[i]
            let link_input_id = enlace_dom.input_id
            let link_output_id = enlace_dom.output_id
            let enlace_rec = recesivo.genoma.find_link(link_input_id, link_output_id)
            if (enlace_rec == false) {
                offspring.add_link(enlace_dom)
            } else {
                let new_enlace = enlace_rec.crossover(enlace_dom, enlace_rec)
                offspring.add_link(new_enlace)
            }

        }
        return offspring
    }
    compute(board, time = 0) {
        // Always cheks the current board status since opponent move can change several squares in the board
        let neuronas = this.genoma.order_by_layers(this.genoma)
        let values = new Map()
        for (let i = 0; i < NUM_INPUTS - 2; i++) {
            //si no existe en el tablero la neurona dira 0
            let a = board[Math.floor(i / this.board.length)]
            if (a == undefined) {
                values.set(i, 1)
                continue
            }
            let b = a[i % this.board.length]
            if (b == undefined) {
                values.set(i, 1)
                continue
            }
            values.set(i, b)

        }
        values.set(NUM_INPUTS - 2, time)
        values.set(NUM_INPUTS - 1, this.board.length)
        for (let i = NUM_INPUTS; i < NUM_INPUTS + NUM_OUTPUTS; i++) {
            values.set(i, 0)
        }
        for (let i = NUM_INPUTS + NUM_OUTPUTS; i < neuronas.length; i++) {
            let value = 0
            for (let link of this.genoma.links) {
                if (link.is_enabled == false) {
                    continue
                }
                if (link.output_id != neuronas[i].neuron_id) {
                    continue
                }
                value += values.get(link.input_id) * link.peso
            }
            value += neuronas[i].bias
            value = neuronas[i].get_activation(value, neuronas[i].activation)
            values.set(neuronas[i].neuron_id, value)
        }
        let outputs = []
        for (let i = NUM_INPUTS; i < NUM_INPUTS + NUM_OUTPUTS; i++) {
            let value = 0
            for (let link of this.genoma.links) {
                if (link.is_enabled == false) {
                    continue
                }
                if (link.output_id != neuronas[i].neuron_id) {
                    continue
                }
                value += values.get(link.input_id) * link.peso
            }
            value += neuronas[i].bias
            value = neuronas[i].get_activation(value, neuronas[i].activation)
            values.set(neuronas[i].neuron_id, value)
            outputs.push(Math.floor(value))
        }
        //console.log(outputs)
        //console.log(values)
        for (let i = 0; i < 3; i++) {
            if (isNaN(outputs[i])) {
                console.log(values)
                console.log(this.board.length)
                this.fitness -= 10000
            }
            if (outputs[i] < 0) {
                this.fitness += 10 * outputs[i]
            }
            if (outputs[i] >= this.board.length) {
                this.fitness -= 10 * outputs[i]
            }
        }
        var moves = this.board.valid_moves(board)
        if (moves.indexOf(outputs) == -1) {
            var index = Math.floor(moves.length * Math.random())
            return moves[index]
        }
        return outputs
        // Randomly picks one available move
    }
}
