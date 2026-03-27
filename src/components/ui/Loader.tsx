import styles from './Loader.module.scss';
import clsx from 'clsx';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullPage?: boolean;
}

export default function Loader({ size = 'md', label, fullPage = false }: LoaderProps) {
  return (
    <div className={clsx(styles.wrap, fullPage && styles.fullPage)}>
      <span className={clsx(styles.spinner, styles[size])} aria-label="Loading" role="status" />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
