from .base_api import BaseResearchAPI


class OpenAlexAPI(BaseResearchAPI):
    BASE_URL = "https://api.openalex.org/works"

    async def fetch(self, query, max_results=5):
        params = {
            "search": query,
            "per-page": max_results,
            "sort": "relevance_score:desc"
        }
        data = await self.get(self.BASE_URL, params=params)

        results = []
        for item in data.get("results", []):
            authors = [a["author"]["display_name"] for a in item.get("authorships", []) if "author" in a]

            abstract = item.get("abstract_inverted_index")
            if abstract:
                words = sorted((i, w) for w, idxs in abstract.items() for i in idxs)
                abstract_text = " ".join(w for _, w in words)
            else:
                abstract_text = ""

            results.append({
                "title": item.get("title"),
                "summary": self.clean_text(abstract_text),
                "authors": authors,
                "doi": item.get("doi"),
                "year": item.get("publication_year"),
                "web_link": item.get("primary_location", {}).get("landing_page_url"),
                "score": item.get("relevance_score"),
                "source": "OpenAlex"
            })
        return results
