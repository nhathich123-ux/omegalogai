import urllib.request
import re

try:
    url = 'https://omegalogai.netlify.app'
    html = urllib.request.urlopen(url).read().decode('utf-8')
    print("HTML Content Length:", len(html))
    
    # Find scripts
    js_files = re.findall(r'src="/(assets/[^"]+\.js)"', html)
    if not js_files:
        js_files = re.findall(r'href="/(assets/[^"]+\.css)"', html) # check CSS too
    print("Found assets:", js_files)
    
    for asset in js_files:
        asset_url = f"{url}/{asset}"
        asset_content = urllib.request.urlopen(asset_url).read().decode('utf-8')
        print(f"Asset: {asset_url} | Size: {len(asset_content)}")
        if "lastMessageText" in asset_content:
            print(">>> SUCCESS: 'lastMessageText' IS present in this asset!")
        else:
            print(">>> 'lastMessageText' is NOT present in this asset.")
except Exception as e:
    print("Error:", e)
