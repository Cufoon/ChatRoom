import { WebSocket, WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import userStore from './user.js';
import messageStore from './message.js';
let msgCount = 0n;
const formatTime = () => dayjs().format('YYYY-MM-DD HH:mm:ss');
const wss = new WebSocketServer({
    port: 3100,
    clientTracking: true,
    maxPayload: 42949672960,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
    }
});
const broadcast = (message) => {
    console.log(message);
    console.log(Date.now());
    msgCount++;
    const data = JSON.stringify(message);
    userStore.getUserListWithWS().forEach((item) => {
        if (item.ws.readyState === WebSocket.OPEN) {
            item.ws.send(data);
        }
    });
};
wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    let cufoon_chat_uid;
    const needLogin = setTimeout(() => {
        ws.close();
    }, 10000);
    ws.on('message', (content) => {
        const data = JSON.parse(content.toString());
        console.log('message', data);
        const type = data.type || 'none';
        if (cufoon_chat_uid !== undefined) {
            const username = userStore.getUserName(cufoon_chat_uid);
            if (type === 'system-clear-messages') {
                console.log('system-clear-messages');
                messageStore.clearHistory();
                broadcast({ type: 'system-clear-messages' });
                return;
            }
            if (type === 'text') {
                const msg = {
                    type: 'room-message',
                    data: {
                        name: username,
                        uid: cufoon_chat_uid,
                        content: data.text,
                        time: formatTime(),
                        mid: nanoid()
                    }
                };
                broadcast(msg);
                messageStore.saveHistory(msg);
                return;
            }
            if (type === 'image') {
                const msg = {
                    type: 'room-message',
                    data: {
                        name: username,
                        uid: cufoon_chat_uid,
                        content: data.text,
                        contentType: 'image',
                        time: formatTime(),
                        mid: nanoid()
                    }
                };
                broadcast(msg);
                messageStore.saveHistory(msg);
                return;
            }
            if (type === 'user-text') {
                const timeStr = formatTime();
                userStore.getUser(data.uid)?.ws.send(JSON.stringify({
                    type: 'user-message',
                    data: {
                        from: username,
                        uid: cufoon_chat_uid,
                        content: data.content,
                        time: timeStr
                    }
                }));
                ws.send(JSON.stringify({
                    type: 'user-message',
                    data: {
                        name: username,
                        uid: cufoon_chat_uid,
                        content: data.content,
                        time: timeStr
                    }
                }));
            }
            return;
        }
        if (type === 'login') {
            const uid = userStore.genUid();
            const loginName = data.name || '无名';
            userStore.addUser(uid, {
                uid,
                name: loginName,
                ip,
                time: Date.now(),
                ws
            });
            cufoon_chat_uid = uid;
            clearTimeout(needLogin);
            ws.send(`
      {
        "type": "login-success",
        "data": {
          "uid": ${JSON.stringify(uid)},
          "history": ${messageStore.getHistory()}
        }
      }
      `);
            broadcast({
                type: 'system-login',
                data: `--> ${loginName} <-- 加入聊天！`
            });
            broadcast({ type: 'system-user-list', data: userStore.getUserList() });
            return;
        }
    });
    ws.on('close', () => {
        if (cufoon_chat_uid !== undefined) {
            broadcast({
                type: 'system-logout',
                data: `--> ${userStore.getUserName(cufoon_chat_uid)} <-- 离开聊天。`
            });
            userStore.removeUser(cufoon_chat_uid);
            broadcast({ type: 'system-user-list', data: userStore.getUserList() });
        }
    });
});
