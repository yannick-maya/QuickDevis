import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { formatMoney } from './format';

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const money = formatMoney;

function buildDocumentHtml(document, company = {}) {
  const rows = document.lines.map((line) => `<tr><td>${escapeHtml(line.description)}</td><td>${line.quantite}</td><td>${money(line.prix_unitaire)}</td><td>${money(line.total_ligne)}</td></tr>`).join('');
  return `<html><body style="font-family:Arial;padding:32px;color:#1459C7"><h1>${escapeHtml(company.nom || 'QuickDevis')}</h1><p>${escapeHtml(company.adresse || '')}<br>${escapeHtml(company.telephone || '')} ${escapeHtml(company.email || '')}</p><hr><h2>${escapeHtml(document.type)} ${escapeHtml(document.numero)}</h2><p>Client : ${escapeHtml(document.client_nom)}</p><table style="width:100%;border-collapse:collapse"><thead><tr><th align="left">Description</th><th>Qté</th><th>Prix</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><h2 style="text-align:right">Total : ${money(document.total)}</h2></body></html>`;
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
