from playwright.sync_api import sync_playwright

def verify_accessibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:8080...")
            page.goto("http://localhost:8080")

            # Wait for the page to load
            page.wait_for_load_state("networkidle")

            print("Page loaded. Checking for elements...")

            # Verify Footer Social Icons
            # Use a slightly more flexible locator if exact match fails, but we expect exact match
            twitter = page.locator('button[aria-label="Follow us on Twitter"]')
            if twitter.count() > 0:
                print("Twitter button found with aria-label")
            else:
                print("Twitter button NOT found. HTML snippet around footer:")
                # print(page.content()) # Too verbose, maybe just check if footer exists
                if page.locator("footer").count() > 0:
                     print("Footer exists.")
                else:
                     print("Footer NOT found.")

            linkedin = page.locator('button[aria-label="Connect on LinkedIn"]')
            if linkedin.count() > 0:
                 print("LinkedIn button found with aria-label")
            else:
                 print("LinkedIn button NOT found")

            github = page.locator('button[aria-label="View source on GitHub"]')
            if github.count() > 0:
                 print("GitHub button found with aria-label")
            else:
                 print("GitHub button NOT found")

            # Verify Mobile Menu Trigger (viewport needs to be small)
            page.set_viewport_size({"width": 375, "height": 667})
            menu_trigger = page.locator('button[aria-label="Open main menu"]')
            if menu_trigger.count() > 0:
                 print("Mobile menu trigger found with aria-label")
            else:
                 print("Mobile menu trigger NOT found")

            page.screenshot(path="verification/verification.png")
            print("Screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_accessibility()
