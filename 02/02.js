const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	let directions = data
		.split('\n')
		.map((d) => d.split(' '))
		.map((d) => [d[0], +d[1]])

	console.log('step one: ', stepOne(directions))
	console.log('step two: ', stepTwo(directions))
}

function stepOne(directions) {
	let h = 0
	let v = 0

	directions.forEach((dir) => {
		if (dir[0] == 'forward') h += dir[1]
		if (dir[0] == 'up') v -= dir[1]
		if (dir[0] == 'down') v += dir[1]
	})

	return h * v
}

function stepTwo(directions) {
	let h = 0
	let v = 0
	let aim = 0

	directions.forEach((dir) => {
		if (dir[0] == 'forward') {
			h += dir[1]
			v += dir[1] * aim
		} else if (dir[0] == 'up') aim -= dir[1]
		else if (dir[0] == 'down') aim += dir[1]
	})

	return h * v
}
