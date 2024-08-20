class Individuo extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.alpha_beta = [-Infinity, Infinity];
        this.limit = 100;
        this.profundidad = 2;
    }

    //FUNCION FITNESS
    valor_estado(estado, color) {
        let score = 0;
        if (color == 'R') {
            for (let i = 0; i < estado.length; i++) {
                for (let j = 0; j < estado.length; j++) {
                    switch (estado[i][j]) {
                        case -1:  // Red completed a box
                            score += color == 'R' ? 10 : -10;
                            break;
                        case -2:  // Yellow completed a box
                            score += color == 'Y' ? 10 : -10;
                            break;
                        case 3:   
                        case 5:   
                        case 6:   
                            score += 2;  
                            break;
                        case 7:   
                        case 9:
                        case 10:
                            score -= 2;  
                            break;
                        case 11:  
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                            score -= 5;  // Stronger penalty for bad moves
                            break;
                    }
                }
            }
            return score;
        } else {
            for (let i = 0; i < estado.length; i++) {
                for (let j = 0; j < estado.length; j++) {
                    switch (estado[i][j]) {
                        case -1:  // Yellow completed a box
                            score += color == 'Y' ? 10 : -10;
                            break;
                        case -2:  // Red completed a box
                            score += color == 'R' ? 10 : -10;
                            break;
                        case 3:   
                        case 5:   
                        case 6:   
                            score += 2;  
                            break;
                        case 7:   
                        case 9:
                        case 10:
                            score -= 2;  
                            break;
                        case 11: 
                        case 12:
                        case 13:
                        case 14:
                        case 15:
                            score -= 5;  // Stronger penalty for bad moves
                            break;
                    }
                }
            }
            return score;
        }
    }


    // Método para calcular la mejor jugada
    compute(board, time) {
        //this.limit = board.length;
        this.alpha_beta = [-Infinity, Infinity];

        let best_score = -Infinity;
        let best_move;
        let limit = 0;
        let moves = this.board.valid_moves(board);
        for (let i = 0; i < moves.length; i++) {
            if (limit++ == this.limit) break;
            let move = (moves.splice(Math.floor(Math.random() * moves.length), 1))[0];
            let n_board = this.board.clone(board);
            this.board.move(n_board, move[0], move[1], move[2], this.color);
            let score = this.min_max(n_board, this.profundidad, this.alpha_beta, true);
            if (best_score < score) {
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

        let moves = this.board.valid_moves(estado);

        if (maximizando) {
            let max_eval = -Infinity;
            for (let move of moves) {
                let hijo = this.board.clone(estado);
                this.board.move(hijo, move[0], move[1], move[2], this.color);
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha_beta, false);
                max_eval = Math.max(max_eval, val_minimax);
                alpha_beta[0] = Math.max(alpha_beta[0], val_minimax);
                if (alpha_beta[1] <= alpha_beta[0]) {
                    break;
                }
            }
            return max_eval;
        } else {
            let min_eval = Infinity;
            let opponent_color = this.color == 'R' ? 'Y' : 'R';
            for (let move of moves) {
                let hijo = this.board.clone(estado);
                this.board.move(hijo, move[0], move[1], move[2], opponent_color);
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
}