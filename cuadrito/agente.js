const LIMIT = 100
const PROFUNDIDAD = 5;

class Individuo extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.counter = this.size / 2;
    }

    //NUESTRA FUNCION FITNESS
    valor_estado(estado, color) {
        let ret = 0;
        for (var i = 0; i < estado.length; i++) {
            for (var j = 0; j < estado.length; j++) {
                if (estado[i][j] < 0) {
                    if (estado[i][j] == -1) { ret++ } else { ret-- }
                }
            }
        }
        return color == 'R' ? ret : -ret;
    }
    compute(board, time) {
        // Always checks the current board status since opponent move can change several squares in the board
        if (time < 0.1) {
            return this.board.valid_moves[0];
        }

        let best_score = -Infinity;
        let best_move;
        let alpha_beta = [Infinity, -Infinity]
        let limit = 0;
        for (let move of this.board.valid_moves(board)) {
            if (limit++ == LIMIT) {
                break;
            }
            let n_board = this.board.clone(board);
            this.board.move(n_board, move[0], move[1], move[2], this.color);
            let score = this.min_max(n_board, PROFUNDIDAD, alpha_beta, true);
            if (best_score < score) {
                console.log(score);
                best_score = score;
                best_move = move;
            }
        }
        return best_move;
    }

    min_max(estado, profundidad, alpha_beta, maximizando) {
        let winner = this.board.winner(estado);
        if (winner != ' ' || profundidad == 0) {
            return this.valor_estado(estado, this.color);
        }
        if (maximizando) {
            let max_eval = -Infinity;
            for (let hijo of this.generar_hijos(estado, this.color == 'R' ? 'R' : 'Y')) {
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha_beta, false);
                max_eval = Math.max(max_eval, val_minimax);
                alpha_beta[0] = Math.max(alpha_beta[0], val_minimax);
                if (alpha_beta[1] <= alpha_beta[0]) {
                    break;
                }
            }
            return max_eval;
        }
        else {
            let min_eval = Infinity;
            for (let hijo of this.generar_hijos(estado, this.color == 'R' ? 'Y' : 'R')) {
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha_beta, true);
                min_eval = Math.min(min_eval, val_minimax);
                alpha_beta[1] = Math.min(alpha_beta[1], val_minimax);
                if (alpha_beta[1] <= alpha_beta[0]) {
                    break;
                }
            }
            return min_eval;
        }
    }


    generar_hijos(estado, color) {
        let arr = [];
        let i = 0;
        for (let move of this.board.valid_moves(estado)) {
            if (i++ == LIMIT) break;
            let new_estado = this.board.clone(estado);
            this.board.move(new_estado, move[0], move[1], move[2], color);
            arr.push(new_estado);
        }
        return arr;
    }
}

