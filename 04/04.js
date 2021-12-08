const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split('\n\n')

	let nums = data[0].split(',').map((n) => +n)
	let bingo = data
		.slice(data.length * -1 + 1)
		.map((board) => board.split('\n').map((row) => row.split(/(?<!^)\s+/).map((n) => +n)))

	// /(?<!^)\s+/ = any num of space chars not at start of string
	console.log('problem one: ', problemOne(bingo, nums))
	console.log('problem two: ', problemTwo(bingo, nums))
}

function problemOne(bingo, nums) {
	let key = new Array(bingo.length)
	let bingoCopy = JSON.parse(JSON.stringify(bingo))
	for (let i = 0; i < key.length; i++) {
		key[i] = { cols: [0, 0, 0, 0, 0], rows: [0, 0, 0, 0, 0] }
	}

	for (num of nums) {
		for (let i = 0; i < bingo.length; i++) {
			let board = bingoCopy[i]

			for (let col = 0; col < 5; col++) {
				for (let row = 0; row < 5; row++) {
					let cur = board[row][col]
					if (cur === num) {
						key[i].cols[col]++
						key[i].rows[row]++
						board[row][col] = null

						if (key[i].cols[col] >= 5 || key[i].rows[row] >= 5) {
							return getWinningScore(board, num)
						}
					}
				}
			}
		}
	}
}

function findNumToWinForBoard(board, nums) {
	let rows = [0, 0, 0, 0, 0]
	let cols = [0, 0, 0, 0, 0]
	for (let i = 0; i < nums.length; i++) {
		let num = nums[i]
		for (let col = 0; col < 5; col++) {
			for (let row = 0; row < 5; row++) {
				let cur = board[row][col]
				if (cur === num) {
					rows[row]++
					cols[col]++

					board[row][col] = null

					if (rows[row] == 5 || cols[col] == 5) {
						return { winningNumber: num, numToWin: i, boardAtWin: board }
					}
				}
			}
		}
	}
}

function problemTwo(bingo, nums) {
	let key = []
	for (let i = 0; i < bingo.length; i++) {
		key.push(findNumToWinForBoard(bingo[i], nums))
	}

	let lastWinner = key.reduce((winner, current) => {
		if (current.numToWin > winner.numToWin) {
			return current
		} else {
			return winner
		}
	}, key[0])

	return getWinningScore(lastWinner.boardAtWin, lastWinner.winningNumber)
}

const getWinningScore = (board, num) =>
	board.reduce((total, row) => row.reduce((t, cur) => t + cur) + total, 0) * num
