# Installation — Jury Reports Decoder

## Fichiers à ajouter à la racine du dépôt
- `jury-reports.html`
- `jury-reports-data.json`
- `jury-sources.json`
- `jury-reports-detected.json`
- `jury-reports-status.json`

## Dossier `scripts`
- `scripts/update-jury-reports.mjs`
- `scripts/check-jury-links.mjs`

## Dossier `.github/workflows`
- `.github/workflows/update-jury-reports.yml`
- `.github/workflows/check-jury-links.yml`

## Mise en ligne
1. Décompresser le ZIP.
2. Dans le dépôt GitHub, téléverser le contenu en conservant les dossiers.
3. Vérifier que **Settings → Actions → General → Workflow permissions** est sur **Read and write permissions**.
4. Aller dans **Actions → Update jury reports → Run workflow**.
5. Lancer ensuite **Check jury report links**.
6. Attendre la reconstruction de GitHub Pages, puis ouvrir `jury-reports.html`.

## Fonctionnement automatique
- Le mercredi matin : détection des nouveaux documents sur les pages officielles.
- Le lundi matin : vérification des liens.
- Un nouveau document est publié dans le bloc « Derniers rapports détectés » avec la mention **Summary pending review**.
- Les synthèses `Do / Avoid / Recommendations` ne sont pas réécrites automatiquement : elles restent validées pour éviter une attribution erronée au jury.

## Ajouter ou modifier une source
Éditer `jury-sources.json`. Le script fonctionne sans dépendance npm.

## Modifier une synthèse
Éditer le concours concerné dans `jury-reports-data.json`.
