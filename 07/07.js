const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split(',').map((n) => +n)

	// console.log('problem one: ', problemOne(data))
	console.time('prob2')
	console.log('problem two: ', problemTwo(data))
	console.timeEnd('prob2')

	// console.log('problem two first: ', problemTwoSolOne(data))
}

function problemOne(crabs) {
	let maxPosition = crabs.reduce((biggest, crab) => (crab > biggest ? crab : biggest))

	let fuels = new Array(maxPosition).fill(0)

	for (let i = 0; i < fuels.length; i++) {
		let fuel = 0
		crabs.forEach((crab) => {
			fuel += Math.abs(crab - i)
		})

		fuels[i] = fuel
	}

	let res = fuels.reduce(
		({ fuel, position }, current, i) => {
			if (current < fuel) {
				return { fuel: current, position: i }
			} else {
				return { fuel, position }
			}
		},
		{ fuel: fuels[0], position: null }
	)

	return res
}

function problemTwo_2(crabs) {
	console.time('second')
	let maxPosition = crabs.reduce((biggest, crab) => (crab > biggest ? crab : biggest))
	console.log(maxPosition)

	// let fuels = new Array(maxPosition).fill(0)

	let fuelUsed = false

	let pos = 0
	while (pos < maxPosition) {
		let fuel = 0
		crabs.forEach((crab) => {
			fuel += sumSteps(Math.abs(crab - pos))
		})

		fuelUsed = !fuelUsed ? fuel : fuel < fuelUsed ? fuel : fuelUsed
		pos++
	}

	console.timeEnd('second')
	return fuelUsed
}

function problemTwo(crabs) {
	let maxPosition = crabs.reduce((biggest, crab) => (crab > biggest ? crab : biggest))

	let stepCounts = []
	for (let i = 0; i <= maxPosition; i++) {
		stepCounts[i] = sumSteps(i)
	}

	let fuels = []
	for (let i = 0; i < maxPosition; i++) {
		fuels[i] = 0
		crabs.forEach((crab) => {
			fuels[i] += stepCounts[Math.abs(crab - i)]
		})
	}

	return Math.min(...fuels)
}

function sumSteps(n) {
	if (n == 0) return 0
	return n + sumSteps(n - 1)
}
