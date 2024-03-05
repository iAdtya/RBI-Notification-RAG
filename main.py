from fastapi import FastAPI
from pydantic import BaseModel
from qdrant_client import QdrantClient
from langchain_community.embeddings import HuggingFaceInferenceAPIEmbeddings

# from langchain_community.llms import OpenAI
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

qdrant_client = QdrantClient(
    url="...",
    api_key="...",
)

embeddings = HuggingFaceInferenceAPIEmbeddings(
    api_key="...",
    model_name="BAAI/bge-base-en-v1.5",
)

llm = OpenAI(openai_api_key="...")

prompt_template = """
Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer:

Context: {context}

Question: {question}

Only return the helpful answer. Answer must be detailed and well explained.
Helpful answer:
"""

prompt = PromptTemplate(
    input_variables=["context", "question"],
    template=prompt_template,
)


class QueryRequest(BaseModel):
    query: str


@app.post("/answer")
async def answer_question(request: QueryRequest):
    query = request.query
    query_vector = embeddings.embed_query(query)

    search_result = qdrant_client.search(
        collection_name="rbi_notification",
        query_vector=query_vector,
        limit=1,
    )

    document = search_result[0].payload["page_content"]
    source = search_result[0].payload["metadata"]

    answer = llm(prompt.format(context=document, question=query))

    return {
        "query": query,
        "relevant_text": document,
        "source": source,
        "answer": answer,
    }
