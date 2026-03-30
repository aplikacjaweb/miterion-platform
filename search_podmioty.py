import csv
import json
import os

extracted_facilities = [
  {
    "Lp.": "1",
    "NIP": "7752649511",
    "Nazwa placówki i miejscowość": "LuxMedica, Żychlin"
  },
  {
    "Lp.": "2",
    "NIP": "7282760492",
    "Nazwa placówki i miejscowość": "Centrum medyczne Med.-Gastr Sp. z o.o., Łódź"
  },
  {
    "Lp.": "3",
    "NIP": "7691965895",
    "Nazwa placówki i miejscowość": "Samodzielny Publiczny ZOZ w Zelowie, Zelów"
  },
  {
    "Lp.": "4",
    "NIP": "7393957795",
    "Nazwa placówki i miejscowość": "Gminny Ośrodek Zdrowia w Stawigudzie, Stawiguda"
  },
  {
    "Lp.": "5",
    "NIP": "8452003745",
    "Nazwa placówki i miejscowość": "Gimed Andrzej Furmaniak Sp. komandytowa, Giżycko"
  },
  {
    "Lp.": "6",
    "NIP": "9840209770",
    "Nazwa placówki i miejscowość": "Przychodnia POZ „Medkam” Sp. Jawna Kamizela, Janowo"
  },
  {
    "Lp.": "7",
    "NIP": "9930651966",
    "Nazwa placówki i miejscowość": "Mościckie Centrum Medyczne Sp. z o.o., Tarnów"
  },
  {
    "Lp.": "8",
    "NIP": "9271507862",
    "Nazwa placówki i miejscowość": "\"POSTĘP\" S.A., Świebodzin"
  },
  {
    "Lp.": "9",
    "NIP": "9730832841",
    "Nazwa placówki i miejscowość": "Prywatna Praktyka Lekarza K. Błażejewska-Kunefał, Centrum Medyczne Kisielin, Zielona Góra"
  },
  {
    "Lp.": "10",
    "NIP": "9271968215",
    "Nazwa placówki i miejscowość": "Centrum Medyczne \"Łużycka\" A. Wierzbicka, J. Porianda-Olesiak Sp. Jawna, Świebodzin"
  },
  {
    "Lp.": "11",
    "NIP": "6871965577",
    "Nazwa placówki i miejscowość": "Panaceum-Med Sp. z o.o., Pakoszówka"
  },
  {
    "Lp.": "12",
    "NIP": "8131190643",
    "Nazwa placówki i miejscowość": "\"Agamed\" NZOZ Agnieszka Bąk, Krasne"
  },
  {
    "Lp.": "13",
    "NIP": "8132643816",
    "Nazwa placówki i miejscowość": "Zespół Opieki Zdrowotnej nr 2 w Rzeszowie, Sokołów Małopolski"
  },
  {
    "Lp.": "14",
    "NIP": "8132643816",
    "Nazwa placówki i miejscowość": "Zespół Opieki Zdrowotnej nr 2 w Rzeszowie, Rzeszów"
  },
  {
    "Lp.": "15",
    "NIP": "8132643816",
    "Nazwa placówki i miejscowość": "Zespół Opieki Zdrowotnej nr 2 w Rzeszowie, Świlcza"
  },
  {
    "Lp.": "16",
    "NIP": "8151811976",
    "Nazwa placówki i miejscowość": "KOALA.LA SP. z o.o., Łańcut"
  },
  {
    "Lp.": "17",
    "NIP": "6861584767",
    "Nazwa placówki i miejscowość": "Medycyna - Barbara i Zbigniew Wcisło S.J., Domaradz"
  },
  {
    "Lp.": "18",
    "NIP": "7151949763",
    "Nazwa placówki i miejscowość": "NZOZ „LEKARZ” Dariusz Chmiel Sp. z o.o., Radomyśl nad Sanem"
  },
  {
    "Lp.": "19",
    "NIP": "6651703467",
    "Nazwa placówki i miejscowość": "Ryszard Górniak, Licheń Stary"
  },
  {
    "Lp.": "20",
    "NIP": "7822318571",
    "Nazwa placówki i miejscowość": "MED-POLONIA Sp. z o.o., Poznań"
  },
  {
    "Lp.": "21",
    "NIP": "7781362255",
    "Nazwa placówki i miejscowość": "Katarzyna Domachowska, Renata Pużak, Lidia Steczko, Poznań"
  },
  {
    "Lp.": "22",
    "NIP": "7121215157",
    "Nazwa placówki i miejscowość": "Jacek Witold Woliński, Lublin"
  },
  {
    "Lp.": "23",
    "NIP": "7122681246",
    "Nazwa placówki i miejscowość": "NZOZ „MAK-MED” Lekarze: Walicka i Partnerzy, Lublin"
  },
  {
    "Lp.": "24",
    "NIP": "9462727014",
    "Nazwa placówki i miejscowość": "Fior-Romanek Spółka Jawna, Chrzanów"
  },
  {
    "Lp.": "25",
    "NIP": "7171581823",
    "Nazwa placówki i miejscowość": "Spółka cywilna: Renata Goliszek, Piotr Pleszyński, Karczmiska Drugie"
  },
  {
    "Lp.": "26",
    "NIP": "8461660804",
    "Nazwa placówki i miejscowość": "Przychodnia Rodzinna Sp. z o.o., Augustów"
  },
  {
    "Lp.": "27",
    "NIP": "8461660804",
    "Nazwa placówki i miejscowość": "Przychodnia Rodzinna Sp. z o.o., Augustów"
  },
  {
    "Lp.": "28",
    "NIP": "9910518715",
    "Nazwa placówki i miejscowość": "Przychodnia Rodzinna \"Dom Zdrowia\", Popielów"
  },
  {
    "Lp.": "29",
    "NIP": "6911287392",
    "Nazwa placówki i miejscowość": "Przychodnia Lekarska \"Medyk\" Andrzej Drabik, Czerniewice"
  },
  {
    "Lp.": "30",
    "NIP": "8781571924",
    "Nazwa placówki i miejscowość": "Samodzielny Publiczny ZOZ w Dębowej Łące, Dębowa Łąka"
  },
  {
    "Lp.": "31",
    "NIP": "9561950790",
    "Nazwa placówki i miejscowość": "Miejska Przychodnia Specjalistyczna w Toruniu, Toruń"
  },
  {
    "Lp.": "32",
    "NIP": "5542944444",
    "Nazwa placówki i miejscowość": "Gabinet Lekarza Rodzinnego S. Jakubiński Sp. j., Tryszczyn"
  },
  {
    "Lp.": "33",
    "NIP": "6912021348",
    "Nazwa placówki i miejscowość": "Gminny Ośrodek Zdrowia w Miłkowicach, Miłkowice"
  },
  {
    "Lp.": "34",
    "NIP": "9121328276",
    "Nazwa placówki i miejscowość": "Fortmedica Medyczne Centrum Rodzinne, Wrocław"
  },
  {
    "Lp.": "35",
    "NIP": "8871648719",
    "Nazwa placówki i miejscowość": "\"NZOZ BBS Przychodnia Lekarska\" Bednarczyk H., Bednarczyk B., Bury Z., Ziębice"
  },
  {
    "Lp.": "36",
    "NIP": "9111678916",
    "Nazwa placówki i miejscowość": "Samodzielny Zespół Publicznych ZOZ w Oleśnicy, Boguszyce"
  },
  {
    "Lp.": "37",
    "NIP": "5842413751",
    "Nazwa placówki i miejscowość": "Centrum Medyczne Zaspa Sp. z o.o., Gdańsk"
  },
  {
    "Lp.": "38",
    "NIP": "5911386076",
    "Nazwa placówki i miejscowość": "Niepubliczny Ośrodek Zdrowia Bartosz Kotas, Liniewo"
  },
  {
    "Lp.": "39",
    "NIP": "6441449399",
    "Nazwa placówki i miejscowość": "Aneta Simka - NZOZ \"Sana\" w Pszczynie, Brzeźce"
  },
  {
    "Lp.": "40",
    "NIP": "6342438955",
    "Nazwa placówki i miejscowość": "Praktyka Lekarska LELEK Sp.j., Katowice"
  },
  {
    "Lp.": "41",
    "NIP": "6351832367",
    "Nazwa placówki i miejscowość": "NZOZ Eskulap Beta, Orzesze"
  },
  {
    "Lp.": "42",
    "NIP": "5482128065",
    "Nazwa placówki i miejscowość": "Poradnia Lekarza Rodzinnego NZOZ B. Greń, D. Lewandowski s.c., Brenna"
  },
  {
    "Lp.": "43",
    "NIP": "5480075465",
    "Nazwa placówki i miejscowość": "METUS Przychodnia Lekarska Sp. z o.o., Strumień"
  }
]

