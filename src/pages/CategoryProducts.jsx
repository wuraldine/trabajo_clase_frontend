import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProductCard from '../components/ProductCard';
import ProductDetailsModal from '../components/ProductDetailsModal';
import styles from '../styles/CategoryProducts.module.css';
import productListStyles from '../styles/ProductList.module.css';
import { loadProducts } from '../utils/productsStorage';

function CategoryProducts({ cartItems, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productsState] = useState(() => loadProducts());
  const navigate = useNavigate();
  const { categoryName } = useParams();

  const category = useMemo(
    () => (categoryName ? decodeURIComponent(categoryName) : null),
    [categoryName]
  );

  const cartQuantityByProductId = useMemo(
    () => new Map(cartItems.map((item) => [item.id, item.quantity])),
    [cartItems]
  );

  const filteredProducts = useMemo(() => {
    if (!category) return [];

    const q = query.trim().toLowerCase();

    return productsState.filter((product) => {
      if (product.category !== category) return false;
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
          <h1 className={styles.title}>{category ?? 'Categoría'}</h1>
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
          aria-label={`Buscar productos en ${category ?? 'esta categoría'}`}
        />
      </div>

      {category ? (
        <div className={styles.categorySection}>
          <div className={styles.categoryHeader}>
            <h2 className={styles.categoryTitle}>Productos de {category}</h2>
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
                  onAddToCart={() => onAddToCart?.(product)}
                  onDetails={() => handleOpenDetails(product)}
                />
              ))}
            </div>
          )}
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