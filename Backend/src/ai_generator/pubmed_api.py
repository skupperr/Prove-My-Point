import aiohttp
import xmltodict
import re

from .base_api import BaseResearchAPI


class PubMedAPI(BaseResearchAPI):
    BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"

    def clean_abstract(self, text):
        if not text:
            return ""
        return re.sub(r"\s+", " ", text).strip()

    async def fetch(self, query, max_results=5):
        # Step 1: Search PubMed for article IDs
        search_params = {
            "db": "pubmed",
            "retmode": "json",
            "retmax": max_results,
            "term": query
        }

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=search_params) as response:
                    ids_data = await response.json()

                id_list = ids_data.get("esearchresult", {}).get("idlist", [])
                if not id_list:
                    return []

                # Step 2: Fetch article metadata by IDs
                fetch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
                fetch_params = {
                    "db": "pubmed",
                    "id": ",".join(id_list),
                    "retmode": "xml"
                }

                async with session.get(fetch_url, params=fetch_params) as fetch_response:
                    xml_data = await fetch_response.text()
                    parsed = xmltodict.parse(xml_data)

        except Exception as e:
            print(f"⚠️ PubMedAPI failed: {e}")
            return []

        articles = parsed.get("PubmedArticleSet", {}).get("PubmedArticle", [])
        if not isinstance(articles, list):
            articles = [articles]

        results = []

        for article in articles:
            citation = article.get("MedlineCitation", {})
            article_info = citation.get("Article", {})

            # Title
            title_raw = article_info.get("ArticleTitle", "No Title")
            if isinstance(title_raw, dict):
                tag_part = next(iter(title_raw.values()), "")
                text_part = title_raw.get("#text", "")
                title = f"{tag_part}: {text_part}".strip()
            else:
                title = str(title_raw)

            # Abstract (handle dict, list, or str)
            abstract_raw = article_info.get("Abstract", {}).get("AbstractText", "")
            abstract_parts = []

            if isinstance(abstract_raw, list):
                for part in abstract_raw:
                    if isinstance(part, dict):
                        abstract_parts.append(part.get("#text", ""))
                    else:
                        abstract_parts.append(str(part))
            elif isinstance(abstract_raw, dict):
                abstract_parts.append(abstract_raw.get("#text", ""))
            else:
                abstract_parts.append(str(abstract_raw))

            abstract = " ".join(abstract_parts).strip()

            # Authors
            authors = []
            for author in article_info.get("AuthorList", {}).get("Author", []):
                if isinstance(author, dict):
                    name = f"{author.get('ForeName', '')} {author.get('LastName', '')}".strip()
                    if name:
                        authors.append(name)

            # DOI (optional)
            elocation = article_info.get("ELocationID", [])
            doi = None
            if isinstance(elocation, list):
                for el in elocation:
                    if isinstance(el, dict) and el.get("@EIdType") == "doi":
                        doi = el.get("#text")
                        break
            elif isinstance(elocation, dict) and elocation.get("@EIdType") == "doi":
                doi = elocation.get("#text")

            doi_url = f"https://doi.org/{doi}" if doi else None

            # Year (may be missing)
            published = article_info.get("Journal", {}).get("JournalIssue", {}).get("PubDate", {})
            year = published.get("Year")

            # PMID and link
            pmid = citation.get("PMID", {}).get("#text")
            web_link = f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" if pmid else None

            results.append({
                "title": title,
                "summary": self.clean_abstract(abstract),
                "authors": authors,
                "doi": doi_url,
                "year": year,
                "web_link": web_link,
                "source": "PubMed"
            })

        return results
