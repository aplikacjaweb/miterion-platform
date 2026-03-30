import re
import json
import os

file_path = "temp_placowki.txt"

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()
except Exception as e:
    print(f"Error reading file: {e}")
    exit(1)

# Remove the header line
text = text.replace("Lp.NIPNazwa placówki i miejscowość", "", 1)

# Revised regex pattern
pattern = r'(\d+)\.(\d{10})(.*?)(?=\d+\.|\Z)'
matches = re.findall(pattern, text)

extracted_data = []
for match in matches:
    lp = match[0]
    nip = match[1]
    name_and_city = match[2].strip()
    if name_and_city.startswith(","):
        name_and_city = name_and_city[1:].strip()
    extracted_data.append({'Lp.': lp, 'NIP': nip, 'Nazwa placówki i miejscowość': name_and_city})

print(json.dumps(extracted_data, indent=2, ensure_ascii=False))

os.remove(file_path)
