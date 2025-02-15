import * as Yup from "yup";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "../styles/Checkout.module.css";
import { useCustom } from "../contexts/CustomContext";
import StateDropdown from "../components/StateDropdown";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  address: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  zip: Yup.string()
    .matches(/^\d{6}$/, "Invalid ZIP code")
    .required("Required"),
});

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const { formatCurrency } = useCustom();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, "userProfiles", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const calculateTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Save/update user profile if checkbox is checked

      if (values.saveInfo && currentUser) {
        await setDoc(doc(db, "userProfiles", currentUser.uid), {
          name: values.name,
          address: values.address,
          city: values.city,
          state: values.state,
          zip: values.zip,
        });
      }

      await runTransaction(db, async (transaction) => {
        await Promise.all(
          cart.items.map(async (item) => {
            const productRef = doc(db, "products", item.id);
            const productDoc = await transaction.get(productRef);

            if (!productDoc.exists()) {
              throw new Error(`Product ${item.name} not found`);
            }

            const newStock = productDoc.data().stock - item.quantity;
            if (newStock < 0) {
              throw new Error(`Insufficient stock for ${item.name}`);
            }

            transaction.update(productRef, { stock: newStock });
          })
        );

        const orderData = {
          userId: currentUser?.uid,
          userEmail: values.email,
          items: cart.items,
          total: calculateTotal(),
          shippingInfo: values,
          status: "processing",
          createdAt: serverTimestamp(),
        };

        /*-------*/

        const orderRef = doc(collection(db, "orders")); // Create a reference for the order
        transaction.set(orderRef, orderData);
        return orderRef.id;
      }).then((orderId) => {
        // Successfully placed the order, now clear the cart and set the order ID
        setOrderId(orderId); // Set the order ID state
        clearCart(); // Clear the cart after the order is placed
      });

      //   const orderData = {
      //     userId: currentUser?.uid,
      //     userEmail: values.email,
      //     items: cart.items,
      //     total: calculateTotal(),
      //     shippingInfo: values,
      //     status: "processing",
      //     createdAt: serverTimestamp(),
      //   };

      //   if (!currentUser) {
      //     return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
      //   }

      //   const docRef = await addDoc(collection(db, "orders"), orderData);
      //   setOrderId(docRef.id);
      //   clearCart();
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
      console.error("Error placing order:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (orderId) {
    return (
      <div className={styles.confirmation}>
        <h2>Order Confirmed!</h2>
        <p>Your order ID: {orderId}</p>
        <p>We've sent a confirmation to your email.</p>
        <button onClick={() => navigate("/")}>Continue Shopping</button>
        <button onClick={() => navigate("/orders")}>View Order History</button>
      </div>
    );
  }

  if (loadingProfile) {
    return <div className={styles.loading}>Loading your information...</div>;
  }

  return (
    <div className={styles.checkoutContainer}>
      <h2>Checkout</h2>
      <div className={styles.checkoutGrid}>
        <Formik
          initialValues={{
            name: userProfile?.name || "",
            email: currentUser?.email || "",
            address: userProfile?.address || "",
            city: userProfile?.city || "",
            state: userProfile?.state || "",
            zip: userProfile?.zip || "",
            saveInfo: !!userProfile, // Check if profile exists
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <Field name="name" type="text" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <Field name="email" type="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Address</label>
                <Field name="address" type="text" />
                <ErrorMessage
                  name="address"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label>City</label>
                <Field name="city" type="text" />
                <ErrorMessage
                  name="city"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label>State</label>
                <Field name="state" component={StateDropdown} />
                <ErrorMessage
                  name="state"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.formGroup}>
                <label>ZIP Code</label>
                <Field name="zip" type="text" />
                <ErrorMessage
                  name="zip"
                  component="div"
                  className={styles.error}
                />
              </div>

              {currentUser && (
                <div className={styles.saveInfo}>
                  <label>
                    <Field type="checkbox" name="saveInfo" />
                    Save shipping information for future purchases
                  </label>
                </div>
              )}

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </Form>
          )}
        </Formik>

        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          {cart.items.map((item) => (
            <div key={item.id} className={styles.orderItem}>
              <span>{item.name}</span>
              <span>
                {item.quantity} x {formatCurrency(item.price)}
              </span>
            </div>
          ))}
          <div className={styles.total}>
            <span>Total:</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
