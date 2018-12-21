---
title: "Les outils gratuits que j&rsquo;utilise"
description: "Tous les outils que vous retrouverez sur mes ordinateurs.. qui manipulent les couleurs jusqu’à mon matériel. Utiles pour les amateurs de développement web."
layout: ArticleLayout
image: https://micheledighoffer.fr/blog/wp-content/uploads/2013/04/tb_outils-800x288.png
date: 2013-04-10 18:00:07
category: 
    - Outils
---

Etant un utilisateur de **Windows** (et oui!) j’utilise des petits **outils** qui me sont utiles lors de mes projets.

Le premier (.. roulements de tambour..)

**La Boîte À Couleurs**  
_[pourpre.com/colorbox](https://pourpre.com/colorbox/)_
---------------------------------------------------------------------------------

[![La Boîte À Couleur](https://micheledighoffer.fr/blog/wp-content/uploads/2013/04/LBAC-300x152.png)](https://micheledighoffer.fr/blog/wp-content/uploads/2013/04/LBAC.png)

Le principe de petit outil est de **capturer la couleur** de n’importe quel pixel que vous trouverez sans devoir faire une capture d’écran et d’utiliser la pipette sur un logiciel de retouche. LBAC permet d’afficher la couleur capturée sous différents formats:

*   en hexadécimale (#RRVVBB)
*   en RVB (RRR,VVV,BBB)
*   en CMJ(CCC,MMM,JJJ)
*   en TLS (Teinte, Luminosité, Saturation)

Tous propose d’afficher la correspondance de la couleur en pour-cent ou en octet.  
_J’oubliais,_ y a aussi l’onglet Visuel qui permet de déplacer son curseur pour changer la couleur, ou simplement changer la saturation, la luminosité ou la teinte.

Il existe pleins d’autres solutions et substitues mais une chose me plait vraiment dans ce petit outil: l’option « Rester au-dessus des autres applications ». À peine la couleur capturée sur un site ou une maquette, on peut switcher sur notre logiciel de programmation et entrer la valeur sans devoir jouer avec les fenêtres.

En parlant de logiciel de programmation, voici le deuxième outil,

**Emmet  
**_[emmet.io](https://emmet.io/)_
-------------------------------------------

[![Emmet](https://micheledighoffer.fr/blog/wp-content/uploads/2013/04/56e63d4d229aafd3a05ea34a46cf2600-300x300.png)](https://micheledighoffer.fr/blog/wp-content/uploads/2013/04/56e63d4d229aafd3a05ea34a46cf2600.png)

Ce plugin que l’on peut implanter dans son éditeur de code favori (Notepad ++, Sublime Text, ..) permet de **générer du HTML ou du CSS** (tout dépend sur quel fichier on développe : .html ou .css).

Bref, cette outil à deux cotés positifs:

*   **Générer rapidement** du HTML / CSS
    *   Toute une structure **HTML** (version au choix)
    *   Des **propriétés CSS** toutes faites
*   **Apprendre** à utiliser les sélecteurs CSS
    *   Pour la génération du HTML

Aller, un sélecteur CSS vaut plus qu’un vieux pavé de texte!

\[css\]html:5>header>nav>ul>li\*3>a^^^^+section#contenu>p\*5^+footer\[/css\]

\[html\]  
<!doctype html>  
<html lang="en">  
<head>  
<meta charset="UTF-8">  
<title>Document</title>  
</head>  
<body>  
<header>  
<nav>  
<ul>  
<li><a href=""></a></li>  
<li><a href=""></a></li>  
<li><a href=""></a></li>  
</ul>  
</nav>  
</header>  
<section id="contenu">  
<p></p>  
<p></p>  
<p></p>  
<p></p>  
<p></p>  
</section>  
<footer></footer>  
</body>  
</html>  
\[/html\]

Je viens de vous parler de CSS, c’est au tour du 3 ème outil.

CSS Refresh  
[cssrefresh.frebsite.nl](http://cssrefresh.frebsite.nl/)
----------------------------------------------------------------------

[![CSS Refresh](https://micheledighoffer.fr/blog/wp-content/uploads/2013/04/cssrefresh-logo-300x281.png)](https://micheledighoffer.fr/blog/wp-content/uploads/2013/04/cssrefresh-logo.png)

Cet outil que j’utilisais beaucoup à une période permet d’intégrer du CSS et d’avoir un aperçu direct (que ce soit en local ou en ligne, sur un CMS comme une site basique).

Il fonctionne grâce à de **l’ajax,** donc vous devez absolument coder sur un **serveur web** (en local comme en ligne). Toutes les secondes, le CSS se rafraîchit si et seulement si celui-ci a été modifié. Ce système fonctionne grâce à la variable `ver` qui correspond à la date en seconde (**_timestamp_**). Lorsque le timestamp du fichier CSS est différent par rapport au précédent, CSS Refresh se chargera de récupérer le CSS et l’appliquer à la page.

Personnellement, lorsque l’on a pas de logiciel sophistiqué et qu’on veut rapidement voir à quoi ressemble son site, c’est un très bon outils!

En plus, ce script fonctionne pour plus d’un fichier CSS.  
Avec [@robudev](https://twitter.com/robudev), on a d’ailleurs fait de l’intégration CSS en **simultané** et à distance bien sûr (_ainsi que Skype_)_. _On travaillait sur deux fichiers distincts et CSS Refresh se chargeait de **mettre à jour** le style de la page.

Maintenant qu’on a de quoi trouver de la couleur et intégrer très rapidement, il va falloir trouver un moyen de bosser avec un écran pour voir l’aperçu et un pour développer rapidement sans toucher à la souris.

Personnellement, j’ai un écran 22 pouces (_pas très grand me direz vous_) qui me permet d’avoir un écran en plus.

Du coup, j’vais vous montrer un logiciel super sympa lorsque vous avez un ordinateur fixe branché à votre écran de bureau et un ordinateur portable.

Input Director  
_[www.inputdirector.com](http://www.inputdirector.com/downloads.html)_
---------------------------------------------------------------------------------------

[![Input Director](https://davejsteele.files.wordpress.com/2012/12/input-director.jpg?w=300)](http://davejsteele.files.wordpress.com/2012/12/input-director.jpg?w=300)

Maintenant, vous pourrez utiliser vos deux ordinateurs en ayant l’impression d’en utiliser qu’un seul.

Le principe c’est de connecter vos deux machines en réseau et de choisir un esclave et un maître. Vous aurez donc qu’un seul clavier et qu’une seule souris pour écrire du texte/coder et bouger votre souris.

Les avantages sont là! Primo, on a plus d’espace sur votre bureau (Votre portable peut être poussé vers le fond de votre bureau pour gagner de la place) et puis secondo, plus besoin de réfléchir à quelle souris ou quel clavier il faut poser sa main pour l’utiliser, tout se fait par les deux mêmes périphériques.

Et comment on fait pour utiliser le clavier sur le fixe ou sur le portable quand on le désire?  
Deux solutions

*   soit par combinaison de toucher qui permet de switcher sur l’autre machine,
*   soit en déplaçant votre souris sur l’écran que vous voulez!

Aller, c’est fini pour aujourd’hui!  
J’espère que pour certain mes outils vous auront servi!

Et vous, quels sont vos outils _sympas_?
