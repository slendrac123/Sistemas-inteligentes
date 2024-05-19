import { Population } from "./population";

const NUM_POBLACION = 20
const NUM_GENERACIONES = 200
let poblacion = new Population(NUM_POBLACION)
let fitness = (x) => x
let winner = poblacion.run(fitness, NUM_GENERACIONES)
save(winner.genome, 'ganador.txt');

function save(genoma, nombre) {

}