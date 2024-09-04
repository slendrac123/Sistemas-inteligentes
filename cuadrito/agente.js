class Individuo extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.profundidad = 3;
    }
    //FUNCION FITNESS
    contar_combos(estado, i, j) {
        switch (estado[i][j]) {
            case 7:
                if (j > 0) {
                    board[i - 1][j] += 4
                    return 2 * this.contar_combos(estado, i, j - 1, estado[i][j - 1]);
                }
            case 11:
                if (i < this.board.length - 1) {
                    board[i - 1][j] += 8;
                    return 2 * this.contar_combos(estado, i + i, j, estado[i + 1][j]);
                }
            case 13:
                if (j < this.board.length - 1) {
                    board[i - 1][j] += 1;
                    return 2 * this.contar_combos(estado, i, j + 1, estado[i][j + 1]);
                }
            case 14:
                if (i > 0) {
                    board[i - 1][j] += 2;
                    return 2 * this.contar_combos(estado, i - 1, j, estado[i - 1][j]);
                }
            case 15:
                let flag1 = false;
                let flag2 = false;
                let flag3 = false;
                let flag4 = false;
                if (j > 0) {
                    board[i - 1][j] += 4;
                    flag1 = true;
                }
                if (i < this.board.length - 1) {
                    board[i - 1][j] += 8;
                    flag2 = true;
                }
                if (j < this.board.length - 1) {
                    board[i - 1][j] += 1;
                    flag3 = true;
                }
                if (i > 0) {
                    board[i - 1][j] += 2;
                    flag4 = true;
                }
                return 2 * flag1 ? this.contar_combos(estado, i, j - 1, estado[i][j - 1]) : 1
                    * flag2 ? this.contar_combos(estado, i + 1, j, estado[i + 1][j]) : 1
                        * flag3 ? this.contar_combos(estado, i, j + 1, estado[i][j + 1]) : 1
                            * flag4 ? this.contar_combos(estado, i - 1, j, estado[i - 1][j]) : 1;

            default:
                return 1;
        }
    }
    valor_estado(estado) {
        let neutral = 0;
        let red = 0;
        let yellow = 0;
        for (let i = 0; i < estado.length; i++) {
            for (let j = 0; j < estado.length; j++) {
                switch (estado[i][j]) {
                    case -1:
                        //red += 10;
                        yellow -= 1;
                        break;
                    case -2:
                        //yellow += 10;
                        red -= 1;
                        break;
                    case 0:
                        break;
                    /*esto deberia hacerse recursivamente*/
                    case 7:
                        neutral += this.contar_combos(estado, i, j);
                        break;
                    case 11:
                        neutral += this.contar_combos(estado, i, j);
                        break;
                    case 13:
                        neutral += this.contar_combos(estado, i, j);
                        break;
                    case 14:
                        neutral += this.contar_combos(estado, i, j);
                        break;
                    case 15:
                        neutral += this.contar_combos(estado, i, j);
                        break;
                }
            }
        }
        /*
        if (this.color != color) {
            neutral *= -1;
        }*/
        if (this.color == 'R') {
            if (red > (this.board.length * this.board.length) / 2) {
                return Infinity
            }
            return red * 100 + neutral;
        }
        if (yellow > (this.board.length * this.board.length) / 2) {
            return Infinity
        }
        return yellow * 100 + neutral;
    }
    compute(board, time) {
        //this.limit = board.length;
        // O(length¹ * limit^profundidad)
        //limit = profundidad_root(1/length²) * c
        this.limit = time / (Math.cbrt(board.length * board.length) * 100);
        console.log(this.limit);
        let alpha = -Infinity;
        let beta = Infinity;
        return this.min_max(board, this.profundidad, alpha, beta, true, [])[1];
    }

    min_max(estado, profundidad, alpha, beta, maximizando, c_move) {
        let winner = this.board.winner(estado);
        if (winner != ' ' || profundidad == 0) {
            return [this.valor_estado(estado), c_move];
        }
        let best_move;
        let limit = 0;
        let moves = this.board.valid_moves(estado);
        if (maximizando == true) {
            let max_eval = -Infinity;
            while (moves.length > 0) {
                if (limit++ > this.limit) break;
                //let move = moves.splice(0, 1)[0];
                let move = (moves.splice(Math.floor(Math.random() * moves.length), 1))[0];
                let hijo = this.board.clone(estado);
                this.board.move(hijo, move[0], move[1], move[2], this.color == 'R' ? -1 : -2);
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, false, move);
                if (val_minimax[0] > max_eval) {
                    best_move = val_minimax[1];
                    max_eval = val_minimax[0];
                }
                alpha = Math.max(alpha, val_minimax[0]);
                if (beta <= alpha) {
                    break;
                }
            }
            return [max_eval, best_move];
        }
        else {
            let min_eval = Infinity;
            while (moves.length > 0) {
                if (limit++ > this.limit) break;
                //let move = moves.splice(0, 1)[0];
                let move = (moves.splice(Math.floor(Math.random() * moves.length), 1))[0];
                let hijo = this.board.clone(estado);
                this.board.move(hijo, move[0], move[1], move[2], this.color == 'R' ? -2 : -1);
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, true, move);

                if (val_minimax[0] < min_eval) {
                    best_move = val_minimax[1];
                    min_eval = val_minimax[0];
                }
                beta = Math.min(beta, val_minimax[0]);
                if (beta <= alpha) {
                    break;
                }
            }
            return [min_eval, best_move];
        }
    }


}

