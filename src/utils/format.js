export function formatMoney(value) {
  return `${Number(value || 0).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} F CFA`;
}
