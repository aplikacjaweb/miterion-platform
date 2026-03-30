import pandas as pd
import io

user_facilities = '''
Lp.,NIP,Nazwa placówki
1,7752649511,LuxMedica Żychlin
2,7282760492,Centrum medyczne Med.-Gastr Spółka z ograniczoną odpowiedzialnością Łódź
3,7691965895,Samodzielny Publiczny Zakład Opieki Zdrowotnej w Zelowie Zelów
4,7393957795,Gminny Ośrodek Zdrowia w Stawigudzie Stawiguda
5,8452003745,Gimed Andrzej Furmaniak Spółka komandytowa Giżycko
6,9840209770,Przychodnia Podstawowej Opieki Zdrowotnej „Medkam” Spółka Jawna Kamizela Janowo
7,9930651966,Mościckie Centrum Medyczne Sp. z o.o. Tarnów
8,9271507862,"""POSTĘP"" Spółka akcyjna Świebodzin"
9,9730832841,"Prywatna Praktyka Lekarska Katarzyna Błażejewska-Kunefał, Centrum Medyczne Kisielin Zielona Góra"
10,9271968215,"Centrum Medyczne ""Łużycka"" A. Wierzbicka, J. Porianda-Olesiak Spółka Jawna Świebodzin"
11,6871965577,Panaceum-Med Sp. z o.o. Pakoszówka
12,8131190643,"""Agamed"" Niepubliczny Zakład Opieki Zdrowotnej Agnieszka Bąk Krasne"
13,8132643816,Zespół Opieki Zdrowotnej nr 2 w Rzeszowie Sokołów Małopolski
14,8132643816,Zespół Opieki Zdrowotnej nr 2 w Rzeszowie Rzeszów
15,8132643816,Zespół Opieki Zdrowotnej nr 2 w Rzeszowie Świlcza
16,8151811976,KOALA.LA SP. z o.o. Łańcut
17,6861584767,Medycyna - Barbara i Zbigniew Wcisło S.J. Domaradz
18,7151949763,Niepubliczny Zakład Opieki Zdrowotnej „LEKARZ” Dariusz Chmiel Sp. z o.o. Radomyśl nad Sanem
19,6651703467,Ryszard Górniak Licheń Stary
20,7822318571,MED-POLONIA Sp. z o.o. Poznań
21,7781362255,"Katarzyna Domachowska, Renata Pużak, Lidia Steczko Poznań"
22,7121215157,Jacek Witold Woliński Lublin
23,7122681246,Niepubliczny Zakład Opieki Zdrowotnej „MAK-MED” Lekarze: Walicka i Partnerzy Lublin
24,9462727014,Fior-Romanek Spółka Jawna Chrzanów
25,7171581823,"spółka cywilna w składzie: Renata Goliszek, Piotr Pleszyński Karczmiska Drugie"
26,8461660804,Przychodnia Rodzinna sp. z o.o. Augustów
27,8461660804,Przychodnia Rodzinna sp. z o.o. Augustów
28,9910518715,"Przychodnia Rodzinna ""Dom Zdrowia"" Popielów"
29,6911287392,"Przychodnia Lekarska ""Medyk"" Andrzej Drabik Czerniewice"
30,8781571924,Samodzielny Publiczny Zakład Opieki Zdrowotnej w Dębowej Łące Dębowa Łąka
31,9561950790,Miejska Przychodnia Specjalistyczna w Toruniu Toruń
32,5542944444,Gabinet Lekarza Rodzinnego S. Jakubiński sp. j. Tryszczyn
33,6912021348,Gminny Ośrodek Zdrowia w Miłkowicach Miłkowice
34,9121328276,Fortmedica Medyczne Centrum Rodzinne Wrocław
35,8871648719,"""NZOZ BBS Przychodnia Lekarska"" Bednarczyk Henryk, Bednarczyk Bożena, Bury Zdzisława Ziębice"
36,9111678916,Samodzielny Zespół Publicznych Zakładów Opieki Zdrowotnej w Oleśnicy Boguszyce
37,5842413751,Centrum Medyczne Zaspa Sp. z o.o. Gdańsk
38,5911386076,Niepubliczny Ośrodek Zdrowia Bartosz Kotas Liniewo
39,6441449399,"Aneta Simka - Niepubliczny Zakład Opieki Zdrowotnej ""Sana"" w Pszczynie Brzeźce"
40,6342438955,Praktyka Lekarska LELEK sp.j. Katowice
41,6351832367,NZOZ Eskulap Beta Orzesze
42,5482128065,"Poradnia Lekarza Rodzinnego NZOZ B. Greń, D. Lewandowski s.c. Brenna"
43,5480075465,METUS Przychodnia Lekarska Sp. z o.o. Strumień
'''

user_df = pd.read_csv(io.StringIO(user_facilities))

try:
    full_df = pd.read_csv('podmioty.csv', delimiter=';', encoding='utf-8', on_bad_lines='warn', low_memory=False)
except Exception as e:
    print(f"Błąd odczytu pliku podmioty.csv: {e}")
    exit()

results = []

for index, row in user_df.iterrows():
    nip = str(row['NIP'])
    nazwa_placowki = row['Nazwa placówki']

    # Search for matching NIP and a similar name
    matches = full_df[
        (full_df['NIP'].astype(str) == nip) &
        (full_df['Nazwa'].fillna('').str.contains(nazwa_placowki, case=False, na=False))
    ]

    if not matches.empty:
        for idx, match_row in matches.iterrows():
            result = {
                'Lp.': row['Lp.'],
                'NIP': match_row['NIP'],
                'Nazwa placówki': match_row['Nazwa'],
                'Adres': f"{match_row['Ulica']} {match_row['Budynek']}, {match_row['Kod pocztowy']} {match_row['Miejscowość']}",
                'Telefon': match_row['Telefon'],
                'Email': match_row['Email'],
                'Strona WWW': match_row['Strona WWW']
            }
            results.append(result)
    else:
        results.append({
            'Lp.': row['Lp.'],
            'NIP': nip,
            'Nazwa placówki': nazwa_placowki,
            'Adres': 'Brak danych w bazie',
            'Telefon': 'Brak danych w bazie',
            'Email': 'Brak danych w bazie',
            'Strona WWW': 'Brak danych w bazie'
        })

formatted_results = []
for res in results:
    formatted_results.append(f"**Lp.: {res['Lp.']}**")
    formatted_results.append(f"**NIP:** {res['NIP']}")
    formatted_results.append(f"**Nazwa placówki:** {res['Nazwa placówki']}")
    formatted_results.append(f"**Adres:** {res['Adres']}")
    formatted_results.append(f"**Telefon:** {res['Telefon'].replace('NULL', 'Brak danych w bazie')}")
    formatted_results.append(f"**Email:** {res['Email'].replace('NULL', 'Brak danych w bazie')}")
    formatted_results.append(f"**Strona WWW:** {res['Strona WWW'].replace('NULL', 'Brak danych w bazie')}")
    formatted_results.append("---")

print("\n".join(formatted_results))
