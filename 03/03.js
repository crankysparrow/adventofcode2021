const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	let bits = data.split('\n').map((bit) => bit.split(''))

	console.log(problemTwo(bits))
}

function problemOne(bits) {
	let len = bits[0].length
	let gamma = ''
	let epsilon = ''

	for (let i = 0; i < len; i++) {
		let one = 0
		let zero = 0
		for (let j = 0; j < bits.length; j++) {
			if (bits[j][i] == '1') {
				one++
			} else {
				zero++
			}
		}

		if (one > zero) {
			gamma += '1'
			epsilon += '0'
		} else {
			gamma += '0'
			epsilon += '1'
		}
	}

	gamma = parseInt(gamma, 2)
	epsilon = parseInt(epsilon, 2)

	return gamma * epsilon
}

function problemTwo(bits) {
	let i = 0
	let oxygenBits = bits
	let co2Bits = bits

	while (i < bits[0].length && (oxygenBits.length > 1 || co2Bits.length > 1)) {
		if (oxygenBits.length > 1) oxygenBits = analyzeBits(oxygenBits, i).oxygen
		if (co2Bits.length > 1) co2Bits = analyzeBits(co2Bits, i).co2
		i++
	}

	let oxygen = parseInt(oxygenBits[0].join(''), 2)
	let co2 = parseInt(co2Bits[0].join(''), 2)
	return oxygen * co2
}

function analyzeBits(bits, pos) {
	if (bits.length <= 1) return bits
	let one = 0
	let zero = 0
	let ones = []
	let zeros = []
	for (let i = 0; i < bits.length; i++) {
		if (bits[i][pos] == '1') {
			one++
			ones.push(bits[i])
		} else {
			zero++
			zeros.push(bits[i])
		}
	}

	return {
		oxygen: one > zero ? ones : zero > one ? zeros : ones,
		co2: one > zero ? zeros : zero > one ? ones : zeros,
	}
}
