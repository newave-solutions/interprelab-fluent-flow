
from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the page
        print("Navigating to /interprestudy...")
        page.goto("http://localhost:8080/interprestudy")

        # Wait for potential redirect or load
        time.sleep(5)

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/interprestudy_page.png")

        browser.close()

if __name__ == "__main__":
    run()
