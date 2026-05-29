<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.md">English</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<div align="center">

<img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/sovereign/readme.png" alt="Sovereign — The Hamilton System Board Game" width="400" />

**Le jeu de société Hamilton System · adaptation solo / numérique**

*Financement initial · Financez la dette. Construisez la banque. Industrialisez la République.*

[![CI](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/sovereign/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@mcptoolshop/sovereign.svg)](https://www.npmjs.com/package/@mcptoolshop/sovereign)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Landing Page](https://img.shields.io/badge/landing-page-1F2D52?style=flat)](https://mcp-tool-shop-org.github.io/sovereign/)

</div>

---

> **État — v1.5.0 (bêta).** La version « pour que l’on ressente l’expérience », qui s’appuie sur la base stratégique de la v1.4. Cinq éléments clés sont présents : **présence des adversaires** (classement d’influence visible + lignes de posture par adversaire qui mettent fin à la phase de jeu solitaire), **la spirale du crédit** (la pression en cas d’échec se fait désormais sentir, elle s’amplifie et est *réversible* — une taxe de remboursement de la dette, une accélération annoncée vers le défaut de paiement, une prévision et une bouée de sauvetage sous forme de réforme — et elle véhicule la thèse civique : vous ressentez *pourquoi* le crédit public est important), **effets visuels et sonores** (transition numérique avec asymétrie de gain/perte, audio procédural ZzFX sur 13 effets sonores, chorégraphie des actions, réglage de la vitesse : Cinématique / Normal / Instantané, accessibilité complète), **niveau Chronicler B** (15 fenêtres contextuelles « En savoir plus », l’encyclopédie Chronicler’s Ledger — 27 citations vérifiées plus des actes / événements / niveaux / visions — et 10 infobulles), et **tutoriel** (un tutoriel Swift-Start « Débat sur le financement de 1790 » + une présentation complète sans rien cacher). Deux éléments de jeu difficiles présents dans la v1.4.0 sont corrigés (enchères déclenchées par une carte ; achat avec des liquidités insuffisantes), et la fidélité de la sauvegarde / du chargement / de la relecture est restaurée (`SAVE_VERSION = v0.26-replay-fidelity-candidate`). La durée moyenne d’une partie est de **~22 tours (~66 tours)** ; la condition de fin basée sur un circuit reste inchangée. L’équilibre mesuré (CANONICAL × 100) est le suivant : Trésor **48 %** / Marchand **34 %** / Fabricant **18 %** — les trois profils gagnent de manière significative. **La v1.5.0 est une version bêta en attente d’une démonstration complète avec un joueur humain** (la validation de la jouabilité). Le jeu de société imprimable reste stable à la v0.2. Consultez le fichier `CHANGELOG.md` pour connaître l’ensemble des modifications et les mises en garde concernant la version bêta.

---

## Ce que c’est

Sovereign est un **jeu de société de type Hamilton System Monopoly** qui traite de la création du crédit public américain, ainsi qu’une **adaptation solo / numérique** qui applique les mêmes règles localement dans un navigateur contre deux adversaires scriptés et déterministes.

- **Jeu de société** — édition imprimable de 34 feuilles. Plateau de 40 cases, 22 propriétés + 4 itinéraires + 2 institutions, 8 systèmes de couleurs, 7 lois du Congrès dans un ordre historique fixe, 4 rôles de joueurs, 3 pistes partagées (Crédit public · Résistance publique · Capacité industrielle), 12 + 12 cartes d’événements. Deux voies économiques viables au-delà du Trésor : le Marchand et le Fabricant. Équilibre de la v0.2, figé.
- **Mode numérique** — un seul fichier HTML autonome. Condition de fin basée sur un circuit : le jeu se termine lorsqu’un joueur effectue sa quatrième traversée de la case « Ouverture du Trésor ». Durée moyenne d’une partie : **~22 tours (~66 tours)**. Lors du décompte final, le joueur ayant le plus d’influence gagne, *pas nécessairement celui qui a fait le tour du plateau en premier*. Niveau de présence des adversaires : classement d’influence visible + lignes de posture par adversaire. Niveau de profondeur stratégique : trois actions spéciales verrouillées par profil, six cartes HAND avec des fenêtres de temps, action de redressement par le biais de la réforme, la spirale du crédit à plusieurs étapes (Doute public → Crise → Panique → Défaut de paiement) avec une taxe de remboursement de la dette, une accélération annoncée, une prévision et une bouée de sauvetage sous forme de réforme. Niveau d’arc stratégique : huit événements de l’ère fédérale qui se déclenchent à chaque tour à partir du tour 8, trois visions de profil avec des bonus de fin de partie. Niveau de narration du Chronicler : 14 bannières historiques liées aux événements, ainsi que le niveau B informatif (fenêtres contextuelles « En savoir plus », l’encyclopédie Chronicler’s Ledger, infobulles), des citations réelles tirées des Federalist Papers et de Founders Online, un message persistant avec un bouton de fermeture. Effets visuels et sonores : transition numérique, audio procédural ZzFX (13 effets sonores), réglage de la vitesse : Cinématique / Normal / Instantané. Générateur de nombres aléatoires déterministe mulberry32, adversaires IA scriptés, sauvegarde / chargement avec intégrité du hachage, barre de relecture, outil de simulation par lots contrôlé par le concepteur.
- **Équilibre de base** — circuit + profondeur stratégique + arc stratégique + Chronicler + spirale du crédit (bêta v1.5.0) : Trésor **48 %** · Marchand **34 %** · Fabricant **18 %** (CANONICAL × 100, mesuré par rapport au moteur en direct via `test/measure-stats.mjs`). Les trois profils gagnent de manière significative, le Trésor étant le plus fort, conformément à la thèse historique. Les trois visions de profil (Architecte du crédit fédéral / Souverain du commerce / Fondateur industriel) sont réalisables et à peu près équilibrées — chacune se déclenche dans environ 41 à 43 % des parties. Les mécanismes sous-jacents de la v0.18 (crise du crédit, notation IP des liquidités, charte industrielle, bonus de complétion d’ensemble) sont préservés, identiques à ceux de l’arc de conception v0.3 → v0.10 → v0.18, qui a été basé sur plus de 1 000 parties de simulation déterministes.

---

## Démarrage rapide

### Jouez dans votre navigateur (zéro installation)

```bash
npx @mcptoolshop/sovereign
```

La commande CLI ouvre le jeu dans votre navigateur par défaut. Pas d’installateur, pas de serveur, pas d’Internet requis.

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

Le jeu de société imprimable est un document HTML autonome de 34 feuilles. Ouvrez `release/board-game/sovereign-board-game.html` à partir du package (ou après l’avoir téléchargé), puis `Cmd/Ctrl-P → Enregistrer au format PDF → US Letter → Échelle de 100 %. Coupez et jouez.

### Bundle de la version hors ligne

Chaque version publiée inclut un fichier compressé `sovereign-vX.Y.Z-release.zip` qui est ajouté à la page de publication sur GitHub. Téléchargez-le, décompressez-le et ouvrez `00-START-HERE.html` pour accéder au point d’entrée principal du jeu. Tout fonctionne hors ligne.

---

## Pourquoi ce jeu existe

La thèse de Sovereign est que le **crédit public + les finances fédérales** étaient les principaux leviers économiques d’Alexander Hamilton, mais un jeu basé sur le système de Hamilton doit permettre au **commerce** et à l’**industrie** d’être également des voies viables vers la victoire. L’évolution du jeu (de la version v0.2 à la v0.10) a consisté en une série de neuf versions, axée sur les données, afin de maintenir le Trésor comme le profil le plus fort (en accord avec l’histoire) sans réduire le jeu à une stratégie unique.

Consultez le fichier [`CHANGELOG.md`](./CHANGELOG.md) pour connaître l’évolution complète du jeu, version par version.

---

## Déterminisme

La même graine + les mêmes décisions humaines = un registre identique, quelle que soit l’exécution, le navigateur ou le système d’exploitation.

- Générateur de nombres aléatoires unique : `mulberry32(state.rngSeed)`.
- Décisions de l’adversaire : fonctions pures de l’état visible, chaque décision étant enregistrée dans le registre avec la règle qui l’a déclenchée.
- L’enregistrement et le chargement préservent un hachage d’état.
- La relecture se reconstruit à partir de `initialState(seed) + decisionLog`.
- Vérifié sur plus de 1 000 jeux déterministes pendant l’évolution du jeu (de la version v0.2 à la v0.10).

---

## Modèle de menace et gestion des données

Sovereign est un jeu de société autonome basé sur un navigateur. L’interface en ligne de commande ouvre un fichier HTML local dans votre navigateur par défaut. Il n’y a pas de serveur, pas d’appel réseau, pas de compte, pas de synchronisation avec le cloud.

- **Données utilisées :** les fichiers HTML inclus dans `release/` (en lecture seule) et `localStorage` sous la clé `sovereign.autosave` (uniquement l’état de sauvegarde du jeu).
- **Données non utilisées :** aucun accès au système de fichiers en dehors du répertoire du package, aucune requête réseau de quelque sorte que ce soit, aucune télémétrie, aucune analyse, aucun identifiant.
- **Autorisations requises :** possibilité de lancer le navigateur par défaut du système d’exploitation, possibilité de lire les fichiers du package, `localStorage` du navigateur (facultatif).
- **Aucune télémétrie, jamais.** La fonctionnalité de « télémétrie » du simulateur fait référence aux rapports d’analyse de jeu locaux dérivés du registre dans le navigateur ; ces rapports ne quittent jamais votre ordinateur.

Consultez le fichier [`SECURITY.md`](./SECURITY.md) pour signaler les vulnérabilités et connaître l’intégralité de la politique de sécurité.

---

## Fonctionnalités

- **Partie en solo : victoire au tour** contre deux adversaires préprogrammés (Trésor/Finance et Commerce/Infrastructure par défaut ; Fabricant/Industrie disponible pour les parties en série). La partie se termine lorsqu'un joueur effectue sa quatrième traversée de la case « Trésor ouvert ». Nombre moyen de tours : ~22 / Nombre moyen de manches : ~66. Le joueur ayant la plus grande influence lors du décompte final gagne.
- **Présence de l’adversaire (couche v1.5)** : affichage visible du classement de l’influence et des lignes indiquant l’attitude de chaque adversaire, qui définissent les actions de chaque adversaire en fonction de *votre* position dans la course (« Hamilton a 3 points d’influence d’avance et prend la Banque ; le bloc du Trésor se renforce. »). Met fin à la sensation de jeu en solo parallèle ; les adversaires sont perçus comme tels. Présentation uniquement ; les données ne sont jamais écrites dans le registre chiffré.
- **La spirale du crédit (couche v1.5)** : l’échec du crédit public est désormais perceptible, cumulatif et réparable. Un prélèvement en espèces pour le service de la dette en cas de faible crédit, une accélération signalée vers le défaut de paiement, une prévision de la direction que prendra la situation et l’action de réforme en tant que véritable solution. Elle véhicule directement la thèse civique : vous comprenez *pourquoi* le crédit public fédéral était important. Elle englobe la hiérarchie de la version 0.18 (Doute public → Crise → Panique → Défaut) sans en modifier les seuils ; elle est appliquée à l’intérieur de `reduce()` afin de garantir sa compatibilité avec les parties répétées.
- **Effets visuels et sonores (couche v1.5)** : nombre d’animations avec asymétrie de gain/perte, audio procédural ZzFX sur 13 effets sonores, chorégraphie des actions et réglage de la vitesse (Cinématique / Normal / Rapide-instantané ; Rapide-instantané saute toutes les animations pour une lecture rapide et une meilleure accessibilité). Prise en charge complète du clavier / réduction des mouvements / lecteur d’écran.
- **Profondeur stratégique (couche v1.2)** : trois actions spéciales verrouillées par profil (Émettre des obligations fédérales / Négocier un contrat de route / Créer un atelier), 6 cartes HAND avec des fenêtres de temps (limite de 2 cartes en main), action de redressement de la réforme.
- **Arc narratif stratégique (couche v1.3)** : 8 événements de l’ère fédérale qui se déclenchent à chaque tour à partir du tour 8 (5 choix + 3 automatiques), 3 visions de profil (Architecte du crédit fédéral / Souverain du commerce / Fondateur industriel) avec un bonus de +3 points d’influence en fin de partie. Les trois visions sont réalisables (~41 à 43 % des parties chacune, CANONIQUE × 100).
- **Le chroniqueur (couche v1.4)** : voix historique à la troisième personne. 14 bannières liées à des événements (Actes × 7 / Ouverture de l’ère fédérale / Doute / Crise / Panique / Défaut / Rébellion / Réforme / Vision / Décompte final). Toutes les citations sont vérifiées par rapport aux sources de founders.archives.gov, Wikisource et de la Bibliothèque du Congrès. Les actes infructueux sont racontés comme des contre-faits de l’histoire réelle (« Dans notre histoire, l’acte de financement d’Hamilton a été adopté par 32 voix contre 29 en juillet 1790 ; dans votre République, la discrimination à l’égard des soldats a permis d’obtenir suffisamment de voix pour fermer la porte. »). Une bannière à bordure argentée persistante avec × pour la supprimer ; respecte le paramètre de narration Activé/Minimal/Désactivé.
- **Chroniqueur, niveau B : la couche informative (v1.5)** : 15 fenêtres contextuelles *Pour en savoir plus* sur les mécanismes clés, **l’encyclopédie du chroniqueur** (27 citations historiques vérifiées, ainsi que les actes, les événements de l’ère fédérale, les niveaux de crédit et les visions dans une seule superposition de référence) et 10 infobulles de glossaire. Transforme l’atmosphère de l’époque en une véritable couche historique consultable.
- **Prise en main (couche v1.5)** : un tutoriel guidé « Débat sur le financement de 1790 » qui présente les bases du jeu à un nouveau joueur, ainsi qu’une infobulle qui affiche le coût et les conséquences de chaque action avant que vous ne vous engagiez.
- **IA déterministe** : chaque décision de l’adversaire est une fonction pure de l’état visible, avec une justification enregistrée. Pas de LLM, pas de magie opaque.
- **8 surfaces de jeu** : plateau, panneau du Trésor, inspecteur d’actifs, tiroir d’événements, actes du Congrès, pistes partagées, journal des tours / registre, rapport de fin de partie.
- **Enchères** : les actifs rejetés sont mis aux enchères entre plusieurs joueurs, avec des enchères préprogrammées basées sur le profil.
- **Sauvegarde / chargement** : sauvegarde automatique dans `localStorage` à chaque tour, exportation / importation manuelle au format JSON, vérification de l’intégrité du hachage au chargement, version contrôlée.
- **Relecture** : possibilité de revoir entièrement n’importe quelle partie terminée. En lecture seule. Reconstruit à partir de la graine + du journal des décisions avec un indicateur d’intégrité vert.
- **Simulation en série** : exécute 10 / 50 / 100 parties déterministes contre n’importe quel triplet de profils, exporte des rapports JSON + HTML pour l’analyse de l’équilibre.
- **Narration historique** : bibliothèque de 25 entrées dérivées du registre (40 à 60 mots par défaut, 150 à 200 mots pour les versions plus longues, ~300 à 500 mots pour le résumé de la fin de la partie). Ne modifie jamais l’état du jeu.
- **Accessibilité** : navigation complète au clavier, indicateurs de focus, étiquettes significatives pour les lecteurs d’écran, valeurs des pistes lisibles sous forme de texte et non uniquement sous forme de marqueurs, taille de police minimale de 14 pixels, respect de la réduction des mouvements.

---

## Composition des profils (base de référence de l’équilibre v0.10)

| Profil | Priorité des actifs | Force | Faiblesse |
|--------------------------------|---------------------------------------------------------------|----------------------|-------------------------------------|
| **Treasury / Finance**         | Dette fédérale > Dette de l’État > Dette de la Banque > Monnaie | Augmentation du crédit public | Pas de revenus liés aux infrastructures |
| **Merchant / Infrastructure**  | Routes (les 4) > Commerce > Améliorations > Revenus | Échelle des routes | Pas de bonus pour la capacité industrielle |
| **Manufacturer / Industry**    | Fabrication > Industrie stratégique > Améliorations > Banque | Multiplicateurs de capacité | Début lent ; reçoit une charte de départ |

Le quatrième profil du document de conception (Opportuniste / Liquidités) est reporté. L’ensemble compétitif verrouillé de la version 0.10 est composé de trois profils.

---

## Mises en garde connues

- **La version 1.5.0 est une version bêta en attente d’une évaluation complète par un utilisateur réel.** Chaque couche a été soumise à un audit structurel et a été revalidée par rapport au moteur en fonctionnement via `test/measure-stats.mjs` et les outils de test de déterminisme et de jouabilité ; l’ensemble du système a été testé en profondeur au niveau de chaque segment, mais n’a pas encore été testé de bout en bout par un joueur humain. Cette évaluation complète constitue la condition préalable à la publication de la version publique. Les chiffres ci-dessous sont des valeurs de référence (multipliées par 100) par rapport au moteur en fonctionnement ; les résultats obtenus avec un joueur humain réel seront différents. Considérez cela comme une option jusqu’à ce que vous (ou une personne de confiance) ayez effectué cette évaluation.
- **La pression exercée en cas d’échec est perceptible et peut être surmontée, ce n’est plus un simple élément décoratif.** La crise financière se déclenche désormais dans environ **29 / 100** parties et peut réellement être surmontée : parmi les parties où la crise se déclenche (Crédit ≤ 4), environ **41 %** permettent de remonter à un niveau de Crédit stable ≥ 7, et aucune ne conduit à la faillite. La panique est rare (environ 1 / 100). La faillite et la rébellion restent rares sous l’IA programmée de la version 0.18, qui se redresse avant de s’effondrer, mais les deux sont tout à fait possibles pour un joueur humain qui néglige le Crédit public. La spirale du Crédit rend la pente vers la faillite visible et perceptible, plutôt qu’une simple chute brutale.
- **Les adversaires utilisent les systèmes des versions 1.2 à 1.4 ; seul le calcul des actions de base est basé sur la version 0.18.** Les adversaires programmés *utilisent* les actions spéciales, la possibilité de redressement, les choix de l’ère fédérale / de la fin de partie, les votes sur les actions et le moment opportun pour jouer les cartes HAND — la remarque précédente selon laquelle « l’IA ne s’adapte pas » était trop générale. Ce qui reste basé sur la version 0.18, c’est l’évaluation de base de l’**achat / de l’enchère / de l’amélioration / du vote** : ils choisissent de manière optimale en fonction de leur profil, mais n’essaient pas encore explicitement de « se lancer dans la course à la Vision » comme le ferait un optimiseur humain. Les mesures de référence (multipliées par 100) reflètent ce comportement programmé ; le jeu humain divergera.
- **Le déclencheur n’est pas synonyme de victoire.** Le joueur qui termine le quatrième tour ne gagne que par l’influence dans environ un tiers des parties. C’est intentionnel : le décompte final récompense la profondeur économique, et non la rapidité sur le plateau. La copie de la fin de partie rend cette distinction explicite.
- **La période de l’ère fédérale présente une pression légère sur les actions.** Les actions fondatrices se déclenchent aux tours 1 à 7 ; le jeu médian dure environ 22 tours, de sorte que l’ère fédérale se déroule sur ses propres événements (qui se déclenchent à chaque tour à partir du tour 8), ainsi que sur la spirale du Crédit et la course à la Vision. La réduction du nombre d’événements de l’ère fédérale à chaque tour dans la version 1.3 a permis de réduire les périodes de 4 tours sans événement à environ 2 / 100. Si une période semble encore trop courte lors d’une partie, la prochaine étape consiste à effectuer une redistribution des actions, et non à revenir à une règle contraignante.
- **Le Trésor / les Finances restent intentionnellement les plus importants** (48 % des victoires), dans la fourchette cible. Cela correspond à la thèse historique : le crédit public et les finances fédérales étaient les principaux leviers économiques de Hamilton, sans pour autant réduire le jeu à une seule stratégie (Marchand 34 %, Fabricant 18 %).

---

## Développement et contribution

```bash
git clone https://github.com/mcp-tool-shop-org/sovereign
cd sovereign
npm install
npm test           # smoke tests
npm run verify     # full verify (smoke + pack-dry-run + CLI flag check)
npm run play       # open the game locally
```

Les versions sont publiées sur npm via GitHub Actions (`release.yml`) lors de la validation d’une balise `v*`, avec une attestation de provenance Sigstore. La source de référence est la branche `main`.

---

## Licence

MIT © mcp-tool-shop. Voir [`LICENSE`](./LICENSE).

---

<div align="center">

Créé par <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>

</div>
