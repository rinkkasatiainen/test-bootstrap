import { expect } from 'chai'

class TicTacToe {
    private readonly board: string[][]

    public constructor() {
        this.board = [[],[],[]]
    }

    public printBoard() {
        if (this.board[0][0]) {
            return 'X__\n___\n___'
        }
        return '___\n___\n___'
    }

    public takeField(player: string, row: number, column: number) {
        this.board[row][column] = player
    }
}

const emptyBoard = `___
___
___`

describe('It', () => {
    it('has nine fields in a 3x3 grid', () => {
        const game = new TicTacToe().printBoard()
        expect(game).to.eql(emptyBoard)
    })
    it('allows a player to take an empty field', () => {
        const game = new TicTacToe()

        game.takeField('X', 0, 0)

        const board = game.printBoard()
        expect(board).to.eql( 'X__\n___\n___' )
    })


    it('has two players in the game (X and O)', () => {
        const game = new TicTacToe()

        game.takeField('X', 1, 1)
        game.takeField('O', 2, 2)

        const board = game.printBoard()
        expect(board).to.eql( '___\n_X_\n__O' )
    })
    it('switches player after every turn')
    describe('ends the game when', () => {
        it('all fields in a row are taken')
        it('all fields in a column are taken by a player')
        it('player makes giagonal line')
        it('all fields are filled')
    })
})
