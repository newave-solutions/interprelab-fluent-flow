from playwright.sync_api import sync_playwright

def verify_ux_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        try:
            print("Navigating to /interprestudy...")
            # Increase timeout
            page.goto("http://127.0.0.1:8080/interprestudy", timeout=90000)

            # Wait for content to load - networkidle might be flaky if there are polling requests
            # Let's wait for a specific element
            print("Waiting for page content...")
            page.wait_for_selector("h1", timeout=30000)

            # Click on the 'Terms' tab (value="terminology")
            print("Clicking 'Terms' tab...")

            # Try multiple selectors for the tab
            try:
                page.click("button[value='terminology']", timeout=5000)
            except:
                print("Could not click by value, trying text...")
                page.click("text=Terms", timeout=5000)

            # Wait for TerminologyLookup to be visible
            print("Waiting for TerminologyLookup...")
            page.wait_for_selector("text=Terminology Lookup", timeout=10000)

            # Search for a term
            print("Searching for a term...")
            page.fill("input[placeholder*='Enter term']", "Diagnostico")
            page.click("button:has-text('Search')")

            # Wait for result (simulate delay is 1000ms)
            page.wait_for_timeout(2000)

            # Find the volume button in the result card.
            print("Finding volume button...")
            # The result card appears after search.
            # Look for the button with the ARIA label we added/verified
            volume_btn = page.locator("button[aria-label='Play pronunciation']").first

            if volume_btn.is_visible():
                print("Volume button found. Hovering...")
                volume_btn.hover()
                # Wait for tooltip to appear
                page.wait_for_timeout(1000)

                # Take screenshot
                print("Taking screenshot...")
                page.screenshot(path="verification/ux_tooltip_verification.png")
                print("Screenshot saved.")
            else:
                print("Volume button not found!")
                page.screenshot(path="verification/ux_failed.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_ux_changes()
