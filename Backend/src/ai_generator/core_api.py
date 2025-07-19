from .base_api import BaseResearchAPI
import os
from dotenv import load_dotenv

load_dotenv()

class CoreAPI(BaseResearchAPI):
    BASE_URL = "https://api.core.ac.uk/v3/search/works"
    CORE_API_KEY = os.getenv("CORE_API_KEY") or os.environ.get("CORE_API_KEY")

    async def fetch(self, query, max_results=5):
        headers = {"Authorization": f"Bearer {self.CORE_API_KEY}"}
        params = {
            "q": query,
            "page": 1,
            "pageSize": max_results,
            "sort": "relevance"
        }

        try:
            data = await self.get(self.BASE_URL, params=params, headers=headers)
        except Exception as e:
            print(f"⚠️ CoreAPI failed: {e}")
            return []

        results = []
        for item in data.get("results", []):
            authors = item.get("authors", [])
            author_names = [
                a["name"] if isinstance(a, dict) and "name" in a else str(a)
                for a in authors
            ]

            results.append({
                "title": item.get("title"),
                "summary": self.clean_text(item.get("abstract")),
                "authors": author_names,
                "doi": item.get("doi"),
                "year": item.get("yearPublished"),
                "web_link": item.get("downloadUrl") or item.get("urls", [None])[0],
                "score": item.get("score"),
                "source": "Core"
            })

        return results
