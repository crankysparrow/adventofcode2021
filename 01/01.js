const fs = require('fs').promises

main()

async function main() {
	let data = await fs.readFile('input', 'utf8')
	let nums = data.split('\n').map((n) => +n)

	console.log('step one: ', stepOne(nums))
	console.log('step two: ', stepTwo(nums))
}

stepOne = (nums) => nums.reduce((acc, cur, i, arr) => acc + (cur > arr[i - 1] ? 1 : 0), 0)

stepTwo = (nums) => stepOne(nums.map((n, i, a) => n + a[i + 1] + a[i + 2]).slice(0, -2))
