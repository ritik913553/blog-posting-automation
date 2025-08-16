
# 📝 Blog Posting Automation with OpenAI + Hashnode

This project is a simple backend automation tool that lets you **post blogs directly to Hashnode** by just providing a topic.  
The system uses **OpenAI** to generate the blog content and then publishes it automatically to your Hashnode publication using the **Hashnode API**.

---

## 📂 Project Structure
```

├── agent.js       # Main AI agent (handles reasoning, tool calls, and publishing)
├── tools.js       # Contains helper functions for publishing blog
├── package.json   # Node.js dependencies and scripts
├── package-lock.json
└── .env           # Environment variables (not committed to git)

````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the project
```bash
git clone https://github.com/ritik913553/blog-posting-automation
cd blog-posting-automation
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

In the project root, create a file named `.env` and add the following values:

```env
OPENAI_API_KEY=your_openai_api_key_here
HASHNODE_TOKEN=your_hashnode_token_here
PUBLICATION_ID=your_hashnode_publication_id_here
```

* **OPENAI\_API\_KEY** → from [OpenAI](https://platform.openai.com/)
* **HASHNODE\_TOKEN** → from [Hashnode Developer Settings](https://hashnode.com/settings/developer)
* **PUBLICATION\_ID** → the ID of your Hashnode publication where blogs will be posted

---

## ▶️ Running the Project

Start the project in development mode:

```bash
npm run dev
```

You will be prompted in the terminal to **enter a blog topic**:

```
👉 Enter the blog topic that you want to post on Hashnode:
```

Just type your topic (e.g. `"The Future of AI in Education"`) and press **Enter**.
The agent will:

1. Generate a blog post using OpenAI
2. Format it in Markdown
3. Automatically publish it to your Hashnode publication 🚀

---

## ✅ Example Flow

```bash
npm run dev
👉 Enter the blog topic that you want to post on Hashnode: The Power of Prompting
🔥 : The user wants to write a blog about The Power of Prompting
🧠 : Found tool postTheBlogOnHashNode
🛠️ : Blog posted successfully → https://hashnode.com/your-blog-link
```

---

## 🛠️ Tech Stack

* **Node.js** (backend runtime)
* **OpenAI API** (blog content generation)
* **Hashnode API** (blog publishing)

---

## 📌 Notes

* Make sure your `.env` file is correctly set up, otherwise the tool won’t be able to authenticate.
* The blog content is generated automatically, but you can tweak the **system prompt** in `agent.js` to adjust style, tone, or formatting.

---

## 🎉 Done!

Now you can generate and publish blogs with just a topic. 🚀


## Demo

https://github.com/user-attachments/assets/743d28ce-e829-49af-b1b8-2ef1aeb65b01



