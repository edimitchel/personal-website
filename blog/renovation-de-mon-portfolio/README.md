---
title: "Rénovation de mon portfolio"
description: "Nous voici en été, il fait chaud et j’en profite pour rafraîchir un peu le web : la rénovation de ma page personnelle. Je suis parti de zéro pour recréer mon univers sous la forme d’un site ergonomique, simple et rapide. J’ai renouvelé mes pratiques en matière de développement back et front en utilisant des …"
layout: ArticleLayout
image: https://micheledighoffer.fr/blog/wp-content/uploads/2015/07/tb_book-800x288.png
date: 2015-07-06 00:01:02
category: 
    - Développement web
    - Projets personnels
---

Nous voici en été, il fait chaud et j’en profite pour rafraîchir un peu le web : la rénovation de ma page personnelle. Je suis parti de zéro pour recréer mon univers sous la forme d’un site ergonomique, simple et rapide. J’ai renouvelé mes pratiques en matière de développement back et front en utilisant des nouvelles technos et l’automatisation des tâches.

Les objectifs
=============

Ce nouveau portfolio, je voulais qu’il soit à la page et dans l’air du temps et qu’il puisse dépasser les frontières.

Je voulais de plus un site qui puisse être facilement maintenable tout en offrant une performance optimale.

Et enfin je voulais un site qui soit optimisé pour tout type de support c’est-à-dire responsive.

J’ai nommé ce projet **_book_** _de développeur_ – notion souvent utilisée par les graphistes – pour mettre en avant mes réalisations.

Solutions
=========

**Fonctionnelles**
------------------

Le contenu du site est accessible rapidement : le chargement du site sera plus long, mais la navigation sera nettement plus rapide, voire instantanée. Le site est à 100% en français et environ à 65% en anglais. Les 35% manquants sont dûs aux articles et projets écris uniquement en français.

Sur certaines parties du site, des raccourcis clavier peuvent être utilisés pour naviguer :

*   sur la page projet, vous pouvez utiliser les flèches gauche et droite pour passer d’un projet à un autre. Les flèches haut et bas permettent de faire défiler les images dans la galerie de projet
*   sur la page article, vous pouvez utiliser les flèches gauche et droite pour passer d’un article à un autre.
*   sur n’importe quelle page, un double appuie sur la touche CTRL mettra le focus sur la barre de recherche transverse

La page À propos contient plusieurs informations sur moi et mes compétences. Les compétences peuvent être présentées de trois manières différentes:

*   simplement lister les domaines et les outils maîtrisés
*   lister et proposer une appréciation subjective fournie par soi-même
*   lister et proposer une appréciation objective fournie par le public

J’ai opté pour la dernière solution plutôt que les autres pour trois simples raisons. Premièrement, j’ai envie que le public (possiblement recruteur) ait une idée de mon niveau. Puis, sur l’ancienne version de mon portfolio, j’étais souvent amené à devoir modifier le degré de maîtrise qui d’ailleurs n’était finalement jamais à jour. Et enfin je souhaite que ce soient des personnes extérieures qui établissent le niveau d’une de mes compétences en la recommandant.

Lorsqu’une compétence est recommandée, je suis directement notifié par SMS ce qui me permet de suivre l’évolution.

**Techniques**
--------------

### **Front**

Pour gérer le _front office_, j’ai utilisé un framework ultra-puissant propulsé par Google : AngularJS. Ce framework organise son cœur en module et met à disposition des méthodes très faciles à comprendre et pourtant très puissantes. Il étend la force du html en permettant l’utilisation d’attributs spéciaux et la création de ses propres balises HTML pour configurer l’application. Cependant gare à la validation W3C (merci aux attributs _data_ qu’apporte HTML 5).

