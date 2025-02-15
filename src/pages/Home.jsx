import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { useCustom } from "../contexts/CustomContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatCurrency } = useCustom();
  const { buyNow, handleAddToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    buyNow(product, navigate);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productQuery = query(
          collection(db, "products"),
          where("featured", "==", true)
        );
        const querySnapshot = await getDocs(productQuery);

        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(productsData);

        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error fetching featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.home}>
      {/* Banner Section */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <p className={styles.bannerText}></p>
          <button
            className={styles.bannerButton}
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className={styles.featuredProducts}>
        <h2 className={styles.sectionTitle}>Featured Products</h2>
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className={styles.productImage}
              />
              <h3 className={styles.productTitle}>{product.name}</h3>
              <p className={styles.productPrice}>
                {formatCurrency(product.price)}
              </p>
              <div className={styles.productActions}>
                <button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className={styles.addToCartButton}
                >
                  Add to Cart
                </button>
                <button
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyNow(product);
                  }}
                  className={styles.buyNowButton}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoriesGrid}>
          {categories.map((category) => (
            <div
              key={category.id}
              className={styles.categoryCard}
              onClick={() => navigate(`/products?categories=${category.name}`)}
            >
              <img
                src={category.icon}
                alt={category.name}
                className={styles.categoryImage}
              />
              <h3 className={styles.categoryTitle}>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
