/*
Fecha de entrega: 1 nov 2023, 9:00
Desarrollar un agente que juegue cuadrito. Tiene límite de tiempo:
 1. Aquí encuentran el código del ambiente
 2. Su agente debe heredar de la clase Agent y debe sobreescribir el método compute
 3. El método de iniciar el agente recibe tres argumentos: 
    - El color con que está jugando
    - El tablero inicial del cual puede obtener el tamaño (siempre cuadrado)
    - El tiempo total de juego en milisegundos
 4. El método compute recibe dos argumentos:
    - El tablero como va 
    - El tiempo que le queda a su agente en milisegundos
 5. El método compute debe retornar una lista con tres argumentos [fila, columna, lado]. El valor del lado
 es un número 0: arriba, 1: derecha, 2.abajo, 3:izquierda 
*/
/**
 * Abstarct agent class
 */
class Agent {
    /**
     * Creates an agent
     */
    constructor() { }

    /**
     * Initializes the agent
     * @param color Color of the agent pieces ('R':red or 'Y':yellow)
     * @param board Initial state of the board (empty, useful for obtaaining the size (nxn))
     * @param time Total amount of time the agent has for playing all the game (milliseconds)
     */
    init(color, board, time = 20000) {
        this.color = color
        this.time = time
        this.size = board.length
    }

    /**
     * Determines the next play of the agent
     * @param board Current square configuration
     * @param time Remaining time the agent has for playing all the game (milliseconds)
     * @return A list with three values [row, column, side]. Parameter size can take one of the following values: 
               0 is up, 1 is right, 2 is bottom, 3 is left  
     */
    compute(board, time) { return [0, 0, 0]; }
}

/*
 * A class for board operations (it is not the board but a set of operations over it)
 */
class Board {
    constructor() { }

    // Initializes a board of the given size. A board is a matrix of size*size of integers 0, .., 15, -1, or -2
    init(size) {
        var m = size - 1
        var board = []
        board[0] = []
        board[0][0] = 9
        for (var j = 1; j < m; j++) {
            board[0][j] = 1
        }
        board[0][m] = 3

        for (var i = 1; i < m; i++) {
            board[i] = []
            board[i][0] = 8
            for (var j = 1; j < m; j++) {
                board[i][j] = 0
            }
            board[i][m] = 2
        }

        board[m] = []
        board[m][0] = 12
        for (var j = 1; j < m; j++) {
            board[m][j] = 4
        }
        board[m][m] = 6

        return board
    }

    // Deep clone of a board the reduce risk of damaging the real board
    clone(board) {
        var size = board.length
        var b = []
        for (var i = 0; i < size; i++) {
            b[i] = []
            for (var j = 0; j < size; j++)
                b[i][j] = board[i][j]
        }
        return b
    }

    // Determines if a line can be drawn at row r, column c, side s 
    check(board, r, c, s) {
        if (board[r][c] < 0) return false
        s = 1 << s
        return ((board[r][c] & s) != s)
    }

    // Computes all the valid moves for the given 'color'
    valid_moves(board) {
        var moves = []
        var size = board.length
        for (var i = 0; i < size; i++)
            for (var j = 0; j < size; j++)
                for (var s = 0; s < 4; s++)
                    if (this.check(board, i, j, s)) moves.push([i, j, s])
        return moves
    }

    fill(board, i, j, color) {
        if (i < 0 || i == board.length || j < 0 || j == board.length) return board

        if (board[i][j] == 15 || board[i][j] == 14) {
            board[i][j] = color
            if (i > 0 && board[i - 1][j] >= 0) {
                board[i - 1][j] += 4
                this.fill(board, i - 1, j, color)
            }
        }

        if (board[i][j] == 15 || board[i][j] == 13) {
            board[i][j] = color
            if (j < board.length - 1 && board[i][j + 1] >= 0) {
                board[i][j + 1] += 8
                this.fill(board, i, j + 1, color)
            }
        }

        if (board[i][j] == 15 || board[i][j] == 11) {
            board[i][j] = color
            if (i < board.length - 1 && board[i + 1][j] >= 0) {
                board[i + 1][j] += 1
                this.fill(board, i + 1, j, color)
            }
        }

        if (board[i][j] == 15 || board[i][j] == 7) {
            board[i][j] = color
            if (j > 0 && board[i][j - 1] >= 0) {
                board[i][j - 1] += 2
                this.fill(board, i, j - 1, color)
            }
        }
        return board
    }

