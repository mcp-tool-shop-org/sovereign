<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.md">English</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**The Hamilton System Board Game · adaptation solo / numérique**

*Financement initial · Financez la dette. Construisez la banque. Industrialisez la République.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **Bêta publique** — jouable gratuitement dans votre navigateur, sans installation. Le jeu est peaufiné mais continue d’évoluer ; consultez le fichier [`CHANGELOG.md`](./CHANGELOG.md) pour connaître les nouveautés et les points faibles connus.

---

## Ce que c’est

Sovereign est un **jeu de société de type Hamilton-system Monopoly** qui traite de la création du crédit public américain, ainsi qu’une **adaptation solo / numérique** qui applique les mêmes règles localement dans un navigateur, face à deux adversaires scriptés et déterministes.

- **Jeu de société** — édition imprimable de 34 feuilles. Plateau de 40 cases, 22 propriétés + 4 routes + 2 institutions, 8 systèmes de couleurs, 7 lois du Congrès dans un ordre historique fixe, 4 rôles de joueurs, 3 pistes partagées (Crédit public · Résistance publique · Capacité industrielle), 12 + 1 cartes d’événements. Deux voies économiques viables au-delà du Trésor : le commerçant et le fabricant. Équilibre de la version 0.2, figé.
- **Mode numérique** — fichier HTML unique et autonome. Condition de fin basée sur un circuit : le jeu se termine lorsqu’un joueur effectue sa quatrième traversée du Trésor. Durée moyenne du jeu : **~22 tours (~66 tours)**. Lors du décompte final, le joueur ayant le plus d’influence gagne, *pas nécessairement celui qui a fait le tour du plateau en premier*. Couche de présence des rivaux : classement de l’influence visible + lignes de posture par adversaire. Couche de profondeur stratégique : trois actions spéciales verrouillées par profil, six cartes HAND avec des fenêtres de temps, action de redressement de la réforme, la spirale du crédit en plusieurs étapes (Doute public → Crise → Panique → Défaut) avec une taxe de service de la dette, accélération annoncée, prévision et une bouée de sauvetage de la réforme. Couche d’arc stratégique : huit événements de l’ère fédérale qui se déclenchent à chaque tour à partir du tour 8, trois visions de profil avec des bonus de fin de partie. Couche de narration du chroniqueur : 14 bannières historiques liées aux événements, plus l’informatif niveau B (pop-ups « En savoir plus », l’encyclopédie du chroniqueur, infobulles du glossaire), citations réelles des Federalist Papers et des Founders Online, message persistant avec × pour le fermer. Effets visuels et sonores : nombre en transition, audio procédural ZzFX (13 effets sonores), un réglage de VITESSE cinématographique / normal / rapide. Générateur de nombres aléatoires déterministe mulberry32, adversaires IA scriptés, sauvegarde / chargement avec intégrité du hachage, barre de relecture, outil de simulation par lots contrôlé par le concepteur.
- **Trois voies réelles vers la victoire** — le Trésor, le commerçant et le fabricant gagnent tous de manière significative, le Trésor étant le plus fort, conformément à l’histoire : le crédit public et les finances fédérales étaient le principal levier économique d’Hamilton. Chaque profil joue différemment, avec sa propre action spéciale et une vision de profil à poursuivre.

---

## Démarrage rapide

### Jouez dans votre navigateur (zéro installation)

```bash
npx @mcptoolshop/sovereign
```

La commande CLI ouvre le jeu dans votre navigateur par défaut. Pas d’installateur, pas de serveur, pas de connexion Internet requise.

Autres modes :

```bash
npx @mcptoolshop/sovereign --print    # Open the printable 34-sheet board game
npx @mcptoolshop/sovereign --start    # Open the audience-routed landing page
npx @mcptoolshop/sovereign --path     # Print the playable HTML file path
npx @mcptoolshop/sovereign --help     # All flags
```

### Jouez en ligne

Ouvrez la page d’accueil hébergée à l’adresse **<https://mcp-tool-shop-org.github.io/sovereign/>** et cliquez pour accéder au jeu numérique.

### Imprimez et jouez

