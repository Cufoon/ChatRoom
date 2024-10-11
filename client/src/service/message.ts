export interface UserInfo {
  name: string;
  uid: string;
}

export interface RoomMessage {
  name: string;
  uid: string;
  content: string;
  contentType?: string;
  time: string;
  mid: string;
}

export type UserMessage =
  | {
    from: string;
    uid: string;
    content: string;
    time: string;
  }
  | RoomMessage;

export const enum MessageType {
  USER_LOGIN_SUCCESS = 'login-success',
  GET_MESSAGE_FROM_ROOM = 'room-message',
  GET_MESSAGE_FROM_PERSON = 'user-message',
  SYSTEM_LOGIN = 'system-login',
  SYSTEM_LOGOUT = 'system-logout',
  SYSTEM_USER_LIST = 'system-user-list',
  SYSTEM_CLEAR_MESSAGES = 'system-clear-messages'
}

export interface MessageTypeData {
  [MessageType.USER_LOGIN_SUCCESS]: {
    uid: string;
    history: { type?: string; data: RoomMessage }[];
  };
  [MessageType.SYSTEM_LOGIN]: string;
  [MessageType.SYSTEM_USER_LIST]: UserInfo[];
  [MessageType.GET_MESSAGE_FROM_ROOM]: RoomMessage;
  [MessageType.GET_MESSAGE_FROM_PERSON]: UserMessage;
  [MessageType.SYSTEM_LOGOUT]: string;
}
