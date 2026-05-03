import { useNavigate } from 'react-router-dom';

import styles from '../styles/OrderConfirmation.module.css';
import { formatCurrency } from '../utils/priceFormat';
import { calculateOrderTotals } from '../utils/calculateOrderTotals';

function OrderConfirmation({ order }) {
  const navigate = useNavigate();

  if (!order) {
    return (
      <section className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>No hay una orden reciente</h1>
          <p className={styles.subtitle}>
            El checkout ya se cerró o no existe una compra para mostrar en esta vista.
          </p>
          <button type="button" className={styles.primaryButton} onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const totals = calculateOrderTotals(order.items, order.shippingMethod?.id);

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>✓ Orden confirmada</p>
        <h1 className={styles.title}>¡Gracias por tu compra!</h1>
        <p className={styles.subtitle}>
          Tu pedido ha sido procesado exitosamente. Recibirás un correo de confirmación con los detalles.
        </p>

        <div className={styles.metaGrid}>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Número de orden</span>
            <span className={styles.metaValue}>{order.id}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Fecha</span>
            <span className={styles.metaValue}>{formattedDate}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Total</span>
            <span className={styles.metaValue}>{formatCurrency(totals.total)}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Estado</span>
            <span className={styles.metaValue}>En proceso</span>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Información de entrega</h3>
            <div className={styles.infoList}>
              <p><strong>Nombre:</strong> {order.customer.fullName}</p>
              <p><strong>Email:</strong> {order.customer.email}</p>
              <p><strong>Teléfono:</strong> {order.customer.phone}</p>
              <p><strong>Dirección:</strong> {order.customer.address}</p>
              <p><strong>Ciudad:</strong> {order.customer.city}</p>
              <p><strong>Código postal:</strong> {order.customer.postalCode}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Resumen de compra</h3>
            <div className={styles.itemList}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={styles.itemImage}
                  />
                  <div>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemMeta}>
                      {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totalRows}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>IVA (19%):</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Envío:</span>
                <span>{totals.shipping === 0 ? 'Gratis' : formatCurrency(totals.shipping)}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.totalRowStrong}`}>
                <span>Total:</span>
                <strong>{formatCurrency(totals.total)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmation;