import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useCustom } from "../contexts/CustomContext";
import styles from "../styles/Cart.module.css";
import { FaPlus, FaMinus } from "react-icons/fa6";

export default function Cart() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const { formatCurrency } = useCustom();

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(id, Number(newQuantity));
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  if (cart.items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Your cart is empty</h2>
        <Link to="/products" className={styles.continueShopping}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartItems}>
        <div className={styles.cartHeader}>
          <h2>Shopping Cart</h2>
          <button onClick={clearCart} className={styles.clearCart}>
            Clear Cart
          </button>
        </div>

        {cart.items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemInfo}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>{formatCurrency(item.price)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className={styles.removeItem}
                >
                  Remove
                </button>
              </div>
            </div>

            <div className={styles.quantityControls}>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className={styles.quantityButton}
              >
                <FaMinus />
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className={styles.quantityInput}
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className={styles.quantityButton}
              >
                <FaPlus />
              </button>
            </div>

            <p className={styles.itemTotal}>
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className={styles.orderSummary}>
        <h3>Order Summary</h3>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{formatCurrency(calculateTotal())}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Taxes (10%)</span>
          <span>{formatCurrency(calculateTotal() * 0.1)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping</span>
          <span>{calculateTotal() > 500 ? "FREE" : formatCurrency(50)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.total}`}>
          <span>Total</span>
          <span>
            {formatCurrency(
              calculateTotal() * 1.1 + (calculateTotal() > 500 ? 0 : 50)
            )}
          </span>
        </div>
        <Link to="/checkout" className={styles.checkoutButton}>
          Proceed to Checkout
        </Link>
        <span className={styles.shipping}>
          *Free shipping on orders over {formatCurrency(499)}
        </span>
      </div>
    </div>
  );
}
