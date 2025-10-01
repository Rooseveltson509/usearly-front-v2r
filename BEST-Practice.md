# 🚀 Usearly Frontend v2r

Frontend du projet **Usearly**, développé en **React + TypeScript + Vite**.  
Ce projet suit des règles strictes de qualité pour garantir un code clair, maintenable et homogène.

---

## 📌 Workflow Git & Règles de Développement

### 🔹 Branches
- `feature/...` → nouvelles fonctionnalités  
- `fix/...` → corrections de bugs  
- `chore/...` → maintenance/config (CI/CD, dépendances, outils)  
- `hotfix/...` → urgences production  

👉 **Une branche = une seule fonctionnalité ou correction.**  
👉 Ne jamais mélanger plusieurs développements dans une seule branche.

---

### 🔹 Commits
- Toujours écrire des **messages clairs** et **descriptifs** :
  - ✅ `feat: add brand filter on reports`
  - ✅ `fix: handle null user in profile card`
  - ❌ `update`, `wip`, `test`

- Utiliser des **préfixes standards** :
  - `feat:` → nouvelle fonctionnalité  
  - `fix:` → correction de bug  
  - `style:` → changements visuels / CSS  
  - `refactor:` → refacto de code sans nouvelle feature  
  - `docs:` → documentation  
  - `chore:` → maintenance / config / outils  

- **Squash les commits** avant merge :  
  - 1 fonctionnalité = 1 commit propre dans `master`.

---

### 🔹 Avant chaque commit
1. **Lancer le lint & formatage** :
   ```bash
   npm run lint
   npm run format
