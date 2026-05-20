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

</div

---

**Statut — v1.1.1 (bêta).** La version v1.1.0 a été retirée le même jour de sa sortie (2026-05-20) après qu'une session de jeu humaine ait révélé deux problèmes structurels affectant la jouabilité, que les audits de simulation n'avaient pas détectés. La version v1.1.1 est une refonte : amélioration de la jouabilité pour les joueurs humains + rythme de 12 tours + modèle de victoire par mandat + apparition de la location. Il s'agit d'une **bêta optionnelle** : le mode numérique est proposé car il est significativement meilleur que la version v1.1.0, mais il n'a pas été testé en profondeur de bout en bout. La version imprimable du jeu de plateau reste stable à la version v0.2. Consultez le fichier `CHANGELOG.md` pour connaître les modifications complètes et les limitations de la version bêta.

---

## Qu'est-ce que c'est ?

Sovereign est un **jeu de société du type Monopoly, basé sur le système Hamilton**, qui traite de la création du crédit public américain, ainsi qu'une **adaptation complète pour un mode solo / numérique** qui exécute les mêmes règles localement dans un navigateur, contre deux adversaires simulés et déterministes.

- **Jeu de plateau** — édition imprimable en 34 feuilles. Plateau de 40 cases, 22 propriétés + 4 itinéraires + 2 institutions, 8 systèmes de couleurs, 7 actes du Congrès dans un ordre historique fixe, 4 rôles de joueurs, 3 pistes communes (Crédit public · Résistance publique · Capacité industrielle), 12 + 12 cartes d'événements. Deux voies économiques viables en dehors du Trésor : le commerçant et le fabricant. Équilibrage de la version v0.2, figé.
- **Mode numérique** — un seul fichier HTML autonome. Jeu de 12 tours avec un modèle de victoire par mandat : à partir du tour 8, un joueur disposant de 15 points d'influence et d'une avance de 5 points déclenche le bilan final et met fin à la partie. S'il n'y a pas de mandat, la partie se termine au tour 12. Générateur de nombres aléatoires déterministe mulberry32, adversaires IA programmés (Trésor / Finances, Commerçant / Infrastructures, Fabricant / Industrie), sauvegarde / chargement avec vérification de l'intégrité, outil de relecture des parties, outil de simulation en lot réservé aux concepteurs.
- **Équilibre de base** — modèle de 12 tours avec mandat (bêta v1.1.1) : Trésor 51 % · Commerçant 33 % · Fabricant 16 % (CANONIQUE × 100). Les trois profils peuvent obtenir un mandat ; aucun profil n'est exclu. Les mécanismes sous-jacents de la version v0.18 (Crise du crédit, système de points d'influence, Charte industrielle, bonus pour la complétion des ensembles) sont conservés de manière identique, provenant de l'évolution de la conception v0.3 → v0.10 → v0.18, basée sur plus de 1000 simulations déterministes.

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

Le prototype du jeu de société est un document HTML autonome en 34 feuilles. Ouvrez `release/board-game/sovereign-prototype.html` depuis le paquet (ou depuis un téléchargement), puis `Cmd/Ctrl-P → Enregistrer sous PDF → Format US Letter → 100 % de l'échelle`. Découpez et jouez.

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

- **La version v1.1.1 est une bêta.** Le mode numérique a été testé par rapport aux diagnostics de simulation, et le test en lot CANONIQUE × 100 a donné 62 / 100 déclenchements de mandat (par rapport aux 67 prévus), avec une répartition des gagnants de 51 / 33 / 16, exactement comme prévu. Il **n'a pas** été testé en profondeur de bout en bout par un joueur humain ; l'adaptation comportementale (la manière dont les joueurs se comportent une fois qu'ils connaissent le système de mandat) n'a pas été mesurée. Considérez-le comme une version optionnelle jusqu'à ce que vous l'ayez vous-même testée.
- **Les profils d'IA ne sont pas encore en compétition pour le mandat.** Ils utilisent les mêmes fonctions de décision de la version v0.18, ce qui signifie qu'ils jouent pour accumuler des points d'influence sur toute la partie, et non pour atteindre rapidement le seuil de 15 points d'influence. Une version future ajustera les décisions des profils en fonction de la prise de conscience du mandat. Les joueurs humains peuvent se comporter différemment.
- **La faillite est une pression indirecte à 12 tours.** Environ 7 / 100 d'événements dans CANONIQUE × 100 avec mandat (par rapport à environ 18 / 100 sans mandat, car les parties se terminent plus tôt). Il est intéressant de l'observer lors des tests.
- **Le Trésor / Finances reste intentionnellement le profil le plus puissant**, dans la plage cible. Cela correspond à la thèse historique : le crédit public et les finances fédérales étaient les principaux leviers économiques de Hamilton.
- **Les événements de défaillance (Défaut / Rébellion) restent principalement décoratifs.** La Crise du crédit se déclenche environ 2 / 100 fois à 12 tours. Le système d'escalade a plus de temps pour s'accumuler, mais atteint rarement un état de défaut ou de rébellion. Les versions futures pourraient revoir la pression exercée en cas de défaillance.

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

</div
