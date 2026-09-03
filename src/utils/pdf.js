import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const money = (value) => `${Number(value || 0).toFixed(2).replace('.', ',')} EUR`;

export async function createDocumentPdf(document, company = {}) {
  const rows = document.lines.map((line) => `<tr><td>${escapeHtml(line.description)}</td><td>${line.quantite}</td><td>${money(line.prix_unitaire)}</td><td>${money(line.total_ligne)}</td></tr>`).join('');
  const html = `<html><body style="font-family:Arial;padding:32px;color:#203B35"><h1>${escapeHtml(company.nom || 'QuickDevis')}</h1><p>${escapeHtml(company.adresse || '')}<br>${escapeHtml(company.telephone || '')} ${escapeHtml(company.email || '')}</p><hr><h2>${escapeHtml(document.type)} ${escapeHtml(document.numero)}</h2><p>Client : ${escapeHtml(document.client_nom)}</p><table style="width:100%;border-collapse:collapse"><thead><tr><th align="left">Description</th><th>Qté</th><th>Prix</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><h2 style="text-align:right">Total : ${money(document.total)}</h2></body></html>`;
  return Print.printToFileAsync({ html });
}

export async function shareDocumentPdf(document, company) {
  const file = await createDocumentPdf(document, company);
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', dialogTitle: 'Partager le document' });
  return file.uri;
}
