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

## Qu'est-ce que c'est ?

Sovereign est un **jeu de société du type Monopoly, basé sur le système Hamilton**, qui traite de la création du crédit public américain, ainsi qu'une **adaptation complète pour un mode solo / numérique** qui exécute les mêmes règles localement dans un navigateur, contre deux adversaires simulés et déterministes.

- **Jeu de société** — édition imprimable de 34 feuilles. Plateau de 40 cases, 22 propriétés + 4 routes + 2 institutions, 8 systèmes de couleurs, 7 actes du Congrès dans un ordre historique fixe, 4 rôles de joueurs, 3 pistes communes (Crédit public · Résistance publique · Capacité industrielle), 12 cartes d'événements + 12 cartes supplémentaires. Deux voies économiques viables en dehors du Trésor : le commerçant et le fabricant.
- **Mode numérique** — un seul fichier HTML autonome. Machine d'état complète, générateur de nombres aléatoires mulberry32 déterministe, adversaires IA scriptés (Trésor / Finances, Commerçant / Infrastructures, Fabricant / Industrie), sauvegarde / chargement avec intégrité par hachage, outil de relecture, outil de simulation en lot, télémétrie locale de l'équilibre.
- **Équilibre de base** — l'équilibre de base de la version 0.10 est conservé jusqu'à la version 1.1.0. Trésor : 60,0 % · Commerçant : 23,5 % · Fabricant : 16,5 % (valeurs canoniques × 400 à la base raffinée de la version 0.18 ; la plage cible est atteinte pour les trois profils).
- **Système de défaillance** — trois niveaux : **Crise de crédit** (Crédit public ≤ 4, avertissement), **Rébellion** (Résistance publique à 12, catastrophe), **Défaut** (Crédit public à 0, catastrophe). Nouveau dans la version 1.1.0 ; les points de terminaison catastrophiques sont inchangés par rapport à la version 0.10.

---

## Nouveautés dans la version 1.1.0

### Fondation du système de défaillance

La version 1.1.0 introduit une hiérarchie de défaillance en trois niveaux. Le défaut à Crédit public à 0 reste la condition d'effondrement financier catastrophique (perte de 50 % des liquidités + 1 amélioration par joueur). La rébellion à Résistance publique à 12 reste l'effondrement politique catastrophique (améliorations des revenus détruites). Entre les deux, un nouvel événement intermédiaire — **Crise de crédit** — se déclenche la première fois que le Crédit public tombe à 4 ou moins, augmente la Résistance de +1 et enregistre une ligne "Système" dans le registre. Il ne réinitialise pas le Crédit, ne détruit pas les actifs et ne met pas fin au jeu.

Pour rendre la couche de défaillance réellement visible en jeu, quatre cartes de pression font maintenant baisser le Crédit :

| Carte | Effet |
|---|---|
| Ruée bancaire | Crédit public −1, Capacité industrielle −1 |
| Fièvre spéculative (Crédit ≥ 7) | Crédit public −1, Résistance +1, vente aux enchères des revenus/dettes de l'État non attribués |
| Fièvre spéculative (Crédit ≤ 6) | Crédit public −2, Résistance +1, vente aux enchères des revenus/dettes de l'État non attribués |
| Pamphlet anti-fédéraliste | Crédit public −1, Résistance +1, 30 TN par propriété du système de revenus |

L'acte de financement au tour 1 ajoute toujours +2 Crédit. Le point de terminaison catastrophique du défaut est conservé comme une limite dramatique, et non comme un objectif d'équilibre ; la Crise de crédit indique l'état actuel.

Preuves CANONICAL-400 (ensemences 2026 – 2425) : Trésor : 60,0 % · Commerçant : 23,5 % · Fabricant : 16,5 %. La Crise de crédit se déclenche 2 / 400 fois. Le défaut se déclenche 0 / 400 fois. La rébellion se déclenche 0 / 400 fois. La Résistance ≥ 8 se maintient à 0 / 400. Déterminisme : PASSÉ. Toutes les preuves sont disponibles à l'adresse `experiments/v0.18-failure-pressure-candidate/sovereign-v0.18-evidence-sweep.html`.

### Améliorations visuelles générales

Chaque élément visible par le joueur a été conçu avec soin pour créer un produit cohérent du Trésor fédéraliste :

- Logo en haut de l'écran + indicateur de mode + version discrète (n'est plus un en-tête du tableau de bord de télémétrie)
- Superposition d'introduction lors du premier chargement, présentant les trois pistes et les trois niveaux de défaillance
- Tuiles du plateau avec des ornements d'angle, des bandes de couleurs du système, des traitements distincts pour les institutions, les routes, les impôts et les espaces d'événements
- Les lignes du registre pour `CREDIT_CRISIS` / `DEFAULT` / `REBELLION` ont des traitements de gravité distincts (couleur + bordure + étiquette - adaptés à l'accessibilité)
- Le panneau des pistes indique la bande d'avertissement de la Crise de crédit (1 à 4) et les points de terminaison du défaut et de la rébellion
- Le rapport de fin de partie affiche des jetons de posture (posture du crédit / état de crise / état de rébellion) au-dessus des colonnes de score, avec une narration qui mentionne explicitement les résultats de la crise / du défaut / de la rébellion
- La fenêtre de simulation en lot a été redéfinie sous le nom de "Exécution de la preuve de l'équilibre"
- Point d'arrêt réactif ≤ 768 px et feuille de style pour l'impression

La documentation de référence du système de conception et un audit visuel de quinze états sont disponibles dans le répertoire `release/design-system/` ; ce sont les éléments qui constituent l'enregistrement permanent de l'apparence de la version v1.1.0.

### Fonctionnalités préservées

L'audit de promotion de la version v0.18 a réussi les 44 vérifications concernant l'origine, l'implémentation, la régression, les preuves d'équilibre/d'échec et la préparation de la documentation. La valeur de hachage de l'état de jeu canonique (100 graines) est identique en termes de bytes entre la simulation Node de la version v0.18 et le code HTML optimisé (`3189375454`). La variable `SAVE_VERSION` reste `'v0.18-candidate'` car aucune fonctionnalité n'a été modifiée lors de l'optimisation.

### Avertissement

Les fonctionnalités de la version v1.1.0 ont été vérifiées par simulation sur le triplet canonique T/M/Mfg (400 graines) et sur la variante MFG-MIRROR (100 graines). Elles n'ont pas encore été testées par des utilisateurs humains.

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

</div
