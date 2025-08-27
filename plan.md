# Glosträning - English-Swedish Vocabulary App

En webapplikation för 10-åringar att träna engelsk-svensk ordförråd genom flashcards och typning.

## Översikt

**Målgrupp**: 10-åringar  
**Språk**: Engelsk-svensk ordträning med svenskt gränssnitt  
**Platform**: Webbaserad (statisk HTML/JS/CSS)  
**Tech Stack**: React + TypeScript + Vite  
**Datalagring**: LocalStorage + JSON-filer  

## Funktioner

### Kärnfunktioner
- **Veckoteman**: 10-20 ord per vecka i fördefinierade teman
- **Flashcard-träning**: Visa ord, användaren skriver översättning i textfält
- **Dubbelriktad träning**: Både engelska→svenska och svenska→engelska
- **Poängsystem**: Samla poäng för rätta svar
- **Märken**: Vecka Klar, Perfekt Poäng, Månads Mästare
- **Egen takt**: Ingen tidsgräns, självstudier

### Tekniska krav
- Fungerar offline efter första laddning
- Sparar framsteg i webbläsarens LocalStorage
- Responsiv design för surfplatta och dator
- Ingen inloggning eller användarhantering

## Projektstruktur

```
glosor/
├── public/
│   ├── data/
│   │   ├── vecka1.json
│   │   ├── vecka2.json
│   │   └── ...
│   └── index.html
├── src/
│   ├── components/
│   │   ├── WeekSelector.tsx
│   │   ├── FlashCard.tsx
│   │   ├── ScoreDisplay.tsx
│   │   ├── BadgeSystem.tsx
│   │   └── ProgressTracker.tsx
│   ├── hooks/
│   │   ├── useLocalStorage.ts
│   │   ├── useWordData.ts
│   │   └── useGameLogic.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── scoreCalculation.ts
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Utvecklingsuppgifter

### Fas 1: Grunduppsättning
1. **Projektinitiering**
   - Skapa React + TypeScript projekt med Vite
   - Konfigurera grundläggande projektstruktur
   - Sätta upp utvecklingsmiljö

2. **Datahantering**
   - Definiera TypeScript interfaces för ord, veckodata, användarframsteg
   - Skapa JSON-struktur för veckans ordförråd
   - Implementera LocalStorage för framstegslagring

3. **Kärnkomponenter**
   - **WeekSelector**: Visar tillgängliga veckor och slutförda veckor
   - **FlashCard**: Huvudkomponent för ordträning med textinmatning
   - **ScoreDisplay**: Visar poäng och framsteg
   - **BadgeSystem**: Hanterar och visar märken/prestationer
   - **ProgressTracker**: Spårar användares prestanda

### Fas 2: Spellogik
4. **Träningslogik**
   - Implementera dubbelriktad träning (engelska↔svenska)
   - Skapa poängsystem baserat på rätta svar
   - Hantera spelomgångar och övergångar mellan ord

5. **Framstegshantering**
   - Spara och ladda användarframsteg från LocalStorage
   - Implementera märkessystem (Vecka Klar, Perfekt Poäng, etc.)
   - Skapa logik för att markera slutförda veckor

### Fas 3: Användarupplevelse
6. **Styling och Design**
   - Skapa barnvänligt och färgglatt gränssnitt
   - Responsiv design för surfplatta och dator
   - Animationer och visuell feedback för rätt/fel svar

7. **Svenska gränssnittet**
   - Översätta alla UI-element till svenska
   - Implementera svenska instruktioner och meddelanden
   - Säkerställa korrekt hantering av svenska tecken (å, ä, ö)

### Fas 4: Kvalitetssäkring
8. **Testning och Optimering**
   - Manuell testning av alla funktioner
   - Validering av JSON-datafiler
   - Performance-optimering för snabb laddning

9. **Deployment och Distribution**
   - Konfigurera byggprocess för statisk hosting
   - Testa deployment på olika plattformar
   - Säkerställa offline-funktionalitet efter första laddning

### Utvidgningsmöjligheter

**Fas 2 funktioner**:
- Ljud för uttal
- Bilder för visuellt stöd
- Tidsbaserade utmaningar
- Föräldra/lärar-dashboard
- Export av framsteg
- Anpassade ordlistor
- Multiplayer-läge

## Testplan

1. **Manuell testning**:
   - Testa varje vecka från början till slut
   - Kontrollera att poäng sparas korrekt
   - Verifiera att märken tilldelas rätt
   - Testa på olika skärmstorlekar

2. **Data validation**:
   - Kontrollera att alla JSON-filer laddar korrekt
   - Testa med svenska tecken (å, ä, ö)
   - Verifiera LocalStorage-funktionalitet

3. **Performance**:
   - Testa laddningstider
   - Kontrollera minneanvändning i webbläsaren

## Utvecklingstid

**Estimerad tid**: 15-20 timmar fördelat på:
- Setup och grundstruktur: 2-3 timmar
- Komponenter och logik: 8-10 timmar  
- Styling och UX: 3-4 timmar
- Testning och bugfixar: 2-3 timmar

Detta projekt är perfekt för AI-assisterad utveckling med tydlig struktur och väldefinierade komponenter.