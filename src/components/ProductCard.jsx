import { useEffect, useState } from 'react';
import styles from './ProductCard.module.css';
import { formatCurrency } from '../utils/priceFormat';

function ProductCard({
  name,
  category,
  price,
  stock,
  image,
  description,
  rating,
  likes,
  isLiked,
  onToggleLike,
  onDetails,
  onAddToCart,
  onEdit,
  onDelete,
}) {
  const [localLikes, setLocalLikes] = useState(() => Number(likes) || 0);
  const [localIsLiked, setLocalIsLiked] = useState(() => Boolean(isLiked));

  useEffect(() => {
    if (typeof likes === 'number') {
      setLocalLikes(likes);
    }
  }, [likes]);

  useEffect(() => {
    if (typeof isLiked === 'boolean') {
      setLocalIsLiked(isLiked);
    }
  }, [isLiked]);

  const handleLike = () => {
    const nextIsLiked = !localIsLiked;
    const nextLikes = nextIsLiked ? localLikes + 1 : Math.max(0, localLikes - 1);

    setLocalIsLiked(nextIsLiked);
    setLocalLikes(nextLikes);

    if (onToggleLike) {
      onToggleLike();
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
            type="button"
            className={`${styles.btnLike} ${localIsLiked ? styles.liked : ''}`}
            onClick={handleLike}
          >
            {localIsLiked ? '❤️' : '🤍'} {localLikes} Me gusta
          </button>
        </div>

        {onDetails || onAddToCart || onEdit || onDelete ? (
          <div className={styles.cardActions}>
            {onDetails ? (
              <button type="button" className={styles.btnDetails} onClick={onDetails}>
                Más información
              </button>
            ) : null}

            {onAddToCart ? (
              <button type="button" className={styles.btnCart} onClick={onAddToCart}>
                Agregar al carrito
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