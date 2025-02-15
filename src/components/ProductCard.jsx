import { useCustom } from "../contexts/CustomContext";
import styles from "../styles/ProductCard.module.css";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProductCard({ product }) {
  const { formatCurrency } = useCustom();
  const { addToCart, buyNow, cart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  console.log(cart);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    buyNow(product, navigate);
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className={styles.productCard2}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        className={styles.productImage}
      />
      <h3 className={styles.productTitle}>{product.name}</h3>
      <p className={styles.productPrice}>{formatCurrency(product.price)}</p>
      <div className={styles.productActions}>
        <button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className={styles.addToCartButton}
        >
          Add to Cart
        </button>
        <button
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            handleBuyNow();
          }}
          className={styles.buyNowButton}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
