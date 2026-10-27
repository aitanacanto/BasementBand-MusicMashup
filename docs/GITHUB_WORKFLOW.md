# GitHub Workflow Guide for Our Music Mashup Project



## Our Branching Strategy

We use the following branches:

### `main`
- The **official, stable version** of our project.
- Managed **only by Aitana** (me).
- **Do not push to this branch** unless instructed.

### `develop`
- The **integration branch** where we'll merge everyone's code.
- Only push here if your code:
  - Compiles successfully
  - Is bug-free (as much as possible)
  - Is stable and ready for review

### Your personal branch (`yourname`)
- Everyone has their **own branch** named after them.
- You'll work only on your personal branch and merge to `develop` when ready.

---

## Initial Setup (One Time Only)

1. **Clone the repository** to your computer:
```bash
git clone https://github.com/username/Music_Mashup-241_project.git
cd Music_Mashup-241_project
```

2. **List all remote branches** to find yours:
```bash
git fetch
git branch -r
```

3. **Checkout your personal branch locally**:
```bash
git checkout -b yourname origin/yourname
```

> Replace `yourname` with the actual name of your branch (e.g., `aitana`, `frankie`, etc.).

---

## Daily Workflow

### Step 1: Switch to your branch
```bash
git checkout yourname
```

### Step 2: Pull latest updates from `develop`
```bash
git checkout develop
git pull origin develop
git checkout yourname
git merge develop
```

> ⚠️ This keeps your branch up to date with the latest code from others.

### Step 3: Make your changes
Edit, test, and commit locally.

### Step 4: Add and commit your changes
```bash
git add .
git commit -m "Brief and clear description of your update"
```

### Step 5: Push to your branch
```bash
git push origin yourname
```

---

## Merging into `develop`

When your code is ready:

1. Switch to the `develop` branch and update it:
```bash
git checkout develop
git pull origin develop
```

2. Merge your own branch into it:
```bash
git merge yourname
```

3. Resolve conflicts if there are any.

4. Push to `develop`:
```bash
git push origin develop
```

---

## Golden Rules

- ✅ Only push stable, working code to `develop`.
- 🚫 Never push or merge directly to `main`.
- Always test your changes.
- Communicate if you need help, especially with Git conflicts.

---

## Need Help?

Contact Aitana (me) anytime if:
- Something breaks
- You encounter merge conflicts
- You’re not sure how to proceed

---
