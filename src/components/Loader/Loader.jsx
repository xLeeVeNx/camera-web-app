import styles from "./Loader.module.css";
import spinner from "../../assets/images/spinner.svg";

export const Loader = ({ text }) => {
  return (
    <div className={styles.loader}>
      <img src={spinner} className={styles.icon} alt="Загрузка" />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};
