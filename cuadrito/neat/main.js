import { Population } from "./population.js"
import * as fs from 'node:fs'

const NUM_POBLACION = 20
const NUM_GENERACIONES = 200
var size = 5
let poblacion = new Population(2)
let winner = poblacion.run(3, NUM_GENERACIONES, size)
save(winner, 'ganador.txt')

function save(genoma, nombre) {
    let str = JSON.stringify(genoma)
    fs.writeFileSync(nombre, str)
}
