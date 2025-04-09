# 🤖 AI Chatbot CMS Platform

This is a full-stack AI-powered chatbot platform with CMS features built using **React + Vite + TypeScript**. It allows users to chat with an AI assistant, while admins can manage Q&A content via a content management interface.

---

## 🌐 Live Demo

[Click here to view the live application]([https://your-live-link.com](https://nimbou-ai-cms.vercel.app/))

---

## 📂 Project Structure

- **Chat Interface:** Allows users to enter a query and receive AI-based or CMS-stored responses.
- **CMS Dashboard:** Create, update, and delete content for AI query matches.
- **AI Integration:** Queries an AI API when no match is found in the CMS.
- **Multi-platform Ready:** Easily extendable to platforms like WhatsApp and Telegram.

---

## 🚀 Getting Started Locally

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```
---
## 💬 How the Chat System Works

The chat interface allows users to submit questions or messages and receive intelligent responses. The backend handles each message using a smart, two-step logic:

### 🧠 Chat Flow Logic

1. **User Submits Message:**
   - The user enters a query in the chat box and hits send.

2. **Database Check (CMS):**
   - The system first searches the CMS/database for a matching or similar question.
   - If a match is found, the stored answer is returned immediately.

3. **Fallback to Gemini AI:**
   - If no match is found in the database, the query is sent to **Gemini AI** (Google's AI model) using the **Gemini API**.
   - Gemini processes the question and returns a relevant, intelligent answer.

4. **Storing New Answers:**
   - The new AI-generated response can be optionally saved in the CMS for future matches, enabling the system to learn and improve over time.

---

## 🤖 Gemini AI Integration

The project integrates **Gemini AI** via a simple API call to enhance chatbot intelligence. Here's how it works under the hood:

### 🔧 Integration Details

- **API Used:** Gemini AI API (by Google)
- **Request Flow:**
  - Send user question as prompt via POST request to the Gemini endpoint.
  - Receive the response (natural language answer).
- **Error Handling:** Fallback and retry mechanisms are used to handle API timeouts or failures.
- **Security:** API key is stored securely using environment variables.
