const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data
		.split('\n')
		.map((line) => line.split(' -> ').map((points) => points.split(',').map((n) => +n)))

	console.log('problem one: ', problemOne(data))
	console.log('problem two: ', problemTwo(data))
}

function problemTwo(lines) {
	let max = lines.reduce(
		(current, [[x1, y1], [x2, y2]]) => {
			let x = x1 > x2 ? x1 : x2
			current.x = current.x > x ? current.x : x

			let y = y1 > y2 ? y1 : y2
			current.y = current.y > y ? current.y : y
			return current
		},
		{ x: 0, y: 0 }
	)

	let key = []
	for (let y = 0; y <= max.y; y++) {
		key[y] = []
		for (let x = 0; x <= max.x; x++) {
			key[y][x] = 0
		}
	}

	lines.forEach(([[x1, y1], [x2, y2]], i) => {
		if (x1 == x2) {
			for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
				key[y][x1]++
			}
		} else if (y1 == y2) {
			for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
				key[y1][x]++
			}
		} else {
			let xAsc = x1 < x2 ? true : false
			let yAsc = y1 < y2 ? true : false
			for (
				let x = x1, y = y1;
				(xAsc ? x <= x2 : x >= x2) && (yAsc ? y <= y2 : y >= y2);
				x += xAsc ? 1 : -1, y += yAsc ? 1 : -1
			) {
				key[y][x]++
			}
		}
	})

	let score = 0

	for (let y = 0; y < key.length; y++) {
		for (let x = 0; x < key[y].length; x++) {
			if (key[y][x] >= 2) score++
		}
	}

	return score
}

function problemOne(lines) {
	let onlyHorizontalAndVertical = lines.filter((line) => {
		return line[0][0] == line[1][0] || line[0][1] == line[1][1]
	})

	let max = onlyHorizontalAndVertical.reduce(
		(current, [[x1, y1], [x2, y2]]) => {
			let x = x1 > x2 ? x1 : x2
			current.x = current.x > x ? current.x : x

			let y = y1 > y2 ? y1 : y2
			current.y = current.y > y ? current.y : y
			return current
		},
		{ x: 0, y: 0 }
	)

	let key = []
	for (let y = 0; y <= max.y; y++) {
		key[y] = []
		for (let x = 0; x <= max.x; x++) {
			key[y][x] = 0
		}
	}

	onlyHorizontalAndVertical.forEach(([[x1, y1], [x2, y2]], i) => {
		if (x1 == x2) {
			for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
				key[y][x1]++
			}
		} else if (y1 == y2) {
			for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
				key[y1][x]++
			}
		}
	})

	let score = 0

	for (let y = 0; y < key.length; y++) {
		for (let x = 0; x < key[y].length; x++) {
			if (key[y][x] >= 2) score++
		}
	}

	return score
}

function stringifyKey(key) {
	let stringedKey = ''
	key.forEach((line) => {
		stringedKey += '\n'
		line.forEach((item) => {
			stringedKey += item.toString()
		})
	})
	return stringedKey
}
