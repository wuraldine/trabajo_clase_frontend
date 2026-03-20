const currencyFormatter = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  const amount = Number(value) || 0;
  return `$${currencyFormatter.format(amount)}`;
}
