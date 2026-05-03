import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import styles from '../styles/OrderConfirmation.module.css';
import { getOrderById } from '../utils/ordersStorage';
import { formatCurrency } from '../utils/priceFormat';

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const order = useMemo(() => {
    return getOrderById(orderId);
  }, [orderId]);

  if (!order) {
    return (
      <section className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Orden no encontrada</h1>
          <p className={styles.subtitle}>La orden solicitada no existe en el historial.</p>
          <button type="button" className={styles.primaryButton} onClick={() => navigate('/user/orders')}>
            Volver al historial
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Orden</p>
        <h1 className={styles.title}>Detalle de la orden {order.id}</h1>

        <div className={styles.metaGrid}>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Fecha</span>
            <span className={styles.metaValue}>{new Date(order.createdAt).toLocaleString('es-CO')}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Total</span>
            <span className={styles.metaValue}>{formatCurrency(order.totals?.total)}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Envío</span>
            <span className={styles.metaValue}>{order.shippingMethod?.label}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Pago</span>
            <span className={styles.metaValue}>{order.paymentMethod?.label}</span>
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
              <p><strong>Método de envío:</strong> {order.shippingMethod?.label}</p>
              <p><strong>Descripción del envío:</strong> {order.shippingMethod?.description}</p>
              <p><strong>Método de pago:</strong> {order.paymentMethod?.label}</p>
              <p><strong>Descripción del pago:</strong> {order.paymentMethod?.description}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Resumen de compra</h3>
            <div className={styles.itemList}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
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
                <span>{formatCurrency(order.totals?.subtotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>IVA (19%):</span>
                <span>{formatCurrency(order.totals?.tax)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Envío:</span>
                <span>{order.totals?.shipping === 0 ? 'Gratis' : formatCurrency(order.totals?.shipping)}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.totalRowStrong}`}>
                <span>Total:</span>
                <strong>{formatCurrency(order.totals?.total)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryButton} onClick={() => navigate('/user/orders')}>
            Volver al historial
          </button>
        </div>
      </div>
    </section>
  );
}

export default OrderDetail;
