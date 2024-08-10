import { Board, Agent } from "./ambiente"

function valor_estado(estado: Board) {
    if (Board.winner(estado))
        return 1;
}

function generar_hijos(estado: Board) {
    return [];
}

class Agente extends Agent {
    board: Board;
    color: string;

    constructor() {
        super()
        this.board = new Board()
    }

    compute(board: Board, time: number) {
        // Always cheks the current board status since opponent move can change several squares in the board
        var moves = this.board.valid_moves(board)
        // Randomly picks one available move
        var index = Math.floor(moves.length * Math.random())
        for (var i = 0; i < 50000000; i++) { } // Making it very slow to test time restriction
        for (var i = 0; i < 50000000; i++) { } // Making it very slow to test time restriction
        return moves[index]
    }

    min_max(estado: Board, profundidad: number, alpha: number, beta: number, maximizando: boolean) {
        let winner = Board.winner(estado);
        if (winner != ' ') {
            if (winner == this.color) {
                return 1;
            }
            return -1

        }
        // Analizando su movimiento
        if (maximizando) {
            let max_eval = -Infinity;
            for (let hijo of generar_hijos(estado)) {
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
            for (let hijo of generar_hijos(estado)) {
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, false);
                min_eval = min_eval < val_minimax ? min_eval : val_minimax;
                beta = beta < val_minimax ? beta : val_minimax;
                if (beta <= alpha) {
                    break
                }
            }
            return min_eval;
        }

    }
}


