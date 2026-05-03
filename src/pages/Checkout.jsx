import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from '../styles/Checkout.module.css';
import {
  calculateOrderTotals,
  PAYMENT_METHODS,
  SHIPPING_OPTIONS,
} from '../utils/calculateOrderTotals';
import { formatCurrency } from '../utils/priceFormat';

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;

function Checkout({ cartItems, user, onCompleteCheckout }) {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: user?.name ?? '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    shippingMethod: SHIPPING_OPTIONS[0].id,
    paymentMethod: PAYMENT_METHODS[0].id,
  });
  const [errors, setErrors] = useState({});

  const totals = useMemo(
    () => calculateOrderTotals(cartItems, values.shippingMethod),
    [cartItems, values.shippingMethod]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  };

  const validateValues = () => {
    const nextErrors = {};

    if (!values.fullName.trim()) nextErrors.fullName = 'Ingresa el nombre completo.';
    if (!values.email.trim()) nextErrors.email = 'Ingresa un correo electrónico.';
    if (values.email.trim() && !EMAIL_REGEX.test(values.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (!values.phone.trim()) nextErrors.phone = 'Ingresa un número de contacto.';
    if (!values.address.trim()) nextErrors.address = 'Ingresa la dirección de entrega.';
    if (!values.city.trim()) nextErrors.city = 'Ingresa la ciudad.';
    if (!values.postalCode.trim()) nextErrors.postalCode = 'Ingresa el código postal.';
    if (!values.shippingMethod) nextErrors.shippingMethod = 'Selecciona un método de envío.';
    if (!values.paymentMethod) nextErrors.paymentMethod = 'Selecciona un método de pago.';

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateValues();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const order = onCompleteCheckout({
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        address: values.address.trim(),
        city: values.city.trim(),
        postalCode: values.postalCode.trim(),
      },
      shippingMethodId: values.shippingMethod,
      paymentMethodId: values.paymentMethod,
    });

    if (order) {
      navigate('/order-confirmation');
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.emptyText}>
            No hay productos en el carrito. Regresa para agregar artículos antes de continuar.
          </p>
          <button type="button" className={styles.secondaryButton} onClick={() => navigate('/cart')}>
            Volver al carrito
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <button type="button" className={styles.backButton} onClick={() => navigate('/cart')}>
            ← Volver
          </button>
          <h1 className={styles.title}>Checkout</h1>
        </div>

        {/* Main Content */}
        <div className={styles.grid}>
          {/* Formulario */}
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Cliente Info */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Información Personal</legend>
              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Juan Pérez"
                />
                {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="tu@correo.com"
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="+57 123 456 7890"
                />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>
            </fieldset>

            {/* Dirección */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Dirección de Entrega</legend>
              <div className={styles.field}>
                <label htmlFor="address" className={styles.label}>
                  Dirección
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Calle 123 #456-789"
                />
                {errors.address && <span className={styles.error}>{errors.address}</span>}
              </div>

              <div className={styles.twoColumns}>
                <div className={styles.field}>
                  <label htmlFor="city" className={styles.label}>
                    Ciudad
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Bogotá"
                  />
                  {errors.city && <span className={styles.error}>{errors.city}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="postalCode" className={styles.label}>
                    Código Postal
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    name="postalCode"
                    value={values.postalCode}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="110111"
                  />
                  {errors.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
                </div>
              </div>
            </fieldset>

            {/* Métodos */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Método de Envío</legend>
              {SHIPPING_OPTIONS.map((option) => (
                <label key={option.id} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={option.id}
                    checked={values.shippingMethod === option.id}
                    onChange={handleChange}
                    className={styles.radio}
                  />
                  <div className={styles.radioContent}>
                    <strong>{option.label}</strong>
                    <p>{option.description}</p>
                    <span className={styles.price}>
                      {formatCurrency(option.price)}
                    </span>
                  </div>
                </label>
              ))}
              {errors.shippingMethod && (
                <span className={styles.error}>{errors.shippingMethod}</span>
              )}
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Método de Pago</legend>
              {PAYMENT_METHODS.map((method) => (
                <label key={method.id} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={values.paymentMethod === method.id}
                    onChange={handleChange}
                    className={styles.radio}
                  />
                  <div className={styles.radioContent}>
                    <strong>{method.label}</strong>
                    <p>{method.description}</p>
                  </div>
                </label>
              ))}
              {errors.paymentMethod && (
                <span className={styles.error}>{errors.paymentMethod}</span>
              )}
            </fieldset>

            {/* Botones */}
            <div className={styles.actions}>
              <button type="submit" className={styles.primaryButton}>
                Confirmar Pedido
              </button>
              <button type="button" className={styles.secondaryButton} onClick={() => navigate('/cart')}>
                Volver al carrito
              </button>
            </div>
          </form>

          {/* Resumen del Pedido */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>

            {/* Items */}
            <div className={styles.items}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.item}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <p className={styles.itemQty}>Cantidad: {item.quantity}</p>
                  </div>
                  <span className={styles.itemPrice}>
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal (sin IVA)</span>
                <strong>{formatCurrency(totals.subtotalWithoutTax)}</strong>
              </div>
              <div className={styles.totalRow}>
                <span>IVA (19%)</span>
                <strong>{formatCurrency(totals.tax)}</strong>
              </div>
              <div className={styles.totalRow}>
                <span>Envío</span>
                <strong>{formatCurrency(totals.shipping)}</strong>
              </div>
              <div className={styles.totalRowFinal}>
                <span>Total</span>
                <strong>{formatCurrency(totals.total)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;