// const fs = require('fs').promises

main()

function main() {
	// let data = await fs.readFile('input', 'utf8')
	// data = data.split('\n').map((r) => r.split('').map((n) => +n))
	// console.log('problem one: ', problemOne(data))

	var client = new XMLHttpRequest()
	client.open('GET', './input-test2')
	client.onload = function () {
		let res = client.response.split('\n').map((r) => r.split('').map((n) => +n))
		// console.log(problemOne(res))
		problemTwo(res)
	}
	client.send()
}

function problemOne(h) {
	let low = []
	h.forEach((r, y) => {
		r.forEach((c, x) => {
			if (r[x - 1] !== undefined && c >= r[x - 1]) return
			if (r[x + 1] !== undefined && c >= r[x + 1]) return
			if (h[y - 1] !== undefined && c >= h[y - 1][x]) return
			if (h[y + 1] !== undefined && c >= h[y + 1][x]) return

			low.push({ val: c, x, y })
		})
	})

	return low
}

function problemTwo(h) {
	let reef = document.getElementById('reef')

	h.forEach((r, y) => {
		let row = document.createElement('div')
		row.id = `row-${y}`

		r.forEach((c, x) => {
			let col = document.createElement('span')
			col.textContent = c
			col.id = `c-${y}-${x}`
			col.style.setProperty('--c', c)
			row.appendChild(col)
		})

		reef.appendChild(row)
	})

	let lowest = problemOne(h)
	lowest.forEach((point) => {
		let c = document.getElementById(`c-${point.y}-${point.x}`)
		c.style.backgroundColor = '#000'
		c.style.color = '#fff'
	})

	let uniqueId = 0
	for (let y = 0; y < h.length; y++) {
		for (let x = 0; x < h[y].length; x++) {
			let val = h[y][x]
			h[y][x] = { val, id: uniqueId }
			uniqueId++
		}
	}

	createGraphDifferent(h)

	// console.log(createGraph(h, { x: 0, y: 0, val: h[0][0].val, id: h[0][0].id }, 0))
}

function createGraphDifferent(h) {
	let cur
}

function createGraph(h, current, count) {
	count++
	console.log(current.val)
	if (count > 50) return current
	if (!current.hasOwnProperty('right')) {
		if (current.up?.right?.down) {
			current.right = current.up.right.down
			current.right.left = current
			return createGraph(h, current, count)
		} else if (current.down?.right?.up) {
			current.right = current.down.right.up
			current.right.left = current
			return createGraph(h, current, count)
		} else if (h[current.y][current.x + 1]) {
			current.right = {
				val: h[current.y][current.x + 1].val,
				id: h[current.y][current.x + 1].id,
				x: current.x + 1,
				y: current.y,
				left: current,
			}
			return createGraph(h, current.right, count)
		} else {
			current.right = null
			return createGraph(h, current, count)
		}
	} else if (!current.hasOwnProperty('down')) {
		if (current.left?.down?.right) {
			current.down = current.left.down.right
			current.down.up = current
			return createGraph(h, current, count)
		} else if (current.right?.down?.left) {
			current.down = current.right.down.left
			current.down.up = current
			return createGraph(h, current, count)
		} else if (h[current.y + 1] && h[current.y + 1][current.x]) {
			current.down = {
				val: h[current.y + 1][current.x].val,
				id: h[current.y + 1][current.x].id,
				x: current.x,
				y: current.y + 1,
				up: current,
			}
			return createGraph(h, current.down, count)
		} else {
			current.down = null
			return createGraph(h, current, count)
		}
	} else if (!current.hasOwnProperty('left')) {
		if (current.up?.left?.down) {
			current.left = current.up.left.down
			current.left.right = current
			return createGraph(h, current, count)
		} else if (current.down?.left?.up) {
			current.left = current.down.left.up
			current.left.right = current
			return createGraph(h, current, count)
		} else if (h[current.y][current.x - 1]) {
			current.left = {
				val: h[current.y][current.x - 1].val,
				id: h[current.y][current.x - 1].id,
				x: current.x - 1,
				y: current.y,
				right: current,
			}
			return createGraph(h, current.left, count)
		} else {
			current.left = null
			return createGraph(h, current, count)
		}
	} else if (!current.hasOwnProperty('up')) {
		if (current.right?.up?.left) {
			current.up = current.right.up.left
			current.up.down = current
			return createGraph(h, current, count)
		} else if (current.left?.up?.right) {
			current.up = current.left.up.right
			current.up.down = current
			return createGraph(h, current, count)
		} else if (h[current.y - 1] && h[current.y - 1][current.x]) {
			current.up = {
				val: h[current.y - 1][current.x].val,
				id: h[current.y - 1][current.x].id,
				x: current.x,
				y: current.y - 1,
				down: current,
			}
			return createGraph(h, current.up, count)
		} else {
			current.up = null
			return createGraph(h, current, count)
		}
	} else {
		return current
	}
}

