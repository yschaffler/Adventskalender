# 🎄 Adventskalender für Mama

Ein interaktiver Adventskalender mit Glücksrad, bei dem jeden Tag ein zufälliger Gutschein oder eine Challenge gewonnen werden kann.

## ✨ Features

- **Glücksrad** - Animiertes Drehrad mit Framer Motion
- **Zufälliger Preis-Pool** - Preise werden zufällig aus dem Pool ausgewählt
- **SQLite Datenbank** - Persistente Speicherung von Preisen und Gewinn-Historie
- **Datums-Validierung** - Türchen können nur am entsprechenden Dezember-Tag geöffnet werden
- **Gewinn-Historie** - Alle gewonnenen Preise mit Datum anzeigen
- **Docker-Unterstützung** - Einfaches Deployment auf eigenem Server

## 🚀 Schnellstart mit Docker

### Mit Docker Compose (empfohlen)

```bash
# Clone das Repository
git clone https://github.com/yschaffler/Adventskalender.git
cd Adventskalender

# Starte die Anwendung
docker compose up -d

# Die Anwendung ist nun unter http://localhost:3000 erreichbar
```

### Manuell mit Docker

```bash
# Build das Image
docker build -t adventskalender .

# Starte den Container
docker run -d -p 3000:3000 -v advent_data:/app/data adventskalender
```

## 🌐 Deployment mit nginx (adventskalender.yschaffler.de)

### Schritt 1: Repository auf Server clonen und starten

```bash
# Auf deinem Linux Server
cd /opt
git clone https://github.com/yschaffler/Adventskalender.git
cd Adventskalender

# Docker Container starten
docker compose up -d
```

### Schritt 2: SSL-Zertifikat erstellen (Let's Encrypt)

```bash
# Certbot installieren (falls noch nicht vorhanden)
sudo apt install certbot python3-certbot-nginx

# Zertifikat erstellen
sudo certbot certonly --nginx -d adventskalender.yschaffler.de
```

### Schritt 3: nginx konfigurieren

```bash
# Konfiguration kopieren
sudo cp nginx.conf.example /etc/nginx/sites-available/adventskalender

# Domain in Konfiguration anpassen (falls nötig)
sudo nano /etc/nginx/sites-available/adventskalender

# Aktivieren
sudo ln -s /etc/nginx/sites-available/adventskalender /etc/nginx/sites-enabled/

# nginx neu laden
sudo nginx -t && sudo systemctl reload nginx
```

Die Seite ist nun unter `https://adventskalender.yschaffler.de` erreichbar!

### Schritt 4: QR-Codes erstellen

Erstelle QR-Codes die zu diesen URLs verlinken:
- Tag 1: `https://adventskalender.yschaffler.de/day/1`
- Tag 2: `https://adventskalender.yschaffler.de/day/2`
- usw.

## 🛠️ Lokale Entwicklung

```bash
# Dependencies installieren
npm install --legacy-peer-deps

# Entwicklungsserver starten
npm run dev
```

## 📁 Projektstruktur

```
├── app/
│   ├── api/
│   │   ├── history/      # GET Gewinn-Historie
│   │   ├── prizes/       # GET/POST/DELETE Preise verwalten
│   │   └── spin/         # GET Status / POST Drehen
│   ├── components/       # UI-Komponenten
│   ├── day/[id]/         # Tages-Seite (QR-Code Ziel)
│   ├── history/          # Gewinn-Übersicht
│   └── lib/
│       ├── db.ts         # SQLite Datenbank
│       └── prizes.ts     # Prize Interface
├── data/                 # SQLite Datenbank (gitignored)
├── nginx.conf.example    # nginx Beispiel-Konfiguration
├── Dockerfile
└── docker-compose.yml
```

## 🎁 Preise anpassen

Die initialen Preise werden beim ersten Start in `app/lib/db.ts` definiert. Um neue Preise hinzuzufügen, kannst du die API verwenden:

```bash
# Neuen Preis hinzufügen
curl -X POST https://adventskalender.yschaffler.de/api/prizes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "voucher",
    "title": "Spa-Tag",
    "description": "Ein entspannender Tag im Spa!",
    "emoji": "💆",
    "color": "#E6E6FA"
  }'

# Alle Preise anzeigen
curl https://adventskalender.yschaffler.de/api/prizes
```

## 📱 QR-Codes

Erstelle QR-Codes für jeden Tag, die zu `/day/1`, `/day/2`, etc. verlinken.

Beispiel für Tag 5: `https://adventskalender.yschaffler.de/day/5`

## 🧪 Demo-Modus

Füge `?demo=true` zur URL hinzu, um die Datums-Validierung zu umgehen:
`https://adventskalender.yschaffler.de/day/5?demo=true`

## 📜 API Endpunkte

| Endpunkt | Methode | Beschreibung |
|----------|---------|--------------|
| `/api/prizes` | GET | Alle Preise + Stats |
| `/api/prizes?available=true` | GET | Nur verfügbare Preise |
| `/api/prizes` | POST | Neuen Preis hinzufügen |
| `/api/prizes?id=1` | DELETE | Preis löschen (nur wenn noch nicht gewonnen) |
| `/api/history` | GET | Gewinn-Historie |
| `/api/spin?day=5` | GET | Prüfen ob Tag spielbar |
| `/api/spin` | POST | Drehen und Preis gewinnen |

## 🐳 Docker Volume

Die SQLite-Datenbank wird im Docker Volume `advent_data` gespeichert. Dieses Volume bleibt auch nach Container-Updates erhalten.

```bash
# Backup der Datenbank
docker cp $(docker ps -q -f ancestor=adventskalender):/app/data/advent.db ./backup.db

# Datenbank wiederherstellen
docker cp ./backup.db $(docker ps -q -f ancestor=adventskalender):/app/data/advent.db
```

## 🔄 Updates

```bash
cd /opt/Adventskalender
git pull
docker compose down
docker compose up -d --build
```
