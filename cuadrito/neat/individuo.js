import { Genoma } from "./genoma.js"
import { Agent, Board } from "./ambiente.js"

export class Individuo extends Agent {
    /***
     * genoma := Genoma
     * fitness := int (sujeto a cambios)
    ***/
    constructor(genoma, fitness = 0) {
        super()
        this.genoma = genoma
        this.fitness = fitness
        this.board = new Board()
    }
    func_fitness(board, length, color) {
        let fitness = 0
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
        let offspring = new Genoma(dominante.genoma?.num_inputs, dominante.genoma?.num_outputs);
        let length_neuronas = dominante.genoma?.neuronas.length
        for (let i = 0; i < length_neuronas; i++) {
            let neurona_dom = dominante.genoma?.neuronas[i]
            let neuron_id = neurona_dom.neuron_id
            let neurona_rec = recesivo.genoma.find_neurona(neuron_id);
            if (neurona_rec == false) {
                offspring.add_neurona(neurona_dom)
            } else {
                let new_neurona = neurona_rec.crossover(neurona_dom, neurona_rec)
                offspring.add_neurona(new_neurona)
            }
        }

        let length_links = dominante.genoma?.links.length
        for (let i = 0; i < length_links; i++) {
            let enlace_dom = dominante.genoma?.links[i]
            let link_input_id = enlace_dom.input_id
            let link_output_id = enlace_dom.output_id
            let enlace_rec = recesivo.genoma.find_link(link_input_id, link_output_id)
            if (enlace_rec == false) {
                offspring.add_link(enlace_dom)
            } else {
                console.log("dom")
                console.log(enlace_dom)
                console.log("rec")
                console.log(enlace_rec)
                let new_enlace = enlace_rec.crossover(enlace_dom, enlace_rec)
                offspring.add_link(new_enlace)
            }

        }
        return offspring
    }
    compute(board, time) {
        // Always cheks the current board status since opponent move can change several squares in the board
        var moves = this.board.valid_moves(board)
        // Randomly picks one available move
        var index = Math.floor(moves.length * Math.random())
        return moves[index]
    }
}