[![angularjs](https://micheledighoffer.fr/blog/wp-content/uploads/2015/07/angularjs.png)](https://micheledighoffer.fr/blog/wp-content/uploads/2015/07/angularjs.png)

La gestion des formulaires est pour moi l’une des fonctionnalités les plus perçantes. Mais bien d’autres suivent pour offrir au développeur un développement rapide, organisé et efficace. Pourquoi organisé et efficace ? Parce qu’AngularJS force l’utilisation du patron de conception MVC (Modèle-Vue-Contrôleur) et que par cette contrainte le code écrit sera robuste. Un concept encore plus fou est implémenté dans son coeur : le data-binding. Ce concept est très implanté dans les développements .Net et c’est certainement de là que vient ce concept. Le data-binding créé un lien très étroit entre la vue et le modèle : ainsi AngularJS utilise la notion de _scope_ pour représenter les données dans un contexte.

AngularJS peut se suffire par lui-même pour créer une application simple. Pour aller plus loin, beaucoup de modules peuvent se greffer pour offrir davantage de possibilités.

J’en ai utilisé une bonne poignée et voici les plus intéressantes :

#### translate

Ce module permet de gérer facilement plusieurs langues d’une application. Il suffit simplement de localiser les parties à rendre internationales et d’écrire les différentes traductions suivant les besoins. Ce plug-in va pouvoir déterminer par lui-même la langue à utiliser et l’appliquer rapidement. Le changement d’une langue est possible et instantané.

#### ui-router

Créer une application web, c’est créer un site navigable et accessible de partout : avec le module ui-router développé par Google on peut définir un routage digne de ce nom pour offrir à l’internaute une navigation historisée et au développeur, une gestion parfaite de la structure de son application (assignation des pages aux contrôleurs, contraintes d’accès).

#### markdown

Tout bon développeur sait ce qu’est _markdown_. C’est une syntaxe de traitement de texte complète souvent utilisée sur les plateformes de gestion de développement logiciel tels que GitHub et BitBucket. Ce module va transformer un texte respectant la syntaxe markdown pour en fait un texte enrichie. Je l’ai utilisé pour la description de mes projets.

#### ngTransition

L’équipe d’AngularJS a pensé à la gestion des animations et des transitions pour donner vie à son application. À chaque endroit que l’on voudra appliquer ses effets, ce module va ajouter 2 paires de classes dans un ordre bien précis : _ng-enter, ng-enter-active_ ou _ng-leave , ng-leave-active_. Au développeur ensuite de gérer l’affichage en fonction de la classe.

Pour le coté design, j’ai fait très simple et j’ai opté pour utiliser le framework Zurb Foundation pour bénéficier de ses classes pratiques et de son style qui me convient. J’ai beaucoup utilisé les classes _grids_ qui permettent la structuration facile des éléments. Pour illustrer mes propos dans certaines pages, les icônes de foundation (de la version 3) ont su faire leur place. Enfin, j’ai travaillé sur le design en utilisant la génération du style CSS avec SASS : un pré-processeur CSS qui permet d’intégrer la hiérarchisation des styles, l’utilisation de variables et l’utilisation de fonctions et mixins.

Pour gérer le code javascript, le style et le HTML de manière à tout optimiser même le déploiement, j’ai tendu la main à Grunt – un task-runner – pour la lui donner dans la génération du CSS à la volée, la minification du code javascript et CSS, à la préparation au déploiement, au déploiement et l’historisation de ma base de données.

J’ai quatre tâches que j’utilise souvent:

watch – tâche par défaut qui réagit à chaque modification de CSS ou HTML pour générer le CSS et le HTML.  
dist – tâche qui va préparer le projet pour la distribution (le déploiement).  
deploy – tâche qui va créer des snapshots de mon application et déployer sur mon FTP.  
dbdump – tâche qui va générer un dump de ma base de données pour l’historisation.

### **Back**

La partie back-office est développée par mes doigts. Elle consiste à offrir une API (Application Programming Interface) orientée service avec plusieurs atouts :

*   Gestion de configuration : l’API peut être configurée à partir d’un fichier ou à partir de simples méthodes. Un module va stocker toutes les configurations et va les mettre à disposition par une simple méthode.
*   Gestion des accès : le système est équipé d’un système de sécurité qui permet de restreindre l’accès à certaines méthodes. Je l’ai utilisé pour toutes les méthodes d’administration.
*   Gestion des données : les données issues de la base de données sont accessibles facilement grâce à une classe abstraites qui offre des méthodes de type CRUD (Create, Read, Update et Delete). Chaque entité hérite de cette classe.
*   Gestion du routage : afin de dispatcher un chemin vers un service, un système de routage est implémenter avec un dépendance étroite avec le système de configuration qui enregistre les routes, le nom de la classe du service, la méthode et ses arguments (avec ou non son type).

Le système reste simple et complet malgré tout. De plus, toute modification ou ajout sont facilement réalisables.

Vos remarques
=============

[Rendez-vous sur mon nouveau site](https://book.micheledighoffer.fr) sauf si vous n’y êtes pas déjà.

Merci d’avoir lu cet article. Si vous avez une remarque ou une critique constructive à me faire, je suis preneur. N’hésitez pas à commenter ce que vous avez lu et vu (ci-dessous) et à partager autour de vous cet article.

Je vous dis au prochain article et bon été !
