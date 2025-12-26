import os
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        try:
            # Navigate to the SignIn page
            page.goto("http://localhost:8080/signin", timeout=60000)

            # Wait for page to load
            page.wait_for_selector("body", timeout=30000)

            # Locate the password toggle button in the SignIn form
            password_input = page.locator("#signin-password")
            show_button = page.locator("button[aria-label='Show password']").first

            # Verify initial state
            expect(show_button).to_be_visible()

            # Take a screenshot of the button state
            page.screenshot(path="verification/signin_password_toggle_initial.png")

            # Click the button to toggle
            show_button.click()

            # Verify state after click - The button's label should change
            hide_button = page.locator("button[aria-label='Hide password']").first
            expect(hide_button).to_be_visible()
            expect(password_input).to_have_attribute("type", "text")

            # Hover to see tooltip
            hide_button.hover()
            page.wait_for_timeout(1000)

            # Take a screenshot showing the toggled state and tooltip
            page.screenshot(path="verification/signin_password_toggle_active.png")

            print("Verification successful!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_state.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
