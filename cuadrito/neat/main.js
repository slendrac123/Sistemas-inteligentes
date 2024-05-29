import { Population } from "./population.js"
import * as fs from 'node:fs'

export const NUM_POBLACION = 100
const NUM_GENERACIONES = 1
var size = 5
let poblacion = new Population(NUM_POBLACION)
let winners = poblacion.run(NUM_GENERACIONES, size)
save(winners, 'ganadores.txt')

function save(genomas, nombre) {
    let data = ""
    for (let genoma of genomas) {
        let str = JSON.stringify(genoma)
        data = data + str + "\n"
    }
    fs.writeFileSync(nombre, data)
}
