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

**Statut — v1.4.0 (bêta).** Première version majeure depuis v1.1.2 (circuit-victory). Ajoute trois couches au-dessus de la base du circuit : **profondeur stratégique** (actions spéciales liées au profil, cartes HAND avec fenêtres temporelles, récupération de la réforme, pression publique sur le crédit en plusieurs étapes), **arc stratégique** (événements de l'ère fédérale déclenchés à chaque tour à partir du tour 8, trois visions de profil avec bonus de fin de partie) et **le Chroniqueur** (une voix historique à la troisième personne qui fait apparaître 14 bannières liées aux événements tout au long du jeu, issues d'une banque de citations historiques vérifiées — 27 citations réelles de Hamilton / Madison / Jefferson / Adams / Gallatin / Maclay / Freneau, avec des URL traçables vers founders.archives.gov, Wikisource et la Bibliothèque du Congrès ; aucune attribution fabriquée). La durée moyenne d'une partie reste d'environ 23 tours / 67 étapes ; le calcul final déclenché par le circuit reste inchangé. Trois voies de profil viables : Trésor 59 % / Marchand 20 % / Fabricant 21 % (CANONIQUE × 100). Le jeu de plateau imprimable reste stable à la version v0.2. Consultez le fichier `CHANGELOG.md` pour connaître les modifications complètes et les limitations de la version bêta.

---

## Qu'est-ce que c'est ?

Sovereign est un **jeu de société du type Monopoly, basé sur le système Hamilton**, qui traite de la création du crédit public américain, ainsi qu'une **adaptation complète pour un mode solo / numérique** qui exécute les mêmes règles localement dans un navigateur, contre deux adversaires simulés et déterministes.

- **Jeu de plateau** — édition imprimable de 34 feuilles. Plateau de 40 cases, 22 propriétés + 4 itinéraires + 2 institutions, 8 systèmes de couleurs, 7 actes du Congrès dans un ordre historique fixe, 4 rôles de joueurs, 3 pistes partagées (Crédit public · Résistance publique · Capacité industrielle), 12+12 cartes d'événements. Deux voies économiques viables en dehors du Trésor : Marchand et Fabricant. Équilibrage à la version v0.2, figé.
- **Mode numérique** — un seul fichier HTML autonome. Condition de fin basée sur le circuit : le jeu se termine lorsque un joueur effectue sa quatrième traversée de "Trésor ouvert". La durée moyenne d'une partie est d'environ 23 tours (67 étapes). Lors du calcul final, le joueur avec la plus grande influence gagne, *pas nécessairement celui qui a fait le tour du plateau en premier*. Couche de profondeur stratégique : trois actions spéciales liées au profil, six cartes HAND avec fenêtres temporelles, action de récupération de la réforme, pression sur le crédit en plusieurs étapes (doute public / crise / panique / défaut de paiement). Couche d'arc stratégique : huit événements de l'ère fédérale déclenchés à chaque tour à partir du tour 8, trois visions de profil avec bonus de fin de partie. Couche de narration du Chroniqueur : 14 bannières historiques liées aux événements, citations réelles des Federalist Papers et Founders Online, notification persistante avec bouton de fermeture. Générateur de nombres aléatoires mulberry32 déterministe, adversaires IA programmés, sauvegarde / chargement avec intégrité du hachage, outil de suppression des répétitions, outil de simulation par lots réservé aux concepteurs.
- **Base d'équilibre** — circuit + profondeur stratégique + arc stratégique + Chroniqueur (v1.4.0 bêta) : Trésor 59 % · Marchand 20 % · Fabricant 21 % (CANONIQUE × 100). Les trois profils ont des chances de gagner de manière significative. Taux de réussite des objectifs : Architecte du crédit fédéral 54 %, Souverain du commerce 39 %, Fondateur industriel 29 %. Les mécanismes sous-jacents de la version v0.18 (crise du crédit, notation des brevets en espèces, charte industrielle, bonus de complétion de séries) sont conservés de manière identique en octets, provenant de l'évolution de la conception de la version v0.3 → v0.10 → v0.18, basée sur plus de 1000 simulations de jeux déterministes.

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

