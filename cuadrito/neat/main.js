import { Genoma } from "./genoma.js"
import { Individuo } from "./individuo.js"
import { Neurona } from "./neurona.js"
import { Population } from "./population.js"
import * as fs from 'node:fs'
import { Sinapsis } from "./sinapsis.js"

export const NOMBRE_ARCHIVO = "ganadores.txt"
export const max_size = 10
export const limit_sup = Math.floor(Math.random() * 8) + 4
export const limit_inf = Math.floor(Math.random() * 9) + 2
//export const SIZE = 5
//cada una de las casillas, el tiempo y el tamaño 
export const NUM_INPUTS = max_size * max_size + 2
export const NUM_OUTPUTS = 3
export const NUM_POBLACION = 1000
export const SOBREVIVIENTES = 30
const NUM_GENERACIONES = 1000
let poblacion = read(NOMBRE_ARCHIVO)
poblacion.run(NUM_GENERACIONES)

export function save(genomas, nombre) {
    let data = ""
    for (let genoma of genomas) {
        let str = JSON.stringify(genoma)
        data = data + str + "\n"
    }
    fs.writeFileSync(nombre, data)
}

function read(nombre) {
    let str = ''
    try {
        str = fs.readFileSync(nombre, { encoding: 'utf-8' })
    } catch {
        return new Population(NUM_POBLACION)
    }
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
