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
        for (let neurona_dom of dominante.genoma.neuronas) {
            let neuron_id = neurona_dom.neuron_id

        }
    }
}

let individuo = new Individuo(1)

individuo.crossover(1, 2)