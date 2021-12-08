const fs = require('fs').promises

async function inputToNums(fileName) {
	let data = await fs.readFile(fileName, 'utf8')

	return data.split('\n')
}

module.exports = { inputToNums }
