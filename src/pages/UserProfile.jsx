import { Link } from 'react-router-dom';

import styles from '../styles/OrderConfirmation.module.css';
import { loadOrders } from '../utils/ordersStorage';
import { formatCurrency } from '../utils/priceFormat';

function UserProfile() {
  const orders = loadOrders();
  const latestOrder = orders[0] ?? null;
  const customer = latestOrder?.customer ?? {
    fullName: 'Usuario de prueba',
    email: 'usuario@ejemplo.com',
    phone: 'Sin registrar',
    city: 'Sin registrar',
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Cuenta</p>
        <h1 className={styles.title}>Mi perfil</h1>
        <p className={styles.subtitle}>Vista pública del usuario mock sin autenticación real.</p>

        <div className={styles.metaGrid}>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Nombre</span>
            <span className={styles.metaValue}>{customer.fullName}</span>
          </div>
          <div className={styles.metaCard}>
            <span className={styles.metaLabel}>Email</span>
            <span className={styles.metaValue}>{customer.email}</span>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Datos básicos</h3>
            <div className={styles.infoList}>
              <p><strong>Teléfono:</strong> {customer.phone}</p>
              <p><strong>Ciudad:</strong> {customer.city}</p>
              <p><strong>Órdenes guardadas:</strong> {orders.length}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Última compra</h3>
            {latestOrder ? (
              <div className={styles.infoList}>
                <p><strong>Orden:</strong> {latestOrder.id}</p>
                <p><strong>Fecha:</strong> {new Date(latestOrder.createdAt).toLocaleString('es-CO')}</p>
                <p><strong>Total:</strong> {formatCurrency(latestOrder.totals?.total)}</p>
                <p><strong>Productos:</strong> {latestOrder.items.length}</p>
              </div>
            ) : (
              <p className={styles.summaryCaption}>Todavía no hay una compra previa para mostrar.</p>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/user/orders" className={styles.primaryButton}>
            Ver historial de órdenes
          </Link>
        </div>
      </div>
    </section>
  );
}

export default UserProfile;