- **Jeu de victoire en mode solo** contre deux adversaires contrôlés par l'ordinateur (Trésor / Finances et Commerce / Infrastructures par défaut ; Fabricant / Industrie disponible pour le mode campagne). La partie se termine lorsque l'un des joueurs effectue sa quatrième traversée de "Trésor Ouvert". Durée moyenne : 23 tours / 67 actions. Le joueur ayant le plus d'influence au moment du décompte final remporte la partie.
- **Profondeur stratégique (niveau v1.2)** : trois actions spéciales spécifiques à chaque profil (Émission d'obligation fédérale / Contrat de courtage / Charte d'atelier), 6 cartes à jouer avec des fenêtres de temps (limite de 2 cartes en main), action de récupération des réformes, pression financière en plusieurs étapes (Doute public / Crise / Panique / Défaut).
- **Arc narratif (niveau v1.3)** : 8 événements de l'ère fédérale qui se déclenchent à chaque tour à partir du tour 8 (5 choix + 3 automatiques), 3 visions de profil (Architecte du crédit fédéral / Souverain du commerce / Fondateur industriel) avec un bonus de +3 points d'influence en fin de partie.
- **Le Chroniqueur (niveau v1.4)** : narration historique à la troisième personne avec des noms de personnages. 14 bannières liées aux événements (Actes × 7 / Ouverture de l'ère fédérale / Doute / Crise / Panique / Défaut / Rébellion / Réforme / Vision / Décompte final). Toutes les citations sont vérifiées par rapport aux sources founders.archives.gov, Wikisource et Library of Congress. Les actes échoués sont narrés comme des alternatives à l'histoire réelle ("Dans notre histoire, la loi de financement de Hamilton a été adoptée par 32 voix contre 29 en juillet 1790 ; dans votre république, la discrimination à l'égard des soldats a trouvé suffisamment de votes pour bloquer l'accès."). Une bannière avec bordure en aluminium, avec une option pour la masquer ; respecte les paramètres de narration (On/Minimal/Off).
- **Intelligence artificielle déterministe** : chaque décision de l'adversaire est une fonction pure de l'état visible, avec une justification enregistrée. Pas de modèle de langage, pas de magie opaque.
- **8 interfaces de jeu** : Plateau, Panneau du Trésor, Inspecteur des actifs, Tiroir des événements, Actes du Congrès, Pistes partagées, Journal des tours / Registre, Rapport de fin de partie.
- **Enchères** : les actifs non sélectionnés sont mis aux enchères entre plusieurs joueurs, avec des enchères programmées en fonction du profil.
- **Sauvegarde / Chargement** : sauvegarde automatique dans `localStorage` à chaque tour, exportation / importation manuelle au format JSON, vérification de l'intégrité des données lors du chargement, version spécifique.
- **Relecture** : relecture complète de toute partie terminée. Lecture seule. Reconstruit à partir de la graine et du journal des décisions, avec une indication verte de l'intégrité des données.
- **Simulation en série** : exécute 10 / 50 / 100 parties déterministes contre n'importe quel trio de profils, exporte des rapports JSON et HTML pour l'analyse de l'équilibre.
- **Narration historique** : bibliothèque de 25 entrées dérivée du registre (descriptions par défaut de 40 à 60 mots, extensions de 150 à 200 mots, résumé de la république en fin de partie d'environ 300 à 500 mots). Ne modifie jamais l'état du jeu.
- **Accessibilité** : navigation complète au clavier, indicateurs de focus, étiquettes significatives pour les lecteurs d'écran, valeurs des éléments lisibles en texte et non seulement en marqueurs, taille minimale du corps de texte de 14px, respect des paramètres de réduction des animations.

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

- **La version 1.4.0 est une version bêta.** Chaque composant (profondeur stratégique, arc stratégique, Chronicler) a été examiné et validé en fonction des diagnostics de simulation. L'ensemble des quatre niveaux a été testé au niveau de chaque composant, mais pas de bout en bout par un joueur humain. Les données issues des tests CANONICAL × 100 indiquent : 100 % de déclencements, une durée médiane de 23 tours, une répartition des vainqueurs de 59 / 20 / 21, environ 6 à 8 bannières Chronicler par partie, et environ 33 réactions par partie. Considérez cette version comme une version d'accès anticipé jusqu'à ce que vous l'ayez testée vous-même.
- **Les profils d'intelligence artificielle ne s'adaptent pas encore aux mécanismes des versions 1.2 à 1.4.** Ils utilisent les fonctions de décision de la version 0.18. Ils ne "cherchent pas à obtenir la Vision" ni ne "utilisent les cartes HAND de manière stratégique" comme le ferait un joueur humain. Le jeu réel des joueurs humains différera des mesures obtenues lors des tests CANONICAL × 100.
- **Le déclenchement d'un événement n'implique pas la victoire.** Le joueur qui complète le quatrième circuit ne gagne que par Influence dans environ un tiers des parties. C'est intentionnel : Final Accounting récompense la profondeur économique, et non la rapidité sur le plateau de jeu. La copie de fin de partie rend cette distinction explicite.
- **La phase de la République tardive est longue et ne comporte pas d'actions.** Les actions restent actives pendant les tours 1 à 7. La durée de jeu médiane est d'environ 23 tours, laissant environ 16 tours de la République tardive sans nouveaux événements politiques. Si cela vous semble vide lors des tests, la prochaine correction consistera à redistribuer les actions, et non à revenir au système des mandats.
- **Le Trésor / les Finances restent intentionnellement les plus puissants**, dans la plage cible. Cela correspond à la thèse historique : le crédit public et les finances fédérales étaient les principaux leviers économiques de Hamilton.
- **Les événements de défaillance (Défaut / Rébellion) restent principalement décoratifs.** La crise du crédit se déclenche occasionnellement ; le défaut et la rébellion se produisent presque jamais. Le système d'escalade a plus de temps pour s'accumuler, mais atteint rarement les niveaux supérieurs. Les versions futures pourraient revoir la pression exercée par les états de défaillance.

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
