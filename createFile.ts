import { ChannelResume, Post } from './chats.interface';
import { promises } from 'fs';

let out: Post[] = [];

export async function createFileToRemoved() {
	const messages = (JSON.parse((await promises.readFile('./result.json')).toString()) as ChannelResume).messages;
	messages.forEach((message) => {
		const index = out.findIndex((m) => message.from_id === m.from_id);
		if (index < 0) {
			out.push({
				from: message.from,
				from_id: message.from_id,
				date: message.date,
				count: 1,
			})
		} else {
			const lastCount = out[index].count;
			out[index] = {
				from: message.from,
				from_id: message.from_id,
				date: message.date,
				count: lastCount + 1,
			}
		}
	});
	out = out.filter(functionFilter);
	out.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
	promises.writeFile('countsMessages.json', JSON.stringify(out, null, '\t',));
}

function functionFilter(message: Post): boolean {
	return message.from !== null && (message.date < '2021-06')
}

createFileToRemoved();