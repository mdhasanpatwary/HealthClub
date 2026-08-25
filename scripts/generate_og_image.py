import os
import subprocess
import sys

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    html_path = os.path.join(base_dir, "scripts", "og_template.html")
    output_path = os.path.join(base_dir, "public", "og-image.png")

    chrome_candidates = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "google-chrome",
        "chromium",
        "chromium-browser",
    ]

    chrome_bin = None
    for candidate in chrome_candidates:
        if os.path.exists(candidate) or subprocess.run(["which", candidate], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0:
            chrome_bin = candidate
            break

    if not chrome_bin:
        print("Chrome binary not found. Please install Chrome or Chromium.")
        sys.exit(1)

    cmd = [
        chrome_bin,
        "--headless",
        "--disable-gpu",
        "--window-size=1200,630",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        f"--screenshot={output_path}",
        f"file://{html_path}",
    ]

    print(f"Rendering {html_path} to {output_path} (1200x630)...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if os.path.exists(output_path):
        print(f"✅ Successfully generated standard 1200x630 OpenGraph card at {output_path}")
    else:
        print(f"❌ Failed to generate screenshot. Stderr: {res.stderr.decode('utf-8', errors='ignore')}")

if __name__ == "__main__":
    main()
