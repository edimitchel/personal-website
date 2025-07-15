---
title: Apprendre pour transmettre, l'objectif ultime de Colibri, la
  nouvelle plateforme d'apprentissage innovante
description: Colibri, une plateforme axée sur l'apprentissage à forte pédagogie
  pour permettre l'acquisition de connaissances simples mais toutefois bien
  maîtrisées....
created: 2017-08-08
slug: apprendre-transmettre-objectif-ultime-de-colibri-la-plateforme-innovante
categories:
  - Autre
  - Promotion
thumbnail: https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/tb_colibri-800x288.png
originalUrl: https://blog.micheledighoffer.fr/blog/apprendre-transmettre-objectif-ultime-de-colibri-la-plateforme-innovante/
---

Comme vous avez pu lire dans l'article précédent, j'ai entamé une mission de 10 mois en tant qu'ingénieur à l'IUT de Haguenau mais aussi en tant qu'enseignant vacataire. L'objectif qui m'a été fixé en début d'année scolaire est arrivé à terme début juillet : les développements sont terminés et la fin devenait presque triste..

Je vais vous décrire les différentes étapes de construction de ce projet après une présentation du concept et des fonctionnalités innovantes qui peuvent rivaliser avec certaines plateformes existantes (Open Classrooms, Coursera, Code Academy, etc..).

## Présentation

**Colibri** pour **Cours Libres Interactifs** va très certainement révolutionner l'enseignement à destination des étudiants : tant pour les enseignants que pour les étudiants même !

