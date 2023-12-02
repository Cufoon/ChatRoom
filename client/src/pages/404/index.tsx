import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }, [navigate]);

  return (
    <div className={styles.outer}>
      <div className={styles.png}></div>
      <div className={styles.text}>你来到了不存在的页面</div>
      <div className={styles.hint}>2秒后回到首页</div>
    </div>
  );
};

export default ForbiddenPage;
