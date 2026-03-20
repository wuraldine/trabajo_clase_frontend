import { useMemo } from 'react';

import styles from '../styles/Cart.module.css';

const SHIPPING_COST = 35000;
const FREE_SHIPPING_THRESHOLD = 500000;
const IVA_RATE = 0.19;

function formatPrice(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function Cart({ items = [], onUpdateQuantity, onClearCart }) {
  const subtotalWithIva = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const ivaAmount = useMemo(
    () => subtotalWithIva * (IVA_RATE / (1 + IVA_RATE)),
    [subtotalWithIva]
  );
  const subtotalWithoutIva = subtotalWithIva - ivaAmount;

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const hasFreeShipping = subtotalWithIva >= FREE_SHIPPING_THRESHOLD;
  const shipping = items.length > 0 && !hasFreeShipping ? SHIPPING_COST : 0;
  const total = subtotalWithIva + shipping;

  const updateQuantity = (id, delta) => {
    onUpdateQuantity?.(id, delta);
  };

  const clearCart = () => {
    onClearCart?.();
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Carrito de compras</h1>
        <p className={styles.subtitle}>Revisa tu pedido antes de confirmar la compra</p>

        <div className={styles.headerStats}>
          <span className={styles.statPill}>{totalItems} articulos</span>
          <span className={styles.statPill}>Total estimado {formatPrice(total)}</span>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.listBlock}>
          {items.length === 0 ? (
            <p className={styles.empty}>Tu carrito esta vacio. Agrega productos desde la vista Productos.</p>
          ) : (
            items.map((item) => (
              <article key={item.id} className={styles.itemCard}>
                <img className={styles.itemImage} src={item.image} alt={item.name} />

                <div className={styles.itemInfo}>
                  <p className={styles.itemCategory}>{item.category}</p>
                  <h2 className={styles.itemName}>{item.name}</h2>
                  <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                </div>

                <div className={styles.qtyBox}>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, -1)}
                    aria-label={`Quitar una unidad de ${item.name}`}
                  >
                    -
                  </button>

                  <span className={styles.qtyValue}>{item.quantity}</span>

                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.id, 1)}
                    aria-label={`Agregar una unidad de ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className={styles.summaryBlock}>
          <h3 className={styles.summaryTitle}>Resumen</h3>
          <p className={styles.summaryCaption}>
            Envio gratis en compras desde {formatPrice(FREE_SHIPPING_THRESHOLD)}.
          </p>

          <div className={styles.summaryRow}>
            <span>Productos</span>
            <span>{totalItems}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Subtotal (sin IVA)</span>
            <span>{formatPrice(subtotalWithoutIva)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>IVA incluido (19%)</span>
            <span>{formatPrice(ivaAmount)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Subtotal (con IVA)</span>
            <span>{formatPrice(subtotalWithIva)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Envio</span>
            <span>{shipping === 0 && items.length > 0 ? 'Gratis' : formatPrice(shipping)}</span>
          </div>

          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button type="button" className={styles.checkoutBtn} disabled={items.length === 0}>
            Confirmar compra
          </button>

          <button type="button" className={styles.clearBtn} onClick={clearCart} disabled={items.length === 0}>
            Vaciar carrito
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;