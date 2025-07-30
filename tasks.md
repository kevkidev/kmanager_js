# DOING


# TO DO
- fix. afficher cal du mois 
- fix. afficher cal de l'année

- feat. import csv 
- feat. exporter csv events + bkp
- feat. lister events par bkp 
- feat. delete bkp
- feat. exporter event sur une periode
- feat. button + et - pour incrementer la date
- feat. selectionner 1 jour dans le cal sous le form add met à jour la date des select
- feat. lier le module notes aux rdv

- enf. Corrifger TU cassés
- enf. verifier que les methode sont pure : ne pas modifier le params => clonner
- enf. refacto avec toggleDisplay$
- enf. refact avec eventREader.displayElements
- enf. TU controlleur et main
- enf. verifier couverture des TU 
- enf. refacto en mode composant

# DONE

v1.11.0-beta planning
- feat. section aube, matin, aprem soir pour chaque jour
- fix. clic dans list doit editier le bon event
- fix. clic plus facilement sur event de list
- fix. grossir nav du bas en hauteur
- feat. creer un event recurent tous les X jour, mois ou année
- feat. retirer le marker dans les options de minutes
- enf. passer manifest en standalone

- fix. design plus ergonomique et plus esthetique
- feat. vue add : limiter le nombre de char du champ titre pour que rien ne dempasse de la vue week
- feat. afficher nom complet des jours
- feat. afficher nom complet des mois
- feat. pas de confirmation avant de commencer edit ou dubliquer
- fix. vue week: cliquer sur aujourdh'hui doit reset les select de recherche à la date du jour
- feat. clic sur un event => vue edition en readonly + menu d'edition (modifier, copier, supprimer)
- feat. edit event depuis la vue list

- fix. affichage list events
- fix. clavier masque liste quand input => mettre input au dessus de liste
- feat. mettre en evidence les miinutes divisible par 5 dans le select de la vue add event
- feat. selectionner 10h par defaut dans le select de la vue add event
- fix. btn del: remplacer ¤ par X
- fix. css: btn plus carré
- fix. prefixZero undefined
- fix. scroll planing et details
- feat. date du jour selectionné par defaut dans vue add event
- feat. lister les events par mois et grouper par mois
- feat. rechecher events par interval : entre 1 mois d'une année et une autre année peut importe l'ordre des years
- feat. rechecher events par titre et interval peut importe la case, trigger keyup
- enf. ajouter fichier .md pour gerer les taches