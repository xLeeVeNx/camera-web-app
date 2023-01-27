import styles from "./Loader.module.css";
import spinner from "../../assets/images/spinner.svg";

export const Loader = ({ children }) => {
  return (
    <div className={styles.loader}>
      <img src={spinner} className={styles.icon} alt="Загрузка" />
      {children && <p className={styles.text}>{children}</p>}
    </div>
  );
};
