import asyncio
from .crossref_api import CrossRefAPI
from .arxiv_api import ArxivAPI
from .pubmed_api import PubMedAPI
from .openalex_api import OpenAlexAPI
from .core_api import CoreAPI
import asyncio


async def fetch_all(query):
    sources = [
        ArxivAPI(),
        PubMedAPI(),
        CrossRefAPI(),
        OpenAlexAPI(),
        CoreAPI()
    ]

    all_results = []
    tasks = []

    async with asyncio.TaskGroup() as tg:
        for source in sources:
            task = tg.create_task(source.fetch(query))
            tasks.append((source.__class__.__name__, task))  # Keep track of which source

    for source_name, task in tasks:
        try:
            result = task.result()  # Safe here after TaskGroup completes
            all_results.extend(result)
        except Exception as e:
            print(f"⚠️ Error fetching from {source_name}:", e)

    return all_results