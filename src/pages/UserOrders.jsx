import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import styles from '../styles/UserOrders.module.css';
import { loadOrdersByUserId } from '../utils/ordersStorage';

function UserOrders() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const orders = useMemo(
    () =>
      loadOrdersByUserId(currentUser?.id).sort(
        (leftOrder, rightOrder) => new Date(rightOrder.createdAt) - new Date(leftOrder.createdAt)
      ),
    [currentUser?.id]
  );

  if (orders.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyState}>
          <p className={styles.eyebrow}>Semana 11</p>
          <h1 className={styles.title}>Mis ordenes</h1>
          <p className={styles.subtitle}>
            Todavía no hay compras asociadas a tu sesión. Completa el checkout autenticado para
            poblar esta vista.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/user/profile')}
            >
              Ir al perfil
            </button>
            <button type="button" className={styles.primaryButton} onClick={() => navigate('/')}>
              Explorar productos
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Semana 11</p>
          <h1 className={styles.title}>Historial de ordenes</h1>
          <p className={styles.subtitle}>
            Recupera únicamente las compras del usuario autenticado y navega al detalle de cada
            pedido.
          </p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/user/profile')}
          >
            Mi perfil
          </button>
          <button type="button" className={styles.primaryButton} onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </header>

      <div className={styles.list}>
        {orders.map((order) => (
          <article key={order.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <p className={styles.orderId}>{order.id}</p>
                <p className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleString('es-CO')}
                </p>
              </div>

              <strong className={styles.orderTotal}>
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  maximumFractionDigits: 0,
                }).format(order.totals.total)}
              </strong>
            </div>

            <div className={styles.cardMeta}>
              <span>
                <strong>{order.items.length}</strong> productos
              </span>
              <span>{order.shippingMethod.label}</span>
              <span>{order.paymentMethod.label}</span>
            </div>

            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate(`/user/orders/${order.id}`)}
              >
                Ver detalle
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default UserOrders;