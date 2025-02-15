import React, { useEffect, useState } from "react";
import {
  Container,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Checkbox,
  Skeleton,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../services/firebase";
import styles from "../styles/ProductListing.module.css";
import ProductCard from "../components/ProductCard";

const ProductSkeleton = () => (
  <div className={styles.productCard}>
    <Skeleton variant="rectangular" height={200} />
    <Skeleton variant="text" sx={{ mt: 1 }} />
    <Skeleton variant="text" width="60%" />
  </div>
);

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [sortOrder, setSortOrder] = useState("default");

  const categoryParams = searchParams.get("categories")?.split(",") || [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);

        const productsQuery = query(collection(db, "products"));
        const querySnapshot = await getDocs(productsQuery);
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);

        if (categoryParams.length > 0) {
          setSelectedCategories(new Set(categoryParams));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = (category) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (newSelectedCategories.has(category)) {
      newSelectedCategories.delete(category);
    } else {
      newSelectedCategories.add(category);
    }
    setSelectedCategories(newSelectedCategories);

    const categoriesArray = Array.from(newSelectedCategories);
    if (categoriesArray.length > 0) {
      setSearchParams({ categories: categoriesArray.join(",") });
    } else {
      setSearchParams({});
    }
  };

  const handleSortChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);
  };

  useEffect(() => {
    let filtered = products;
    if (selectedCategories.size > 0) {
      filtered = products.filter((product) =>
        selectedCategories.has(product.category)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
  }, [selectedCategories, products, sortOrder]);

  return (
    <>
      <Toolbar />
      <Container className={styles.home} sx={{ mt: 4 }}>
        <div className={styles.layout}>
          <aside className={styles.filterSection}>
            <div className={styles.categoriesFilter}>
              <Typography variant="h6" gutterBottom>
                Categories
              </Typography>
              <FormGroup>
                {categories.map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        checked={selectedCategories.has(category.name)}
                        onChange={() => handleCategoryChange(category.name)}
                      />
                    }
                    label={category.name}
                  />
                ))}
              </FormGroup>
            </div>

            <div className={styles.sortSection}>
              <Typography variant="h6" gutterBottom>
                Sort By
              </Typography>
              <Select
                value={sortOrder}
                onChange={handleSortChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="default">Default Sorting</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
              </Select>
            </div>
          </aside>

          <main className={styles.mainContent}>
            <Typography variant="h4" className={styles.sectionTitle}>
              {selectedCategories.size > 0
                ? `${Array.from(selectedCategories).join(", ")}`
                : "All Products"}
            </Typography>

            <div className={styles.productsGrid}>
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, index) => <ProductSkeleton key={index} />)
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <Typography>
                  No products found for the selected filters.
                </Typography>
              )}
            </div>
          </main>
        </div>
      </Container>
    </>
  );
}
