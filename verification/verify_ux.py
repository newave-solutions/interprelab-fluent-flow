
import asyncio
from playwright.async_api import async_playwright, expect

async def verify_ux_changes():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            print("Navigating to home page...")
            await page.goto("http://localhost:8080/", timeout=60000)

            print("Checking mobile menu...")
            await page.set_viewport_size({"width": 375, "height": 667})

            # Take a debug screenshot to see what's rendered
            await page.wait_for_timeout(3000)
            await page.screenshot(path="verification/debug_mobile_view.png")

            # Check for the button presence first, perhaps it's not visible for some reason
            # The button is inside SheetTrigger which is md:hidden.

            # Try finding it by role button first
            buttons = page.get_by_role("button")
            count = await buttons.count()
            print(f"Found {count} buttons")

            # Try to find our button by internal SVG or class if label fails
            # But we really want to verify the label.

            # Maybe the state is somehow isOpen=true? Unlikely.

            menu_button = page.get_by_label("Open menu")
            if await menu_button.count() > 0:
                print("Found button by label 'Open menu'")
                await expect(menu_button).to_be_visible()
                print("Verified Mobile Nav Button has aria-label")
            else:
                print("Could not find button by label 'Open menu'")
                # Fallback check
                close_button = page.get_by_label("Close menu")
                if await close_button.count() > 0:
                    print("Found button by label 'Close menu'")
                else:
                    print("Could not find button by label 'Close menu' either")

            # Footer check
            print("Checking footer...")
            await page.set_viewport_size({"width": 1280, "height": 800})

            await page.reload()
            await page.wait_for_timeout(3000)
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_timeout(1000)

            twitter_btn = page.get_by_label("Twitter")
            if await twitter_btn.count() > 0:
                 await expect(twitter_btn).to_be_visible()
                 print("Verified Footer Social Buttons have aria-labels")
                 await page.screenshot(path="verification/footer_aria.png")
            else:
                print("Could not find Twitter button by label")
                await page.screenshot(path="verification/debug_footer.png")

        except Exception as e:
            print(f"Error during verification: {e}")
            await page.screenshot(path="verification/error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_ux_changes())
