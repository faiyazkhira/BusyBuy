import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  MdClose,
  MdExpandMore,
  MdLogin,
  MdLogout,
  MdShoppingCart,
} from "react-icons/md";
import styles from "../styles/Navbar.module.css";
import {
  Button,
  ClickAwayListener,
  InputBase,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { useCart } from "../contexts/CartContext";
import { useCustom } from "../contexts/CustomContext";

export default function Navbar() {
  const { currentUser, handleSignOut } = useAuth();
  const navigate = useNavigate();
  const { formatCurrency } = useCustom();
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const categoriesButtonRef = useRef(null);
  const { cart } = useCart();
  const [itemsCount, setItemsCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleLogIn = () => navigate("/login");
  const handleCart = () => navigate("/cart");

  useEffect(() => {
    const total = cart.items.reduce((qty, item) => qty + item.quantity, 0);
    setItemsCount(total);
  }, [cart.items]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const cats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  //search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSearch = async () => {
    if (!search.trim()) return;

    setIsSearching(true);

    try {
      const productsRef = collection(db, "products");
      const querySnapshot = await getDocs(productsRef);

      const searchLower = search.toLowerCase();
      const results = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((product) => product.name.toLowerCase().includes(searchLower));

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchResultClick = (product) => {
    navigate(`/products/${product.id}`);
    setSearch("");
    setShowResults(false);
  };

  const handleCloseSearch = () => {
    setSearch("");
    setShowResults(false);
    setSearchResults([]);
  };

  const handleOpenCategories = () => {
    setAnchorEl(categoriesButtonRef.current);
  };

  // When mouse leaves both the button and menu, the menu closes.
  const handleCloseCategories = () => {
    setAnchorEl(null);
  };

  const handleCategorySelect = (category) => {
    handleCloseCategories();
    navigate(`/products?categories=${category.name}`);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMain}>BusyBuy</span>
          <span className={styles.logoSub}>store</span>
        </Link>

        {/* Search */}
        <ClickAwayListener onClickAway={() => setShowResults(false)}>
          <div className={styles.searchContainer}>
            <div className={styles.search}>
              <div className={styles.searchIcon}>
                <Search />
              </div>
              <InputBase
                placeholder="Search..."
                value={search}
                onChange={handleSearchInputChange}
                onClick={() => searchResults.length > 0 && setShowResults(true)}
                classes={{
                  root: styles.inputRoot,
                  input: styles.inputInput,
                }}
              />
              {search && (
                <button
                  className={styles.clearSearch}
                  onClick={handleCloseSearch}
                >
                  <MdClose />
                </button>
              )}
            </div>
            {showResults && searchResults.length > 0 && (
              <Paper className={styles.searchResults}>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className={styles.searchResultItem}
                    onClick={() => handleSearchResultClick(product)}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={styles.searchResultImage}
                    />
                    <div className={styles.searchResultInfo}>
                      <div className={styles.searchResultName}>
                        {product.name}
                      </div>
                      <div className={styles.searchResultPrice}>
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </Paper>
            )}
          </div>
        </ClickAwayListener>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.navLinks}>
            <Button
              className={styles.navButton}
              onClick={() => navigate("/products")}
            >
              Shop
            </Button>
            <div
              style={{ position: "relative", display: "inline-block" }}
              onMouseLeave={handleCloseCategories}
            >
              <Button
                ref={categoriesButtonRef}
                className={styles.navButton}
                onMouseEnter={handleOpenCategories}
                endIcon={<MdExpandMore />}
              >
                Categories
              </Button>
              <Menu
                disableScrollLock
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseCategories}
                MenuListProps={{
                  onMouseEnter: handleOpenCategories,
                  onMouseLeave: handleCloseCategories,
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </div>

          {/* Auth and Cart */}
          <div className={styles.actions}>
            <Button
              className={styles.cartBtn}
              onClick={handleCart}
              startIcon={<MdShoppingCart className={styles.cartIcon} />}
            >
              Cart<span>&nbsp;({itemsCount})</span>
            </Button>

            {currentUser ? (
              <Button
                className={styles.authBtn}
                onClick={handleSignOut}
                startIcon={<MdLogout className={styles.authIcon} />}
              >
                Logout
              </Button>
            ) : (
              <Button
                className={styles.authBtn}
                onClick={handleLogIn}
                startIcon={<MdLogin className={styles.authIcon} />}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
