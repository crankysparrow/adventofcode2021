const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	data = data.split('\n')
	console.log('problem one: ', problemOne(data))
	console.log('problem two: ', problemTwo(data))
}

function problemOne(lines) {
	let points = 0
	let res = []
	lines.forEach((line) => {
		let a = analyzeLine(line)
		res.push(a)
		if (a.invalid) points += a.point
	})

	return points
}

function analyzeLine(line) {
	const regex = /[{|\[|<|\(\)][\)|\]|\}|\>]/m
	let m = line.match(regex)

	while (m) {
		let g = m[0]
		if (
			(g[0] === '{' && g[1] !== '}') ||
			(g[0] === '[' && g[1] !== ']') ||
			(g[0] === '<' && g[1] !== '>') ||
			(g[0] === '(' && g[1] !== ')')
		) {
			let point = g[1] === ')' ? 3 : g[1] === ']' ? 57 : g[1] === '}' ? 1197 : 25137
			return { invalid: true, point: point }
		}

		let index = m.index
		line = line.slice(0, index) + line.slice(index + 2)
		m = line.match(regex)
	}

	return { incompleteLine: line }
}

function problemTwo(lines) {
	let autocompleteLines = []
	lines.forEach((line) => {
		let a = analyzeLine(line)
		if (a.incompleteLine) {
			autocompleteLines.push(findAutocompleteLine(a.incompleteLine))
		}
	})

	let scores = []
	autocompleteLines.forEach((line) => {
		scores.push(findAutocompleteScore(line))
	})

	return findMedian(scores)
}

function findAutocompleteLine(line) {
	let autocomplete = ''
	for (let i = line.length - 1; i >= 0; i--) {
		if (line[i] === '<') autocomplete += '>'
		else if (line[i] === '(') autocomplete += ')'
		else if (line[i] === '[') autocomplete += ']'
		else if (line[i] === '{') autocomplete += '}'
	}

	return autocomplete
}

function findAutocompleteScore(line) {
	let score = 0
	line.split('').forEach((i) => {
		score *= 5
		score += i == ']' ? 2 : i == ')' ? 1 : i == '}' ? 3 : 4
	})

	return score
}

function findMedian(scores) {
	let sorted = scores.sort((a, b) => b - a)
	return sorted[Math.floor(sorted.length / 2)]
}
