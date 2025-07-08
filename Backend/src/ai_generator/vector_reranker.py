from sentence_transformers import SentenceTransformer, util

class VectorReranker:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def rerank(self, query, papers, top_k=None):
        """
        Reranks papers based on semantic similarity to the query.
        Each paper should have 'title' and 'summary'.

        Args:
            query (str): User's original query.
            papers (list): List of dicts with 'title' and 'summary'.
            top_k (int): Optional limit of top results to return.

        Returns:
            List of papers sorted by similarity.
        """
        if not papers:
            return []

        # Encode query and paper texts
        query_embedding = self.model.encode(query, convert_to_tensor=True)
        doc_texts = [f"{p['title']} {p['summary']}" for p in papers]
        doc_embeddings = self.model.encode(doc_texts, convert_to_tensor=True)

        # Compute cosine similarity
        similarities = util.cos_sim(query_embedding, doc_embeddings)[0]

        # Attach score and rerank
        scored = [
            {**paper, "score": float(similarity)}
            for paper, similarity in zip(papers, similarities)
        ]
        scored.sort(key=lambda x: x["score"], reverse=True)

        return scored[:top_k] if top_k else scored
