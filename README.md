# 🚀 Projet Symfony + Next.js

Ce projet est une application web full-stack utilisant **Symfony** (API backend) et **Next.js** (frontend React).

# 👥 Auteurs du projet
  - Raphaël CHICHE : [https://github.com/Raphael-Chiche](https://github.com/Raphael-Chiche)
  - Léo RICHÉ : [https://github.com/Leo-Riche](https://github.com/Leo-Riche)

---

## 📁 Structure du projet

```
/backend      -> Symfony (API)
/front        -> Next.js (Interface utilisateur)
```

---

## ✅ Prérequis

- PHP >= 8.1
- Composer
- Node.js >= 18.x
- Yarn ou npm
- MySQL >= 5.7 / MariaDB
- Symfony CLI (facultatif mais recommandé)
- Docker (facultatif)

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.comLeo-Riche/FrameworkFullstackRendu.git
cd FrameworkFullstackRendu
```

---

### 2. Configuration du backend (Symfony)

```bash
cd backend
cp .env .env.local
```

Dans `.env.local`, configure la connexion à ta base de données :

```
DATABASE_URL="mysql://username:password@127.0.0.1:3306/nom_de_ta_bdd"
```

Ensuite :

```bash
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load # facultatif
```

Pour lancer le serveur Symfony :

```bash
symfony server:start --no-tls
```

---

### 3. Configuration du frontend (Next.js)

```bash
cd ../front
cp .env.local.example .env.local
```

Dans `.env.local`, configure l’URL de l’API Symfony :

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Ensuite :

```bash
yarn install
# ou
npm install
```

Pour lancer le serveur Next.js :

```bash
yarn dev
# ou
npm run dev
```

Accès : [http://localhost:3000](http://localhost:3000)

---

## 🛠 Commandes utiles

### Backend (Symfony)

- `php bin/console cache:clear`
- `php bin/console doctrine:migrations:migrate`
- `symfony server:start --no-tls`

### Frontend (Next.js)

- `yarn dev` / `npm run dev`
- `yarn build` / `npm run build`
- `yarn lint` / `npm run lint`
