---
title: RCA Store
description: Un projet étudiant sur la création d'un e-commerce de A à Z
  utilisant tous les standards actuels du web (HTML 5, CSS 3, JS, jQuery,
  Bootstrap).
image: /images/projects/rcastore/caption.png
url: http://www.rcastore.pictake.fr
type: application
status: published
creation: 2014-11-17
categories:
  - E-commerce
  - PHP
  - Web Development
technologies:
  - PHP
  - HTML5
  - CSS3
  - JavaScript
  - jQuery
  - Bootstrap
  - Smarty
  - Propel
---

# RCA Store

## Présentation

Dans le cadre d'un des modules de mes études d'ingénieur, nous avions un projet portant sur le web. Il était demandé de créer une plate-forme proposant la vente d'articles avec différents contraintes :

- Utiliser le language PHP,
- Respect des normes W3C pour le html et css
- Créer une structure MVC
- Utiliser un tiers pour le paiement (soit PayPal soit un service REST créé via un framework (SlimPHP))
- Utiliser un ORM (Propel)
- Adapter le site pour tous supports (responsive design - bootstrap 3).
- Utiliser un moteur de template (Smarty)

## Notre vision

Nous avons choisi de créer un site e-commerce orienté vers l'aéromodélisme. Le site proposera donc des avions de tous types, des carburants, des accus et des accessoires. L'image de chaque articles occupe une très grande place dans l'affichage du catalogue.

Nous avons décidé de créer un design très simple et ergonomique. Ainsi, le panier sera accessible sur toutes les pages, les catégories des articles également. Pour un utilisateur non connecté, le formulaire de connexion est également accessible partout et s'il n'est pas encore enregistré, il pourra s'inscrire en accédant au formulaire d'inscription.

Des maquettes ont été réalisées afin de délimiter les zones et de créer en avance les templates Smarty.

## Travail réalisé

### Back Office

Le système en *arrière boutique* a suscité le plus d'attention. Création du système d'information, gestion du panier, gestion des utilisateurs et gestion de la commande ont été les plus grosses tâches à réaliser afin de répondre aux exigences définies au préalable.

L'architecture du système repose sur le concept Modèle - Vue - Contrôleur où chacun a sa place. :br Le modèle est l'entité métier qui va à la fois *Récupérer les données métier* mais également *Permettre leur modifications*. La vue est l'interface graphique permettant d'arranger les données métier à afficher ou à modifier (à travers un formulaire). Le contrôleur est l'intermédiaire entre les deux.

Par exemple, il va demander à récupérer les infos nécessaires au modèle et va demander à la vue de les afficher.

### Front Office

L'expérience utilisateur sur ce genre de site est très importante car elle va déterminer la motivation de l'internaute susceptible de passer commande. Nous avons alors créé un site simple mais qui saches offrir un retour positif sur chaque action réalisée par l'utilisateur. :br Le moment le plus important est bien sûr l'ajout au panier et la finalisation de la commande. Un effet de translation a alors été ajouté lors de l'ajout afin de bien représenter l'action de l'ajout vers le panier. Le nombre d'article à ajouter est alors demander sans obligation puisque par déjà le nombre est à 1. Pour notifier l'utilisateur du montant du panier, le prix est affiché ou mise à jour à chaque ajout ou suppression d'article dans le panier.

La modification du panier est réalisé très simplement par le biais de bouton *+* ou *-* ou encore *corbeille* à savoir qu'enlever une unité d'un article déjà présent une fois dans le panier engendre sa suppression.
Un panier peut être sauvegardé comme une liste de souhaits pouvant par la suite être repris et soumise à une passation de commande.

Le passage à la commande est réalisé en 4 étapes:

1. Si l'utilisateur n'est pas connecté, demander à le faire ou à s'inscrire si non enregistré.
2. Affichage d'un récapitulatif de commande (montant brut, taxe et montant fixe)
3. Affichage des informations de livraisons renseignées au préalable
4. Paiement en un clic : récupération du numéro de la transaction effectuée.

## Le résultat

On est très content d'avoir réalisé ce projet pour sa finalité très satisfaisante. Nous avons eu un **16.75/20** pour la conception, le maquettage et la réalisation.

N'hésitez pas [à essayer le site](http://www.rcastore.pictake.fr).

## Captures d'écran

### Accueil du site

![Accueil du site](/images/projects/rcastore/rcastore-accueil.png)*Affichage des articles les plus vendus et des articles du blog (fictif)*

### Catalogue des articles

![Catalogue des articles](/images/projects/rcastore/rcastore-catalogue.png)*Affichage des articles avec images et informations au survol avec la souris*

### Inscription

![Inscription](/images/projects/rcastore/rcastore-inscription.png)*Propose l'inscription avec les informations importantes pour la livraison*

### Commandes

![Commandes](/images/projects/rcastore/rcastore-commandes.png)*Affichage des commandes réalisées avec les articles*

### Informations de l'utilisateur

![Informations de l'utilisateur](/images/projects/rcastore/rcastore-informations.png)*Affichage des informations de l'utilisateur et propose leur modification*

## Liens

- [Voir le site en ligne](http://www.rcastore.pictake.fr)
