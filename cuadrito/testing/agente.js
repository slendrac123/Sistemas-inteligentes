import { Agent, Board, ambiente_run } from "./ambiente.js";

class Individuo extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.profundidad = 3;
        this.limit = 100;
    }
    //FUNCION FITNESS
    valor_estado(estado, color) {
        let neutral = 0;
        let red = 0;
        let yellow = 0;
        for (let i = 0; i < estado.length; i++) {
            for (let j = 0; j < estado.length; j++) {
                switch (estado[i][j]) {
                    case -1:
                        red += 7;
                        yellow -= 7;
                        break;
                    case -2:
                        yellow += 7;
                        red -= 7;
                        break;
                    case 0:
                        break;
                    case 7:
                        neutral += 5;
                        if (j > 0) {
                            switch (estado[i][j - 1]) {
                                case 5:
                                    neutral += 5;
                                    break;
                                case 9:
                                    neutral += 5;
                                    break;
                                case 11:
                                    neutral += 5;
                                    break;
                                case 12:
                                    class Individuo extends Agent {
                                        constructor() {
                                            super();
                                            this.board = new Board();
                                            this.profundidad = 3;
                                        }
                                        //FUNCION FITNESS
                                        valor_estado(estado, color) {
                                            let neutral = 0;
                                            let red = 0;
                                            let yellow = 0;
                                            for (let i = 0; i < estado.length; i++) {
                                                for (let j = 0; j < estado.length; j++) {
                                                    switch (estado[i][j]) {
                                                        case -1:
                                                            red += 7;
                                                            yellow -= 7;
                                                            break;
                                                        case -2:
                                                            yellow += 7;
                                                            red -= 7;
                                                            break;
                                                        case 0:
                                                            break;
                                                        case 7:
                                                            neutral += 5;
                                                            if (j > 0) {
                                                                switch (estado[i][j - 1]) {
                                                                    case 5:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 9:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 11:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 12:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 13:
                                                                        neutral += 5;
                                                                        break;
                                                                }
                                                            }
                                                            break;
                                                        case 11:
                                                            neutral += 5;
                                                            if (i < this.board.length - 1) {
                                                                switch (estado[i + 1][j]) {
                                                                    case 6:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 10:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 12:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 13:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 14:
                                                                        neutral += 5;
                                                                        break;
                                                                }
                                                            }
                                                            break;
                                                        case 13:
                                                            neutral += 5;
                                                            if (j < this.board.length - 1) {
                                                                switch (estado[i][j + 1]) {
                                                                    case 3:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 5:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 6:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 7:
                                                                        neutral += 5;
                                                                        break;
                                                                }
                                                            }
                                                            break;
                                                        case 14:
                                                            neutral += 5;
                                                            if (i > 0) {
                                                                switch (estado[i - 1][j]) {
                                                                    case 3:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 7:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 9:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 10:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 11:
                                                                        neutral += 5;
                                                                        break;
                                                                }
                                                            }
                                                            break;
                                                        case 15:
                                                            neutral += 5;
                                                            if (j > 0) {
                                                                switch (estado[i][j - 1]) {
                                                                    case 5:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 9:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 11:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 12:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 13:
                                                                        neutral += 5;
                                                                        break;
                                                                }
                                                            }
                                                            if (i < this.board.length - 1) {
                                                                switch (estado[i + 1][j]) {
                                                                    case 6:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 10:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 12:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 13:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 14:
                                                                        neutral += 5;
                                                                        break;
                                                                }
                                                            }
                                                            if (j < this.board.length - 1) {
                                                                switch (estado[i][j + 1]) {
                                                                    case 3:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 5:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 6:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 7:
                                                                        neutral += 5;
                                                                        break;
                                                                }
                                                            }
                                                            if (i > 0) {
                                                                switch (estado[i - 1][j]) {
                                                                    case 3:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 7:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 9:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 10:
                                                                        neutral += 5;
                                                                        break;
                                                                    case 11:
                                                                        neutral += 5;
                                                                        break;
                                                                }
                                                            }
                                                            break;
                                                    }
                                                }
                                            }
                                            if (this.color != color) {
                                                neutral *= -1;
                                            }
                                            if (this.color == 'R') {
                                                return red + neutral;
                                            }
                                            return yellow + neutral;
                                        }
                                        compute(board, time) {
                                            //this.limit = board.length;
                                            //this.limit = 50;
                                            this.limit = Math.cbrt(1 / (board.length * board.length * board.length)) * time / 10;
                                            let alpha = -Infinity;
                                            let beta = Infinity;
                                            return this.min_max(board, this.profundidad, alpha, beta, true, [], this.color)[1];
                                        }

                                        min_max(estado, profundidad, alpha, beta, maximizando, c_move, color) {
                                            let winner = this.board.winner(estado);
                                            if (winner != ' ' || profundidad == 0) {
                                                return [this.valor_estado(estado, color), c_move];
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
                                                    let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, false, move, this.color);
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
                                                    let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, true, move, this.color == 'R' ? 'Y' : 'R');

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

                                    neutral += 5;
                                    break;
                                case 13:
                                    neutral += 5;
                                    break;
                            }
                        }
                        break;
                    case 11:
                        neutral += 5;
                        if (i < this.board.length - 1) {
                            switch (estado[i + 1][j]) {
                                case 6:
                                    neutral += 5;
                                    break;
                                case 10:
                                    neutral += 5;
                                    break;
                                case 12:
                                    neutral += 5;
                                    break;
                                case 13:
                                    neutral += 5;
                                    break;
                                case 14:
                                    neutral += 5;
                                    break;
                            }
                        }
                        break;
                    case 13:
                        neutral += 5;
                        if (j < this.board.length - 1) {
                            switch (estado[i][j + 1]) {
                                case 3:
                                    neutral += 5;
                                    break;
                                case 5:
                                    neutral += 5;
                                    break;
                                case 6:
                                    neutral += 5;
                                    break;
                                case 7:
                                    neutral += 5;
                                    break;
                            }
                        }
                        break;
                    case 14:
                        neutral += 5;
                        if (i > 0) {
                            switch (estado[i - 1][j]) {
                                case 3:
                                    neutral += 5;
                                    break;
                                case 7:
                                    neutral += 5;
                                    break;
                                case 9:
                                    neutral += 5;
                                    break;
                                case 10:
                                    neutral += 5;
                                    break;
                                case 11:
                                    neutral += 5;
                                    break;
                            }
                        }
                        break;
                    case 15:
                        neutral += 5;
                        if (j > 0) {
                            switch (estado[i][j - 1]) {
                                case 5:
                                    neutral += 5;
                                    break;
                                case 9:
                                    neutral += 5;
                                    break;
                                case 11:
                                    neutral += 5;
                                    break;
                                case 12:
                                    neutral += 5;
                                    break;
                                case 13:
                                    neutral += 5;
                                    break;
                            }
                        }
                        if (i < this.board.length - 1) {
                            switch (estado[i + 1][j]) {
                                case 6:
                                    neutral += 5;
                                    break;
                                case 10:
                                    neutral += 5;
                                    break;
                                case 12:
                                    neutral += 5;
                                    break;
                                case 13:
                                    neutral += 5;
                                    break;
                                case 14:
                                    neutral += 5;
                                    break;
                            }
                        }
                        if (j < this.board.length - 1) {
                            switch (estado[i][j + 1]) {
                                case 3:
                                    neutral += 5;
                                    break;
                                case 5:
                                    neutral += 5;
                                    break;
                                case 6:
                                    neutral += 5;
                                    break;
                                case 7:
                                    neutral += 5;
                                    break;
                            }
                        }
                        if (i > 0) {
                            switch (estado[i - 1][j]) {
                                case 3:
                                    neutral += 5;
                                    break;
                                case 7:
                                    neutral += 5;
                                    break;
                                case 9:
                                    neutral += 5;
                                    break;
                                case 10:
                                    neutral += 5;
                                    break;
                                case 11:
                                    neutral += 5;
                                    break;
                            }
                        }
                        break;
                }
            }
        }
        if (this.color != color) {
            neutral *= -1;
        }
        if (this.color == 'R') {
            return red + neutral;
        }
        return yellow + neutral;
    }

    compute(board, time) {
        //this.limit = board.length;
        //this.limit = 50;
        let alpha = -Infinity;
        let beta = Infinity;
        return this.min_max(board, this.profundidad, alpha, beta, true, [], this.color)[1];
    }

    min_max(estado, profundidad, alpha, beta, maximizando, c_move, color) {
        let winner = this.board.winner(estado);
        if (winner != ' ' || profundidad == 0) {
            return [this.valor_estado(estado, color), c_move];
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
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, false, move, this.color);
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
                let val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, true, move, this.color == 'R' ? 'Y' : 'R');

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
class RandomPlayer extends Agent {

    constructor() {
        super();
        this.board = new Board();
        this.profundidad = 3;
    }
    compute(board, time) {
        let moves = this.board.valid_moves(board);
        return moves[Math.floor(Math.random() * moves.length)];
    }


}

let individuo = new Individuo();
let random = new RandomPlayer();

console.log("ganador: " + ambiente_run(individuo, random, 20));
