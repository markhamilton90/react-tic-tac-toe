import { useState } from "react"

/* Game component */
export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = useState(0)
    const [sort, setSort] = useState('asc')
    const xIsNext = currentMove % 2 === 0
    const currentSquares = history[currentMove]

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove)
    }

    function handleChange(event) {
        setSort(event.currentTarget.value)
    }

    const sortedHistory = sort == 'asc'
        ? [...history]
        : [...history.toReversed()]

    const moves = sortedHistory.map((squares, move) => {

        const isReversed = sort === 'desc'
        // update gameStart index to be first or last
        const gameStart = isReversed ? move === sortedHistory.length - 1 : move === 0
        // update move to count forwards or backwards
        move = isReversed ? sortedHistory.length - move - 1 : move

        let description = (gameStart)
            ? `Go to game start`
            : `Go to move #${move}`

        const textItem = (
            <li key={move}>
                You are at move #{move}
            </li>
        )

        const buttonItem = (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>
                    {description}
                </button>
            </li>
        )

        return (
            (currentMove === move) ? textItem : buttonItem
        )
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <select name="sort" onChange={ e => handleChange(e) }>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
                <ol>
                    {moves}
                </ol>
            </div>
        </div>
    )
}

/* Board component */
function Board({xIsNext, squares, onPlay}) {

    function handleClick(i) {
        if (squares[i] || calculateWinner(squares)) {
            return
        }
        const nextSquares = squares.slice()
        nextSquares[i] = xIsNext ? "X" : "O"
        onPlay(nextSquares)
    }

    const winner = calculateWinner(squares)
    let status;
    if (winner) {
        status = `Winner: ${winner}`
    } else {
        status = `Next player: ${ xIsNext ? 'X' : 'O' }`
    }

    const board = [
        [0,1,2],
        [3,4,5],
        [6,7,8]
    ]

    return (
        <>
            <div className="status">{status}</div>
            {
                board.map( (bRow, bIndex) => (
                    <div className="board-row" key={`board_${bIndex}`}>
                        {
                            bRow.map( index => (
                                <Square
                                    key={index}
                                    value={squares[index]}
                                    onSquareClick={() => handleClick(index)}
                                />
                            ))
                        }
                    </div>
                ))
            }
        </>
    )
}

/* Square component */
function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    )
}

/* Helpers */
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
