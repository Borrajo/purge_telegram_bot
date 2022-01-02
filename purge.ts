import { Post } from './chats.interface';
import { promises } from 'fs';
import Axios from 'axios';

require('dotenv').config();

const botExecuteMethod = (method: string) => `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_TOKEN}/${method}`;
const basicPayload = {
	chat_id: process.env.CHAT_ID
}

async function getMembersCount(): Promise<number> {
	return (await Axios.post(botExecuteMethod('getChatMemberCount'), basicPayload)).data.result as number;
}

export async function requestDeleteUsers(listOfUsersToBeRemoved?: Post[]) {
	const people = listOfUsersToBeRemoved ?? (JSON.parse((await promises.readFile('./countsMessages.json')).toString()) as Post[])
	const message = () => `Se ha ejecutado la Purga:\nDe los ${people.length} candidatos a ser eliminados\n${chatResume.deleted} fueron purgados/desbaneados\n${chatResume.totalBefore - chatResume.totalAfter} usuarios han sido expulsados.`
	const chatResume = {
		totalBefore: 0,
		totalAfter: 0,
		deleted: 0,
		nonDeleted: 0,
	}
	chatResume.totalBefore = await getMembersCount();
	const requests: Promise<any>[] = [];
	people.forEach(async (person) => {
		const data = {
			...basicPayload,
			user_id: person.from_id?.replace('user', '')
		};
		requests.push(Axios.post(botExecuteMethod('unbanChatMember'), data)
			.catch(() => chatResume.nonDeleted++));
	});
	const responses = await Axios.all(requests);
	responses.forEach((response) => {
		if (response) {
			chatResume.deleted++;
		}
	});
	chatResume.totalAfter = await getMembersCount();
	Axios.post(botExecuteMethod('sendMessage'), { ...basicPayload, text: message() })
		.catch((error) => console.log(error.data.description));
	console.log(chatResume);
}

requestDeleteUsers();