// function createGraph(h, current) {
// 	current.val = h[current.y][current.x]

// 	if (!current.hasOwnProperty('right')) {
// 		if (h[current.y][current.x + 1] > -1) {
// 			let right = {
// 				x: current.x + 1,
// 				y: current.y,
// 				left: current,
// 			}
// 			current.right = right
// 			return createGraph(h, right)
// 		} else {
// 			current.right = null
// 			return createGraph(h, current)
// 		}
// 	} else if (!current.hasOwnProperty('down')) {
// 		if (h[current.y + 1] && h[current.y + 1][current.x] > -1) {
// 			let down = {
// 				x: current.x,
// 				y: current.y + 1,
// 				up: current,
// 			}
// 			current.down = down
// 			return createGraph(h, down)
// 		} else {
// 			current.down = null
// 			return createGraph(h, current)
// 		}
// 	} else {
// 		return current
// 	}
// }

// function tick(h, lowest, currentLowIndex, dir, x, y, prev) {
// 	let point = lowest[currentLowIndex]

// 	if (dir == 'right') {
// 		x = x ? x + 1 : point.x + 1
// 		y = y ? y : point.y
// 		prev = prev ? prev : point.val

// 		if (h[y][x] > prev) {
// 			setTimeout(() => {
// 				console.log({ val: h[y][x], x, y })
// 				let c = document.getElementById(`c-${y}-${x}`)
// 				c.style.backgroundColor = '#0af'

// 				tick(h, lowest, currentLowIndex, dir, x, y, h[y][x])
// 			}, 500)
// 		} else {
// 			// setTimeout(() => {
// 			// tick(h, lowest, currentLowIndex, 'down')
// 			// tick(h, lowest, currentLowIndex, 'left')
// 			// }, 500)
// 		}
// 	} else if (dir == 'left') {
// 		x = x ? x - 1 : point.x - 1
// 		y = y ? y : point.y
// 		prev = prev ? prev : point.val

// 		if (h[y][x] > prev) {
// 			setTimeout(() => {
// 				console.log({ val: h[y][x], x, y })
// 				tick(h, lowest, currentLowIndex, dir, x, y, h[y][x])
// 			}, 500)
// 		}
// 	}
// }

// function getBasin(h, point) {
// 	let collection = []
// 	let x = point.x + 1
// 	let y = point.y
// 	let prev = point.val

// 	setTimeout(() => iterateAcross(h, x, y, prev), 500)

// 	// while (h[y][x] !== undefined && h[y][x] > prev) {
// 	// 	collection.push({ val: h[y][x], x, y })
// 	// 	x++
// 	// 	prev = h[y][x]
// 	// }

// 	x = point.x - 1
// 	prev = point.val
// 	while (h[y][x] !== undefined && h[y][x] > prev) {
// 		collection.push({ val: h[y][x], x, y })
// 		x--
// 		prev = h[y][x]
// 	}

// 	// console.log(collection)
// }

// function iterateAcross(h, x, y, prev) {
// 	console.log('hi')
// 	console.log(h[y][x])
// 	if (h[y][x] !== undefined && h[y][x] > prev) {
// 		// return { res: { val: h[y][x], x, y }, prev: h[y][x] }
// 		console.log({ val: h[y][x], y, x })
// 		prev = h[y][x]
// 		setTimeout(() => {
// 			iterateAcross(h, x + 1, y, prev)
// 		}, 500)
// 	} else {
// 		return false
// 	}
// }
