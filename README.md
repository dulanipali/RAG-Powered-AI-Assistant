# Rate My Professor AI Assistant

A RAG-powered AI assistant designed to help students find professors and courses by providing context-aware responses. This project uses technologies like Next.js, Pinecone, Material-UI and the OpenAI API to create a smart and responsive assistant.

This repository uses Bill Zhang's Article on AI assistant as a starting point structure (https://medium.com/@billzhangsc/building-a-rag-powered-ai-assistant-the-rate-my-professor-project-19b8a999313a)

## Getting Started

Clone the repository
```bash
git clone 'repositorylink'
```

Download Miniconda (https://docs.anaconda.com/miniconda/#miniconda-latest-installer-links)

conda create -n rag python=3.10.4
conda activate rag
.\env\Scripts\activate
pip install python-dotenv
pip install openai
pip install "pinecone-client[grpc]"
pip install pip-chill
pip-chill >requirements.txt

Install dependencies
```bash
npm install
```

Create a .env file in the root directory and add your API keys:
```bash
PINECONE_API_KEY=your_pinecone_api_key
OPENAI_API_KEY=your_openai_api_key
```

Run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
#   R A G - P o w e r e d - A I - A s s i s t a n t  
 