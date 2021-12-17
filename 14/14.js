const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input-test', 'utf8')
	data = data.split('\n\n')
	let template = data[0]
	let rules = {}

	data[1].split('\n').forEach((rule) => {
		let s = rule.split(' -> ')
		rules[s[0]] = s[1]
	})

	let rules2 = data[1].split('\n').map((r) => r.split(' -> '))

	let p1 = problemOne(template, rules, 10)
	let p2 = problemTwo(template, rules2, 40)

	console.log(p2)
}

function problemOne(template, rules, steps) {
	let step = 0

	while (step < steps) {
		let tArr = template.split('')
		let tNew = ''

		for (let i = 0; i < tArr.length - 1; i++) {
			tNew += tArr[i]
			let rule = rules[tArr[i] + tArr[i + 1]]
			if (rule) {
				tNew += rule
			}
		}

		tNew += tArr[tArr.length - 1]

		template = tNew
		step++
	}

	return countLetters(template)
}

function problemTwo(polymer, rulesArray, steps) {
	let pairs = new Map()
	for (let i = 0; i < polymer.length - 1; i++) {
		let pair = polymer[i] + polymer[i + 1]
		pairs.set(pair, pairs.get(pair) ? pairs.get(pair) + 1 : 1)
	}

	let rules = new Map()
	rulesArray.forEach((rule) => {
		let pair = rule[0]
		let insert = rule[1]

		let pairsFromInsert = [pair[0] + insert, insert + pair[1]]
		rules.set(pair, pairsFromInsert)
	})

	for (item of rules) {
		if (!pairs.has(item[0])) {
			pairs.set(item[0], 0)
		}
		if (!pairs.has(item[1][0])) {
			pairs.set(item[1][0], 0)
		}
		if (!pairs.has(item[1][1])) {
			pairs.set(item[1][1], 0)
		}
	}

	for (let i = 0; i < steps; i++) {
		pairs = pairInsertion(pairs, rules)
	}

	// console.log(countLettersFromPairs(pairs))
	return minMaxFromPairs(pairs)
}

function pairInsertion(pairs, rules) {
	let newPairs = new Map()

	for (item of pairs) {
		newPairs.set(item[0], 0)
	}

	for (item of pairs) {
		let pair = item[0]
		let num = item[1]

		if (num > 0) {
			let toAdd = rules.get(pair)
			newPairs.set(toAdd[0], newPairs.has(toAdd[0]) ? newPairs.get(toAdd[0]) + num : num)

			newPairs.set(toAdd[1], newPairs.has(toAdd[1]) ? newPairs.get(toAdd[1]) + num : num)
		}
	}

	return newPairs
}

function minMaxFromPairs(pairs) {
	let chars = new Map()
	for (pair of pairs) {
		let letters = pair[0]
		let l1 = letters[0]
		let l2 = letters[1]
		let num = pair[1]

		if (chars.has(l1)) {
			chars.set(l1, chars.get(l1) + num)
		} else {
			chars.set(l1, num)
		}

		if (chars.has(l2)) {
			chars.set(l2, chars.get(l2) + num)
		} else {
			chars.set(l2, num)
		}
	}

	let max, min

	for (char of chars) {
		let n = Math.ceil(char[1] / 2)
		chars.set(char[0], n)

		max = !max ? n : n > max ? n : max
		min = !min ? n : n < min ? n : min
	}

	return max - min
}

function countLettersFromPairs(pairs) {
	let count = 0
	for (pair of pairs) {
		count += pair[1]
	}
	return count + 1
}

function countLetters(template) {
	let counted = new Set()
	let max = 0
	let min = template.length

	// console.log({ templateLength: template.length })

	for (let i = 0; i < template.length; i++) {
		let letter = template[i]

		if (!counted.has(letter)) {
			counted.add(letter)
			let regex = new RegExp(letter, 'g')
			let count = template.match(regex).length
			if (count > max) max = count
			if (count < min) min = count
		}
	}

	return max - min
}
