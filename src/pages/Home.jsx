import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import homeStyles from '../styles/Home.module.css';
import { loadProducts } from '../utils/productsStorage';

function Home() {
  const [productsState] = useState(loadProducts);
  const navigate = useNavigate();

  const categoryTiles = useMemo(() => {
    const bestByCategory = new Map();
    /* lógica existente */
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
            <span className={homeStyles.categoryLabel} aria-hidden="true">
              <span className={homeStyles.categoryLabelText}>{category}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;