
import asyncio
from playwright.async_api import async_playwright

async def verify_interprelink():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Navigate to InterpreLink
        try:
            await page.goto("http://localhost:8080/interprelink", timeout=60000)

            # Wait for content to load
            await page.wait_for_selector("text=InterpreLink", timeout=30000)

            # Take screenshot
            await page.screenshot(path="verification/interprelink_verified.png")
            print("Screenshot taken successfully")

        except Exception as e:
            print(f"Error: {e}")
            # Take error screenshot
            await page.screenshot(path="verification/interprelink_error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_interprelink())
