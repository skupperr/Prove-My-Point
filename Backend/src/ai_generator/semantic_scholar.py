import aiohttp
from .base_api import BaseResearchAPI

class SemanticScholarAPI(BaseResearchAPI):
    BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search"

    async def fetch(self, query, max_results=10):
        params = {
            "query": query,
            "limit": max_results,
            "fields": "title,abstract,authors,year,url",
            "sort": "relevance" 
        }
        try:
            data = await self.get(self.BASE_URL, params=params)
        except Exception as e:
            print(f"⚠️ SemanticScholarAPI failed: {e}")
            return []

        results = []
        for item in data.get("data", []):
            if not item.get("abstract"):
                continue
            authors = [a.get("name", "") for a in item.get("authors", [])]
            results.append({
                "title": item.get("title"),
                "summary": self.clean_text(item.get("abstract")),
                "authors": authors,
                "doi": None,
                "year": item.get("year"),
                "web_link": item.get("url"),
                "score": None,
                "source": "Semantic Scholar"
            })
        return results