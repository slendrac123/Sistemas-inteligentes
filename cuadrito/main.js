import { Neurona } from './neurona.js'
import { Sinapsis } from './sinapsis.js'
import { Genoma } from './genoma.js'
import { Individuo } from './individuo.js'

/* TESTING */
let neurona_a = new Neurona(1, 0.5, (x) => x * x)
let neurona_b = new Neurona(2, 0.5, (x) => 2 * x)
let neurona_c = new Neurona(3, 0.5, (x) => 3 * x)
let enlace_a = new Sinapsis(1, 2, 1, true)
let enlace_b = new Sinapsis(1, 3, 1, true)
let genoma_a = new Genoma(1, 2, 1, [neurona_a, neurona_b], [enlace_a])
let genoma_b = new Genoma(2, 2, 1, [neurona_a, neurona_c], [enlace_a, enlace_b])
genoma_a.add_link(enlace_b)
genoma_a.mutate_add_link(genoma_a)
let individuo_a = new Individuo(genoma_a)
let individuo_b = new Individuo(genoma_b)
individuo_a.crossover(individuo_a, individuo_b)