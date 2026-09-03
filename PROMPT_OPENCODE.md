# Prompt pour OpenCode — App "QuickDevis" (Gestion Devis & Factures)

Tu es un développeur React Native expert. Crée une application mobile complète nommée **QuickDevis**, pour la **gestion de devis et factures**, en utilisant la stack suivante :

- **React Native avec Expo** (managed workflow)
- **expo-sqlite** pour une base de données 100% locale (aucun backend, aucun serveur)
- **React Navigation** (native-stack) pour la navigation
- **expo-print** + **expo-sharing** pour générer et partager les devis/factures en PDF
- **expo-file-system** pour l'export/sauvegarde des données
- **date-fns** pour la gestion des dates

## Fonctionnalités attendues

### 1. Gestion des clients
- Liste des clients avec recherche
- Ajout / modification / suppression
- Fiche client affichant son historique de devis/factures

### 2. Gestion des produits/services
- Liste des produits/services (nom, prix unitaire, unité)
- Ajout / modification / suppression
- Utilisables comme lignes pré-remplies lors de la création d'un devis/facture

### 3. Devis & Factures
- Création d'un document (devis ou facture) : sélection d'un client + ajout de lignes (produit existant, ligne libre avec description/quantité/prix, ou **ligne main d'œuvre**)
- **Ligne "Main d'œuvre"** : champ dédié où l'utilisateur saisit une description (ex : "Installation", "Réparation") et un prix de main d'œuvre (au forfait ou par heure/quantité), ajouté comme ligne au même titre que les produits
- Calcul automatique du total (produits + main d'œuvre)
- Statut du document (brouillon, envoyé, payé, annulé)
- Conversion d'un devis en facture en un clic (conserve le lien vers le devis d'origine)
- Génération PDF du document avec en-tête (nom entreprise, logo, coordonnées) + partage via WhatsApp/email/etc.

### 4. Historique
- Vue chronologique de tous les devis/factures, filtrable par client, statut, type, période

### 5. Dashboard
- Nombre total de clients
- Nombre de devis/factures par statut
- Total facturé / total en attente de paiement
- Accès rapides aux dernières actions

### 6. Paramètres
- Informations de l'entreprise (nom, logo, adresse, contact) utilisées dans le PDF
- Export/sauvegarde de la base de données locale (JSON ou copie du fichier .db) — l'utilisateur doit pouvoir sauvegarder ses données ailleurs (les données restent uniquement sur l'appareil)

## Schéma de base de données (SQLite)

```sql
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  prix_unitaire REAL NOT NULL,
  unite TEXT DEFAULT 'unité'
);

CREATE TABLE documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT CHECK(type IN ('devis', 'facture')) NOT NULL,
  numero TEXT UNIQUE NOT NULL,
  client_id INTEGER NOT NULL,
  date_creation TEXT DEFAULT CURRENT_TIMESTAMP,
  date_echeance TEXT,
  statut TEXT DEFAULT 'brouillon',
  total REAL DEFAULT 0,
  devis_origine_id INTEGER, -- si facture issue d'un devis
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (devis_origine_id) REFERENCES documents(id)
);

CREATE TABLE document_lignes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  produit_id INTEGER, -- NULL si ligne libre ou main d'oeuvre
  type_ligne TEXT CHECK(type_ligne IN ('produit', 'main_oeuvre', 'libre')) DEFAULT 'produit',
  description TEXT NOT NULL, -- ex: "Installation", "Réparation" pour la main d'oeuvre
  quantite REAL NOT NULL,
  prix_unitaire REAL NOT NULL,
  total_ligne REAL NOT NULL,
  FOREIGN KEY (document_id) REFERENCES documents(id),
  FOREIGN KEY (produit_id) REFERENCES produits(id)
);

CREATE TABLE entreprise (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT,
  logo_uri TEXT,
  adresse TEXT,
  telephone TEXT,
  email TEXT
);
```

## Contraintes techniques
- Nom de l'application : **QuickDevis** (à définir dans `app.json` : `"name": "QuickDevis"`, `"slug": "quickdevis"`)
- Pas de backend, pas d'API distante : tout est local via `expo-sqlite`
- Code organisé en `/src/screens`, `/src/components`, `/src/db`, `/src/utils`
- Les fonctions d'accès à la base doivent être isolées dans `/src/db` (pas de SQL brut dans les composants)
- Prévoir une fonction d'initialisation de la base au premier lancement de l'app (création des tables si elles n'existent pas)
- Code en français pour les libellés visibles à l'utilisateur, code/variables en anglais ou français au choix mais cohérent

## Livrable attendu
Un projet Expo fonctionnel nommé **QuickDevis**, lançable avec `npx expo start`, avec tous les écrans listés ci-dessus opérationnels et connectés à la base SQLite locale.
