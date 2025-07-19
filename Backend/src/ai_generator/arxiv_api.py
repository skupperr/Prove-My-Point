import aiohttp
import xml.etree.ElementTree as ET
from .base_api import BaseResearchAPI

class ArxivAPI(BaseResearchAPI):
    BASE_URL = "https://export.arxiv.org/api/query"

    async def fetch(self, query, max_results=5):
        params = {
            "search_query": f"all:{query}",
            "start": 0,
            "max_results": max_results * 2
        }

        # We skip using self.get() because it expects JSON.
        async with aiohttp.ClientSession() as session:
            async with session.get(self.BASE_URL, params=params) as response:
                xml_text = await response.text()

        # Parse the Atom XML response
        root = ET.fromstring(xml_text)
        ns = {"atom": "http://www.w3.org/2005/Atom"}

        results = []
        for entry in root.findall("atom:entry", ns):
            title = entry.find("atom:title", ns).text.strip()
            summary = entry.find("atom:summary", ns).text.strip()
            authors = [a.find("atom:name", ns).text.strip() for a in entry.findall("atom:author", ns)]
            published = entry.find("atom:published", ns).text[:4]  # Just year
            link = entry.find("atom:id", ns).text.strip()

            results.append({
                "title": title,
                "summary": self.clean_text(summary),
                "authors": authors,
                "doi": None,  # arXiv typically doesn’t include DOI in the API
                "year": published,
                "web_link": link,
                "score": None,
                "source": "arXiv"
            })

            if len(results) >= max_results:
                break

        return results
