PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS produits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  prix_unitaire REAL NOT NULL,
  unite TEXT DEFAULT 'unité'
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK(type IN ('devis', 'facture')) NOT NULL,
  numero TEXT UNIQUE NOT NULL,
  client_id INTEGER,
  date_creation TEXT DEFAULT CURRENT_TIMESTAMP,
  date_echeance TEXT,
  statut TEXT DEFAULT 'brouillon',
  total REAL DEFAULT 0,
  devis_origine_id INTEGER,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (devis_origine_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS document_lignes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  produit_id INTEGER,
  type_ligne TEXT CHECK(type_ligne IN ('produit', 'main_oeuvre', 'libre')) DEFAULT 'produit',
  description TEXT NOT NULL,
  quantite REAL NOT NULL,
  prix_unitaire REAL NOT NULL,
  total_ligne REAL NOT NULL,
  FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  FOREIGN KEY (produit_id) REFERENCES produits(id)
);

CREATE TABLE IF NOT EXISTS entreprise (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT,
  logo_uri TEXT,
  adresse TEXT,
  telephone TEXT,
  email TEXT
);
