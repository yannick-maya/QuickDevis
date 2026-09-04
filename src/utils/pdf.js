import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { formatMoney } from './format';

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const money = formatMoney;

function buildDocumentHtml(document, company = {}) {
  const rows = document.lines.map((line, index) => `<tr><td class="number">${index + 1}</td><td class="label">${escapeHtml(line.description)}</td><td class="quantity">${line.quantite}</td><td class="unit">${money(line.prix_unitaire)}</td><td class="total">${money(line.total_ligne)}</td></tr>`).join('');
  return `<html><head><style>body{font-family:Arial;padding:32px;color:#1459C7}table{width:100%;border-collapse:collapse;margin-top:24px}th{background:#1459C7;color:#fff;padding:10px;font-size:11px;text-align:left}td{border-bottom:1px solid #D7E5F5;padding:11px;font-size:12px}.number{width:7%;text-align:center}.label{width:43%}.quantity{width:12%;text-align:center}.unit,.total{width:19%;text-align:right}.total{font-weight:bold} .grand-total{border-top:2px solid #1677FF;margin-top:22px;padding-top:14px;text-align:right;font-size:18px;font-weight:bold}</style></head><body><h1>${escapeHtml(company.nom || 'QuickDevis')}</h1><p>${escapeHtml(company.adresse || '')}<br>${escapeHtml(company.telephone || '')} ${escapeHtml(company.email || '')}</p><hr><h2>${escapeHtml(document.type)} ${escapeHtml(document.numero)}</h2><p>Client : ${escapeHtml(document.client_nom || 'Sans client')}</p><table><thead><tr><th class="number">N°</th><th>Libellé / Produit</th><th class="quantity">Nombre</th><th class="unit">Prix unitaire</th><th class="total">Total</th></tr></thead><tbody>${rows}</tbody></table><div class="grand-total">TOTAL : ${money(document.total)}</div></body></html>`;
}

export async function createDocumentPdf(document, company = {}) {
  return Print.printToFileAsync({ html: buildDocumentHtml(document, company) });
}

export async function openDocumentPdf(document, company = {}) {
  const file = await createDocumentPdf(document, company);
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('Le partage système est indisponible sur cet appareil.');
  await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Ouvrir l’aperçu PDF' });
  return file.uri;
}

export async function shareDocumentPdf(document, company) {
  const file = await createDocumentPdf(document, company);
  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('Le partage système est indisponible sur cet appareil.');
  await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Partager le document' });
  return file.uri;
}
