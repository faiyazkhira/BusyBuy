import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import styles from "./../styles/OrderHistory.module.css";
import { useCustom } from "../contexts/CustomContext";
import { useSelector } from "react-redux";

export default function OrderHistory() {
  const { currentUser } = useSelector((state) => state.authReducer);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCustom();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const orderData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className={styles.orderHistory}>
      <h2>Order History</h2>
      {orders.map((order) => (
        <div key={order.id} className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <span className={styles.orderId}>Order ID: {order.id}</span>
            &nbsp;
            <span className={styles.orderDate}>
              Date:{" "}
              {new Date(order.createdAt?.toDate()).toLocaleDateString("en-GB")}
            </span>
          </div>
          <div className={styles.orderDetails}>
            <div className={styles.items}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.total}>
              <span>Total:</span> <span>{formatCurrency(order.total)}</span>
            </div>
            <div className={styles.status}>Status: {order.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
