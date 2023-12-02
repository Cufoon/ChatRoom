import React from 'react';

import styles from './index.module.scss';
import TitleLine from '../title';

interface Props {
  name: string;
  onChangeName: () => void;
}

const Profile: React.FC<Props> = ({ name, onChangeName }) => {
  return (
    <div className={styles.profile}>
      <TitleLine title='个人资料' />
      <div className={styles.profileNameLine}>
        <div className={styles.profileName}>{name}</div>
        <div className={styles.profileNameChangeButton} onClick={onChangeName}>
          改名字
        </div>
      </div>
    </div>
  );
};

export default Profile;
