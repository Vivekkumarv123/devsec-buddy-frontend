
# 🛡️ DevSec Buddy – Frontend

A modern, interactive frontend for **DevSec Buddy**, a website vulnerability scanner that analyzes URLs for common security issues like CSRF, XSS, and missing headers. Built using **Next.js**, **Tailwind CSS**, and **Framer Motion**, it provides security scores, detailed reports, and actionable remediation tips.

A free instance of render will spin down with inactivity, which can delay requests by 50 seconds or more.
---

## 🚀 Features

- 🔍 Website security scan form with animated UI
- 📊 Visual security score with circular progress bar
- ⚠️ Real-time vulnerability parsing (e.g. CSRF, XSS)
- 📋 Full remediation guide with markdown rendering
- 📜 Scan history with timestamps
- 🌈 Responsive, mobile-friendly design
- ⚛️ Animated transitions with Framer Motion
- 🧠 Markdown support using `react-markdown`

---

## 🧰 Tech Stack

| Tech          | Description                          |
|---------------|--------------------------------------|
| Next.js       | React framework for SSR and routing  |
| Tailwind CSS  | Utility-first CSS for styling        |
| Framer Motion | Animations and transitions           |
| Axios         | HTTP requests to backend API         |
| React Markdown| Rendering Gemini-generated markdown  |
| Firebase (optional) | Realtime DB for storing scans  |

---

## 📁 Folder Structure

```

📦frontend/
┣ 📂components/
┃ ┣ 📄ScanForm.jsx
┃ ┣ 📄ScanResult.jsx
┃ ┗ ...
┣ 📂public/
┃ ┗ 📄logo.png
┣ 📂app/ or 📂pages/
┃ ┗ 📄page.jsx / index.jsx
┣ 📄tailwind.config.js
┣ 📄package.json
┗ 📄README.md



## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/devsec-buddy-frontend.git
   cd devsec-buddy-frontend
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env`**

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000  # or your backend URL
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

---


## 🔧 Configuration Notes

* ✅ Image optimization uses `next/image`
* ✅ Markdown rendering with `react-markdown`
* ✅ Circular progress via `react-circular-progressbar`
* ✅ Custom animations using `motion.div`

---

## 🤝 Contributing

Pull requests are welcome! If you have suggestions or bug reports, please open an issue or submit a PR.

```bash
# Fork the repo
# Create a feature branch
git checkout -b feature/my-feature

# Commit and push
git commit -m "✨ Add my feature"
git push origin feature/my-feature
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ✨ Credits

Created by **Vivek Kumar Verma** 👨‍💻
Connect on [LinkedIn](https://www.linkedin.com/in/vivek-kumar-verma-programmer-information-technology/) or visit [GitHub](https://github.com/Vivekkumarv123)

---

## 🔐 DevSec Buddy = Developer + Security + Assistant ❤️
