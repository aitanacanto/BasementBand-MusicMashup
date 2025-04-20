
# 🎓 GitHub Workflow Guide for Our Music Mashup Project


## 🚧 Our Branching Strategy

We will use the following branches:

### ✅ `main`
- The **official, stable version** of our project.
- Managed **only by Aitana** (me).
- **Do not push to this branch** unless I ask you to.
  
### 🔄 `develop`
- This is our **integration branch**.
- You’ll merge your feature branch here once your code:
  - Compiles
  - Is bug-free (as much as possible)
  - Is ready for review
- We will use this branch to detect **merge conflicts** and fix them **before going to `main`**.

### 👤 Your personal branch (`yourname`)
- Everyone will have their own branch named after them.
- You’ll work on this branch and commit your code changes regularly.

---

## 🧰 Initial Setup (One Time Only)

1. 🔽 **Clone the repository** to your computer:
```bash
git clone https://github.com/username/music-mashup-project.git
cd music-mashup-project
```

2. 🆕 **Create your personal branch:**
```bash
git checkout -b yourname
git push -u origin yourname
```

---

## 🛠 Daily Workflow

### Step 1: Checkout your branch
```bash
git checkout yourname
```

### Step 2: Pull changes from `develop` regularly
Before coding, always do:
```bash
git pull origin develop
```

### Step 3: Make your changes
Edit, add, and test your files.

### Step 4: Add and commit
```bash
git add .
git commit -m "Meaningful message about what you did"
```

### Step 5: Push to your branch
```bash
git push origin yourname
```

---

## 🧪 Merging to `develop`

Once your code is ready and stable:
1. Checkout `develop`:
```bash
git checkout develop
git pull origin develop
```

2. Merge your personal branch:
```bash
git merge yourname
```

3. Resolve conflicts if needed.

4. Push the updated `develop`:
```bash
git push origin develop
```

---

## 🧼 Golden Rules

- ✅ Only merge **working, stable code** into `develop`.
- 🚫 Never push directly to `main`.
- 🧪 Test your code before merging.
- 🧑‍🤝‍🧑 Communicate if you need help with Git, especially with **merge conflicts**.

---

## 💬 Need Help?

Ask Aitana (me) anytime. I'm managing the repository and I’ll help you if you:
- Break something
- Have merge conflicts
- Don’t understand a step
