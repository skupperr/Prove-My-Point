from .base_api import BaseResearchAPI

class CrossRefAPI(BaseResearchAPI):
    BASE_URL = "https://api.crossref.org/works"

    async def fetch(self, query, max_results=5):
        params = {
            "query": query,
            "rows": max_results * 2,
            "sort": "score",
            "filter": "type:journal-article",
            "mailto": "your@email.com"
        }
        data = await self.get(self.BASE_URL, params=params)

        results = []
        for item in data["message"].get("items", []):
            abstract = item.get("abstract")
            if not abstract:
                continue

            authors = [
                f"{a.get('given', '')} {a.get('family', '')}".strip()
                for a in item.get("author", [])
            ]

            results.append({
                "title": item.get("title", [""])[0],
                "summary": self.clean_text(abstract),
                "authors": authors,
                "doi": "https://doi.org/"+item.get("DOI"),
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