import React, { FunctionComponent, useState } from 'react'
import useLocalStorageState from '../../hooks/useLocalStorage'

interface BoardProps {
    onClick: (index: number) => void
    squares: string[]
}
const Board: FunctionComponent<BoardProps> = ({ squares, onClick }) => {
    function renderSquare(i: number) {
        return (
            <button className="square" onClick={() => onClick(i)}>
                {squares[i]}
            </button>
        )
    };
    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    )
}

function Game() {
    // 🐨 squares is the state for this component. Add useState for squares

    const [currentStep, setCurrentStep] = useLocalStorageState("tic-tac-toe:step", 0)
    const [history, setHistory] = useLocalStorageState("tic-tac-toe:history", [Array(9).fill(null)])
    const currentSquares = history[currentStep]
    const nextValue = calculateNextValue(currentSquares)
    const winner = calculateWinner(currentSquares)
    const status = calculateStatus(winner, currentSquares, nextValue)

    console.log("currentStep", currentStep);
    console.log("history", history);

    function selectSquare(square: number) {
        console.log("square", square);
        console.log("currentSquares", currentSquares);
        if (winner || currentSquares[square]) {
            return
        }
        const newHistory = history.slice(0, currentStep + 1)
        console.log("newHistory", newHistory);
        const squaresCopy = [...currentSquares];
        squaresCopy[square] = nextValue
        setHistory([...newHistory, squaresCopy])
        setCurrentStep(newHistory.length)
    }

    function restart() {

        setHistory([Array(9).fill(null)])
        setCurrentStep(0)
    };
    const moves = history?.map((stepSquares: string[], step: number) => {
        const desc = step === 0 ? "Go to game start" : `Go to move ${step}`
        const isCurrentStep = step === currentStep;
        return <li key={step}>
            <button className="history-btn" disabled={isCurrentStep} onClick={() => setCurrentStep(step)}>
                {desc} {isCurrentStep ? `(current)` : null}
            </button>
        </li>
    })
    return (
        <div className="game">
            <div className="game-board">
                <Board onClick={selectSquare} squares={currentSquares} />
                <button className="restart history-btn" onClick={restart}>
                    restart
                </button>
            </div>
            <div className="game-info">
                <div className="status">{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    )
}

function calculateStatus(winner: string, squares: string[], nextValue: string) {
    return winner
        ? `Winner: ${winner}`
        : squares.every(Boolean)
            ? `Scratch: Cat's game`
            : `Next player: ${nextValue}`
}

function calculateNextValue(squares: any) {
    return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares: any) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}
const TicTacToe = () => {
    return (
        <>
            <h1 className="game-title">Tic-Tac-Toe Game</h1>
            <Game />
        </>
    )
}

export default TicTacToe