    // Computes the new board when a piece of 'color' is set at row i, column j, side s. 
    // If it is an invalid movement stops the game and declares the other 'color' as winner
    move(board, i, j, s, color) {
        if (this.check(board, i, j, s)) {
            var ocolor = (color == -2) ? -1 : -2
            board[i][j] |= 1 << s
            board = this.fill(board, i, j, ocolor)
            if (i > 0 && s == 0) {
                board[i - 1][j] |= 4
                board = this.fill(board, i - 1, j, ocolor)
            }
            if (i < board.length - 1 && s == 2) {
                    if(board[i+1][j] >= 0) board[i+1][j] |= 1
                board = this.fill(board, i + 1, j, ocolor)
            }
            if (j > 0 && s == 3) {
                board[i][j - 1] |= 2
                board = this.fill(board, i, j - 1, ocolor)
            }

            if (j < board.length - 1 && s == 1) {
                board[i][j + 1] |= 8
                board = this.fill(board, i, j + 1, ocolor)
            }
            return true
        }
        return false
    }

    // Determines the winner of the game if available 'R': red, 'Y': yellow, ' ': none
    winner(board) {
        var cr = 0
        var cy = 0
        for (var i = 0; i < board.length; i++)
            for (var j = 0; j < board.length; j++)
                if (board[i][j] < 0) {
                    if (board[i][j] == -1) { cr++ } else { cy++ }
                }
        if (cr + cy < board.length * board.length) return ' '
        if (cr > cy) return 'R'
        if (cy > cr) return 'Y'
        return ' '
    }

    // Draw the board on the canvas
    print(board) {
        var size = board.length
        // Commands to be run (left as string to show them into the editor)
        var grid = []
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var commands = [{ "command": "-" }]
                if (board[i][j] < 0) {
                    if (board[i][j] == -1) commands.push({ "command": "R" })
                    else commands.push({ "command": "Y" })
                    commands.push({ "command": "u" })
                    commands.push({ "command": "r" })
                    commands.push({ "command": "d" })
                    commands.push({ "command": "l" })
                } else {
                    if ((board[i][j] & 1) == 1) commands.push({ "command": "u" })
                    if ((board[i][j] & 2) == 2) commands.push({ "command": "r" })
                    if ((board[i][j] & 4) == 4) commands.push({ "command": "d" })
                    if ((board[i][j] & 8) == 8) commands.push({ "command": "l" })
                }
                grid.push({ "command": "translate", "y": i, "x": j, "commands": commands })
            }
        }

        var cmds = { "r": true, "x": 1.0 / size, "y": 1.0 / size, "command": "fit", "commands": grid }
        Konekti.client['canvas'].setText(cmds)
    }
}

/*
 * Player's Code (Must inherit from Agent: It is mandatory the inheritance process) 
 * This is an example of a rangom player agent
 *
 */
class RandomPlayer extends Agent {
    constructor() {
        super();
        this.board = new Board();
        this.maxDepth = 6; // Profundidad máxima inicial
        this.baseSampleSize = 10; // Tamaño de muestra base inicial
    }

    init(color, board, time) {
        super.init(color, board, time);
        this.color = color;
        this.size = board.length;
        this.baseSampleSize = this.calculateSampleSize(this.size);
        this.randomMovesCount = 10; // Número de movimientos aleatorios iniciales
        this.currentRandomMove = 0; // Contador de movimientos aleatorios realizados
    }

