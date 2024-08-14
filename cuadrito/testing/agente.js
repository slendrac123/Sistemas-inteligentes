import { Agent, Board, ambiente_run } from "./ambiente.js";

class Individuo extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.limit = 100;
        this.profundidad = 3;
    }
    //FUNCION FITNESS
    valor_estado(estado, color) {
        let ret = 0;
        let red = 0;
        let yellow = 0;
        for (var i = 0; i < estado.length; i++) {
            for (var j = 0; j < estado.length; j++) {
                switch (estado[i][j]) {
                    case -1:
                        red += 15;
                        break;
                    case -2:
                        yellow += 15;
                        break;
                    case 3:
                        ret += 1;
                        break;
                    case 5:
                        ret += 1;
                        break;
                    case 6:
                        ret += 1;
                        break;
                    case 7:
                        ret -= 5;
                        break;
                    case 9:
                        ret += 1;
                        break
                    case 10:
                        ret += 1;
                        break;
                    case 11:
                        ret -= 5;
                        break;
                    case 12:
                        ret += 1;
                        break;
                    case 13:
                        ret -= 5;
                        break;
                    case 14:
                        ret -= 5;
                        if (i > 0) {
                            switch (board[i - 1][j]) {
                                case 3:
                                    ret -= 5;
                                    break;
                                case 9:
                                    ret -= 5;
                                    break;
                                case 12:
                                    break;
                            }
                        }
                        break;
                    case 15:
                        ret -= 5;
                        break;
                }
            }
        }
        return color == 'R' ? (ret + red) : (ret + yellow)
    }
    compute(board, time) {
        //this.limit = board.length;
        let alpha = this.valor_estado(board) + 1;
        let beta = alpha + board.length;
        let move = this.min_max(board, this.profundidad, alpha, beta, true);
        console.log(move[2]);
        return move[1]
    }

    min_max(estado, profundidad, alpha, beta, maximizando, move) {
        let winner = this.board.winner(estado);
        if (winner != ' ' || profundidad == 0) {
            return [this.valor_estado(estado, this.color), move, alpha, beta];
        }
        let best_move;
        let limit = 0;
        let moves = this.board.valid_moves(estado);
        if (maximizando) {
            let max_eval = -Infinity;
            while (moves.length > 0) {
                if (limit++ == this.limit) break;
                let move = (moves.splice(Math.floor(Math.random() * moves.length), 1))[0];
                let hijo = this.board.clone(estado);
                this.board.move(hijo, move[0], move[1], move[2], this.color);
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, false, move);
                if (val_minimax[0] > max_eval) {
                    best_move = val_minimax[1];
                    max_eval = val_minimax[0];
                }
                if (alpha < val_minimax[0]) {
                    alpha = val_minimax[0];
                    //console.log(`alpha: ${alpha}`);
                }
                //alpha = Math.max(alpha, val_minimax[0]);
                if (beta <= alpha) {
                    break;
                }
            }
            return [max_eval, best_move, alpha, beta];
        }
        else {
            let min_eval = Infinity;
            let limit = 0;
            while (moves.length > 0) {
                if (limit++ == this.limit) break;
                let move = (moves.splice(Math.floor(Math.random() * moves.length), 1))[0];
                let hijo = this.board.clone(estado);
                this.board.move(hijo, move[0], move[1], move[2], this.color == 'R' ? 'Y' : 'R');
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, true, move);

                if (val_minimax[0] < min_eval) {
                    best_move = move;
                    min_eval = val_minimax[0];
                }
                if (beta > val_minimax[0]) {
                    beta = val_minimax[0];
                    //console.log(`beta: ${beta}`);
                }
                //beta = Math.min(beta, val_minimax[0]);
                if (beta <= alpha) {
                    break;
                } else {
                    //console.log("something");
                }
            }
            return [min_eval, best_move, alpha, beta];
        }
    }
}

class RandomPlayer extends Agent {
    constructor() {
        super()
        this.board = new Board()
    }

    compute(board, time) {
        // Always cheks the current board status since opponent move can change several squares in the board
        var moves = this.board.valid_moves(board)
        // Randomly picks one available move
        var index = Math.floor(moves.length * Math.random())
        return moves[index]
    }
}

let ind1 = new Individuo();
let random = new RandomPlayer();

console.log("ganador" + ambiente_run(ind1, random, 20));
