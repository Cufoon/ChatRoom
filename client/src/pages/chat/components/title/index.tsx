import React from 'react';

import styles from './index.module.scss';

const TitleLine: React.FC<{ title: string }> = ({ title }) => {
  return <div className={styles.titleLine}>{title}</div>;
};

export default TitleLine;
