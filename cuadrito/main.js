import { Neurona } from './neurona.js'
import { Sinapsis } from './sinapsis.js'
import { Genoma } from './genoma.js'

let neurona_a = new Neurona(1, 0.5, (x) => x * x)
let neurona_b = new Neurona(2, 0.5, (x) => 2 * x)
let neurona_c = new Neurona(3, 0.5, (x) => 3 * x)
let enlace_a = new Sinapsis(1, 2, 1, true)
let enlace_b = new Sinapsis(1, 3, 1, true)
let genoma = new Genoma(1, 2, 1, [neurona_a, neurona_b], [enlace_a])
genoma.add_link(enlace_b)
genoma.add_neurona(neurona_c)
genoma.mutate_add_link(genoma)
genoma.mutate_remove_link(genoma)