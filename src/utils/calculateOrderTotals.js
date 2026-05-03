export const TAX_RATE = 0.19;

export const SHIPPING_OPTIONS = [
  {
    id: 'free-door',
    label: 'Envío gratis hasta la puerta de tu casa',
    description: 'Entrega sin costo adicional.',
    price: 0,
  },
];

export const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Tarjeta de crédito',
    description: 'Pago inmediato con validación simulada.',
  },
  {
    id: 'transfer',
    label: 'Transferencia bancaria',
    description: 'Confirmación manual del pago en la orden.',
  },
  {
    id: 'cash',
    label: 'Pago contra entrega',
    description: 'El cobro se realiza cuando recibes el pedido.',
  },
];

export function getShippingOptionById(shippingMethodId) {
  return SHIPPING_OPTIONS.find((option) => option.id === shippingMethodId) ?? SHIPPING_OPTIONS[0];
}

export function getPaymentMethodById(paymentMethodId) {
  return PAYMENT_METHODS.find((option) => option.id === paymentMethodId) ?? PAYMENT_METHODS[0];
}

export function calculateCartSubtotal(cartItems) {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}
export function calculateOrderTotals(cartItems, shippingMethodId = SHIPPING_OPTIONS[0].id) {
  const subtotal = calculateCartSubtotal(cartItems);

  const shippingOption = getShippingOptionById(shippingMethodId);

  if (subtotal === 0) {
    return {
      subtotal: 0,
      subtotalWithoutTax: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      shippingOption,
    };
  }

  // Prices are tax-included. Extract tax portion from the gross subtotal.
  // tax = subtotal - (subtotal / (1 + TAX_RATE))
  const subtotalWithoutTax = Math.round(subtotal / (1 + TAX_RATE));
  const tax = subtotal - subtotalWithoutTax;

  const shipping = shippingOption.price;

  // Total = subtotal (already includes tax) + shipping
  const total = subtotal + shipping;

  return {
    subtotal,
    subtotalWithoutTax,
    tax,
    shipping,
    total,
    shippingOption,
  };
}