Le jeu de société imprimable est un document HTML autonome de 34 feuilles. Ouvrez `release/board-game/sovereign-board-game.html` à partir du package (ou à partir d’un téléchargement), puis `Cmd/Ctrl-P → Enregistrer au format PDF → US Letter → Échelle de 100 %. Découpez et jouez.

### Ensemble de publication hors ligne

Chaque version étiquetée inclut un ensemble `sovereign-vX.Y.Z-release.zip` dans sa page de publication GitHub. Téléchargez-le, décompressez-le et ouvrez `00-START-HERE.html` pour accéder au point d’entrée adapté au public. Tout fonctionne hors ligne.

---

## Pourquoi il existe

La thèse de Sovereign est que le **crédit public + les finances fédérales** étaient le principal levier économique d’Alexander Hamilton, mais un jeu de type Hamilton doit permettre au **commerce** et à l’**industrie** d’être également des voies viables vers la victoire. L’arc d’équilibre (v0.2 → v0.10) a été une progression en neuf versions, basée sur des preuves, pour maintenir le Trésor comme le profil le plus fort (en accord avec l’histoire) sans réduire la conception à un jeu à stratégie unique.

Consultez le fichier [`CHANGELOG.md`](./CHANGELOG.md) pour connaître l’évolution complète de chaque version.

---

## Déterminisme

Même graine + mêmes décisions humaines = journal identique entre les parties, les navigateurs et les systèmes d’exploitation.

- Un seul générateur de nombres aléatoires : `mulberry32(state.rngSeed)`.
- Décisions des adversaires : fonctions pures de l’état visible, chaque décision étant enregistrée dans le journal avec la règle qui l’a déclenchée.
- La sauvegarde / le chargement conserve un hachage d’état.
- La relecture est reconstruite à partir de `initialState(seed) + decisionLog`.
- Vérifié sur plus de 1 000 parties déterministes pendant l’arc d’équilibre v0.2 → v0.10.

---

## Modèle de menace et gestion des données

Sovereign est un jeu de société autonome basé sur un navigateur. La commande CLI ouvre un fichier HTML local dans votre navigateur par défaut. Il n’y a pas de serveur, pas d’appel réseau, pas de compte, pas de synchronisation dans le cloud.

- **Données concernées :** les fichiers HTML inclus dans `release/` (en lecture seule) et `localStorage` sous la clé `sovereign.autosave` (uniquement l’état de sauvegarde du jeu).
- **Données non concernées :** aucun accès au système de fichiers en dehors du répertoire du package, aucune requête réseau de quelque type que ce soit, aucune télémétrie, aucune analyse, aucun identifiant.
- **Autorisations requises :** possibilité de lancer le navigateur par défaut du système d’exploitation, possibilité de lire les fichiers du package, `localStorage` du navigateur (facultatif).
- **Aucune télémétrie, jamais.** La fonctionnalité de « télémétrie » du simulateur fait référence à des rapports locaux d’analyse du jeu dérivés du journal en ligne ; ces rapports ne quittent jamais votre appareil.

Consultez le fichier [`SECURITY.md`](./SECURITY.md) pour signaler les vulnérabilités et connaître l’intégralité de la politique de sécurité.

---

## Fonctionnalités

- **Jeu solo de victoire sur circuit** contre deux adversaires programmés (Trésorerie/Finance et Commerce/Infrastructure par défaut ; Fabricant/Industrie disponible pour les parties en série). Le jeu se termine lorsqu’un joueur effectue sa quatrième traversée de Treasury Opens. Le joueur ayant la plus grande influence au moment du décompte final gagne. Durée moyenne : environ 22 tours / environ 66 actions.
- **Présence de l’adversaire (couche v1.5)** : affichage visible du classement de l’influence et des lignes de posture par adversaire qui encadrent chaque action de l’adversaire par rapport à *votre* position dans la course (« Hamilton : 3 points d’influence d’avance ; il prend la Banque ; le bloc de la Trésorerie se resserre. »). Met fin à la sensation de jeu en solitaire parallèle ; les adversaires sont perçus comme tels. Présentation uniquement : les données ne sont jamais écrites dans le journal haché.
- **La spirale du crédit (couche v1.5)** : l’échec du crédit public est désormais perceptible, cumulatif et récupérable. Une taxe en espèces sur le service de la dette en cas de faible crédit, une accélération signalée vers le défaut de paiement, une prévision de la direction que prendra la pente et l’action de réforme en tant que véritable planche de salut. Elle véhicule directement la thèse civique : vous comprenez *pourquoi* le crédit public fédéral était important. Elle englobe la hiérarchie d’échec existante (Doute public → Crise → Panique → Défaut), et la sauvegarde/relecture reste entièrement déterministe.
- **Effets visuels et sonores (couche v1.5)** : nombre en transition avec asymétrie de gain/perte, audio procédural ZzFX dans 13 scénarios, chorégraphie des actions et réglage de la vitesse (Cinématique / Normal / Rapide-instantané ; Rapide-instantané saute toutes les animations pour un jeu rapide et une meilleure accessibilité). Prise en charge complète du clavier / réduction des mouvements / lecteur d’écran.
- **Profondeur stratégique (couche v1.2)** : trois actions spéciales verrouillées par profil (Émettre des obligations fédérales / Négocier un contrat de route / Créer un atelier), 6 cartes HAND avec des fenêtres de synchronisation (limite de 2 cartes en main), action de redressement de la réforme.
- **Arc narratif stratégique (couche v1.3)** : 8 événements de l’ère fédérale qui se déclenchent à chaque tour à partir du tour 8 (5 choix + 3 automatiques), 3 visions de profil (Architecte du crédit fédéral / Souverain du commerce / Fondateur industriel) avec un bonus de fin de partie. Les trois visions sont réalisables.
- **Le chroniqueur (couche v1.4)** : voix historique à la troisième personne. 14 bannières liées à des événements (Actes × 7 / Ouverture de l’ère fédérale / Doute / Crise / Panique / Défaut / Rébellion / Réforme / Vision / Décompte final). Toutes les citations sont vérifiées par rapport aux sources founders.archives.gov, Wikisource et Library of Congress. Les actes échoués sont racontés comme des contre-faits de l’histoire réelle (« Dans notre histoire, l’acte de financement d’Hamilton a été adopté par 32 voix contre 29 en juillet 1790 ; dans votre République, la discrimination à l’égard des soldats a trouvé suffisamment de voix pour fermer la porte. »). Une bannière à bordure de feuille persistante avec × pour la supprimer ; respecte le paramètre de narration Activé/Minimal/Désactivé.
- **Chroniqueur, niveau B : la couche informative (v1.5)** : 15 fenêtres contextuelles *Pour en savoir plus* sur les mécanismes clés, **l’encyclopédie du chroniqueur** (27 citations historiques vérifiées plus les actes, les événements de l’ère fédérale, les niveaux de crédit et les visions dans une seule superposition de référence) et 10 infobulles de glossaire. Transforme la saveur de l’époque en une véritable couche historique consultable.
- **Intégration (couche v1.5)** : un tutoriel guidé « Débat sur le financement de 1790 » qui présente les bases du jeu à un nouveau joueur, ainsi qu’une infobulle/mise au point qui affiche le coût et les conséquences de chaque action avant que vous ne vous engagiez.
- **IA déterministe** : chaque décision de l’adversaire est une fonction pure de l’état visible avec une raison enregistrée. Pas d’IA générative, pas de magie opaque.
- **8 surfaces de jeu** : tableau de bord, tableau de la Trésorerie, inspecteur des actifs, tiroir d’événements, actes du Congrès, pistes partagées, journal des tours / journal, rapport de fin de partie.
- **Enchères** : les actifs refusés sont mis aux enchères entre plusieurs joueurs, avec des enchères programmées en fonction du profil.
- **Sauvegarde / chargement** : sauvegarde automatique dans `localStorage` à chaque tour, exportation / importation manuelle au format JSON, vérification de l’intégrité du hachage au chargement, contrôle de la version.
- **Relecture** : possibilité de revoir entièrement n’importe quelle partie terminée. En lecture seule. Reconstruit à partir de la graine + du journal des décisions avec un indicateur d’intégrité vert.
- **Simulation par lots** : exécutez 10 / 50 / 100 jeux déterministes contre n’importe quel triplet de profils, exportez des rapports JSON + HTML pour l’analyse de l’équilibre.
- **Narration historique** : bibliothèque de 25 entrées dérivées du journal (par défaut de 40 à 60 mots, extensions de 150 à 200 mots, résumé de fin de partie d’environ 300 à 500 mots). Ne modifie jamais l’état.
- **Accessibilité** : navigation complète au clavier, indicateurs de mise au point, étiquettes significatives pour les lecteurs d’écran, valeurs de piste lisibles sous forme de texte et non uniquement sous forme de marqueurs, taille de police minimale de 14 pixels, respect de la réduction des mouvements.

---

## Composition des profils (base de référence de l’équilibre v0.10)

| Profil | Priorité des actifs | Force | Faiblesse |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | NF > Dette de l’État > Dette de la Révolution > Banque > Monnaie | Augmentation du crédit public | Pas de revenus de l’infrastructure |
| **Merchant / Infrastructure**  | Routes (les 4) > Commerce > Améliorations > Revenus | Échelle des routes | Pas de notation de la capacité industrielle |
| **Manufacturer / Industry**    | Fabrication > Industrie stratégique > Améliorations > Banque | Multiplicateurs de capacité | Début lent ; obtient une charte de démarrage |

Le quatrième profil du document de conception (Opportuniste / Liquidités) est reporté. L’ensemble compétitif verrouillé de la version v0.10 est de trois.

---

## Notes de la version bêta

- **Il s’agit d’une version bêta publique** : elle est peaufinée et agréable, mais elle est encore en développement ; vous pourriez rencontrer quelques imperfections. Les signalements de bogues et les commentaires sont les bienvenus sur le [système de suivi des problèmes](https://github.com/mcp-tool-shop-org/sovereign/issues).
- **Le fait de compléter le plateau en premier ne garantit pas la victoire.** La partie se termine lorsqu’un joueur effectue son quatrième tour du plateau, mais le gagnant est celui qui possède le plus d’Influence lors du décompte final : la profondeur économique l’emporte sur la rapidité. L’écran de fin de partie le confirme.
- **La voie du Trésor est la plus efficace, de par sa conception.** Le crédit public et les finances fédérales étaient les principaux atouts d’Hamilton, c’est pourquoi le Trésor l’emporte le plus souvent, mais les voies du Marchand et du Fabricant sont toutes deux viables et offrent des styles de jeu très différents.

---

## Développement et contributions

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

Les versions sont publiées sur npm via GitHub Actions (`release.yml`) lors de la validation d’une étiquette `v*`, avec une attestation d’origine Sigstore. La branche `main` est la source de référence.

---

## Licence

MIT © mcp-tool-shop. Voir [`LICENSE`](./LICENSE).

---

<div align="center">

Créé par <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
