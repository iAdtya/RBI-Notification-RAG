import voyageai
import time

vo = voyageai.Client(api_key="...")

batch_size = 128
embeddings = []
texts = ["Vectorize your data to gear up your AI stack."]

for i in range(0, len(texts), batch_size):
    embeddings += vo.embed(
        texts[i:i + batch_size], model="voyage-02", input_type="document"
    ).embeddings
    # add a wait period
    time.sleep(0.1)

result = vo.embed(texts, model="voyage-code-2")

print(result.embeddings)
