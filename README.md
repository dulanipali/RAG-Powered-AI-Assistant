# Rate My Professor AI Assistant

A RAG-powered AI assistant designed to help students find professors and courses by providing context-aware responses. This project uses technologies like Next.js, Pinecone, Material-UI and the OpenAI API to create a smart and responsive assistant.

This repository uses Bill Zhang's Article on AI assistant as a starting point structure (https://medium.com/@billzhangsc/building-a-rag-powered-ai-assistant-the-rate-my-professor-project-19b8a999313a)

## Getting Started

Clone the repository

```bash

git clone 'repositorylink'

```


Create a .env file in the root directory and add your API keys:

```bash

PINECONE_API_KEY=your_pinecone_api_key
OPENAI_API_KEY=your_openai_api_key

```

## Using Python

Download Miniconda (https://docs.anaconda.com/miniconda/#miniconda-latest-installer-links)

```bash
conda create -n rag python=3.10.4
```
```bash
conda activate rag
```

## Install dependencies

```bash
pip install python-dotenv
```
```bash
pip install openai
```
```bash
pip install "pinecone-client[grpc]"
```
```bash
pip install pip-chill
```
```bash
pip-chill >requirements.txt
```
```bash
npm install
```
```bash
npm install @pinecone-database/pinecone     
```

## Run the development server:

```bash

npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
#
