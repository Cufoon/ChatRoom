import {
  Handler,
  OnWebSocketOpenCallback,
  useWebSocket
} from '../../hooks/useWebSocket';
import styles from './index.module.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MessageType,
  MessageTypeData,
  RoomMessage,
  UserInfo,
  UserMessage
} from '../../service/message.ts';
import { useNavigate } from 'react-router-dom';
import { ActionType, useDispatch, useSelector } from '../../hooks/useStore.ts';
import Profile from './components/profile';
import Communication from './components/communication';
import OnlineUser from './components/online-user';
import { setUsername } from '../../utils/storage.ts';
import Loading from './components/loading/index.tsx';

const enum LoadDataState {
  NONE = 0,
  LOGIN_SUCCESS = 1,
  LOAD_USER_LIST = 1 << 1,
  ALL_DONE = LOGIN_SUCCESS | LOAD_USER_LIST
}

const ChatPage = () => {
  const navigate = useNavigate();
  const username = useSelector((global) => global.name);
  const dispatch = useDispatch();

  const [inited, setInited] = useState(false);
  const [initState, setInitState] = useState(LoadDataState.NONE);
  const [userId, setUserId] = useState<string>('');
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [roomMessages, setRoomMessages] = useState<RoomMessage[]>([]);
  const [, setPersonMessages] = useState<UserMessage[]>([]);

  useEffect(() => {
    if (username === undefined) {
      navigate('/login');
    }
  }, [navigate, username]);

  const whenOpenWebSocket = useCallback<OnWebSocketOpenCallback>(
    (ws) => {
      ws.send({
        type: 'login',
        name: username
      });
    },
    [username]
  );

  const handleMessage = useMemo<Handler<MessageTypeData>>(() => {
    return {
      [MessageType.USER_LOGIN_SUCCESS]: (init) => {
        setUserId(init.uid);
        const filteredList: RoomMessage[] = init.history.map((item) => {
          return {
            ...item.data
          };
        });
        setRoomMessages(filteredList);
        setInitState((prevState) => prevState | LoadDataState.LOGIN_SUCCESS);
      },
      [MessageType.SYSTEM_USER_LIST]: (users) => {
        setUserList(users);
        setInitState((prevState) => prevState | LoadDataState.LOAD_USER_LIST);
      },
      [MessageType.GET_MESSAGE_FROM_ROOM]: (msg) => {
        setRoomMessages((prevState) => {
          return [...prevState, msg];
        });
      },
      [MessageType.GET_MESSAGE_FROM_PERSON]: (msg) => {
        setPersonMessages((prevState) => {
          prevState.push(msg);
          return prevState;
        });
      },
      [MessageType.SYSTEM_LOGIN]: (info) => {
        console.log(info);
      },
      [MessageType.SYSTEM_LOGOUT]: (info) => {
        console.log(info);
      }
    };
  }, []);

  const ws = useWebSocket(
    // 'ws://192.168.71.30:5000',
    `ws://${location.host}/ws`,
    whenOpenWebSocket,
    handleMessage
  );

  const [inputMessage, setInputMessage] = useState('');

  const onSendMessage = () => {
    console.log('发送文字');
    if (inputMessage.length > 0) {
      ws.send({
        type: 'text',
        text: inputMessage
      });
      setInputMessage('');
    }
  };

  const onSendMessageImage = (images: string[]) => {
    console.log('发送图片');
    const len = images.length;
    if (len > 0) {
      if (len > 100) {
        for (let i = 0; i < len; i += 100) {
          const next = i + 100;
          ws.send({
            type: 'image',
            text: `[${images
              .slice(i, next)
              .map((item) => JSON.stringify(item))
              .join(',')}]`
          });
        }
        return;
      }
      ws.send({
        type: 'image',
        text: `[${images.map((item) => JSON.stringify(item)).join(',')}]`
      });
    }
  };

  const onChangeName = async () => {
    await setUsername();
    dispatch({ type: ActionType.SET_NAME });
    navigate('/login');
  };

  useEffect(() => {
    if (initState === LoadDataState.ALL_DONE) {
      setInited(true);
    }
  }, [initState]);

  return (
    (inited && (
      <div className={styles.mainWrapper}>
        <div className={styles.main}>
          <div className={styles.left}>
            <Communication
              userId={userId}
              message={inputMessage}
              userNum={userList.length || 0}
              roomMessages={roomMessages}
              onMessageInput={setInputMessage}
              onSendMessage={onSendMessage}
              onSendMessageImage={onSendMessageImage}
            />
          </div>
          <div className={styles.rightWrapper}>
            <div className={styles.right} id='userListOuter'>
              <Profile name={username || ''} onChangeName={onChangeName} />
              <OnlineUser users={userList} currentUser={userId} />
            </div>
          </div>
        </div>
      </div>
    )) || <Loading />
  );
};

export default ChatPage;
