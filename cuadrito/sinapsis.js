class Sinapsis {
    /***
     * input_id := int
     * output_id := int
     * peso := double
     * is_enabled := bool
    ***/
    constructor(input_id, output_id, peso, is_enabled) {
        this.input_id = input_id
        this.output_id = output_id
        this.peso = peso
        this.is_enabled = is_enabled
    }
    crossover(sin_a, sin_b) {
        if (sin_a.input_id != sin_b.output_id || sin_a.output_id != sin_b.output_id) {
            throw ('Error, enlaces no iguales')
        }
        let input_id = sin_a.input_id, output_id = sin_a.output_id
        let peso
        if (Math.random() < 0.5) {
            peso = sin_a.peso
        } else {
            peso = sin_b.peso
        }
        let is_enabled
        if (Math.random() < 0.5) {
            is_enabled = sin_a.is_enabled
        } else {
            is_enabled = sin_b.is_enabled
        }
        return new Sinapsis(input_id, output_id, peso, is_enabled)
    }
}