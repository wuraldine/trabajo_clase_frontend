import styles from '../styles/Cart.module.css';
import { calculateOrderTotals } from '../utils/calculateOrderTotals';
import { formatCurrency } from '../utils/priceFormat';
import { useState } from 'react';

function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  onProceedToCheckout,
}) {
  const [showTerms, setShowTerms] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const { subtotal, subtotalWithoutTax, tax, shipping, shippingOption } = calculateOrderTotals(cartItems);

  if (cartItems.length === 0) {
    return (
      <section className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.greeting}>Hola, bienvenido al carrito de compras</h1>
          <p className={styles.greetingSubtitle}>Revisa tus productos, ajusta cantidades y finaliza tu compra fácilmente.</p>
        </header>

        <div className={styles.emptyWrapper}>
          <div className={styles.emptyCard}>
            <svg className={styles.emptyIcon} viewBox="0 0 64 64" aria-hidden>
              <path d="M16 16h32l-4 24H20z" fill="#f3f4f6" />
              <circle cx="24" cy="48" r="4" fill="#ddd" />
              <circle cx="44" cy="48" r="4" fill="#ddd" />
            </svg>
            <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
            <p className={styles.emptySubtitle}>Agrega productos para comenzar tu compra.</p>
            <div className={styles.emptyActions}>
              <button type="button" className={styles.btnContinue} onClick={onContinueShopping}>
                Ir a productos
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleDecrement = (item) => {
    const next = Math.max(1, item.quantity - 1);
    onUpdateQuantity(item.id, next);
  };

  const handleIncrement = (item) => {
    const next = Math.min(item.stock, item.quantity + 1);
    onUpdateQuantity(item.id, next);
  };

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Hola, bienvenido al carrito de compras</h1>
        <p className={styles.greetingSubtitle}>Revisa tus productos, ajusta cantidades y finaliza tu compra fácilmente.</p>
      </header>

      <div className={styles.content}>
        <div className={`${styles.list} ${styles.itemsBlock}`}>
          {cartItems.map((item) => (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemMedia}>
                {item.image ? (
                  <img className={styles.itemImage} src={item.image} alt={item.name} />
                ) : (
                  <div className={styles.itemPlaceholder} />
                )}
              </div>

              <div className={styles.itemBody}>
                <h3 className={styles.itemTitle}>{item.name}</h3>
                <div className={styles.metaRow}>
                  <span className={styles.itemCategory}>{item.category}</span>
                  <span className={styles.itemStock}>Stock: {item.stock}</span>
                </div>

                <div className={styles.rowBottom}>
                  <div className={styles.priceAndQty}>
                    <div className={styles.itemPrice}>{formatCurrency(item.price)}</div>

                    <div className={styles.quantityControl}>
                      <button
                        type="button"
                        aria-label={`Disminuir cantidad de ${item.name}`}
                        className={styles.qtyBtn}
                        onClick={() => handleDecrement(item)}
                      >
                        −
                      </button>
                      <input
                        className={styles.qtyInput}
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value) || 1)}
                      />
                      <button
                        type="button"
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        className={styles.qtyBtn}
                        onClick={() => handleIncrement(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <button type="button" className={styles.btnRemove} onClick={() => onRemoveItem(item.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className={`${styles.summary} ${styles.summaryBlock}`}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Resumen de la compra</h3>
            {cartItems.length > 0 ? (
              <div className={styles.miniList}>
                {cartItems.slice(0, 3).map((ci) => (
                  <div key={ci.id} className={styles.miniItem}>
                    <img src={ci.image} alt={ci.name} className={styles.miniImage} />
                    <div className={styles.miniInfo}>
                      <div className={styles.miniName}>{ci.name}</div>
                      <div className={styles.miniQty}>x{ci.quantity}</div>
                    </div>
                    <div className={styles.miniPrice}>{formatCurrency(ci.price * ci.quantity)}</div>
                  </div>
                ))}

                {cartItems.length > 3 ? (
                  <div className={styles.moreItems}>+{cartItems.length - 3} más</div>
                ) : null}
              </div>
            ) : null}
            <p className={styles.summaryLine}><strong>{totalItems}</strong> artículos</p>
            <p className={styles.summaryLine}>Subtotal (sin IVA): <strong>{formatCurrency(subtotalWithoutTax)}</strong></p>
            <p className={styles.summaryLine}>Total IVA 19%: <strong>{formatCurrency(tax)}</strong></p>
            <p className={styles.summaryLine}>Envío ({shippingOption.label}): <strong>{formatCurrency(shipping)}</strong></p>
            <p className={styles.freeShippingMsg}>Envío gratis hasta la puerta de tu casa</p>
            <button
              type="button"
              className={styles.termsLink}
              onClick={() => setShowTerms(true)}
            >
              Aplica términos y condiciones
            </button>

            <p className={styles.summaryLine}><strong>Total: {formatCurrency(subtotal)}</strong></p>

            <div className={styles.summaryButtons}>
              <button type="button" className={styles.btnClear} onClick={onClearCart}>
                Vaciar carrito
              </button>

              <button type="button" className={styles.btnCheckout} onClick={onProceedToCheckout}>
                Proceder al pago
              </button>
            </div>

            <button type="button" className={styles.btnContinueLink} onClick={onContinueShopping}>
              Seguir comprando
            </button>
          </div>
        </aside>
      </div>

      {showTerms ? (
        <div className={styles.modalBackdrop} onClick={() => setShowTerms(false)} role="presentation">
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h4 id="terms-title" className={styles.modalTitle}>Términos y condiciones</h4>
              <button type="button" className={styles.modalClose} onClick={() => setShowTerms(false)} aria-label="Cerrar términos">
                ×
              </button>
            </div>

            <p className={styles.modalText}>
              El servicio de envío gratuito aplica exclusivamente para pedidos con entrega dentro del territorio
              nacional colombiano. La cobertura se limita a direcciones válidas ubicadas en Colombia y está sujeta
              a verificación logística, cobertura operativa y disponibilidad de entrega en la zona seleccionada.
              En caso de que la dirección registrada no cumpla con estas condiciones, la tienda podrá informar al
              usuario sobre eventuales restricciones, tiempos adicionales o alternativas de despacho antes de
              finalizar la compra. Al continuar con el proceso de pago, el cliente manifiesta haber leído y aceptado
              estas condiciones de envío.
            </p>

            <div className={styles.modalActions}>
              <button type="button" className={styles.btnCheckout} onClick={() => setShowTerms(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Cart;