[**Accéder à Colibri !**](https://colibri.unistra.fr)

La problématique qu'un étudiant peut rencontrer c'est la monotonie d'un cours en ligne (et c'est d'autant plus vrai pour un cours magistral). L'enseignant lui se retrouve souvent dans une routine pour la constitution d'exercices ou d'examen.

Colibri propose des solutions pour ces deux parties : une interactivité sur des exercices spécifiques auto-corrigés et une gestion de ressources collaboratives entre créateurs de ressources pédagogiques. À noter que toute ressource créée par un enseignant peut être dite collaborative ou non si la ressource a été définie comme publique ou privée. Ainsi est préservée votre droit d'auteur si toutefois vous avez choisi la formule payante de 100 € par année. La formule gratuite vous permettra quoi qu'il arrive de profiter pleinement de la plateforme.

### Une pédagogie simple et efficace

Les cours publiques de *Colibri* proposent une méthodologie structurée en plusieurs phases d'observation, d'apport théorique et de pratique. Cette méthodologie, sans être obligatoirement suivie à la lettre, permettra à l'apprenant d'acquérir une qualité d'observation et d'analyse non négligeable au sein d'une entreprise, bien entendu en plus des connaissances en la matière.

Rien n'est imposé, autant pour les étudiants pour l'apprentissage que pour les professeurs pour la rédaction de cours ou d'examens.

Comme dans la [légende de Pierre Rahbi](http://kaizen-pour-tous.blogspot.fr/p/blog-page_04.html), réalisez-vous en volant de vos propres ailes tout en apportant votre contribution à la hauteur de vos capacités.

### Les exercices comme vous ne les avez jamais vus

Vous connaissez tous les exercices qui prennent un certain temps avant d'apprécier ou de pré-sentir son objectif.

Colibri a pré-mâché le travail pour vous en proposant des exercices auto-corrigés embarquant un système d'interprétation, d'évaluation et de mise en forme.

*Vous voulez apprendre ? C'est simple et efficace ! — Vous voulez transmettre ? C'est rapide et intuitif !*

### Suivre sa progression et celle de vos camarades (ou élèves)

Au fur et à mesure que vous évoluez sur les différents cours publiques, votre progression personnelle qui tend vers 100% vous permet de vous rendre compte du travail à terminer !

Mais vous pouvez également rejoindre des groupes prenant la forme de classe. Ils sont utilisés par les enseignants qui souhaite suivre leurs étudiants et leur proposer des travaux pratiques en ligne (pouvant être limités dans la durée et pouvant être notés).

L'enseignant aura une interface de correction lui permettant de consulter les différents travaux de ses étudiants en vue d'une correction et d'une notation.

Une expérimentation avec une classe de 60 étudiants sur un TP noté sur le langage PHP a montré l'efficacité de son utilisation : la correction a été réalisée **4 fois plus rapidement** étant donné que les exercices était plus nombreux que le TP noté des années précédentes.

<https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/colibri-long.mp4>

## Les coulisses de son développement

Ce second projet professionnel mené au début de ma vie active a été certes intéressant et ô combien plein de défis qu'il m'a fallu affronter efficacement grâce à une organisation plus méthodique.

**Allez, on y va !**

Le projet a été ponctué par des choix et des actions : finalement, assez typique pour un projet de ce type...

Il a fallu d'abord comprendre le prototype existant et connaître l'objectif ultime du projet pour en faire ressortir d'éventuelles problématiques et corrections. Les fonctionnalités ont été listées et formalisées dans un dossier de spécifications fonctionnelles qui sera plus tard un support pour la planification et le développement.

Pour supporter la réponse aux différents besoins technico-fonctionnels, il m'a fallu réfléchir au socle technique. *Prendre un framework éprouvé ? Faire du sur-mesure ? Garder la structure déjà existante ?*

Le prototype de ce projet présentait une organisation généralisable par la création d'un socle flexible et encapsulable. Alors j'ai décidé de créer un framework maison en réutilisant une base existante d'un autre projet (RCA Store). Il sera architecturé en MVC avec un système de template et la librairie [*Query Builder*](https://github.com/usmanhalalit/pixie) pour simplifier la manipulation des données.

![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/archi-e1503317713221.png)

Une fois la base posée, j'ai entamé le développement d'une base fonctionnelle (que j'ai nommé *Milestone Utilisateur*). À coté, j'ai réfléchi à greffer des tests unitaires pour garantir une intégration continue sans pépin.

S'en est suivi, après le premier Milestone complété, le développement d'un nouveau Milestone: Apprentissage qui consiste à poser les bases pour tout l'aspect pédagogique de la plateforme. Il m'a fallut réfléchir aux différents besoins spécifiques en plus de ceux qui étaient clarifiés dans la spécification fonctionnelle.

L'objectif technique était de simplifier la création de nouveaux types de ressources pédagogique et de pouvoir gérer toutes les entités de la plateforme (par entité, j'entends table de la base de données).

Durant cette étape, il m'a fallut penser à l'exécution de script. Pour le SQL, je me suis basé sur le prototype par l'utilisation des bases de données volatiles (SQLite). Mais pour le PHP, c'est une autre affaire..

Avec ma propre culture et quelques aides en ligne, j'ai choisi de créer un noeud extérieur à l'application mais facilement manipulable : j'ai utilisé Docker et j'ai interfacé le serveur par une toute petite API qui consiste à simplement demander l'exécution d'un script avec le langage demandé.

![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/manager-e1503317698617-875x400.png)

J'ai alors distingué deux types d'éléments : les **entités** et les **ressources**.

Ce milestone ne concernait que la partie affichage des ressources sans tenir compte de la partie gestion pour se concentrer sur l'ergonomie.

L'affichage des cours et des différentes ressources était satisfaisante lorsque j'entamais le nouveau milestone Administration.

Son but sera de permettre l'administration des entités liées aux ressources et les ressources mêmes. L'interface présente deux zones : l'arborescence qui reflète la structure des cours / sujets et la zone de détail qui affiche les formulaires d'édition et de recherche.

Cette facette du projet a été l'une des plus rudes car elle mettait en concurrence plusieurs problématiques techniques et fonctionnelles.. J'ai presque baissé les bras. Finalement avec du courage et de l'encouragement de mon prof préféré (cc Antoine), l'administration est aujourd'hui 100 % fonctionnelle. Elle propose un outil rapide et efficace pour constituer un cours ou un examen en offrant la possibilité de **copier, enchérir les éléments existants, d'organiser le tout par un système de glisser-déposer, etc**..

La dernière grande étape du projet a été développée en parallèle des finitions et ajustements de l'administration. Elle consistait à développer les fonctionnalités de regroupement, de suivi et de mise à disposition de sujets. La première opération a consisté à mettre en place la notion de classe et de permettre l'inscription sous plusieurs formes. Ensuite, la visualisation de la progression globale et individuelle de chaque membre de la classe et enfin, la création de sujet et tout ce qui tourne autour (la génération d'un sujet dans le temps, l'affichage d'un sujet et la correction).

Ces milestones ont été terminées bien avant l'heure mais beaucoup de choses restaient à faire : réaliser les finitions sur le rendu graphique, améliorer l'ergonomie de certaines interfaces et l'amélioration de certains points pour la mise en ligne de la plateforme.

BON ! Je m'arrête là, je pense que ça suffit. Maintenant, quelques d'images pour illustrer le tout !

## [**Accéder à Colibri !**](https://colibri.unistra.fr)

![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/accueil-597x400.png)![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/cours-liste-300x167.png)![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/exercice-sql-300x226.png)![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/synthese-300x214.png)![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/accueil-classe-300x184.png)![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/sujet-300x118.png)![](https://blog.micheledighoffer.fr/blog/wp-content/uploads/2017/08/administration-300x170.png)
