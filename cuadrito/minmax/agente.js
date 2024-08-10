"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ambiente_1 = require("./ambiente");
var Agente = /** @class */ (function (_super) {
    __extends(Agente, _super);
    function Agente() {
        var _this = _super.call(this) || this;
        _this.board = new ambiente_1.Board();
        return _this;
    }
    Agente.prototype.compute = function (board, time) {
        // Always cheks the current board status since opponent move can change several squares in the board
        var moves = this.board.valid_moves(board);
        // Randomly picks one available move
        var index = Math.floor(moves.length * Math.random());
        for (var i = 0; i < 50000000; i++) { } // Making it very slow to test time restriction
        for (var i = 0; i < 50000000; i++) { } // Making it very slow to test time restriction
        return moves[index];
    };
    Agente.prototype.min_max = function (estado, profundidad, alpha, beta, maximizando) {
        var winner = this.board.winner(estado);
        if (winner != ' ') {
            if (winner == this.color) {
                return Infinity;
            }
            return -Infinity;
        }
        // Analizando su movimiento
        if (maximizando) {
            var max_eval = -Infinity;
            for (var _i = 0, _a = this.generar_hijos(estado); _i < _a.length; _i++) {
                var hijo = _a[_i];
                var val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, false);
                max_eval = max_eval > val_minimax ? max_eval : val_minimax;
                alpha = max_eval > val_minimax ? max_eval : val_minimax;
                if (beta <= alpha) {
                    break;
                }
            }
            return max_eval;
        }
        // Analizando el movimiento del rival
        else {
            var min_eval = Infinity;
            for (var _b = 0, _c = this.generar_hijos(estado); _b < _c.length; _b++) {
                var hijo = _c[_b];
                var val_minimax = this.min_max(hijo, profundidad - 1, alpha, beta, false);
                min_eval = min_eval < val_minimax ? min_eval : val_minimax;
                beta = beta < val_minimax ? beta : val_minimax;
                if (beta <= alpha) {
                    break;
                }
            }
            return min_eval;
        }
    };
    Agente.prototype.valor_estado = function (estado) {
        var ret = 0;
        for (var i = 0; i < estado.length; i++)
            for (var j = 0; j < estado.length; j++)
                if (estado[i][j] < 0) {
                    if (estado[i][j] == -1) {
                        ret++;
                    }
                    else {
                        ret--;
                    }
                }
        return ret;
    };
    Agente.prototype.generar_hijos = function (estado) {
        var arr = [];
        for (var _i = 0, _a = this.board.valid_moves(); _i < _a.length; _i++) {
            var move = _a[_i];
            this.board.move(move);
        }
        return arr;
    };
    return Agente;
}(ambiente_1.Agent));
