from playwright.sync_api import sync_playwright

def verify_theme_toggle_aria(page):
    print("Navigating to home page...")
    page.goto("http://localhost:8080")

    # Wait for the page to load
    page.wait_for_load_state("networkidle")

    print("Checking for ThemeToggle button...")
    # Try to find the button. Since the mounted state might swap quickly,
    # we might see the mounted version.
    # However, both versions should have the aria-label now if I implemented it correctly in both places?
    # Wait, I only added it to the !mounted state.
    # The mounted state code says:
    # <Button variant="ghost" size="icon" onClick={...} ...>
    #   ...
    #   <span className="sr-only">Toggle theme</span>
    # </Button>
    # The mounted state uses a sr-only span, which acts as a label.
    # The unmounted state had NO label.
    # So I can't easily verify the unmounted state with Playwright because Playwright runs JS.
    # But I can check if the button *eventually* has an accessible name.

    # Actually, to verify my change, I need to see the HTML *before* hydration or disable JS.
    # Let's try disabling JS.


def verify_no_js(page):
    print("Navigating with JS disabled...")
    page.goto("http://localhost:8080")

    # Without JS, the 'mounted' state will stay false (if it relies on useEffect).
    # In the code:
    # const [mounted, setMounted] = useState(false);
    # useEffect(() => { setMounted(true); }, []);
    # if (!mounted) ...

    # So if I disable JS, it should stay in the !mounted state.

    button = page.locator("button.glass")

    # Check if it has aria-label
    aria_label = button.get_attribute("aria-label")
    print(f"Aria label found: {aria_label}")

    if aria_label == "Toggle theme":
        print("SUCCESS: Aria label is present in unmounted state.")
    else:
        print("FAILURE: Aria label is missing or incorrect.")
        exit(1)

    page.screenshot(path="verification/theme_toggle.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Create a context with JavaScript disabled
        context = browser.new_context(java_script_enabled=False)
        page = context.new_page()

        try:
            verify_no_js(page)
        except Exception as e:
            print(f"Error: {e}")
            exit(1)
        finally:
            browser.close()
