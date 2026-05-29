import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { productService } from '../services';
import styles from '../styles/CategoryProducts.module.css';
import productListStyles from '../styles/ProductList.module.css';
import { toSpanishCategoryLabel } from '../utils/categoryLabels';
import { loadProducts } from '../utils/productsStorage';

const normalizeCategory = (value) => String(value ?? '').trim().toLowerCase();

const normalizeProduct = (product) => ({
  ...product,
  category: product?.category ?? product?.categoryName ?? product?.category?.name ?? 'Sin categoría',
  image: product?.image ?? product?.imageUrl ?? product?.thumbnailUrl ?? '',
});

function CategoryProducts({ cartItems, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddToast, setShowAddToast] = useState(false);
  const [productsState, setProductsState] = useState(() => loadProducts().map(normalizeProduct));
  const toastTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { categoryName } = useParams();

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    productService
      .list()
      .then((res) => {
        if (!mounted) return;
        const source = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.products)
              ? res.data.products
              : [];

        if (source.length > 0) {
          setProductsState(source.map(normalizeProduct));
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const category = useMemo(
    () => (categoryName ? decodeURIComponent(categoryName) : null),
    [categoryName]
  );
  const categoryLabel = useMemo(() => toSpanishCategoryLabel(category), [category]);

  const cartQuantityByProductId = useMemo(
    () => new Map(cartItems.map((item) => [item.id, item.quantity])),
    [cartItems]
  );

  const filteredProducts = useMemo(() => {
    if (!category) return [];

    const q = query.trim().toLowerCase();

    return productsState.filter((product) => {
      if (normalizeCategory(product.category) !== normalizeCategory(category)) return false;
      if (!q) return true;

      return String(product.name ?? '')
        .toLowerCase()
        .includes(q);
    });
  }, [category, productsState, query]);

  const handleOpenDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToCart = (product) => {
    onAddToCart?.(product);
    setShowAddToast(true);

    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setShowAddToast(false);
    }, 2000);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <button type="button" className={styles.btnBack} onClick={() => navigate('/')}>
          Volver
        </button>

        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{categoryLabel ?? 'Categoría'}</h1>
          <p className={styles.subtitle}>
            {filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'} disponible
            {filteredProducts.length === 1 ? '' : 's'}
          </p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.input}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Buscar en ${category ?? 'esta categoría'}`}
          aria-label={`Buscar productos en ${categoryLabel ?? 'esta categoría'}`}
        />
      </div>

      {category ? (
        <div className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Productos de {categoryLabel}</h2>
            <span className={styles.categoryCount}>{filteredProducts.length} resultados</span>
          </div>

          {filteredProducts.length === 0 ? (
            <p className={styles.empty}>No encontramos productos para esta búsqueda.</p>
          ) : (
            <div className={productListStyles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  stock={product.stock}
                  image={product.image}
                  description={product.description}
                  rating={product.rating}
                  disableAddToCart={cartQuantityByProductId.get(product.id) >= product.stock}
                  onAddToCart={() => handleAddToCart(product)}
                  onDetails={() => handleOpenDetails(product)}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {showAddToast ? (
        <div className={styles.toast} role="status" aria-live="polite">
          Producto agregado correctamente al carrito
        </div>
      ) : null}

      <ProductDetailsModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={handleCloseDetails}
      />
    </section>
  );
}

export default CategoryProducts;