import React from 'react';
import cx from 'classnames';

import { UserInfo } from '../../../../service/message.ts';
import styles from './index.module.scss';
import TitleLine from '../title';

interface Props {
  users: UserInfo[];
  currentUser: string;
}

const OnlineUser: React.FC<Props> = ({ users, currentUser }) => {
  return (
    <div className={styles.cardWrapper}>
      <TitleLine title='在线用户' />
      <div id='userList' className={styles.userList}>
        {users.map((item) => {
          return (
            <div className={styles.userLine} key={item.uid}>
              <div
                className={cx(styles.user, {
                  [styles.userMe]: item.uid === currentUser
                })}
              >
                {item.name}
                <div className={styles.messageBtn}>私聊</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnlineUser;
