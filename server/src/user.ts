import type { User, UserWithoutWS } from './interface.js';

let uid = 0n;
const genUid = () => `ws-uid-${uid++}`;

const userList = new Map<string, User>();

const getUserList = () => {
  const result: UserWithoutWS[] = [];
  userList.forEach((item) => {
    result.push({
      name: item.name,
      uid: item.uid,
      ip: item.ip,
      time: item.time
    });
  });
  return result.sort((a, b) => a.time - b.time);
};

const getUserListWithWS = () => {
  const result: User[] = [];
  userList.forEach((item) => {
    result.push(item);
  });
  return result.sort((a, b) => a.time - b.time);
};

const getUserName = (uid: string) => userList.get(uid)?.name || '无名';
const getUser = (uid: string) => userList.get(uid);
const addUser = (uid: string, user: User) => userList.set(uid, user);
const removeUser = (uid: string) => userList.delete(uid);

export default {
  genUid,
  getUserList,
  getUserListWithWS,
  getUserName,
  getUser,
  addUser,
  removeUser
};
