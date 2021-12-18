const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split('\n').map((row) => row.split(''))

	console.log(problemOne(data))
}

function problemOne(data) {
	let g = new Graph()
	for (let y = 0; y < data.length; y++) {
		for (let x = 0; x < data[y].length; x++) {
			let v = `${x}-${y}-${data[y][x]}`
			g.addVertex(v)

			if (data[y - 1] && data[y - 1][x]) {
				g.addEdge(`${x}-${y - 1}-${data[y - 1][x]}`, v)
			}
			if (data[y + 1] && data[y + 1][x]) {
				g.addEdge(`${x}-${y + 1}-${data[y + 1][x]}`, v)
			}
			if (data[y][x - 1]) {
				g.addEdge(`${x - 1}-${y}-${data[y][x - 1]}`, v)
			}
			if (data[y][x + 1]) {
				g.addEdge(`${x + 1}-${y}-${data[y][x + 1]}`, v)
			}
		}
	}

	let distances = dijkstra(g, g.vertices[0])
	let result = distances[g.vertices[g.vertices.length - 1]]
	return result
}

class Graph {
	constructor() {
		this.vertices = []
		this.adjacent = {}
		this.edges = 0
	}

	addVertex(v) {
		if (this.vertices.includes(v)) return
		this.vertices.push(v)
		this.adjacent[v] = new Set()
	}

	addEdge(v, w) {
		if (!this.vertices.includes(v)) {
			this.addVertex(v)
		}
		if (!this.vertices.includes(w)) {
			this.addVertex(w)
		}

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

function getLength(v) {
	let arr = v.split('-')
	return +arr[arr.length - 1]
}
