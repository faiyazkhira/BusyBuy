import { useSelector } from "react-redux";
import styles from "../styles/Notification.module.css";

const Notification = () => {
  const notification = useSelector((state) => state.notificationReducer);

  console.log("Current notification state:", notification);

  if (!notification) return null;

  return (
    <div className={`${styles.notification} ${styles[notification.type]}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
