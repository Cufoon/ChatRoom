let uid = 0n;
const genUid = () => `ws-uid-${uid++}`;
const userList = new Map();
const getUserList = () => {
    const result = [];
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
    const result = [];
    userList.forEach((item) => {
        result.push(item);
    });
    return result.sort((a, b) => a.time - b.time);
};
const getUserName = (uid) => userList.get(uid)?.name || '无名';
const getUser = (uid) => userList.get(uid);
const addUser = (uid, user) => userList.set(uid, user);
const removeUser = (uid) => userList.delete(uid);
export default {
    genUid,
    getUserList,
    getUserListWithWS,
    getUserName,
    getUser,
    addUser,
    removeUser
};
