from playwright.sync_api import sync_playwright

def verify_glossary():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to InterpreStudy
        page.goto("http://127.0.0.1:8080/interprestudy")

        # Wait for page to load
        page.wait_for_timeout(5000)

        # Click on Terminology tab
        page.get_by_role("tab", name="Terms").click()

        # Wait for glossary to load
        page.wait_for_timeout(2000)

        # Add a term manually if none exist (simulate search)
        page.get_by_placeholder("Enter term in English or target language...").fill("test")
        page.get_by_role("button", name="Search").click()

        page.wait_for_timeout(3000) # Wait for search

        if page.get_by_role("button", name="Add to Glossary").is_visible():
            page.get_by_role("button", name="Add to Glossary").click()

        page.wait_for_timeout(1000)

        # Take screenshot
        page.screenshot(path="verification/glossary.png")

        browser.close()

if __name__ == "__main__":
    verify_glossary()
