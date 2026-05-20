<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.md">English</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**Le jeu de société Hamilton · adaptation solo / numérique**

*Crédit fondateur · Financez la dette. Construisez la banque. Industrialisez la république.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

## Qu'est-ce que c'est ?

Sovereign est un **jeu de société du type Monopoly, basé sur le système Hamilton**, qui traite de la création du crédit public américain, ainsi qu'une **adaptation complète pour un mode solo / numérique** qui exécute les mêmes règles localement dans un navigateur, contre deux adversaires simulés et déterministes.

- **Jeu de société** — prototype imprimable en 34 feuilles. Plateau de 40 cases, 22 propriétés + 4 routes + 2 institutions, 8 systèmes de couleurs, 7 actes du Congrès dans un ordre historique fixe, 4 rôles de joueurs, 3 pistes communes (Crédit public · Résistance publique · Capacité industrielle), 12+12 cartes d'événements. Deux voies économiques viables en dehors du Trésor : le commerce et l'industrie.
- **Mode numérique** — un seul fichier HTML autonome. Machine d'état complète, générateur de nombres aléatoires déterministe mulberry32, adversaires simulés (Trésor / Finance, Commerce / Infrastructure, Industrie / Production), sauvegarde / chargement avec intégrité de la somme de contrôle, outil de relecture, outil de simulation par lots, télémétrie locale de l'équilibre.
- **Équilibre de base** — v0.10, figé après une série de neuf versions, basée sur plus de 1000 simulations de jeux déterministes. Trésor : 59 % · Commerce : 25 % · Industrie : 16 % (valeur canonique × 100, la plage cible est atteinte pour les trois profils).

---

## Démarrage rapide

### Jouez dans votre navigateur (sans installation)

```bash
npx @mcptoolshop/sovereign
```

L'interface en ligne de commande ouvre le jeu dans votre navigateur par défaut. Pas d'installateur, pas de serveur, pas besoin de connexion Internet.

Autres modes :

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Jouer en ligne

Ouvrez la page d'accueil hébergée à l'adresse **<https://mcp-tool-shop-org.github.io/sovereign/>** et cliquez sur le jeu numérique.

### Imprimer et jouer

Le prototype du jeu de société est un document HTML autonome en 34 feuilles. Ouvrez `release/board-game/sovereign-board-game.html` depuis le paquet (ou depuis un téléchargement), puis `Cmd/Ctrl-P → Enregistrer sous PDF → Format US Letter → 100 % de l'échelle`. Découpez et jouez.

### Paquet de publication hors ligne

Chaque publication avec tag attache un paquet `sovereign-vX.Y.Z-release.zip` à sa page de publication GitHub. Téléchargez-le, décompressez-le et ouvrez `00-START-HERE.html` pour le point d'entrée adapté au public. Tout fonctionne hors ligne.

---

## Pourquoi cela existe-t-il ?

