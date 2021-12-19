const fs = require('fs').promises
let Heap = require('heap')

main()

// this worked but it took literally hours :( i'd like to come back to this and find a better way

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split('\n').map((row) => row.split('').map((n) => +n))

	data = adjustData(data, 5)

	console.log(solve(data))
}

function solve(data) {
	let g = new Graph()

	let start = `0-0-${data[0][0]}`
	let h = data.length
	let w = data[0].length

	let end = `${w - 1}-${h - 1}-${data[h - 1][w - 1]}`

	for (let y = 0; y < data.length; y++) {
		for (let x = 0; x < data[y].length; x++) {
			let v = `${x}-${y}-${data[y][x]}`
			g.addVertex(v)

			if (data[y + 1] && data[y + 1][x]) {
				let down = `${x}-${y + 1}-${data[y + 1][x]}`
				g.addVertex(down)
				g.addEdge(down, v)
			}

			if (data[y][x + 1]) {
				let right = `${x + 1}-${y}-${data[y][x + 1]}`
				g.addVertex(right)
				g.addEdge(right, v)
			}
		}
	}

	let distances = dijkstraWithHeap(g, start)
	let result = distances[end]
	return result
}

function adjustData(data, times) {
	let w = data[0].length
	let h = data.length

	for (let y = 0; y < h; y++) {
		let tile = data[y]
		let nextTile = tile

		for (let i = 0; i < times - 1; i++) {
			nextTile = nextTile.map((n) => {
				n = +n
				return n == 9 ? 1 : n + 1
			})
			data[y].push(...nextTile)
		}
	}
	for (let i = 0; i < times - 1; i++) {
		for (let y = 0; y < h; y++) {
			let row = data[y + i * h]
			let nextRow = row

			nextRow = nextRow.map((n) => {
				return n == 9 ? 1 : n + 1
			})
			data.push(nextRow)
		}
	}

	return data
}

class Graph {
	constructor() {
		this.vertices = new Set()
		this.adjacent = {}
		this.edges = 0
	}

	addVertex(v) {
		this.vertices.add(v)
		if (!this.adjacent[v]) this.adjacent[v] = new Set()
	}

	addEdge(v, w) {
		this.adjacent[v].add(w)
		this.adjacent[w].add(v)
		this.edges++
	}
}

function dijkstra(graph, source) {
	let dist = {}
	let q = []
	dist[source] = 0

	graph.vertices.forEach((v) => {
		if (v != source) {
			dist[v] = Infinity
		}
		q.push(v)
	})

	let v

	while (q.length > 0) {
		process.stdout.write('q size: ' + q.length)
		process.stdout.cursorTo(0)
		let min = q.reduce((acc, cur) => {
			return dist[cur] < dist[acc] ? cur : acc
		})
		v = q.splice(q.indexOf(min), 1)

		let neighbors = graph.adjacent[v]
		neighbors.forEach((n) => {
			let alt = dist[v] + getLength(n)
			if (alt < dist[n]) {
				dist[n] = alt
			}
		})
	}

	return dist
}

function dijkstraWithHeap(graph, source) {
	console.log('start dijkstra')

	let cmp = function (a, b) {
		return dist[a] - dist[b]
	}
	let q = new Heap(cmp)

	let dist = {}
	dist[source] = 0

	graph.vertices.forEach((v) => {
		if (v != source) {
			dist[v] = Infinity
		}
		q.push(v)
	})

	while (q.size() > 0) {
		process.stdout.cursorTo(0)
		process.stdout.write('q size: ' + q.size())

		q.heapify()
		v = q.pop()
		let distV = dist[v]

		let neighbors = graph.adjacent[v]
		neighbors.forEach((n) => {
			let alt = distV + getLength(n)
			if (alt < dist[n]) {
				dist[n] = alt
			}
		})
	}

	process.stdout.write('\n')
	return dist
}

const getLength = (v) => +v.split('-')[2]

function printData(data) {
	for (let i = 0; i < data.length; i++) {
		process.stdout.write(data[i].join(''))
		process.stdout.write('\n')
	}
}
