import { Genoma } from "./genoma.js"
import { Individuo } from "./individuo.js"
import { Neurona } from "./neurona.js"
import { Population } from "./population.js"
import * as fs from 'node:fs'
import { Sinapsis } from "./sinapsis.js"

const max_size = 5
//const size = Math.floor(Math.random() * max_size) + 1
export const SIZE = 5
//cada una de las casillas, el tiempo y el tamaño 
export const NUM_INPUTS = SIZE * SIZE + 2
export const NUM_OUTPUTS = 3
export const SOBREVIVIENTES = 50
export const NUM_POBLACION = 1000
const NUM_GENERACIONES = 100
const NOMBRE_ARCHIVO = "ganadores.txt"
let poblacion = new Population(NUM_POBLACION)
//let poblacion = read(NOMBRE_ARCHIVO)
let winners = poblacion.run(NUM_GENERACIONES, SIZE)
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
    for (let neurona of object) {
        let new_neurona = new Neurona(neurona.bias, neurona.activation, neurona.neuron_id)
        neuronas.push(new_neurona)
    }
    return neuronas
}
function JSON_to_enlaces(object) {
    let enlaces = []
    for (let enlace of object) {
        let new_enlace = new Sinapsis(enlace.input_id, enlace.output_id, enlace.peso, enlace.is_enabled)
        enlaces.push(new_enlace)
    }
    return enlaces
}
function JSON_to_genoma(object) {
    return new Genoma(object.num_inputs, object.num_outputs, JSON_to_neuronas(object.neuronas), JSON_to_enlaces(object.links), object.genome_id)

}
function JSON_to_ind(object) {
    return new Individuo(JSON_to_genoma(object.genoma), object.fitness)

}