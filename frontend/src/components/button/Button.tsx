import clsx from 'clsx';

import styles from './index.module.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button = ({ children, onClick, className }: ButtonProps) => {
  return (
    <button className={clsx(className, styles.button)} onClick={onClick}>
      {children}
    </button>
  );
}