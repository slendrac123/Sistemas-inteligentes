class Cuadrito extends Agent {
    constructor(genoma) {
        super()
        this.board = new Board()
        this.fitness = 0
        this.genoma = genoma
    }

    calc_fitness(board) {
        let fitness = 0
        let cr = 0
        let cy = 0
        for (var i = 0; i < board.length; i++)
            for (var j = 0; j < board.length; j++)
                if (board[i][j] < 0) {
                    if (board[i][j] == -1) { cr++ } else { cy++ }
                }
        if (this.color == 'R') {
            return cr - cy;
        } else {
            return cy - cr;
        }

    }
    compute(board, time) {
        // Always cheks the current board status since opponent move can change several squares in the board
        var moves = this.board.valid_moves(board)
        this.fitness += this.calc_fitness(board)
        // Randomly picks one available move
        var index = Math.floor(moves.length * Math.random())
        let neurona_a = Neurona(1, 0.5, (x) => x * x)
        let neurona_b = Neurona(2, 0.5, (x) => 2 * x)
        let enlace = Sinapsis(1, 2, 1, true)
        let genoma = Genoma(1, 2, 1, [neurona_a, neurona_b], [enlace])

        console.log(genoma)
        return moves[index]
    }

}
