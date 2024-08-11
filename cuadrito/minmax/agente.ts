import { Board, Agent } from "./ambiente"


class Agente extends Agent {
    board: Board;
    color: string;
    size: number;
    time: number

    constructor() {
        super()
        this.board = new Board()
    }

    compute(board: number[], time: number) {
        // Always cheks the current board status since opponent move can change several squares in the board
        var moves = this.board.valid_moves(board)
        // Randomly picks one available move
        var index = Math.floor(moves.length * Math.random())
        for (var i = 0; i < 50000000; i++) { } // Making it very slow to test time restriction
        for (var i = 0; i < 50000000; i++) { } // Making it very slow to test time restriction
        return moves[index]
    }

    min_max(estado: number[], profundidad: number, alpha: number, beta: number, maximizando: boolean) {
        let winner = this.board.winner(estado);
        if (winner != ' ') {
            if (winner == this.color) {
                return Infinity;
            }
            return -Infinity;

        }
        // Analizando su movimiento
        if (maximizando) {
            let max_eval = -Infinity;
            for (let hijo of this.generar_hijos(estado)) {
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, false);
                max_eval = max_eval > val_minimax ? max_eval : val_minimax;
                alpha = max_eval > val_minimax ? max_eval : val_minimax;
                if (beta <= alpha) {
                    break
                }
            }
            return max_eval;
        }
        // Analizando el movimiento del rival
        else {
            let min_eval = Infinity;
            for (let hijo of this.generar_hijos(estado)) {
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, true);
                min_eval = min_eval < val_minimax ? min_eval : val_minimax;
                beta = beta < val_minimax ? beta : val_minimax;
                if (beta <= alpha) {
                    break
                }
            }
            return min_eval;
        }

    }

    valor_estado(estado: number[]) {
        let ret = 0;
        for (let i = 0; i < estado.length; i++)
            for (let j = 0; j < estado.length; j++)
                if (estado[i][j] < 0) {
                    if (estado[i][j] == -1) { ret++ } else { ret-- }
                }
        return ret;
    }
    generar_hijos(estado: number[], color: string) {
        let arr = [];
        for (let move of this.board.valid_moves()) {
            let new_estado = this.board.clone(estado);
            this.board.move(new_estado, move[0], move[1], move[2], color);
            arr.push(new_estado);
        }
        return arr;
    }

}


