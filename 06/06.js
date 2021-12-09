const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split(',').map((n) => +n)

	console.log('problem one: ', countTheFishes(data, 80))
	console.log('problem two: ', countTheFishes(data, 256))
}

// test case
let day0 = [0, 1, 1, 2, 1, 0, 0, 0, 0]
let day1 = [1, 1, 2, 1, 0, 0, 0, 0, 0]
let day2 = [1, 2, 1, 0, 0, 0, 1, 0, 1]
let day3 = [2, 1, 0, 0, 0, 1, 1, 1, 1]
let day4 = [1, 0, 0, 0, 1, 1, 3, 1, 2]

function countTheFishes(data, days) {
	let lanternfish = []
	for (let i = 0; i <= 8; i++) {
		lanternfish[i] = 0
	}

	data.forEach((fish) => {
		lanternfish[fish]++
	})
	// process.stdout.write('day 00: ' + lanternfish.toString())
	// process.stdout.write('\n')

	let day = 1

	while (day <= days) {
		let readyToSpawn = lanternfish[0]
		for (let i = 0; i <= 7; i++) {
			lanternfish[i] = lanternfish[i + 1]
		}
		lanternfish[6] += readyToSpawn
		lanternfish[8] = readyToSpawn

		// process.stdout.write('day ' + padDigit(day.toString()) + ': ' + lanternfish.toString())
		// process.stdout.write('\n')
		day++
	}

	let total = 0
	for (let i = 0; i <= 8; i++) {
		total += lanternfish[i]
	}

	return total
}

function padDigit(d) {
	if (d.length < 2) {
		return '0' + d
	}
	return d
}

function iterateLanternfish(lanternfish) {
	let initialLen = lanternfish.length
	for (let i = 0; i < initialLen; i++) {
		if (lanternfish[i] === 0) {
			lanternfish.push(8)
			lanternfish[i] = 6
		} else {
			lanternfish[i]--
		}
	}

	return lanternfish
}