    /**
     * Calcula el tamaño de muestra basado en el tamaño del tablero.
     * @param {number} size - Tamaño del tablero.
     * @returns {number} - Tamaño de muestra adecuado.
     */
    calculateSampleSize(size) {
        if (size <= 5) {
            return 30; // Tableros pequeños

        } else if (size <= 8) {
            return 20; // Tableros medianos
        } else {
            return 10; // Tableros grandes
        }
    }

    /**
     * Simula un movimiento en el tablero y devuelve el nuevo estado del tablero.
     * @param {Array} board - El estado actual del tablero.
     * @param {Array} move - El movimiento a simular.
     * @param {string} color - El color del jugador.
     * @returns {Array} - El nuevo estado del tablero.
     */
    simulateMove(board, move, color) {
        const [row, col, side] = move;
        let newBoard = this.board.clone(board);
        this.board.move(newBoard, row, col, side, color === 'R' ? -1 : -2);
        return newBoard;
    }

    /**
     * Evalúa el tablero y devuelve una puntuación.
     * @param {Array} board - El estado del tablero a evaluar.
     * @returns {number} - La puntuación del tablero.
     */
    evaluateBoard(board) {
        let score = 0;
        const myAgent = this.color === 'R' ? -1 : -2;
        const opponent = this.color === 'R' ? -2 : -1;

        for (let row of board) {
            for (let cell of row) {
                if (cell === myAgent) score++;
                if (cell === opponent) score--;
            }
        }

        return score;
    }

