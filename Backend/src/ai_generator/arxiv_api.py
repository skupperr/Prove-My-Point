from .base_api import BaseResearchAPI
import aiohttp
import feedparser
import re

class ArxivAPI(BaseResearchAPI):
    async def fetch(self, query, max_results=15):
        base_url = 'http://export.arxiv.org/api/query'
        search_query = f'search_query=all:{query}&start=0&max_results={max_results}'
        url = f"{base_url}?{search_query}"

        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                data = await response.text()
                parsed = feedparser.parse(data)

        results = []
        for entry in parsed.entries:
            results.append({
                "title": entry.title,
                "summary": self.clean_text(entry.summary),
                "authors": [author.name for author in entry.authors],
                "doi": entry.link,
                "year": entry.published[:4],
                "web_link": entry.link,
                "score": None,
                "source": "Arxiv"
            })
        return results