from .base_api import BaseResearchAPI

class CrossRefAPI(BaseResearchAPI):
    BASE_URL = "https://api.crossref.org/works"

    async def fetch(self, query, max_results=5):
        params = {
            "query": query,
            "rows": max_results * 2,
            "sort": "score",
            "filter": "type:journal-article",
            "mailto": "your@email.com"  # Replace this with a valid email
        }

        try:
            data = await self.get(self.BASE_URL, params=params)
        except Exception as e:
            print(f"⚠️ CrossRefAPI failed: {e}")
            return []

        results = []
        for item in data.get("message", {}).get("items", []):
            abstract = item.get("abstract")
            if not abstract:
                continue  # Skip if no abstract

            authors = [
                f"{a.get('given', '')} {a.get('family', '')}".strip()
                for a in item.get("author", [])
            ]

            results.append({
                "title": item.get("title", [""])[0],
                "summary": self.clean_text(abstract),
                "authors": authors,
                "doi": f"https://doi.org/{item.get('DOI')}" if item.get("DOI") else None,
                "year": (
                    item.get("published-print", {}).get("date-parts", [[None]])[0][0]
                    or item.get("published-online", {}).get("date-parts", [[None]])[0][0]
                ),
                "web_link": item.get("URL"),
                "score": item.get("score"),
                "source": "CrossRef"
            })

            if len(results) >= max_results:
                break

        return results
