import asyncio
from .crossref_api import CrossRefAPI
from .arxiv_api import ArxivAPI
from .pubmed_api import PubMedAPI
from .openalex_api import OpenAlexAPI
from .core_api import CoreAPI
import asyncio


# async def fetch_all(query):
#     sources = [
#         ArxivAPI(),
#         PubMedAPI(),
#         CrossRefAPI(),
#         OpenAlexAPI(),
#         CoreAPI()
#     ]

#     all_results = []
#     tasks = []

#     async with asyncio.TaskGroup() as tg:
#         for source in sources:
#             task = tg.create_task(source.fetch(query))
#             tasks.append((source.__class__.__name__, task))  # Keep track of which source

#     for source_name, task in tasks:
#         try:
#             result = task.result()  # Safe here after TaskGroup completes
#             all_results.extend(result)
#         except Exception as e:
#             print(f"⚠️ Error fetching from {source_name}:", e)

#     return all_results

async def fetch_all(query):
    sources = [
        ArxivAPI(),
        PubMedAPI(),
        CrossRefAPI(),
        OpenAlexAPI(),
        CoreAPI()
    ]

    all_results = []

    async with asyncio.TaskGroup() as tg:
        results = {}

        for source in sources:
            async def safe_fetch(source):
                try:
                    result = await source.fetch(query)
                    results[source.__class__.__name__] = result
                except Exception as e:
                    print(f"⚠️ Error fetching from {source.__class__.__name__}:", e)
                    results[source.__class__.__name__] = []

            tg.create_task(safe_fetch(source))

    # After TaskGroup exits, everything is completed
    for res_list in results.values():
        all_results.extend(res_list)

    return all_results
