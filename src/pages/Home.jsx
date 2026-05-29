import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import homeStyles from '../styles/Home.module.css';
import { productService } from '../services';
import { toSpanishCategoryLabel } from '../utils/categoryLabels';
import { loadProducts } from '../utils/productsStorage';

function Home() {
  const [productsState, setProductsState] = useState(() => loadProducts());
  const navigate = useNavigate();

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
          setProductsState(source);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const categoryTiles = useMemo(() => {
    const bestByCategory = new Map();

    productsState.forEach((product) => {
      const category =
        product?.category ?? product?.categoryName ?? product?.category?.name ?? 'Sin categoría';

      const image = product?.image ?? product?.imageUrl ?? product?.thumbnailUrl ?? '';
      const normalizedProduct = { ...product, category, image };

      const currentBest = bestByCategory.get(category);

      if (!currentBest) {
        bestByCategory.set(category, normalizedProduct);
        return;
      }

      const currentRating = Number(currentBest.rating) || 0;
      const nextRating = Number(normalizedProduct.rating) || 0;

      if (nextRating > currentRating) {
        bestByCategory.set(category, normalizedProduct);
      }
    });

    return Array.from(bestByCategory.entries())
      .map(([category, product]) => ({ category, product }))
      .sort((left, right) => left.category.localeCompare(right.category, 'es'));
  }, [productsState]);

  return (
    <div className={homeStyles.container}>
      <header className={homeStyles.header}>
        <h1 className={homeStyles.title}>Inicio</h1>
        <p className={homeStyles.subtitle}>Selecciona una categoría para ver sus productos</p>
      </header>

      <div className={homeStyles.categoryGrid}>
        {categoryTiles.map(({ category, product }) => (
          <button
            key={category}
            type="button"
            className={homeStyles.categoryTile}
            onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
            aria-label={`Ver productos de ${category}`}
          >
            <img className={homeStyles.categoryImage} src={product.image} alt={product.name} />
            <div className={homeStyles.categoryInfo} aria-hidden="true">
              <span className={homeStyles.categoryName}>{toSpanishCategoryLabel(category)}</span>
            </div>
          </button>
        ))}
      </div>

      {categoryTiles.length === 0 ? (
        <p className={homeStyles.subtitle}>No hay categorías disponibles por el momento.</p>
      ) : null}
    </div>
  );
}

export default Home;