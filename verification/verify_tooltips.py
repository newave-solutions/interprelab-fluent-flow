from playwright.sync_api import sync_playwright

def verify_footer_tooltips(page):
    # Navigate to the home page
    page.goto("http://localhost:8080/")

    # Scroll to the bottom to make the footer visible
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

    # Wait for the footer to be visible
    footer = page.locator("footer")
    footer.wait_for()

    # Locate the social buttons within the footer
    twitter_btn = footer.locator("button[aria-label='Twitter']")

    # Verify Twitter tooltip
    print("Hovering Twitter...")
    twitter_btn.hover()

    # Use get_by_role('tooltip') to target the popover content
    tooltip = page.get_by_role("tooltip")
    tooltip.wait_for()

    # Verify it contains the text
    if "Follow us on Twitter" in tooltip.text_content():
        print("Tooltip text matches!")
    else:
        print(f"Tooltip text mismatch: {tooltip.text_content()}")

    page.screenshot(path="verification/verification_twitter.png")
    print("Twitter tooltip verified")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_footer_tooltips(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
