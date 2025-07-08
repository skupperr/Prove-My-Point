import aiohttp
import xmltodict
import re

from .base_api import BaseResearchAPI



class PubMedAPI(BaseResearchAPI):
    BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"

    def clean_abstract(self, text):
        if not text:
            return ""
        text = re.sub(r'\s+', ' ', text).strip()
        return text


    async def fetch(self, query, max_results=5):
        params = {
            "db": "pubmed",
            "retmode": "json",
            "retmax": max_results,
            "term": query
        }
        async with aiohttp.ClientSession() as session:
            async with session.get(self.BASE_URL, params=params) as response:
                ids_data = await response.json()

            id_list = ids_data.get("esearchresult", {}).get("idlist", [])
            if not id_list:
                return []

            summary_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
            details_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

            # Step 2: Fetch article metadata
            fetch_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
            fetch_params = {
                "db": "pubmed",
                "id": ",".join(id_list),
                "retmode": "xml"
            }
            async with session.get(fetch_url, params=fetch_params) as fetch_response:
                xml_data = await fetch_response.text()
                parsed = xmltodict.parse(xml_data)

            articles = parsed.get("PubmedArticleSet", {}).get("PubmedArticle", [])
            if not isinstance(articles, list):
                articles = [articles]

            results = []
            for article in articles:
                citation = article["MedlineCitation"]
                article_info = citation["Article"]

                # Title
                title_raw = article_info.get("ArticleTitle", "No Title")
                if isinstance(title_raw, dict):
                    tag_part = next(iter(title_raw.values())) if title_raw else ""
                    text_part = title_raw.get("#text", "")
                    title = f"{tag_part}: {text_part}".strip()
                else:
                    title = str(title_raw)


                # Abstract (handle str, list, or dict)
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

                abstract = " ".join(abstract_parts)


                # Authors
                authors = []
                for a in article_info.get("AuthorList", {}).get("Author", []):
                    if isinstance(a, dict):
                        full_name = f"{a.get('ForeName', '')} {a.get('LastName', '')}".strip()
                        if full_name:
                            authors.append(full_name)

                # DOI (optional)
                elocation = article_info.get("ELocationID", [])
                doi = None
                if isinstance(elocation, list):
                    for el in elocation:
                        if isinstance(el, dict) and el.get('@EIdType') == 'doi':
                            doi = el.get('#text')
                            break
                elif isinstance(elocation, dict) and elocation.get('@EIdType') == 'doi':
                    doi = elocation.get('#text')

                # Published info (optional)
                published = article_info.get("Journal", {}).get("JournalIssue", {}).get("PubDate", {})

                # Web link
                pmid = citation.get("PMID", {}).get("#text")
                web_link = f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" if pmid else None

                results.append({
                "title": title,
                "summary": self.clean_abstract(abstract),
                "authors": authors,
                "doi": "https://doi.org/"+doi,
                "year": published['Year'],
                "web_link": web_link,
                "source": "PubMed"
            })
        return results


            