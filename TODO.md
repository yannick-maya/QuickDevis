# TODO — QuickDevis (Gestion Devis & Factures — React Native + Expo + SQLite local)

## 1. Setup du projet
- [ ] Installer Node.js LTS
- [ ] Installer Expo CLI (`npm install -g expo-cli` ou utiliser `npx` directement)
- [x] Créer le projet : `npx create-expo-app QuickDevis`
- [x] Installer les dépendances :
  - `npx expo install expo-sqlite`
  - `npx expo install expo-print expo-sharing expo-file-system`
  - `npm install @react-navigation/native @react-navigation/native-stack`
  - `npx expo install react-native-screens react-native-safe-area-context`
  - `npm install date-fns`
- [x] Structurer les dossiers :
  ```
  /src
    /screens
    /components
    /db
    /utils
  ```

## 2. Base de données (SQLite)
- [x] Créer `src/db/schema.sql` avec les tables : `clients`, `produits`, `documents`, `document_lignes`, `entreprise` (paramètres/infos société pour le PDF)
- [x] Créer `src/db/database.js` (init de la connexion + exécution du schéma au premier lancement)
- [x] Fonctions CRUD clients (créer, lire, modifier, supprimer, rechercher)
- [x] Fonctions CRUD produits/services
- [ ] Fonctions CRUD documents (devis/factures) + leurs lignes (produit, main d'œuvre, ou ligne libre)
- [ ] Fonction "convertir devis en facture" (duplique le document avec `type = 'facture'`, garde le lien historique)
- [ ] Fonctions de stats pour le dashboard (nb clients, total facturé, total en attente, etc.)

## 3. Écrans
- [x] Dashboard (stats + accès rapide)
- [x] Liste clients (recherche/filtre)
- [ ] Fiche client (infos + historique de ses devis/factures)
- [ ] Formulaire ajout/édition client
- [x] Liste produits/services
- [x] Formulaire ajout/édition produit
- [ ] Liste devis/factures (filtres : type, statut, date)
- [ ] Formulaire création devis/facture (choix client + lignes depuis produits, ligne libre, ou **ligne main d'œuvre** avec champ dédié pour le prix de main d'œuvre)
- [ ] Détail d'un document + bouton "Convertir en facture" (si devis)
- [ ] Génération PDF (`expo-print`) avec logo/infos entreprise
- [ ] Partage du PDF (`expo-sharing`) — WhatsApp, email, etc.
- [ ] Écran historique global (chronologique, filtrable)
- [ ] Écran paramètres (infos entreprise, logo)
- [ ] Export/sauvegarde de la base (JSON ou copie du fichier SQLite) — important car tout est en local

## 4. Tests
- [ ] Ajout/modification/suppression client
- [ ] Création d'un devis avec plusieurs lignes (produit existant + ligne libre + ligne main d'œuvre)
- [ ] Conversion devis → facture
- [ ] Génération et affichage du PDF
- [ ] Partage du PDF (WhatsApp/email/autre)
- [ ] Export/sauvegarde des données puis réimport
- [ ] Test sur téléphone Android réel via Expo Go
- [ ] Test sur téléphone iOS réel via Expo Go (si disponible)

## 5. Finalisation avant envoi au client
- [ ] Icône de l'app + splash screen (`app.json`)
- [ ] Nom de l'app (**QuickDevis**), identifiant (`bundle identifier` / `package name`, ex : `com.tonnom.quickdevis`)
- [ ] Build avec EAS Build (`eas build`) pour générer un vrai APK (Android) ou IPA (iOS)
- [ ] Installer et tester le build final sur un téléphone avant envoi
