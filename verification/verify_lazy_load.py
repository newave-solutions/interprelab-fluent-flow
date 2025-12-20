from playwright.sync_api import sync_playwright, expect
import time

def verify_interprestudy(page):
    print("Navigating to InterpreStudy page...")
    # The app has a protected route wrapper, but in dev/mock environment or if we just load the page,
    # it might redirect to login. However, we want to see if the page *loads* without crashing due to lazy imports.
    # We can try to navigate directly.
    # If there is authentication, we might need to mock it or just check if the Suspense fallback appears.

    try:
        page.goto("http://localhost:8080/interprestudy")

        # Wait a bit for initial load
        page.wait_for_timeout(2000)

        # Take a screenshot of the initial state
        page.screenshot(path="verification/interprestudy_initial.png")
        print("Initial screenshot taken.")

        # Check if tabs are visible (meaning the page loaded)
        # The tabs list is eager, so it should be visible even if content is loading.
        expect(page.get_by_role("tablist")).to_be_visible()
        print("Tablist is visible.")

        # Click on a tab that was lazy loaded, e.g., 'Training'
        # Labels are hidden on mobile but visible on desktop. We are likely desktop size by default.
        # But let's use the text anyway or get by role tab.

        # "Training" tab
        print("Clicking Training tab...")
        page.get_by_role("tab", name="Training").click()

        # Wait for potential suspense fallback or content load
        page.wait_for_timeout(2000)

        page.screenshot(path="verification/interprestudy_training_tab.png")
        print("Training tab screenshot taken.")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification/error.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()
        try:
            verify_interprestudy(page)
        finally:
            browser.close()
