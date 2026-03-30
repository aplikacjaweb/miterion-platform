import csv
import io

# Read original user facilities list
user_facilities = []
try:
    with open('user_facilities.csv', 'r', encoding='utf-8') as f:
        user_reader = csv.reader(f, delimiter=',')
        header = next(user_reader) # Skip header
        for row in user_reader:
            user_facilities.append({
                'Lp.': row[0],
                'NIP': row[1].strip(),
                'Nazwa placówki': row[2].strip()
            })
    print(f"[DEBUG] Wczytano {len(user_facilities)} placówek z user_facilities.csv")
except FileNotFoundError:
    print("Błąd: Plik 'user_facilities.csv' nie został znaleziony.")
    exit()
except Exception as e:
    print(f"Wystąpił błąd podczas przetwarzania pliku user_facilities.csv: {e}")
    exit()

# Read previously found results to identify what's still missing
found_lps_with_data = set()
try:
    with open('results.txt', 'r', encoding='utf-8') as f:
        current_lp = None
        has_data = False
        for line in f:
            if line.startswith('**Lp.: '):
                if current_lp is not None and has_data:
                    found_lps_with_data.add(current_lp)
                current_lp = line.replace('**Lp.: ', '').strip('*- \r\n')
                has_data = False # Reset for new LP
            elif line.startswith('**Adres:'):
                if 'Brak danych w bazie' not in line:
                    has_data = True
        # Add the last one after loop finishes
        if current_lp is not None and has_data:
            found_lps_with_data.add(current_lp)

    print(f"[DEBUG] Zidentyfikowano {len(found_lps_with_data)} Lp. placówek ZE ZNALEZIONYMI DANYMI z results.txt: {found_lps_with_data}")
except FileNotFoundError:
    print("Błąd: Plik 'results.txt' nie został znaleziony. Zakładam, że nic nie zostało znalezione wcześniej.")
    # If results.txt is not found, then all are unfound from the file processing step.


unfound_facilities_for_websearch = []
for user_item in user_facilities:
    if user_item['Lp.'] not in found_lps_with_data:
        unfound_facilities_for_websearch.append(user_item)

print(f"[DEBUG] {len(unfound_facilities_for_websearch)} placówek do przeszukania w Internecie.")
# Print unfound facilities in a format that's easy to parse or use for web_search
for item in unfound_facilities_for_websearch:
    print(f"{item['Lp.']};{item['NIP']};{item['Nazwa placówki']}")
