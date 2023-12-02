import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUsername } from '../../utils/storage';
import styles from './index.module.scss';
import { ActionType, useDispatch } from '../../hooks/useStore.ts';

const LoginPage = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async () => {
    if (name === '') {
      return;
    }
    dispatch({
      type: ActionType.SET_NAME,
      payload: name
    });
    await setUsername(name);
    navigate('/chat');
  };

  return (
    <div className={styles.login}>
      <div className={styles.title}>一个聊天室</div>
      <div className={styles.loginOuter}>
        <input
          className={styles.input}
          placeholder='输入你的用户名'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className={styles.comein} onClick={login}>
          进入聊天室
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
