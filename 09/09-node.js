const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split('\n').map((r) => r.split('').map((n) => +n))
	// console.log('problem one: ', problemOne(data))
	console.log('problem two: ', problemTwo(data))
}

function problemOne(h) {
	let lows = findLows(h)

	let risk = 0
	lows.forEach((low) => (risk += low.val + 1))
	return risk
}

function findLows(h) {
	let lows = []
	h.forEach((r, y) => {
		r.forEach((c, x) => {
			if (r[x - 1] !== undefined && c >= r[x - 1]) return
			if (r[x + 1] !== undefined && c >= r[x + 1]) return
			if (h[y - 1] !== undefined && c >= h[y - 1][x]) return
			if (h[y + 1] !== undefined && c >= h[y + 1][x]) return

			lows.push({ val: c, x, y })
		})
	})

	return lows
}

function problemTwo(h) {
	let lows = findLows(h)
	// h = h.map((r) =>
	// 	r.map((item) => {
	// 		return { val: item, basined: false }
	// 	})
	// )
	let basins = []
	for (let i = 0; i < lows.length; i++) {
		let low = lows[i]
		basins.push(findBasin(h, low.val, low.x, low.y, true))
	}

	let sorted = basins.sort((a, b) => b - a)
	return sorted[0] * sorted[1] * sorted[2]
	// return basins.sort((a, b) => b - a)
}

function findBasin(h, low, x, y, initial) {
	let size = initial ? 1 : 0

	h[y][x] = '_'
	// console.log({ low, up, down, left, right })
	let up = h[y - 1]?.[x]
	if (up > low && up !== 9) {
		size += 1
		size += findBasin(h, up, x, y - 1)
	}

	let down = h[y + 1]?.[x]
	if (down > low && down !== 9) {
		size += 1
		size += findBasin(h, down, x, y + 1)
	}

	let left = h[y][x - 1]
	if (left > low && left !== 9) {
		size += 1
		size += findBasin(h, left, x - 1, y)
	}

	let right = h[y][x + 1]
	if (right > low && right !== 9) {
		size += 1
		size += findBasin(h, right, x + 1, y)
	}

	return size
}
