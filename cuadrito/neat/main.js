import { Individuo } from "./individuo.js"
import { Population } from "./population.js"
import * as fs from 'node:fs'

const NUM_POBLACION = 20
const NUM_GENERACIONES = 200
let poblacion = new Population(2)
let winner = poblacion.run(3, NUM_GENERACIONES)
console.log("game played")

function save(genoma, nombre) {
    console.log(genoma)
}
