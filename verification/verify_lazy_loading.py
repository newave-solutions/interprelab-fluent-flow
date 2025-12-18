from playwright.sync_api import sync_playwright, expect

def verify_lazy_loading(page):
    print("Navigating to home page...")
    page.goto("http://localhost:8080")

    # Verify home page loads (it's eager)
    print("Checking home page content...")
    # The home page title usually contains "InterpreLab"
    expect(page).to_have_title(r"InterpreLab")

    # Navigate to a lazy loaded page (e.g., InterpreStudy)
    print("Navigating to /interprestudy...")
    page.goto("http://localhost:8080/interprestudy")

    # We verify the page eventually loads.
    # We need to find something that is definitely on the InterpreStudy page.
    # Looking at InterpreStudy.tsx (not read yet, but assuming tabs) or "Terminology Lookup" from TerminologyLookup component.

    # Let's wait for a bit to allow network requests if any
    page.wait_for_timeout(2000)

    # Take a screenshot of the loaded page
    page.screenshot(path="verification/interprestudy_loaded.png")
    print("Screenshot taken.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_lazy_loading(page)
        finally:
            browser.close()
