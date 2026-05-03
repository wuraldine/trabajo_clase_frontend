import { Link } from 'react-router-dom';

import styles from '../styles/OrderConfirmation.module.css';
import { loadOrders } from '../utils/ordersStorage';
import { formatCurrency } from '../utils/priceFormat';

function UserOrders() {
  const orders = loadOrders().sort(
    (leftOrder, rightOrder) => new Date(rightOrder.createdAt) - new Date(leftOrder.createdAt)
  );

  if (orders.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>Historial</p>
          <h1 className={styles.title}>Mis órdenes</h1>
          <p className={styles.subtitle}>Todavía no hay compras guardadas en este navegador.</p>
          <div className={styles.actions}>
            <Link to="/products" className={styles.primaryButton}>
              Ver productos
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Historial</p>
        <h1 className={styles.title}>Mis órdenes</h1>
        <p className={styles.subtitle}>Aquí ves tus compras guardadas, de la más reciente a la más antigua.</p>

        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '0.85rem' }}>
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/user/orders/${encodeURIComponent(order.id)}`}
              className={styles.section}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div className={styles.metaGrid} style={{ marginTop: 0 }}>
                <div>
                  <span className={styles.metaLabel}>Orden</span>
                  <span className={styles.metaValue}>{order.id}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>Fecha</span>
                  <span className={styles.metaValue}>{new Date(order.createdAt).toLocaleString('es-CO')}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>Productos</span>
                  <span className={styles.metaValue}>{order.items.length}</span>
                </div>
                <div>
                  <span className={styles.metaLabel}>Total</span>
                  <span className={styles.metaValue}>{formatCurrency(order.totals?.total)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UserOrders;
