const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split('\n\n')
	let points = data[0].split('\n').map((point) => point.split(',').map((n) => +n))
	let instructions = data[1].split('\n').map((inst) => {
		let modify = inst.split('=')
		return [modify[0][modify[0].length - 1], +modify[1]]
	})

	console.log('problem one: ', problemOne(points, instructions))
	console.log('problem two: ', printLines(problemTwo(points, instructions)))
}

function problemOne(points, instructions) {
	let map = []
	let widest = 0
	points.forEach((point) => {
		if (!map[point[1]]) map[point[1]] = []
		if (point[0] > widest) widest = point[0]
		map[point[1]][point[0]] = '#'
	})

	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < widest + 1; x++) {
			if (!map[y]) map[y] = []
			if (!map[y][x]) map[y][x] = '.'
		}
	}

	if (instructions[0][0] == 'y') {
		return foldY(map, instructions[0][1]).numPoints
	} else {
		return foldX(map, instructions[0][1]).numPoints
	}
}

function problemTwo(points, instructions) {
	let height = Math.max(...points.map((p) => p[1])) + 1
	height = height % 2 !== 0 ? height : height + 1
	let width = Math.max(...points.map((p) => p[0])) + 1
	width = width % 2 !== 0 ? width : width + 1

	let paper = new Array(height).fill('.')
	paper = paper.map(() => new Array(width).fill('.'))

	points.forEach((point) => {
		paper[point[1]][point[0]] = '#'
	})

	for (let i = 0; i < instructions.length; i++) {
		if (instructions[i][0] == 'y') {
			paper = foldY(paper, instructions[i][1]).map
		} else if (instructions[i][0] == 'x') {
			paper = foldX(paper, instructions[i][1]).map
		}
	}

	return paper
}

function foldX(map, x) {
	let numPoints = 0
	let sides = map.map((row) => {
		let left = row.slice(0, x)
		let right = row.slice(-x).reverse()

		let newRow = []

		for (let i = 0; i < left.length; i++) {
			if (left[i] == '#' || right[i] == '#') {
				newRow[i] = '#'
				numPoints++
			} else {
				newRow[i] = '.'
			}
		}
		return newRow
	})

	return { map: sides, numPoints }
}

function foldY(map, y) {
	let top = map.slice(0, y)
	let bottom = map.slice(-y).reverse()
	let numPoints = 0

	let res = []

	for (let y = 0; y < bottom.length; y++) {
		res.push([])
		for (let x = 0; x < bottom[0].length; x++) {
			if ((top[y] && top[y][x] == '#') || (bottom[y] && bottom[y][x] == '#')) {
				numPoints++
				res[y][x] = '#'
			} else {
				res[y][x] = '.'
			}
		}
	}

	return { map: res, numPoints }
}

function printLines(o) {
	for (let i = 0; i < o.length; i++) {
		for (let j = 0; j < o[0].length; j++) {
			if (o[i] && o[i][j]) {
				process.stdout.write(o[i][j])
			} else {
				process.stdout.write('.')
			}
			process.stdout.write(' ')
		}
		process.stdout.write('\n')
	}
}
