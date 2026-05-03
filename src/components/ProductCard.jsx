import { useState } from 'react';

import styles from './ProductCard.module.css';
import { formatCurrency } from '../utils/priceFormat';

function ProductCard({
  id,
  name,
  category,
  price,
  stock,
  image,
  description,
  rating,
  onAddToCart,
  onDetails,
  onEdit,
  onDelete,
  disableAddToCart = false,
  likes: initialLikes = 0,
  isLiked: initialIsLiked = false,
}) {
  const [likes, setLikes] = useState(Number(initialLikes) || 0);
  const [isLiked, setIsLiked] = useState(Boolean(initialIsLiked));

  const handleLike = () => {
    if (isLiked) {
      setLikes((n) => Math.max(0, n - 1));
      setIsLiked(false);
    } else {
      setLikes((n) => n + 1);
      setIsLiked(true);
    }
  };

  return (
    <article className={styles.productCard}>
      <img src={image} alt={name} className={styles.productImage} />
      <div className={styles.productInfo}>
        <span className={styles.productCategory}>{category}</span>
        <h3 className={styles.productName}>{name}</h3>
        {Number.isFinite(Number(rating)) ? (
          <p className={styles.productRating}>Calificación: {Number(rating)}/5</p>
        ) : null}
        <p className={styles.productDescription}>{description}</p>
        <p className={styles.productStock}>Stock: {stock}</p>
        <div className={styles.productFooter}>
          <span className={styles.productPrice}>{formatCurrency(price)}</span>
          <button
            className={`${styles.btnLike} ${isLiked ? styles.liked : ''}`}
            onClick={handleLike}
          >
            {isLiked ? '❤️' : '🤍'} {likes} Me gusta
          </button>
        </div>

        {onAddToCart || onDetails || onEdit || onDelete ? (
          <div className={styles.cardActions}>
            {onAddToCart ? (
              <button
                type="button"
                className={styles.btnAddToCart}
                onClick={() => onAddToCart({ id, name, category, price, stock, image })}
                disabled={disableAddToCart}
              >
                {disableAddToCart ? 'Stock agotado en carrito' : 'Agregar al carrito'}
              </button>
            ) : null}

            {onDetails ? (
              <button type="button" className={styles.btnDetails} onClick={onDetails}>
                Más información
              </button>
            ) : null}

            {onEdit ? (
              <button type="button" className={styles.btnEdit} onClick={onEdit}>
                Editar
              </button>
            ) : null}

            {onDelete ? (
              <button type="button" className={styles.btnDelete} onClick={onDelete}>
                Eliminar
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default ProductCard;
