# Iqra AI Documentation

<div align="center">
  <p>
    <a href="https://docs.iqra.bot">
      <img src="./public/images/intro-banner.jpg" alt="Iqra AI Banner" width="100%">
    </a>
  </p>
  <h3>The Dynamic AI-First Computing Engine</h3>
  <p>
    Official documentation source for <a href="https://iqra.bot">Iqra AI</a>.
    <br />
    <a href="https://docs.iqra.bot"><strong>Explore the Docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/abdofallah/IqraAI">Main Repository</a>
    ·
    <a href="https://github.com/abdofallah/IqraAI/issues">Report Bug</a>
    ·
    <a href="https://discord.gg/UkKHtmqmMH">Join Community</a>
  </p>
</div>

---

## 📚 Overview

This repository contains the source code for **[docs.iqra.bot](https://docs.iqra.bot)**. It is built using **[Fumadocs](https://fumadocs.dev)** and **[Next.js](https://nextjs.org)**.

The documentation covers:
*   **Introduction:** Philosophy & Architecture.
*   **Platform:** User Dashboard & Whitelabeling.
*   **Build & Deploy:** The Visual Script Builder, Agents, Tools/Connections, Rag/Data & Route/Campaigns.
*   **Integrations:** Providers, LLM/STT/TTS, Rerank, Embedding, FlowApps & Telephony.
*   **Developers:** Self-Hosting & FlowApp Development.
*   **API Reference:** OpenAPI based dynamic API references.

## 🚀 Getting Started

### Prerequisites
*   Node.js 20+
*   npm / pnpm (preffered) / yarn

### Local Development
1.  **Clone the repo:**
    ```bash
    git clone https://github.com/abdofallah/IqraAI-Docs.git
    cd IqraAI-Docs
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run the dev server:**
    ```bash
    pnpm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🐳 Docker Deployment

We provide an official Docker image for easy deployment.

### Using Docker Compose
You can spin up the documentation site locally or on your server using the included compose file.

1.  **Run:**
    ```bash
    docker-compose up -d
    ```
2.  **Access:**
    The docs will be available at `http://localhost:5000`.

### Manual Build
To build the image yourself:

```bash
docker build -t abdofallah/iqraai-docs .
```

---

## 📂 Project Structure

*   `content/docs`: The actual MDX documentation files. **Edit content here.**
*   `app/`: Next.js app router structure.
*   `public/`: Static assets (images, logos).
*   `lib/`: Fumadocs configuration and source loaders.

## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingDocs`).
3.  Commit your Changes (`git commit -m 'Add some AmazingDocs'`).
4.  Push to the Branch (`git push origin feature/AmazingDocs`).
5.  Open a Pull Request.