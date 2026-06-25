---
title: >-
  Formation Nuxt avec une plateforme interactive — Une expérience de 4 jours
  avec 30 développeurs
description: >-
  Construction d'une plateforme de formation Nuxt interactive et livraison de
  deux sessions de 4 jours pour 30 développeurs — approche pédagogique, défis
  WebContainer et un projet de workshop pratique sur machines locales
slug: training-nuxt-interactive-platform
categories:
  - Web
  - Education
tags:
  - nuxt
  - vue
  - training
  - webcontainer
created: 2026-03-15T00:00:00.000Z
original_slug: training-nuxt-interactive-platform
source_content_hash: 69b7e10cb75741f033a646cb356cb5c4
---

En février et mars 2026, j'ai animé deux sessions de formation Nuxt sur 4 jours pour une équipe de 30 développeurs chez un **client du secteur public**. L'objectif n'était pas seulement de transmettre des connaissances sur le framework, mais de soutenir un **projet de workshop pratique** que chaque participant construirait sur sa propre machine.

Cet article partage ce que j'ai appris du côté **pédagogique** et **technique**.

# Contexte

Le client avait besoin de monter en compétences une grande équipe interne sur Vue et Nuxt. Des cours en salle de classe seuls ne suffiraient pas : les développeurs devaient écrire du code, casser des choses et consolider les concepts dans la même session.

J'ai construit une plateforme de formation inspirée par [learn.nuxt.com](https://learn.nuxt.com), déployée sur [vue-nuxt-training.vercel.app](https://vue-nuxt-training.vercel.app), avec le code source sur [GitHub](https://github.com/edimitchel/nuxt-vue-formation).

# Approche pédagogique

## Diapositives d'abord, plateforme ensuite

Le feedback que j'ai reçu était clair : **introduire les concepts avec des diapositives, puis envoyer les participants sur la plateforme pour les appliquer**, était très efficace.

Le rythme était le suivant :

1. **Bloc théorique court** — concepts, patrons et pièges sur les diapositives
2. **Exercice guidé** sur la plateforme — puis appliqué sur leur machine dans le cadre du projet de workshop
3. **Débat** — questions, corrections en direct et liens vers le module suivant

Cette alternance maintenait l'attention élevée : les diapositives encadrent le "pourquoi", la plateforme ancre le "comment".

## Deux sessions, une plateforme

Les deux sessions (février et mars 2026) m'ont permis d'affiner les modules entre les cohortes — en resserrant les explications qui avaient causé des confusions la première fois, et en ajoutant des indices là où les exercices s'étaient bloqués.

# Plateforme technique

## Architecture

La plateforme dédiée structurait le parcours d'apprentissage — modules, exercices et progression — tandis que **le projet de workshop lui-même était construit sur la machine de chaque développeur**.

Ce n'était pas un remplacement du setup local : elle guidait les participants à travers les concepts et exercices afin qu'ils puissent les intégrer dans le projet qu'ils exécutaient localement. La stack est basée sur Nuxt, déployée sur Vercel, avec des flux de contenu modélisés après des sites d'apprentissage interactifs dans l'écosystème Vue.

## WebContainer et versions Nuxt

La partie la plus difficile n'était pas le contenu du cours — c'était **rendre l'exécution fiable dans le navigateur**.

### WebContainer

[WebContainer](https://webcontainers.io/) permet l'exécution de Node dans le navigateur. En pratique, j'ai rencontré :

- **Temps de démarrage et mémoire** variant considérablement entre les machines
- **Installation de paquets** à l'intérieur du conteneur qui pouvait échouer silencieusement sur les réseaux lents
- **Artéfacts du système de fichiers** lorsque les exercices attendaient des chemins qui ne correspondaient pas à la disposition du sandbox

J'ai fini par verrouiller les ensembles de dépendances par module et par préchauffer les conteneurs quand c'était possible, afin que le premier exercice de chaque jour ne mange pas trente minutes de dépannage.

### Verrouillage des versions Nuxt et bindings oxc-parser

Nuxt évolue rapidement. Le matériel de formation qui fonctionnait sur une version mineure a cassé sur la suivante.

Le plus douloureux a été autour des **bindings natifs oxc-parser** : les exercices qui fonctionnaient bien localement ont échoué dans WebContainer parce que la résolution des bindings différait entre les environnements. Les symptômes ressemblaient à des erreurs de parse aléatoires dans les fichiers `.vue` avec aucune ligne à blâmer.

Mitigations qui ont aidé :

- **Verrouiller Nuxt et les packages associés** aux versions validées sur la plateforme avant chaque session
- **Tester chaque module** dans WebContainer, pas seulement sur mon ordinateur portable
- **Documenter un chemin de repli** (exercice simplifié sans la transformation qui plante) lorsque un désaccord de binding apparaissait le jour de la session

## Plateforme et projet de workshop local

La plateforme et le projet de workshop locaux se complétaient :

- La plateforme introduisait et renforçait chaque concept avant que les participants ne l'appliquent sur leur machine
- Tous suivaient la même progression de module, tout en travaillant sur leur propre setup de projet
- Les formateurs pouvaient s'aligner sur les mêmes étapes d'exercice et résultats attendus pendant les débats

# Bilan

- **Diapositives + plateforme interactive** battent chaque approche seule pour un public à expérience mixte
- **Environnements de développement basés sur le navigateur** sont puissants mais nécessitent une phase de durcissement dédiée — surtout avec des frameworks en mouvement rapide
- **Verrouiller les versions agressivement** quand 30 personnes dépendent du même runtime à 9h00

Si vous préparez une formation similaire, investissez du temps dans WebContainer et les cas limites des bindings avant d'écrire le dernier exercice. Votre futur vous — et votre cohorte — remercieront.

**Plateforme en direct :** [vue-nuxt-training.vercel.app](https://vue-nuxt-training.vercel.app)

**Source :** [github.com/edimitchel/nuxt-vue-formation](https://github.com/edimitchel/nuxt-vue-formation)

# Intéressé par cette formation ?

Si vous souhaitez une formation Nuxt similaire pour votre équipe — plateforme interactive, projet de workshop pratique, ou les deux — **n'hésitez pas à me contacter**. Je peux adapter le format, la durée et le contenu à votre contexte.

::contact-form
::