podmioty_csv_path = "podmioty.csv"
output_file_path = "wyniki_placowek.json"
results = []
matched_nips = set() 

nips_to_find = {f['NIP'] for f in extracted_facilities}

target_columns = [
    "NIP",
    "Nazwa podmiotu",
    "Miejscowość",
    "Ulica",
    "Budynek",
    "Telefon",
    "Email",
    "Strona WWW"
]

try:
    # Use a direct file open for podmioty.csv
    with open(podmioty_csv_path, 'r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file, delimiter=';')
        
        for row in reader:
            current_nip = row.get("NIP", "").strip('"')
            if current_nip in nips_to_find and current_nip not in matched_nips:
                matched_nips.add(current_nip)
                
                original_facility = next((f for f in extracted_facilities if f['NIP'] == current_nip), None)
                
                if original_facility:
                    result_entry = {
                        "Lp. z listy": original_facility["Lp."],
                        "Nazwa placówki z listy": original_facility["Nazwa placówki i miejscowość"]
                    }
                    for col in target_columns:
                        result_entry[col] = row.get(col, "").strip('"') 
                    results.append(result_entry)
except Exception as e:
    print(f"Error processing podmioty.csv: {e}")

try:
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"Successfully wrote {len(results)} matched entries to {output_file_path}")
except Exception as e:
    print(f"Error writing results to file: {e}")

print(json.dumps(results, indent=2, ensure_ascii=False))
