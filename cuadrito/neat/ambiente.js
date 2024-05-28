export class Agent {
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
export class Board {
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
                board[i + 1][j] |= 1
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
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                process.stdout.write(`${board[i][j]}`)
            }
            console.log()
        }
    }
}

export function ambiente_run(agente1, agente2, size) {
    let board = new Board()
    board.board = board.init(size)
    agente1.init('R', board, 20000)
    agente2.init('Y', board, 20000)
    let turno_agente1 = true
    let jugando = true
    let winner = ' '
    let turnos = 0
    while (jugando) {
        board.print(board.board)
        if (turno_agente1) {
            let move = agente1.compute(board.board)
            console.log(`${move}`)
            jugando = board.move(board.board, move[0], move[1], move[2], agente1.color)
            if (!jugando) {
                console.log("el ganador es Y")
                return 1
            }
        } else {
            let move = agente2.compute(board.board)
            console.log(`${move}`)
            jugando = board.move(board.board, move[0], move[1], move[2], agente2.color)
            if (!jugando) {
                console.log("el ganador es R")
                return 0
            }
        }
        turnos++
        console.log(`${turnos}`)
        turno_agente1 = turno_agente1 ? false : true
        console.log(`${turno_agente1}`)
        winner = board.winner(board.board)
        if (winner != ' ') {
            console.log(`el ganador es ${winner}`)
            if (winner == 'R') {
                return 0
            } else {
                return 1
            }
        }
    }
}

