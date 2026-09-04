# QuickDevis

Application mobile de gestion de devis et factures, développée avec React Native, Expo et SQLite local.

QuickDevis permet de créer des devis et factures en F CFA, de gérer les clients et produits, de suivre les statuts, de générer des PDF, de les partager et de sauvegarder les données locales.

## Fonctionnalités

- Création de devis et factures avec parcours en étapes.
- Client facultatif lors de la création.
- Lignes produit, ligne libre et main-d’œuvre.
- Prix produit repris automatiquement depuis le catalogue.
- Calcul automatique des quantités et totaux.
- Aperçu intégré du document sous forme de tableau.
- Génération et partage PDF.
- Statuts : brouillon, envoyé, payé, annulé.
- Conversion d’un devis en facture.
- Historique filtrable par type et statut.
- KPI dans l’historique : documents, devis, factures, brouillons, envoyés, montants payés et montants à encaisser.
- Paramètres entreprise, logo, pied de page, conditions générales et coordonnées bancaires PDF.
- Export JSON des données locales.
- Guide d’utilisation intégré.
- Données stockées localement avec SQLite, sans backend distant.

## Technologies

- React Native 0.86
- Expo SDK 57
- Expo SQLite
- React Navigation Native Stack
- Expo Print
- Expo Sharing
- Expo File System
- date-fns

## Prérequis

- Node.js LTS
- npm
- Android Studio ou un téléphone Android pour les tests
- Expo Go pour le test rapide
- Un compte Expo/EAS pour générer un APK

## Installation

Depuis PowerShell :

```powershell
Set-Location D:\PROJECTS\QuickDevis

$env:TEMP='D:\PROJECTS\QuickDevis\.cache\tmp'
$env:TMP='D:\PROJECTS\QuickDevis\.cache\tmp'

npm install
```

Les caches npm et les fichiers temporaires du projet sont configurés sur le disque D via `.npmrc`.

## Lancer l’application avec Expo Go

```powershell
Set-Location D:\PROJECTS\QuickDevis
$env:TEMP='D:\PROJECTS\QuickDevis\.cache\tmp'
$env:TMP='D:\PROJECTS\QuickDevis\.cache\tmp'
npx expo start -c
```

Scannez ensuite le QR code avec Expo Go sur un téléphone Android connecté au même réseau Wi-Fi.

## Vérification Android

Le bundle Android peut être vérifié localement avec :

```powershell
$env:TEMP='D:\PROJECTS\QuickDevis\.cache\tmp'
$env:TMP='D:\PROJECTS\QuickDevis\.cache\tmp'
$env:CI='1'
npx expo export --platform android --output-dir .dist\android --clear --no-minify
```

Cette commande produit un bundle JavaScript Android, mais pas un fichier APK installable.

## Générer un APK avec EAS

### 1. Installer EAS CLI

```powershell
npm install --global eas-cli
```

Le préfixe npm global du projet est configuré sur `D:\PROJECTS\QuickDevis\.global-node`.

### 2. Se connecter à Expo

```powershell
eas login
eas whoami
```

### 3. Vérifier la configuration EAS

À la racine du projet :

```powershell
Set-Location D:\PROJECTS\QuickDevis
Get-Content eas.json
```

Le fichier `eas.json` est déjà fourni dans le projet. Si vous devez le régénérer, utilisez `eas build:configure`, puis vérifiez que le profil `preview` produit bien un APK.

### 4. Générer l’APK de test

```powershell
eas build --platform android --profile preview
```

Pour garantir un APK installable, le profil `preview` doit contenir :

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

Si le fichier `eas.json` existe déjà, vérifiez que le profil `preview` contient bien `"buildType": "apk"` avant de lancer le build.

### 5. Télécharger et installer

À la fin du build, EAS affiche une URL de téléchargement.

1. Ouvrez cette URL sur le téléphone Android.
2. Téléchargez le fichier `.apk`.
3. Autorisez l’installation depuis cette source si Android le demande.
4. Installez l’application QuickDevis.
5. Lancez QuickDevis et testez SQLite, l’aperçu, la génération et le partage PDF.

L’APK de test peut être installé directement sur un téléphone. Pour une publication Play Store, utilisez plutôt un build Android App Bundle (`.aab`) avec le profil production.

## Tests fonctionnels recommandés

1. Créer un client, le modifier et le supprimer.
2. Créer un produit avec son prix unitaire.
3. Créer un devis avec plusieurs lignes.
4. Créer un document sans client.
5. Ajouter une ligne produit, une ligne libre et une main-d’œuvre.
6. Vérifier le tableau : N°, libellé, nombre, prix unitaire, total.
7. Enregistrer et vérifier l’aperçu intégré.
8. Générer et partager le PDF depuis un appareil réel.
9. Passer le document de brouillon à envoyé puis payé.
10. Convertir un devis en facture.
11. Vérifier les KPI et filtres de l’historique.
12. Exporter une sauvegarde JSON.
13. Vérifier les paramètres entreprise et le Guide d’utilisation.

## Structure principale

```text
QuickDevis/
├── App.js
├── app.json
├── package.json
├── src/
│   ├── components/
│   ├── db/
│   │   ├── database.js
│   │   └── schema.sql
│   ├── screens/
│   └── utils/
├── assets/
├── TODO.md
└── PROMPT_OPENCODE.md
```

## Données et sauvegardes

QuickDevis ne possède pas de serveur distant. Les données sont enregistrées dans SQLite sur l’appareil. Utilisez régulièrement l’export JSON depuis Paramètres avant de changer de téléphone ou de réinitialiser l’application.

Les caches de développement de ce projet sont conservés sur le disque D :

```text
D:\PROJECTS\QuickDevis\.cache
D:\PROJECTS\QuickDevis\.global-node
```

## Identité de l’application

- Nom : QuickDevis
- Slug Expo : `quickdevis`
- Package Android : `com.yannickmaya.quickdevis`
- Bundle iOS : `com.yannickmaya.quickdevis`
- Devise : F CFA

## Auteur et contact

**Ing. Yannick MADJIADOUM**

- Téléphone : +235 65234480 / +228 70772542
- Email : yannickmadjiadoum@gmail.com
