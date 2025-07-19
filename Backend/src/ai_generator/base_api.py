import aiohttp
import asyncio
import re
import async_timeout

class BaseResearchAPI:
    # Removed shared self.session

    async def get(self, url, params=None, headers=None, retries=3, backoff_factor=1.5, return_text=False, timeout=15):
        delay = 1
        for attempt in range(retries):
            try:
                async with aiohttp.ClientSession() as session:
                    async with async_timeout.timeout(timeout):
                        async with session.get(url, params=params, headers=headers) as response:
                            if response.status == 200:
                                if return_text:
                                    return await response.text()
                                else:
                                    content_type = response.headers.get("Content-Type", "")
                                    if "application/json" in content_type:
                                        return await response.json()
                                    else:
                                        raise Exception(f"Attempt to decode JSON with unexpected mimetype: {content_type}, url='{response.url}'")
                            else:
                                content = await response.text()
                                raise Exception(f"{self.__class__.__name__} Error {response.status}: {content}")
            except Exception as e:
                if attempt == retries - 1:
                    raise e
                print(f"⚠️ Retry {attempt + 1}/{retries} for {url} due to error: {e}")
                await asyncio.sleep(delay)
                delay *= backoff_factor

    def clean_text(self, text):
        """Strips XML/HTML tags and normalizes whitespace."""
        if not text:
            return ''
        text = re.sub(r'<[^>]+>', '', text)
        return re.sub(r'\s+', ' ', text).strip()

    async def fetch(self, query, max_results=5):
        raise NotImplementedError("Each API class must implement fetch()")
