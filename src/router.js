import { nuke } from './controllers';

export default async function router(options) {
	console.log(options);
	nuke();
}
