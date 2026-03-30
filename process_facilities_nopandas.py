import csv
import io
import unicodedata # For more robust text normalization
import re # For regex to clean names

def normalize_name(name):
    if name is None: 
        return ""
    # Convert to lowercase, strip whitespace
    name = name.lower().strip()
    # Remove diacritics
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('utf-8')
    # Remove common problematic characters and multiple spaces
    name = re.sub(r'[\"”“„'']', '', name) # Remove various quotes
    # Removed apostrophe from the character class to avoid SyntaxError
    name = re.sub(r'[^a-z0-9\s]', '', name) # Remove other non-alphanumeric except spaces
    name = re.sub(r'\s+', ' ', name).strip() # Replace multiple spaces with single space
    return name

# Parse user facilities list from file
user_facilities = []
try:
    with open('user_facilities.csv', 'r', encoding='utf-8') as f:
        user_reader = csv.reader(f, delimiter=',')
        header = next(user_reader) # Skip header
        for row in user_reader:
            user_facilities.append({
                'Lp.': row[0],
                'NIP': row[1].strip(),
                'Nazwa placówki': row[2].strip(),
                'Normalized_Nazwa': normalize_name(row[2].strip())
            })
except FileNotFoundError:
    print("Błąd: Plik 'user_facilities.csv' nie został znaleziony.")
    exit()
except Exception as e:
    print(f"Wystąpił błąd podczas przetwarzania pliku user_facilities.csv: {e}")
    exit()

found_facilities = []
# Use a set of tuples (NIP, Normalized_Nazwa) for efficient lookup of unfound items
not_found_set = { (item['NIP'], item['Normalized_Nazwa'], item['Lp.'], item['Nazwa placówki']) for item in user_facilities }

try:
    with open('podmioty.csv', 'r', encoding='utf-8') as f:
        csv_reader = csv.reader(f, delimiter=';')
        
        # Read header to find column indices
        header = next(csv_reader)
        col_indices = {
            'NIP': header.index('NIP'),
            'Nazwa': header.index('Nazwa'),
            'Ulica': header.index('Ulica'),
            'Budynek': header.index('Budynek'),
            'Lokal': header.index('Lokal'),
            'Kod pocztowy': header.index('Kod pocztowy'),
            'Miejscowość': header.index('Miejscowość'),
            'Telefon': header.index('Telefon'),
            'Email': header.index('Email'),
            'Strona WWW': header.index('Strona WWW')
        }

        for row in csv_reader:
            current_nip = row[col_indices['NIP']].strip()
            current_nazwa = row[col_indices['Nazwa']].strip()
            normalized_current_nazwa = normalize_name(current_nazwa)

            # Iterate over a copy to allow modification if a match is found
            for user_nip, user_normalized_name, user_lp, user_original_name in list(not_found_set):
                # Match by NIP first. Then check if normalized user name is contained in normalized current name.
                if user_nip == current_nip and user_normalized_name in normalized_current_nazwa:
                    # Match found
                    address_parts = [
                        row[col_indices['Ulica']],
                        row[col_indices['Budynek']],
                        row[col_indices['Lokal']],
                        row[col_indices['Kod pocztowy']],
                        row[col_indices['Miejscowość']]
                    ]
                    address = " ".join([part for part in address_parts if part and part != 'NULL']).strip()

                    found_facilities.append({
                        'Lp.': user_lp,
                        'NIP': current_nip,
                        'Nazwa placówki': current_nazwa,
                        'Adres': address,
                        'Telefon': row[col_indices['Telefon']].replace('NULL', 'Brak danych w bazie'),
                        'Email': row[col_indices['Email']].replace('NULL', 'Brak danych w bazie'),
                        'Strona WWW': row[col_indices['Strona WWW']].replace('NULL', 'Brak danych w bazie')
                    })
                    not_found_set.remove((user_nip, user_normalized_name, user_lp, user_original_name)) # Remove from set of unfound
                    break # Move to next row in podmioty.csv once a match for a user_item is found

except FileNotFoundError:
    print("Błąd: Plik 'podmioty.csv' nie został znaleziony.")
    exit()
except Exception as e:
    print(f"Wystąpił błąd podczas przetwarzania pliku: {e}")
    exit()

# Format results
formatted_output_lines = []

# Add found facilities
for res in found_facilities:
    formatted_output_lines.append(f"**Lp.: {res['Lp.']}**")
    formatted_output_lines.append(f"**NIP:** {res['NIP']}")
    formatted_output_lines.append(f"**Nazwa placówki:** {res['Nazwa placówki']}")
    formatted_output_lines.append(f"**Adres:** {res['Adres']}")
    formatted_output_lines.append(f"**Telefon:** {res['Telefon']}")
    formatted_output_lines.append(f"**Email:** {res['Email']}")
    formatted_output_lines.append(f"**Strona WWW:** {res['Strona WWW']}")
    formatted_output_lines.append("---")

# Add not found facilities (using original name from the user list)
for user_nip, user_normalized_name, user_lp, user_original_name in sorted(list(not_found_set), key=lambda x: x[3]): # Sort by original name
    formatted_output_lines.append(f"**Lp.: {user_lp}**")
    formatted_output_lines.append(f"**NIP:** {user_nip}")
    formatted_output_lines.append(f"**Nazwa placówki:** {user_original_name}")
    formatted_output_lines.append(f"**Adres:** Brak danych w bazie")
    formatted_output_lines.append(f"**Telefon:** Brak danych w bazie")
    formatted_output_lines.append(f"**Email:** Brak danych w bazie")
    formatted_output_lines.append(f"**Strona WWW:** Brak danych w bazie")
    formatted_output_lines.append("---")

# Write results to a file
with open('results.txt', 'w', encoding='utf-8') as outfile:
    outfile.write("\n".join(formatted_output_lines))

print("Wyniki zostały zapisane do pliku results.txt")
