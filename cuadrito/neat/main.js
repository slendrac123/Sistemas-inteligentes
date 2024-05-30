import { Board } from "./ambiente.js"
import { Genoma } from "./genoma.js"
import { Individuo } from "./individuo.js"
import { Neurona } from "./neurona.js"
import { Population } from "./population.js"
import * as fs from 'node:fs'
import { Sinapsis } from "./sinapsis.js"

export const NUM_POBLACION = 100
const NUM_GENERACIONES = 1
const NOMBRE_ARCHIVO = "ganadores.txt"
var size = 5
let poblacion = read(NOMBRE_ARCHIVO)
let winners = poblacion.run(NUM_GENERACIONES, size)
save(winners, NOMBRE_ARCHIVO)

function save(genomas, nombre) {
    let data = ""
    for (let genoma of genomas) {
        let str = JSON.stringify(genoma)
        data = data + str + "\n"
    }
    fs.writeFileSync(nombre, data)
}

function read(nombre) {
    let str = fs.readFileSync(nombre, { encoding: 'utf-8', flag: 'r' })
    let genomas = str.split('\n')
    let poblacion = new Population()
    let individuos = []
    for (let genoma of genomas) {
        if (genoma != '') {
            let content = JSON.parse(genoma)
            let individuo = JSON_to_ind(content)
            individuos.push(individuo)
        }

    }
    poblacion.individuos = individuos
    return poblacion
}

function JSON_to_neuronas(object) {
    let neuronas = []
    for (let neurona in object) {
        let new_neurona = new Neurona(neurona.bias, neurona.activation, neurona.neuron_id)
        neuronas.push(new_neurona)
    }
    return neuronas
}
function JSON_to_enlaces(object) {
    let enlaces = []
    for (let enlace in object) {
        let new_enlace = new Sinapsis(enlace.input_id, enlace.output_id, enlace.peso, enlace.is_enabled)
        enlaces.push(new_enlace)
    }
    return enlaces
}
function JSON_to_genoma(object) {
    return new Genoma(object.num_inputs, object.num_outputs, JSON_to_neuronas(object.neuronas), JSON_to_enlaces(object.links), object.id_genoma)

}
function JSON_to_ind(object) {
    return new Individuo(JSON_to_genoma(object.genoma), object.fitness)

}