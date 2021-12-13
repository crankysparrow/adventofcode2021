const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split('\n').map((edge) => edge.split('-'))

	console.log('possible paths:', solveCavePaths(data))
}

function solveCavePaths(caves) {
	let g = new Graph()
	caves.forEach((edge) => {
		g.addEdge(edge[0], edge[1])
	})

	return {
		'problem one': g.searchOne('start', 'end'),
		'problem two': g.search('start', 'end'),
	}
}

// reference for graph class: https://jarednielsen.com/data-structure-graph-depth-first-search/
class Graph {
	constructor() {
		this.vertices = []
		this.adjacent = {}
		this.edges = 0
		this.smallCaves = []
	}

	addVertex(v) {
		if (this.vertices.includes(v)) return
		this.vertices.push(v)
		this.adjacent[v] = []
		if (/[a-z]/.test(v) && !/start|end/.test(v)) {
			this.smallCaves.push(v)
		}
	}

	addEdge(v, w) {
		if (!this.vertices.includes(v)) {
			this.addVertex(v)
		}
		if (!this.vertices.includes(w)) {
			this.addVertex(w)
		}

		this.adjacent[v].push(w)
		this.adjacent[w].push(v)
		this.edges++
	}

	checkForDoubledSmallCaves(path) {
		for (let i = 0; i < path.length; i++) {
			let c = path[i]
			if (/[a-z]/.test(c) && !/start|end/.test(c)) {
				if (path.indexOf(c) > -1 && path.indexOf(c) !== path.lastIndexOf(c)) {
					return true
				}
			}
		}
		return false
	}

	search(start = 'start', end = 'end', path, finalPaths = []) {
		let adj = this.adjacent
		let currentPath = path ? path : [start]
		let paths = []
		let doubledSmall = this.checkForDoubledSmallCaves(currentPath)

		for (let i = 0; i < adj[start].length; i++) {
			let c = adj[start][i]
			let isSmall = /[a-z]/.test(c) && !/start|end/.test(c)

			if (
				(isSmall && currentPath.includes(c) && doubledSmall) ||
				(/start|end/.test(c) && currentPath.includes(c))
			) {
				continue
			}

			let newPath = currentPath.map((n) => n)
			newPath.push(c)

			if (c == 'end') {
				finalPaths.push(newPath)
			} else {
				paths.push(newPath)
				this.search(c, end, newPath, finalPaths)
			}
		}

		return finalPaths.length
	}

	searchOne(start = 'start', end = 'end', path, finalPaths = []) {
		let adj = this.adjacent
		let currentPath = path ? path : [start]
		let paths = []

		for (let i = 0; i < adj[start].length; i++) {
			let c = adj[start][i]

			if (/[A-Z]/.test(c) || !currentPath.includes(c)) {
				let newPath = currentPath.map((n) => n)
				newPath.push(c)

				if (c == 'end') {
					finalPaths.push(newPath)
				} else {
					paths.push(newPath)
					this.searchOne(c, end, newPath, finalPaths)
				}
			}
		}

		return finalPaths.length
	}
}

function testSimple() {
	const g = new Graph()

	g.addVertex('start')
	g.addVertex('end')
	g.addVertex('A')
	g.addVertex('b')
	g.addVertex('c')
	g.addVertex('d')

	g.addEdge('start', 'A')
	g.addEdge('start', 'b')
	g.addEdge('c', 'A')
	g.addEdge('A', 'end')
	g.addEdge('A', 'b')
	g.addEdge('b', 'end')
	g.addEdge('b', 'd')

	console.log(g.search('start', 'end'))
}
