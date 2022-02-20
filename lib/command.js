const child_process = require('child_process');
const DEFAULT_FLAT_LEVEL = 100;

module.exports = {
	args: {
		map: (args, func) => {
			return args.map(func).flat(DEFAULT_FLAT_LEVEL);
		}
	},
	exec: async (...args) => {
		const command = args.join(' ');

		return new Promise((resolve, reject) => {
			child_process.exec(command, (err, stdout, stderr) => {
				process.stdout.write(stdout);
				process.stderr.write(stderr);

				if (err) {
					reject(err);
				} else {
					resolve({ stdout, stderr });
				}
			});
		})
	}
}