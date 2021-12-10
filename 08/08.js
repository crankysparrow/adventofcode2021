const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data
		.split('\n')
		.map((line) =>
			line.split(' | ').map((x) => x.split(' ').map((n) => n.split('').sort().join('')))
		)

	// console.log('problem one: ', problemOne(data))
	console.log('problem two: ', problemTwo(data))
}

function problemOne(data) {
	let easy = 0
	data.forEach(([signal, output]) => {
		output.forEach((d) => {
			let len = d.length
			if (len === 7 || len === 3 || len === 4 || len === 2) {
				easy++
			}
		})
	})

	return easy
}

function problemTwo(data) {
	let outputs = []
	let res = 0
	data.forEach(([signals, numbers]) => {
		outputs.push(decode(signals, numbers))
	})

	return outputs.reduce((a, c) => a + c)
}

function decode(signals, numbers) {
	let one = signals.filter((signal) => signal.length == 2)[0].split('')
	let four = signals.filter((signal) => signal.length == 4)[0].split('')
	let fourMinusOne = four.filter((letter) => one.indexOf(letter) == -1)

	let sixDigits = signals.filter((signal) => signal.length == 6).map((item) => item.split(''))
	let fiveDigits = signals.filter((signal) => signal.length == 5).map((item) => item.split(''))

	let bottomRight, topRight, topLeft, middle, bottomLeft
	let six, zero, nine, three, five, two
	sixDigits.forEach((signal) => {
		if (signal.indexOf(one[0]) == -1) {
			topRight = one[0]
			bottomRight = one[1]
			six = signal.join('')
		} else if (signal.indexOf(one[1]) == -1) {
			topRight = one[1]
			bottomRight = one[0]
			six = signal.join('')
		} else if (signal.includes(fourMinusOne[0]) && signal.includes(fourMinusOne[1])) {
			nine = signal.join('')
			bottomLeft = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].filter(
				(letter) => !signal.includes(letter)
			)[0]
		} else {
			zero = signal.join('')
			if (signal.includes(fourMinusOne[0])) {
				topLeft = fourMinusOne[0]
				middle = fourMinusOne[1]
			} else {
				topLeft = fourMinusOne[1]
				middle = fourMinusOne[0]
			}
		}
	})

	fiveDigits.forEach((signal) => {
		if (!signal.includes(topLeft) && !signal.includes(bottomLeft)) {
			three = signal.join('')
		} else if (signal.includes(topLeft) && signal.includes(bottomRight)) {
			five = signal.join('')
		} else if (signal.includes(topRight) && signal.includes(bottomLeft)) {
			two = signal.join('')
		}
	})

	let answers = []

	numbers.forEach((n) => {
		if (n.length == 2) {
			answers.push(1)
		} else if (n.length == 7) {
			answers.push(8)
		} else if (n.length == 4) {
			answers.push(4)
		} else if (n.length == 3) {
			answers.push(7)
		} else if (n.length == 5) {
			answers.push(n == three ? 3 : n == five ? 5 : 2)
		} else if (n.length == 6) {
			answers.push(n == six ? 6 : n == zero ? 0 : 9)
		}
	})
	// console.log({ one, four, fourMinusOne, sixDigits, fiveDigits, three, two, zero })

	return +answers.join('')
}
