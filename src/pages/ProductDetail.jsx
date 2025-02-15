import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useCustom } from "../contexts/CustomContext";
import { useCart } from "../contexts/CartContext";
import styles from "../styles/ProductDetail.module.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatCurrency } = useCustom();
  const { handleAddToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, "products", productId);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorMessage}>{error}</h2>
        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.productDetailContainer}>
      <div className={styles.productWrapper}>
        <div className={styles.imageContainer}>
          <img
            src={product.imageUrl2}
            alt={product.name}
            className={styles.productImage}
          />
        </div>

        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.priceSection}>
            <span className={styles.price}>
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className={styles.productMeta}>
            {product.category && (
              <span className={styles.categoryTag}>
                Category: {product.category}
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className={styles.stockWarning}>
                Only {product.stock} left in stock!
              </span>
            )}
          </div>

          <p className={styles.productDescription}>{product.description}</p>

          <button
            className={`${styles.addToCartButton} ${
              product.stock <= 0 ? styles.disabled : ""
            }`}
            onClick={() => handleAddToCart(product)}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
