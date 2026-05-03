import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Cart.module.css';
import { calculateCartSubtotal } from '../utils/calculateOrderTotals';
import { formatCOP } from '../utils/formatCOP';

function Cart({
  cartItems = [],
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const cart = cartItems.length > 0 || !items ? cartItems : items;

  const totalItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => calculateCartSubtotal(cart), [cart]);

  const subtotalWithoutTax = useMemo(
    () => Math.round(subtotal / 1.19),
    [subtotal]
  );
  const tax = subtotal - subtotalWithoutTax;
  const shipping = cart.length > 0 ? 0 : 0;
  const total = subtotal + shipping;

  const updateQuantity = (id, delta) => {
    const currentItem = cart.find((item) => item.id === id);
    if (!currentItem) {
      return;
    }

    onUpdateQuantity?.(id, currentItem.quantity + delta);
  };

  const removeItem = (id) => {
    onRemoveItem?.(id);
  };

  const clearCart = () => {
    onClearCart?.();
  };

  const continueShopping = () => {
    navigate('/');
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Hola, bienvenido al carrito de compras</h1>
        <p className={styles.subtitle}>Revisa tu pedido antes de confirmar la compra</p>

        <div className={styles.headerStats}>
          <span className={styles.statPill}>{totalItems} articulos</span>
          <span className={styles.statPill}>Total estimado {formatCOP(total)}</span>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.listBlock}>
          {cart.length === 0 ? (
            <p className={styles.empty}>Tu carrito esta vacio. Agrega productos desde la vista Productos.</p>
          ) : (
            cart.map((item) => (
              <article key={item.id} className={styles.itemCard}>
                <img className={styles.itemImage} src={item.image} alt={item.name} />

                <div className={styles.itemInfo}>
                  <p className={styles.itemCategory}>{item.category}</p>
                  <h2 className={styles.itemName}>{item.name}</h2>
                  <p className={styles.itemPrice}>{formatCOP(item.price)}</p>
                </div>

                <div className={styles.qtyBox}>
                  <button
                    type="button"
                    className={styles.btnQuantity}
                    onClick={() => updateQuantity(item.id, -1)}
                    aria-label={`Quitar una unidad de ${item.name}`}
                  >
                    -
                  </button>

                  <span className={styles.qtyValue}>{item.quantity}</span>

                  <button
                    type="button"
                    className={styles.btnQuantity}
                    onClick={() => updateQuantity(item.id, 1)}
                    aria-label={`Agregar una unidad de ${item.name}`}
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className={styles.btnRemove}
                    onClick={() => removeItem(item.id)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <aside className={styles.summaryBlock}>
          <h3 className={styles.summaryTitle}>Resumen</h3>

          {cart.length === 0 ? (
            <p className={styles.summaryCaption}>No hay productos en el carrito.</p>
          ) : null}

          <div className={styles.summaryRow}>
            <span>Productos</span>
            <span>{totalItems}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Subtotal (sin IVA)</span>
            <span>{formatCOP(subtotalWithoutTax)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Total IVA (19%)</span>
            <span>{formatCOP(tax)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Subtotal (con IVA)</span>
            <span>{formatCOP(subtotal)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Envio</span>
            <span>{shipping === 0 && cart.length > 0 ? 'Gratis' : formatCOP(shipping)}</span>
          </div>

          <p className={styles.freeShippingMsg}>Envio gratis hasta la puerta de tu casa</p>

          <button
            type="button"
            className={styles.termsLink}
            onClick={() => setShowTerms(true)}
          >
            Aplica términos y condiciones
          </button>

          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
            <span>Total</span>
            <span>{formatCOP(total)}</span>
          </div>

          <button
            type="button"
            className={styles.btnCheckout}
            onClick={proceedToCheckout}
            disabled={cart.length === 0}
          >
            Confirmar compra
          </button>

          <button type="button" className={styles.btnClear} onClick={clearCart} disabled={cart.length === 0}>
            Vaciar carrito
          </button>

          <button type="button" className={styles.btnContinue} onClick={continueShopping}>
            Seguir comprando
          </button>
        </aside>
      </div>

      {showTerms ? (
        <div className={styles.modalBackdrop} onClick={() => setShowTerms(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setShowTerms(false)}
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <h2 className={styles.modalTitle}>Términos y condiciones de envío</h2>

            <div className={styles.modalContent}>
              <p>
                Nos complace ofrecer envíos gratuitos a nuestros clientes. Sin embargo, esta política está sujeta a los siguientes términos y condiciones:
              </p>

              <h3>Cobertura geográfica</h3>
              <p>
                Los envíos se realizan de forma gratuita únicamente dentro del territorio nacional colombiano. No se contemplan entregas internacionales bajo esta política.
              </p>

              <h3>Disponibilidad de stock</h3>
              <p>
                La política de envío gratis se aplica de acuerdo a la disponibilidad logística de stock en nuestros centros de distribución. La disponibilidad está sujeta a cambios sin previo aviso.
              </p>

              <h3>Limitaciones</h3>
              <p>
                El envío gratuito está sujeto a limitaciones de volumen y peso. Productos que excedan los parámetros establecidos pueden incurrir en costos adicionales de envío.
              </p>

              <h3>Aceptación</h3>
              <p>
                Al continuar con su compra, usted acepta estos términos y condiciones de envío de forma íntegra.
              </p>
            </div>

            <button
              type="button"
              className={styles.modalConfirmBtn}
              onClick={() => setShowTerms(false)}
            >
              He leído y acepto
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Cart;