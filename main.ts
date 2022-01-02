import { Post } from './chats.interface';
import { createFileToRemoved } from './createFile';
import { requestDeleteUsers } from './purge';

let out: Post[] = [];
createFileToRemoved();
requestDeleteUsers(out);
