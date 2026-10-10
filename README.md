\# TP Headless \& Microservices — PhoneTech Accessories



\## Présentation du projet



Ce projet consiste à développer une vitrine web d’accessoires téléphoniques en utilisant une architecture Headless et une séparation entre le backend et le frontend.



Le backend permet de gérer les produits à l’aide de Strapi, tandis que le frontend affiche les produits aux visiteurs.



\## Objectifs



\- Comprendre l’architecture Headless.

\- Séparer le backend du frontend.

\- Gérer les produits à l’aide d’un CMS Headless.

\- Consommer une API REST depuis une application web.

\- Déployer les services avec Docker Compose.



\## Technologies utilisées



\- \*\*Backend :\*\* Strapi

\- \*\*Frontend :\*\* Next.js et React

\- \*\*Langages :\*\* TypeScript, JavaScript, HTML et CSS

\- \*\*Conteneurisation :\*\* Docker et Docker Compose

\- \*\*Base de données :\*\* SQLite en configuration locale, selon la configuration du backend



\## Architecture du projet



```text

TP-Headless-Microservices/

├── backend-accessoires/

│   ├── config/

│   ├── src/

│   ├── public/

│   └── Dockerfile

├── frontend-vitrine/

│   ├── app/

│   └── Dockerfile

├── captures/

├── docker-compose.yml

└── README.md

```



\## Prérequis



\- Node.js et npm

\- Docker Desktop

\- Git



\## Installation et lancement



1\. Cloner le dépôt :



```bash

git clone https://github.com/samiaaamara/TP-Headless-Microservices.git

cd TP-Headless-Microservices

```



2\. Configurer les variables d’environnement nécessaires sans publier les fichiers contenant des secrets.



3\. Lancer les services avec Docker Compose :



```bash

docker compose up --build -d

```



4\. Accéder aux applications :



\- \*\*Vitrine web :\*\* http://localhost:3000

\- \*\*Administration Strapi :\*\* http://localhost:1337/admin



Pour arrêter les services :



```bash

docker compose down

```



\## Captures d’écran



Les captures de la vitrine et de l’administration seront disponibles dans le dossier `captures/`.



\## Auteur



Samiaa Amara



\## Formation



TP de Programmation Full Stack — Architecture Headless \& Microservices



\*\*Dépôt GitHub :\*\* https://github.com/samiaaamara/TP-Headless-Microservices

