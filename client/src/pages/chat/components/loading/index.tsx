import { useEffect, useState } from 'react';

const Loading = () => {
  const [delayed, setDelayed] = useState(true);

  useEffect(() => {
    let isLiving = true;
    setTimeout(() => {
      if (isLiving) {
        setDelayed(false);
      }
    }, 2000);
    return () => {
      isLiving = false;
    };
  }, []);

  return !delayed && <div>历史信息加载中...</div>;
};

export default Loading;
