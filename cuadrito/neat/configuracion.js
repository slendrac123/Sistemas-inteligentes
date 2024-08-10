const INIT_MEAN = 0.0
const INIT_STDEV = 1.0
const MIN = -1.0
const MAX = 1.0
export const MUTATION_RATE = 0.05
const MUTATE_POWER = 1.2
const REPLACE_RATE = 0.05

export class Configuracion {
    constructor(init_mean = INIT_MEAN, init_stdev = INIT_STDEV, min = MIN, max = MAX, mutation_rate = MUTATION_RATE, mutate_power = MUTATE_POWER, replace_rate = REPLACE_RATE) {
        this.init_mean = init_mean
        this.init_stdev = init_stdev
        this.min = min
        this.max = max
        this.mutation_rate = mutation_rate
        this.mutate_power = mutate_power
        this.replace_rate = replace_rate

    }
    clamp(val, min = this.min, max = this.max) {
        return Math.min(Math.max(val, min), max)
    }
    //nuevo valor siguiendo una distribucion normal
    gaussianRandom(mean = this.init_mean, stdev = this.init_stdev) {
        const u = 1 - Math.random() // Converting [0,1) to (0,1]
        const v = Math.random()
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
        // Transform to the desired mean and standard deviation:
        return this.clamp(z * stdev + mean)
    }

    mutate_delta(value) {
        let delta = this.clamp(this.gaussianRandom(0.0, this.mutate_power))
        return this.clamp(value + delta)
    }

}