    /**
     * Selecciona una muestra aleatoria de movimientos válidos.
     * @param {Array} arr - Array de movimientos válidos.
     * @param {number} size - Tamaño de la muestra a seleccionar.
     * @returns {Array} - Subconjunto aleatorio de movimientos.
     */
    getRandomSubset(arr, size) {
        let shuffled = arr.slice(0);
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, size);
    }

    /**
     * Algoritmo Minimax con poda Alfa-Beta.
     * @param {Array} board - Estado del tablero.
     * @param {number} depth - Profundidad actual de búsqueda.
     * @param {number} alpha - Valor alfa para la poda.
     * @param {number} beta - Valor beta para la poda.
     * @param {boolean} maximizingPlayer - Indica si es el jugador maximizador.
     * @returns {number} - Puntuación del tablero.
     */
    minimax(board, depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || this.board.winner(board) !== ' ') {
            return this.evaluateBoard(board);
        }

        let validMoves = this.board.valid_moves(board);
        validMoves = this.getRandomSubset(validMoves, Math.min(10, validMoves.length));

        if (maximizingPlayer) {
            let maxeval = -Infinity;
            for (const move of validMoves) {
                const newBoard = this.simulateMove(board, move, this.color);
                const evall = this.minimax(newBoard, depth - 1, alpha, beta, false);
                maxeval = Math.max(maxeval, evall);
                alpha = Math.max(alpha, evall);
                if (beta <= alpha) break;
            }
            return maxeval;
        } else {
            let mineval = Infinity;
            for (const move of validMoves) {
                const newBoard = this.simulateMove(board, move, this.color === 'R' ? 'Y' : 'R');
                const evall = this.minimax(newBoard, depth - 1, alpha, beta, true);
                mineval = Math.min(mineval, evall);
                beta = Math.min(beta, evall);
                if (beta <= alpha) break;
            }
            return mineval;
        }
    }

    /**
     * Encuentra el mejor movimiento posible.
     * @param {Array} board - Estado actual del tablero.
     * @returns {Array|null} - El mejor movimiento encontrado.
     */
    findBestMove(board) {
        let validMoves = this.board.valid_moves(board);
        validMoves = this.getRandomSubset(validMoves, Math.min(this.baseSampleSize, validMoves.length));

        let bestMove = null;
        let bestScore = -Infinity;

        for (const move of validMoves) {
            const newBoard = this.simulateMove(board, move, this.color);
            const score = this.minimax(newBoard, this.maxDepth, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove;
    }
    /**
      * Determina si un movimiento está en una esquina del tablero.
      * @param {Array} move - El movimiento a verificar.
      * @returns {boolean} - Verdadero si el movimiento está en una esquina.
      */
    isCornerMove(move) {
        const [row, col] = move;
        return (row === 0 || row === this.size - 1) && (col === 0 || col === this.size - 1);
    }

    /**
     * Filtra los movimientos válidos para excluir los que están en las esquinas.
     * @param {Array} moves - Lista de movimientos válidos.
     * @returns {Array} - Lista de movimientos válidos sin los movimientos de las esquinas.
     */
    filterCornerMoves(moves) {
        return moves.filter(move => !this.isCornerMove(move));
    }

    compute(board, time) {
        // Realizar movimientos aleatorios iniciales para tableros grandes
        if (this.size >= 11 && this.currentRandomMove < this.randomMovesCount) {
            this.currentRandomMove++;
            let validMoves = this.board.valid_moves(board);
            validMoves = this.filterCornerMoves(validMoves);
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        // Ajustar la profundidad según el tiempo restante
        if (time < this.time / 20) {
            this.maxDepth = 0; // Jugar al azar si queda muy poco tiempo
        } else if (time < this.time / 10) {
            this.maxDepth = 1;
        } else if (time < this.time / 4) {
            this.maxDepth = 3;
        } else if (time < this.time / 2) {
            this.maxDepth = 5;
        }

        if (this.maxDepth === 0) {
            // Modo de emergencia, elige un movimiento válido aleatorio
            const validMoves = this.board.valid_moves(board);
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }

        return this.findBestMove(board);
    }
}




/*
 * Environment (Cannot be modified or any of its attributes accesed directly)
 */
class Environment extends MainClient {
    constructor() {
        super()
        this.board = new Board()
    }

    setPlayers(players) { this.players = players }

    // Initializes the game 
    init() {
        var white = Konekti.vc('R').value // Name of competitor with red pieces
        console.log(white)
        var black = Konekti.vc('Y').value // Name of competitor with yellow pieces
        var time = 1000 * parseInt(Konekti.vc('time').value) // Maximum playing time assigned to a competitor (milliseconds)
        var size = parseInt(Konekti.vc('size').value) // Size of the reversi board

        this.size = size
        this.rb = this.board.init(size)
        this.board.print(this.rb)
        var b1 = this.board.clone(this.rb)
        var b2 = this.board.clone(this.rb)

        this.white = white
        this.black = black
        this.ptime = { 'R': time, 'Y': time }
        Konekti.vc('R_time').innerHTML = '' + time
        Konekti.vc('Y_time').innerHTML = '' + time
        this.player = 'R'
        this.winner = ''

        this.players[white].init('R', b1, time)
        this.players[black].init('Y', b2, time)
    }

    // Listen to play button 
    play() {
        var TIME = 10
        var x = this
        var board = x.board
        x.player = 'R'
        Konekti.vc('log').innerHTML = 'The winner is...'

        x.init()
        var start = -1

        function clock() {
            if (x.winner != '') return
            if (start == -1) setTimeout(clock, TIME)
            else {
                var end = Date.now()
                var ellapsed = end - start
                var remaining = x.ptime[x.player] - ellapsed
                Konekti.vc(x.player + '_time').innerHTML = remaining
                Konekti.vc((x.player == 'R' ? 'Y' : 'R') + '_time').innerHTML = x.ptime[x.player == 'R' ? 'Y' : 'R']

                if (remaining <= 0) x.winner = (x.player == 'R' ? x.black : x.white) + ' since ' + (x.player == 'R' ? x.white : x.black) + 'got time out'
                else setTimeout(clock, TIME)
            }
        }

        function compute() {
            var w = x.player == 'R'
            var id = w ? x.white : x.black
            var nid = w ? x.black : x.white
            var b = board.clone(x.rb)
            start = Date.now()
            var action = x.players[id].compute(b, x.ptime[x.player])
            var end = Date.now()
            var ply = (x.player == 'R') ? -1 : -2
            var flag = board.move(x.rb, action[0], action[1], action[2], ply)
            if (!flag) {
                x.winner = nid + ' ...Invalid move taken by ' + id + ' on column ' + action
            } else {
                var winner = board.winner(x.rb)
                if (winner != ' ') x.winner = winner
                else {
                    var ellapsed = end - start
                    x.ptime[x.player] -= ellapsed
                    Konekti.vc(x.player + '_time').innerHTML = '' + x.ptime[x.player]
                    if (x.ptime[x.player] <= 0) {
                        x.winner = nid + ' since ' + id + ' got run of time'
                    } else {
                        x.player = w ? 'Y' : 'R'
                    }
                }
            }

            board.print(x.rb)
            start = -1
            if (x.winner == '') setTimeout(compute, TIME)
            else Konekti.vc('log').innerHTML = 'The winner is ' + x.winner
        }

        board.print(x.rb)
        setTimeout(clock, 1000)
        setTimeout(compute, 1000)
    }
}

// Drawing commands
function custom_commands() {
    return [
        {
            "command": " ", "commands": [
                {
                    "command": "fillStyle",
                    "color": { "red": 255, "green": 255, "blue": 255, "alpha": 255 }
                },
                {
                    "command": "polygon",
                    "x": [0.2, 0.2, 0.8, 0.8],
                    "y": [0.2, 0.8, 0.8, 0.2]
                }

            ]
        },
        {
            "command": "-",
            "commands": [
                {
                    "command": "strokeStyle",
                    "color": { "red": 128, "green": 128, "blue": 128, "alpha": 255 }
                },
                {
                    "command": "polyline",
                    "x": [0, 0, 1, 1, 0],
                    "y": [0, 1, 1, 0, 0]
                }
            ]
        },
        {
            "command": "u",
            "commands": [
                {
                    "command": "strokeStyle",
                    "color": { "red": 0, "green": 0, "blue": 255, "alpha": 255 }
                },
                {
                    "command": "polyline",
                    "x": [0, 1],
                    "y": [0, 0]
                }
            ]
        },
        {
            "command": "d",
            "commands": [
                {
                    "command": "strokeStyle",
                    "color": { "red": 0, "green": 0, "blue": 255, "alpha": 255 }
                },
                {
                    "command": "polyline",
                    "x": [0, 1],
                    "y": [1, 1]
                }
            ]
        },
        {
            "command": "r",
            "commands": [
                {
                    "command": "strokeStyle",
                    "color": { "red": 0, "green": 0, "blue": 255, "alpha": 255 }
                },
                {
                    "command": "polyline",
                    "x": [1, 1],
                    "y": [0, 1]
                }
            ]
        },
        {
            "command": "l",
            "commands": [
                {
                    "command": "strokeStyle",
                    "color": { "red": 0, "green": 0, "blue": 255, "alpha": 255 }
                },
                {
                    "command": "polyline",
                    "x": [0, 0],
                    "y": [0, 1]
                }
            ]
        },
        {
            "command": "R",
            "commands": [
                {
                    "command": "fillStyle",
                    "color": { "red": 255, "green": 0, "blue": 0, "alpha": 255 }
                },
                {
                    "command": "polygon",
                    "x": [0.2, 0.2, 0.8, 0.8],
                    "y": [0.2, 0.8, 0.8, 0.2]
                }
            ]
        },
        {
            "command": "Y",
            "commands": [
                {
                    "command": "fillStyle",
                    "color": { "red": 255, "green": 255, "blue": 0, "alpha": 255 }
                },
                {
                    "command": "polygon",
                    "x": [0.2, 0.2, 0.8, 0.8],
                    "y": [0.2, 0.8, 0.8, 0.2]
                },
            ]
        }
    ]
}

