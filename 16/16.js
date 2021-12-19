const fs = require('fs').promises
const util = require('util')

const key = {
	0: '0000',
	1: '0001',
	2: '0010',
	3: '0011',
	4: '0100',
	5: '0101',
	6: '0110',
	7: '0111',
	8: '1000',
	9: '1001',
	A: '1010',
	B: '1011',
	C: '1100',
	D: '1101',
	E: '1110',
	F: '1111',
}

let tests = [
	'8A004A801A8002F478',
	'620080001611562C8802118E34',
	'C0015000016115A2E0802F182340',
	'A0016C880162017C3686B18A3D4780',
]

async function main() {
	let data = await fs.readFile('input', 'utf8')

	data = parseData(data)
	// console.log('problem one: ', sumVersions(data))
	let m = packet(data)
	let o = organizePackets(m)

	console.log('main packet: ')
	console.log(util.inspect(m, { depth: null }))
	console.log('organized packet: ')
	console.log(util.inspect(o, { depth: null }))
}

main()
let testSum = parseData('C200B40A82')
let testProduct = parseData('04005AC33890')
let testMin = parseData('880086C3E88112')
let testMax = parseData('CE00C43D881120')
let testLt = parseData('D8005AC2A8F0')
let testGt = parseData('F600BC2D8F')
let testEq = parseData('9C005AC2F8F0')
let testMore = parseData('9C0141080250320F1802104A08')
// let m = packet(testMore)
// let o = organizePackets(m)

// console.log('main packet: ')
// console.log(util.inspect(m, { depth: null }))
// console.log('organized packet: ')
// console.log(util.inspect(o, { depth: null }))

function parseData(data) {
	return data
		.split('')
		.map((h) => key[h])
		.join('')
		.split('')
}

function sumVersions(p, vSum = 0) {
	if (p.length < 6) {
		return vSum
	}

	let v = parseInt(p.splice(0, 3).join(''), 2)
	vSum += v
	let t = parseInt(p.splice(0, 3).join(''), 2)

	if (t !== 4) {
		let i = p.splice(0, 1)

		if (i == 1) {
			let subPackets = parseInt(p.splice(0, 11).join(''), 2)
			return sumVersions(p, vSum)
		}

		if (i == 0) {
			let subBits = parseInt(p.splice(0, 15).join(''), 2)
			return sumVersions(p, vSum)
		}
	} else {
		let keepGoing = 1
		while (keepGoing > 0) {
			keepGoing = p.splice(0, 5)[0]
		}

		return sumVersions(p, vSum)
	}
}

function packet(p, currentPackets = []) {
	if (p.length < 6) {
		return currentPackets
	}
	let v = parseInt(p.splice(0, 3).join(''), 2)
	let t = parseInt(p.splice(0, 3).join(''), 2)
	let bitCount = 6

	if (t == 4) {
		let keepGoing = 1
		let literal = []

		while (keepGoing > 0) {
			keepGoing = p.splice(0, 1)
			literal.push(...p.splice(0, 4))
			bitCount += 5
		}
		literal = parseInt(literal.join(''), 2)
		currentPackets.push({ t, literal, bitCount })
		return packet(p, currentPackets)
	} else {
		let i = p.splice(0, 1)
		bitCount += 1

		if (i == 0) {
			let subBits = parseInt(p.splice(0, 15).join(''), 2)
			bitCount += 15
			currentPackets.push({ t, subBits, bitCount })
			return packet(p, currentPackets, bitCount)
		} else {
			let subPacketN = parseInt(p.splice(0, 11).join(''), 2)
			bitCount += 11
			currentPackets.push({ t, subPacketN, bitCount })
			return packet(p, currentPackets, bitCount)
		}
	}

	// return currentPackets
}

function organizePackets(packets) {
	let count = packets.length
	let packet = { ...packets[0] }
	let i = 1

	if (packet.subBits) {
		let bitCount = packet.bitCount
		packet.packets = []
		while (bitCount < packet.subBits) {
			packet.packets.push(packets[i])
			bitCount += packets[i].bitCount
			i++
		}

		if (packet.packets.length > 0) {
			packet.packets = organizePackets(packet.packets)
		}
	} else if (packet.subPacketN) {
		let subPacketCount = packet.subPacketN
		packet.packets = []
		let packetCount = 0

		while (packetCount < subPacketCount) {
			packet.packets.push({ ...packets[i] })
			if (packets[i].literal) {
				packetCount++
			}
			i++
		}

		if (packet.packets.length > 0) {
			packet.packets = organizePackets(packet.packets)
		}
	}

	return packet
}
