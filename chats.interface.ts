export interface ChannelResume {
	name: string;
	type: 'public_supergroup' | 'public_group' | 'channel';
	id: number;
	messages: Message[];
}

export interface Message {
	id: number;
	type: 'service' | 'message';
	date: string; // ISO Date
	edited?: string;
	from?: string;
	from_id?: string;
	actor?: string;
	actor_id?: string;
	action: 'migrate_from_group',
	title: string;
	text: string | string[];
}

export interface Post extends Pick<Message,'date' | 'from' |'from_id'> {
	count: number;
}