La thèse de Sovereign est que **le crédit public et la finance fédérale** étaient les principaux leviers économiques d'Alexander Hamilton, mais un jeu basé sur le système Hamilton doit permettre au **commerce** et à l'**industrie** d'être également des voies viables vers la victoire. La phase d'équilibre (v0.2 → v0.10) a été une série de neuf versions, axée sur des preuves, visant à maintenir le Trésor comme le profil le plus fort (conformément à l'histoire) sans que la conception ne se réduise à un seul type de stratégie.

Consultez [`CHANGELOG.md`](./CHANGELOG.md) pour l'évolution complète de chaque version.

---

## Déterminisme

La même graine + les mêmes décisions humaines = un registre identique au niveau des octets entre les exécutions, les navigateurs et les systèmes d'exploitation.

- Générateur de nombres aléatoires unique : `mulberry32(state.rngSeed)`.
- Décisions de l'adversaire : fonctions pures de l'état visible, chaque décision étant enregistrée dans le registre avec sa règle de déclenchement.
- La sauvegarde / le chargement préservent une somme de contrôle de l'état.
- La relecture reconstruit à partir de `initialState(seed) + decisionLog`.
- Vérifié lors de plus de 1000 jeux déterministes pendant la phase d'équilibre v0.2 → v0.10.

---

## Modèle de menace et gestion des données

Sovereign est un jeu de société basé sur un navigateur, autonome. L'interface en ligne de commande (CLI) ouvre un fichier HTML local dans votre navigateur par défaut. Il n'y a pas de serveur, d'appel réseau, de compte, de synchronisation cloud.

- **Données concernées :** les fichiers HTML inclus dans le dossier `release/` (lecture seule) et le stockage local (`localStorage`) sous la clé `sovereign.autosave` (uniquement l'état de sauvegarde du jeu).
- **Données NON concernées :** aucun accès au système de fichiers en dehors du répertoire du paquet, aucune requête réseau de quelque nature que ce soit, aucune télémétrie, aucune analyse, aucun identifiant.
- **Autorisations requises :** capacité à lancer le navigateur par défaut du système d'exploitation, capacité à lire les fichiers du paquet, stockage local du navigateur (facultatif).
- **Aucune télémétrie, jamais.** La fonctionnalité de "télémétrie" du simulateur fait référence à des rapports d'analyse du jeu locaux, dérivés du registre intégré ; ces rapports ne quittent jamais votre machine.

Consultez le fichier [`SECURITY.md`](./SECURITY.md) pour signaler les vulnérabilités et consulter la politique de sécurité complète.

---

## Fonctionnalités

- **Jeu solo en 7 tours** contre deux adversaires programmés (Trésorerie / Finance et Commerce / Infrastructure par défaut ; Fabricant / Industrie disponible pour les parties en série).
- **IA déterministe** : chaque décision de l'adversaire est une fonction pure de l'état visible, avec une justification enregistrée. Pas de LLM, pas de magie opaque.
- **8 surfaces de jeu** : Tableau, Panneau de la Trésorerie, Inspecteur des Actifs, Boîte à Événements, Actes du Congrès, Pistes Partagées, Journal des Tours / Registre, Rapport de Fin de Partie.
- **Enchères** : les actifs rejetés sont mis aux enchères auprès de plusieurs joueurs, avec des enchères programmées basées sur le profil.
- **Sauvegarde / chargement** : sauvegarde automatique dans le stockage local à chaque tour, exportation / importation manuelle au format JSON, vérification de l'intégrité par hachage lors du chargement, version contrôlée.
- **Relecture** : relecture complète de n'importe quelle partie terminée. Lecture seule. Reconstruit à partir de la graine et du journal des décisions, avec une "pastille" d'intégrité verte.
- **Simulation en série** : exécutez 10 / 50 / 100 parties déterministes contre n'importe quel triplet de profils, exportez des rapports JSON + HTML pour l'analyse de l'équilibre.
- **Narration historique** : bibliothèque de 25 entrées dérivée du registre (descriptions par défaut de 40 à 60 mots, extensions de 150 à 200 mots, résumé de la république de fin de partie d'environ 300 à 500 mots). Ne modifie jamais l'état.
- **Accessibilité** : navigation complète au clavier, indicateurs de focus, étiquettes significatives pour les lecteurs d'écran, valeurs des pistes lisibles sous forme de texte et non uniquement de marqueurs, taille minimale du corps de texte de 14px, respect des paramètres de réduction du mouvement.

---

## Liste des profils (v0.10)

| Profil | Priorité des actifs | Force | Faiblesse |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Dette de l'État > Dette des impôts > Banque > Monnaie | Augmentation du crédit public | Pas de revenus d'infrastructure |
| **Merchant / Infrastructure**  | Routes (les 4) > Commerce > Améliorations > Revenus | Échelle des routes | Pas de notation de la capacité industrielle |
| **Manufacturer / Industry**    | Fabrication > Industrie stratégique > Améliorations > Banque | Multiplicateurs de capacité | Début lent ; reçoit une charte de départ |

Le quatrième profil conceptuel (Opportuniste / Trésorerie) est reporté. L'ensemble compétitif verrouillé de la v0.10 est de trois.

---

## Limitations connues

- **Les seuils de capacité restent rares dans le jeu canonique.** La capacité finale moyenne est de 3,49 ; ≥ 6 est atteint dans seulement 4 / 100 parties. La notation industrielle de fin de partie existe comme un plafond, et non comme un chemin régulier.
- **La Trésorerie / Finance reste intentionnellement la plus forte**, dans la plage cible. Cela correspond à la thèse historique : le crédit public + la finance fédérale étaient le principal levier économique de Hamilton.
- **Les événements d'échec se sont déclenchés 0 / 400 fois** lors de la passe de validation de la v0.10. Les menaces par défaut / rébellion / faillite sont actuellement décoratives ; une version future pourrait revoir la pression des états d'échec.
- **Testé uniquement par simulation.** L'équilibre est validé par rapport à plus de 1 000 parties déterministes sur l'arc v0.3 → v0.10. Pas encore testé par des joueurs humains ; la déviation stratégique peut modifier ces taux.

---

## Construction et contribution

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

Les versions sont publiées sur npm via GitHub Actions (`release.yml`) lors de chaque modification de la branche étiquetée `v*`, avec une attestation de provenance Sigstore. La source de vérité est la branche `main`.

---

## Licence

MIT © mcp-tool-shop. Voir le fichier [`LICENSE`](./LICENSE).

---

<div align="center">

Créé par <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
