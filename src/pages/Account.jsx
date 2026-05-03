import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import styles from '../styles/OrderConfirmation.module.css';
import { loadOrders } from '../utils/ordersStorage';
import { formatCurrency } from '../utils/priceFormat';

function Account() {
  const orders = useMemo(() => loadOrders(), []);

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Mi cuenta</h1>
        <p className={styles.subtitle}>Perfil y órdenes</p>

        <div style={{ marginTop: '1rem' }}>
          <h2 className={styles.sectionTitle}>Perfil</h2>
          <div className={styles.infoList}>
            <p><strong>Nombre:</strong> Usuario de prueba</p>
            <p><strong>Email:</strong> usuario@ejemplo.com</p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h2 className={styles.sectionTitle}>Órdenes</h2>

          {orders.length === 0 ? (
            <p className={styles.summaryCaption}>No tienes órdenes guardadas.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {orders.map((order) => (
                <li key={order.id} style={{ marginBottom: '0.75rem' }}>
                  <Link to={`/user/orders/${encodeURIComponent(order.id)}`} className={styles.link}>
                    <strong>{order.id}</strong> — {new Date(order.createdAt).toLocaleString('es-CO')}
                    <span style={{ float: 'right' }}>{formatCurrency(order.totals?.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default Account;
