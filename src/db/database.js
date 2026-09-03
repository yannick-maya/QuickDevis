import * as SQLite from 'expo-sqlite';

let databasePromise;

const schema = `
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS clients (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, email TEXT, telephone TEXT, adresse TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS produits (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT NOT NULL, prix_unitaire REAL NOT NULL, unite TEXT DEFAULT 'unité');
CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT CHECK(type IN ('devis', 'facture')) NOT NULL, numero TEXT UNIQUE NOT NULL, client_id INTEGER NOT NULL, date_creation TEXT DEFAULT CURRENT_TIMESTAMP, date_echeance TEXT, statut TEXT DEFAULT 'brouillon', total REAL DEFAULT 0, devis_origine_id INTEGER, FOREIGN KEY (client_id) REFERENCES clients(id), FOREIGN KEY (devis_origine_id) REFERENCES documents(id));
CREATE TABLE IF NOT EXISTS document_lignes (id INTEGER PRIMARY KEY AUTOINCREMENT, document_id INTEGER NOT NULL, produit_id INTEGER, type_ligne TEXT CHECK(type_ligne IN ('produit', 'main_oeuvre', 'libre')) DEFAULT 'produit', description TEXT NOT NULL, quantite REAL NOT NULL, prix_unitaire REAL NOT NULL, total_ligne REAL NOT NULL, FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE, FOREIGN KEY (produit_id) REFERENCES produits(id));
CREATE TABLE IF NOT EXISTS entreprise (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT, logo_uri TEXT, adresse TEXT, telephone TEXT, email TEXT);
`;

export async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('quickdevis.db').then(async (database) => {
      await database.execAsync(schema);
      return database;
    });
  }
  return databasePromise;
}

export async function listClients(search = '') {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM clients WHERE nom LIKE ? OR email LIKE ? ORDER BY nom', [`%${search}%`, `%${search}%`]);
}

export async function saveClient(client) {
  const database = await getDatabase();
  if (client.id) {
    await database.runAsync('UPDATE clients SET nom = ?, email = ?, telephone = ?, adresse = ? WHERE id = ?', client.nom, client.email || null, client.telephone || null, client.adresse || null, client.id);
    return client.id;
  }
  const result = await database.runAsync('INSERT INTO clients (nom, email, telephone, adresse) VALUES (?, ?, ?, ?)', client.nom, client.email || null, client.telephone || null, client.adresse || null);
  return result.lastInsertRowId;
}

export async function deleteClient(id) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM clients WHERE id = ?', id);
}

export async function listProducts(search = '') {
  const database = await getDatabase();
  return database.getAllAsync('SELECT * FROM produits WHERE nom LIKE ? ORDER BY nom', [`%${search}%`]);
}

export async function saveProduct(product) {
  const database = await getDatabase();
  if (product.id) {
    await database.runAsync('UPDATE produits SET nom = ?, prix_unitaire = ?, unite = ? WHERE id = ?', product.nom, product.prix_unitaire, product.unite || 'unité', product.id);
    return product.id;
  }
  const result = await database.runAsync('INSERT INTO produits (nom, prix_unitaire, unite) VALUES (?, ?, ?)', product.nom, product.prix_unitaire, product.unite || 'unité');
  return result.lastInsertRowId;
}

export async function deleteProduct(id) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM produits WHERE id = ?', id);
}

export async function listDocuments() {
  const database = await getDatabase();
  return database.getAllAsync('SELECT documents.*, clients.nom AS client_nom FROM documents JOIN clients ON clients.id = documents.client_id ORDER BY date_creation DESC');
}

export async function getDashboardStats() {
  const database = await getDatabase();
  const clients = await database.getFirstAsync('SELECT COUNT(*) AS total FROM clients');
  const factures = await database.getFirstAsync("SELECT COALESCE(SUM(total), 0) AS total FROM documents WHERE type = 'facture' AND statut = 'payé'");
  const attente = await database.getFirstAsync("SELECT COALESCE(SUM(total), 0) AS total FROM documents WHERE type = 'facture' AND statut != 'payé' AND statut != 'annulé'");
  const documents = await database.getAllAsync('SELECT statut, COUNT(*) AS total FROM documents GROUP BY statut');
  return { clients: clients.total, factures: factures.total, attente: attente.total, documents };
}
