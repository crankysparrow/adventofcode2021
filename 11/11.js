const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('/Users/michelleenos/advent-of-code/11/input', 'utf8')
	data = data.split('\n').map((r) => r.split('').map((n) => +n))

	// console.log(data)
	console.log('problem two: ', octopusTime(data))
}

function octopusTime(o) {
	let flashes = 0

	function reset(o) {
		for (let y = 0; y < o.length; y++) {
			for (let x = 0; x < o[0].length; x++) {
				if (o[y][x] == '_') o[y][x] = 0
			}
		}
	}

	function flash(o, y, x) {
		flashes++
		o[y][x] = '_'

		addEnergy(o, y - 1, x - 1)
		addEnergy(o, y - 1, x)
		addEnergy(o, y - 1, x + 1)
		addEnergy(o, y, x - 1)
		addEnergy(o, y, x + 1)
		addEnergy(o, y + 1, x)
		addEnergy(o, y + 1, x - 1)
		addEnergy(o, y + 1, x + 1)
	}

	function addEnergy(o, y, x) {
		if (o[y] && o[y][x] && o[y][x] !== '_') {
			o[y][x]++
			if (o[y][x] > 9) {
				flash(o, y, x)
			}
		}
	}

	let totalOctopuses = o.length * o[0].length
	let step = 1
	let final = 150
	while (step) {
		for (let y = 0; y < o.length; y++) {
			for (let x = 0; x < o[0].length; x++) {
				o[y][x]++
			}
		}
		for (let y = 0; y < o.length; y++) {
			for (let x = 0; x < o[0].length; x++) {
				if (o[y][x] == 10) {
					flash(o, y, x)
				}
			}
		}

		let flashed = 0

		for (let y = 0; y < o.length; y++) {
			for (let x = 0; x < o[0].length; x++) {
				if (o[y][x] == '_') {
					o[y][x] = 0
					flashed++
				}
			}
		}

		if (flashed == totalOctopuses) {
			printLines(o)
			return { step: step, flashes }
		}

		step++
	}

	// printLines(o)
	// return { step: final, flashes: flashes }
}

function printLines(o) {
	for (let i = 0; i < o.length; i++) {
		for (let j = 0; j < o[i].length; j++) {
			if (o[i][j] == 0) {
				process.stdout.write('\x1b[33m\x1b[89m')
				process.stdout.write(o[i][j].toString())
			} else {
				process.stdout.write('\x1b[0m')
				process.stdout.write(o[i][j].toString())
			}
		}
		process.stdout.write('\n')
	}
	process.stdout.write('\x1b[0m')
}
