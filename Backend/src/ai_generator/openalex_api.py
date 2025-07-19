from .base_api import BaseResearchAPI

class OpenAlexAPI(BaseResearchAPI):
    BASE_URL = "https://api.openalex.org/works"

    async def fetch(self, query, max_results=5):
        params = {
            "search": query,
            "per-page": max_results,
            "sort": "relevance_score:desc"
        }

        try:
            data = await self.get(self.BASE_URL, params=params)
        except Exception as e:
            print(f"⚠️ OpenAlexAPI failed: {e}")
            return []

        results = []
        for item in data.get("results", []):
            authors = [
                a["author"].get("display_name")
                for a in item.get("authorships", [])
                if isinstance(a, dict) and "author" in a and isinstance(a["author"], dict)
            ]

            # Reconstruct abstract from inverted index
            abstract_text = ""
            abstract_index = item.get("abstract_inverted_index")
            if abstract_index:
                try:
                    position_map = []
                    for word, positions in abstract_index.items():
                        for pos in positions:
                            position_map.append((pos, word))
                    # Sort by position and join
                    abstract_text = " ".join(word for _, word in sorted(position_map))
                except Exception as e:
                    print(f"⚠️ Error decoding abstract_inverted_index: {e}")
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
