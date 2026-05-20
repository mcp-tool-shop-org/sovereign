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

**Statut — v1.1.2 (bêta).** La version v1.1.0 a été retirée le jour même de sa sortie (2026-05-20). La version v1.1.1 a refait le mode numérique avec des corrections de jouabilité, un rythme de 12 tours, et un seuil de victoire par mandat, mais elle restait toujours trop courte. La version v1.1.2 remplace la condition de fin basée sur le nombre de tours par une condition de fin basée sur un circuit : la partie se termine lorsque l'un des joueurs a fait le tour de la République quatre fois. La durée moyenne d'une partie est d'environ 23 tours / 67 tours (1,9 fois la v1.1.1). Le joueur qui déclenche la fin ne gagne pas automatiquement ; c'est le joueur avec la plus grande influence lors du décompte final qui gagne. La version imprimable du jeu de plateau reste stable à la version v0.2. Consultez le fichier `CHANGELOG.md` pour connaître les modifications complètes et les limitations de la version bêta.

---

## Qu'est-ce que c'est ?

Sovereign est un **jeu de société du type Monopoly, basé sur le système Hamilton**, qui traite de la création du crédit public américain, ainsi qu'une **adaptation complète pour un mode solo / numérique** qui exécute les mêmes règles localement dans un navigateur, contre deux adversaires simulés et déterministes.

- **Jeu de plateau** — édition imprimable de 34 feuilles. Plateau de 40 cases, 22 propriétés + 4 routes + 2 institutions, 8 systèmes de couleurs, 7 actes du Congrès dans un ordre historique fixe, 4 rôles de joueurs, 3 pistes communes (Crédit public · Résistance publique · Capacité industrielle), 12 + 12 cartes d'événements. Deux voies économiques viables en dehors du Trésor : le commerçant et le fabricant. Équilibrage de la version v0.2, figé.
- **Mode numérique** — un seul fichier HTML autonome. Condition de fin basée sur un circuit : la partie se termine lorsque l'un des joueurs effectue son quatrième passage par "Trésor ouvert". La durée moyenne d'une partie est d'environ 23 tours (67 tours). Lors du décompte final, le joueur avec la plus grande influence gagne, *et non nécessairement celui qui a fait le tour du plateau en premier*. La limite maximale de tours reste à 30 pour des raisons de sécurité (elle ne se déclenche jamais dans le mode CANONIQUE × 100). Générateur de nombres aléatoires mulberry32 déterministe, adversaires IA scriptés (Trésor / Finances, Commerçant / Infrastructures, Fabricant / Industrie), sauvegarde / chargement avec intégrité des données, outil de simulation par lots pour les concepteurs.
- **Équilibre de base** — modèle de circuit (v1.1.2 bêta) : Trésor 56 % · Commerçant 19 % · Fabricant 25 % (CANONIQUE × 100). Les trois profils ont une chance de gagner de manière significative ; le fabricant gagne plus souvent dans les parties plus longues, car les ensembles industriels ont le temps de se développer ; la part du commerçant diminue à mesure que les routes deviennent moins dominantes lorsque l'argent est dépensé pour des améliorations sur une période plus longue. Les mécanismes sous-jacents de la version v0.18 (Crise du crédit, notation des points de propriété, Charte industrielle, bonus pour l'achèvement des ensembles) sont conservés de manière identique, provenant de la conception v0.3 → v0.10 → v0.18, basée sur plus de 1000 simulations de jeux déterministes.

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

- **La version v1.1.2 est une bêta.** Les chiffres proviennent du diagnostic effectué lors de la simulation par lots intégrée (100 % des parties déclenchent la fin par circuit, durée moyenne de 23 tours, répartition des gagnants 56 % / 19 % / 25 %). Elle n'a **pas** été testée de bout en bout par un joueur humain. Considérez-la comme une version à tester sur demande jusqu'à ce que vous l'ayez vous-même testée.
- **Les profils d'IA ne se font pas encore la course pour les circuits.** Ils utilisent les fonctions de décision de la version v0.18, qui visent à accumuler de l'influence plutôt qu'à faire la course vers le quatrième circuit. Les joueurs humains peuvent se comporter très différemment une fois qu'ils comprennent la condition de fin.
- **Déclencheur ≠ gagnant.** Le joueur qui effectue le quatrième circuit ne gagne que par influence dans environ un tiers des parties. C'est intentionnel : le décompte final récompense la profondeur économique, et non la vitesse autour du plateau. La copie de fin de partie rend cette distinction explicite.
- **La partie tardive de la République est longue et ne comporte aucun acte.** Les actes sont toujours actifs pendant les tours 1 à 7. La durée moyenne d'une partie est d'environ 23 tours, ce qui laisse environ 16 tours de la partie tardive de la République sans nouveaux événements politiques. Si cela vous semble vide en mode "jeu froid", la prochaine correction consistera à redistribuer les actes, et non à revenir à un système de mandat.
- **Le Trésor / Finances reste intentionnellement le plus puissant**, dans la plage cible. Cela correspond à la thèse historique : le crédit public et les finances fédérales étaient les principaux leviers économiques de Hamilton.
- **Les événements de défaillance (Défaut / Rébellion) restent principalement décoratifs.** La Crise du crédit se déclenche occasionnellement ; le Défaut et la Rébellion se déclarent presque jamais. Le système d'escalade a plus de temps pour s'accumuler, mais atteint rarement les niveaux supérieurs. Les versions futures pourraient revoir la pression des états de défaillance.

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
