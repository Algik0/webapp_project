// Wetter-Komponente: Holt Wetterdaten und zeigt ein passendes Zitat an
import React, { useEffect, useState } from "react";

// Typen für Wetterdaten
type WeatherData = {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
};

// Zitate je nach Wetterlage
const weatherQuotes: Record<string, string[]> = {
  sonnig: [
    "Heute brauchst du Sonnencreme statt Sorgen!",
    "So viel Sonne – dein Vitamin-D-Konto jubelt!",
    "Wenn das Wetter ein Emoji wäre: 😎",
    "Sonnenschein im Kopf macht das Lernen leichter.",
    "Mit jedem Sonnenstrahl wächst auch mein Wissen",
    "Lernen bei Sonnenschein – Vitamin D für den Geist.",
    "Die Sonne scheint, der Lernstoff auch.",
    "Sonnenklar: Heute wird gelernt!",
    "Lernen ist wie Sonnenbaden für den Verstand.",
    "Mit der Sonne um die Wette lernen.",
    "Sonnige Gedanken führen zu hellen Ideen.",
    "Die Sonne motiviert – auch zum Lernen.",
    "Strahlender Himmel, strahlender Schüler.",
    "Nutze das Licht des Tages, um deinen Geist zu erhellen.",
    "Heute ist der perfekte Tag, um zu wachsen – genau wie die Sonnenblumen.",
    "Strahle wie die Sonne – mit Wissen im Herzen.",
    "Die Sonne scheint – genau wie deine Chancen",
    "Heute ist ein Tag zum Aufblühen – im Kopf wie im Leben.",
    "Lernen bei Sonnenschein? Erfolg kommt gratis dazu",
    "Deine Zukunft ist so hell wie der Himmel heute",
    "Ein klarer Himmel – ein klarer Plan.",
    "Mit Sonnenkraft durchstarten – auch beim Lernen.",
    "Wenn die Sonne scheint, scheint auch dein Potenzial.",
  ],
  regen: [
    "Nicht vergessen: Enten lieben dieses Wetter!",
    "Heute: gratis Dusche vom Himmel.",
    "Ein perfekter Tag für Gummistiefel und schlechte Frisuren.",
    "Regenwetter – perfekte Zeit, um Wissen zu säen",
    "Jeder Tropfen inspiriert einen neuen Gedanken",
    "Lernen im Regen – Gedanken fließen besser.",
    "Regentage sind Lerntage",
    "Mit jedem Regentropfen wächst mein Wissen.",
    "Regen bringt Ruhe – ideal zum Lernen",
    "Plitsch, platsch – Wissen macht nass.",
    "Regenzeit ist Denkzeit.",
    "Lernen im Takt des Regens.",
    "Regen draußen, Wissen drinnen.",
    "Lass den Regen dein Antrieb sein – heute wächst du.",
    "Auch im Regen sprießen die stärksten Ideen.",
    "Jeder Regentag bringt frisches Denken.",
    "Regen ist nur der Applaus des Himmels für deine Mühe.",
    "Nass macht klug – wenn du heute lernst, wächst du morgen.",
    "Ohne Regen kein Regenbogen – ohne Lernen kein Erfolg.",
    "Nutze Regentage, um deine Ziele zu gießen.",
    "Wenn draußen alles grau ist, machs dir im Kopf bunt",
    "Tropfen für Tropfen wächst dein Wissen.",
    "Es regnet? Zeit, innerlich zu leuchten!",
  ],
  schnee: [
    "Schnee? Zeit für Kakao und Wollsocken!",
    "Winterwunderland oder Verkehrsalbtraum? Du entscheidest.",
    "Wenn die Welt wie Puderzucker aussieht – willkommen im Schneekoma!",
    "Schnee bedeckt die Welt, Wissen deckt den Geist",
    "Jede Schneeflocke ein neuer Gedanke",
    "Lernen im Schneegestöber – klarer Kopf garantiert.",
    "Schneeflocken tanzen, Gedanken fliegen.",
    "Kalter Schnee, heißer Lernwille",
    "Im Schnee lernen – cool bleiben!",
    "Schneezeit ist Lesezeit",
    "Weiße Landschaft, bunte Gedanken",
    "Lernen mit Schneeflocken im Haar.",
    "Schnee draußen, Wissen drinnen.",
    "Bleib cool – auch beim Lernen.",
    "Schnee deckt zu, aber dein Ehrgeiz bricht durch",
    "Kalter Wind, heißer Wille.",
    "Jede Schneeflocke einzigartig – wie dein Weg zum Ziel.",
    "Wenns draußen still ist, kann dein Verstand laut werden.",
    "Klarheit wie Winterluft – nutze sie zum Denken.",
    "Lernen ist wie Schneefall – leise, aber wirkungsvoll.",
    "Der Schnee hält dich nicht auf – er spornt dich an",
    "Winter ist kein Grund zu ruhn – sondern zu reifen.",
    "Die Kälte draußen stärkt den Fokus drinnen.",
  ],
  bewölkt: [
    "Die Sonne macht heute Homeoffice.",
    "Wolkig mit Aussicht auf Couch.",
    "Heute brauchst du dein inneres Licht – draußen ist keins.",
    "Wolken am Himmel, Klarheit im Kopf.",
    "Grauer Himmel, bunte Gedanken",
    "Bewölkt draußen, erleuchtet drinnen",
    "Wolken ziehen, Wissen bleibt",
    "Unter Wolken lernt es sich besser.",
    "Wolkenverhangen, aber lernbereit.",
    "Graue Tage, helle Ideen.",
    "Wolken am Himmel, Sonne im Geist.",
    "Bewölkt? Zeit zum Lernen!",
    "Wolken ziehen vorbei, Wissen bleibt",
    "Wolken sind keine Ausrede – sondern dein Trainingslager",
    "Auch hinter Wolken kann dein Ziel leuchten.",
    "Heute ist ein Tag, um innerlich zu glänzen.",
    "Wenns draußen grau ist, schreib Geschichte in Farbe",
    "Nutze die Ruhe der Wolken für große Pläne.",
    "Dein Kopf ist heller als der Himmel.",
    "Wolken schieben – Motivation ziehen.",
    "Du brauchst keinen Sonnenschein, um zu glänzen.",
    "Auch an grauen Tagen ist Lernen Gold wert.",
    "Mach aus Grau ein Meisterwerk.",
  ],
  nebel: [
    "Wenn du dein Haus findest, hast du gewonnen.",
    "Mysteriöses Wetter für Detektive und Geisterjäger!",
    "Heute brauchst du eher ein Radar als eine Sonnenbrille.",
    "Nebel draußen, Klarheit drinnen.",
    "Im Nebel lernen – Fokus finden.",
    "Nebel verhüllt, Wissen enthüllt.",
    "Durch den Nebel zum Wissen.",
    "Nebelige Sicht, klare Gedanken.",
    "Lernen im Nebel – Konzentration pur.",
    "Nebel draußen, Erleuchtung drinnen.",
    "Im Nebel des Wissens",
    "Nebelzeit ist Denkzeit.",
    "Nebel verschwindet, Wissen bleibt.",
    "Auch wenn du das Ziel nicht siehst – jeder Schritt zählt.",
    "Im Nebel beginnt oft der Weg zum Erfolg.",
    "Unklarheit heißt: Du bist auf dem Weg",
    "Nebel ist der perfekte Moment für Fokus.",
    "Wenn die Sicht verschwimmt, schärfe deinen Verstand",
    "Stille im Außen – Klarheit im Inneren",
    "Dein Wille bringt dich durch jeden Nebel.",
    "Vertrau deinem Kompass – deinem Ziel entgegen",
    "Im Nebel suchen – heißt Neues finden.",
    "Du siehst es noch nicht, aber du kommst an.",
  ],
  windig: [
    "Heute wird dir selbst die Frisur davonfliegen.",
    "Flieg nicht weg! (Oder tu's!)",
    "Gratis Windkanal für alle!",
    "Wind im Haar, Wissen im Kopf.",
    "Frischer Wind bringt neue Ideen.",
    "Mit dem Wind des Wissens segeln.",
    "Windige Tage, klare Gedanken.",
    "Lernen mit Rückenwind.",
    "Der Wind trägt meine Gedanken.",
    "Stürmisches Wetter, ruhiger Geist.",
    "Wind draußen, Fokus drinnen.",
    "Mit dem Wind des Wissens fliegen.",
    "Windige Zeiten, stabile Ideen.",
    "Lass den Wind dich tragen – aber du bestimmst die Richtung.",
    "Gegenwind? Zeit, stärker zu werden.",
    "Wo Wind weht, tanzen die Gedanken.",
    "Du bist der Kapitän deines Lernschiffs.",
    "Wissen ist wie Wind im Segel.",
    "Stürmisch draußen, standhaft drinnen.",
    "Wind macht wach – nutz ihn.",
    "Lass den Wind dein Feuer schüren.",
    "Heute bringt der Wind neue Möglichkeiten.",
    "Mit Rückenwind und Willen ist alles möglich.",
  ],
};

function getFunnyQuote(conditionText: string): string {
  const text = conditionText.toLowerCase();

  if (text.includes("sonnig") || text.includes("klar"))
    return randomQuote("sonnig");
  if (text.includes("regen") || text.includes("nass"))
    return randomQuote("regen");
  if (text.includes("schnee")) return randomQuote("schnee");
  if (text.includes("wolke") || text.includes("bewölkt"))
    return randomQuote("bewölkt");
  if (text.includes("nebel")) return randomQuote("nebel");
  if (text.includes("wind")) return randomQuote("windig");

  return "Wetter unklar – aber du bleibst cool!";
}

function randomQuote(category: string): string {
  const list = weatherQuotes[category];
  return list[Math.floor(Math.random() * list.length)];
}

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null); // Wetterdaten
  const [loading, setLoading] = useState(true); // Ladezustand
  const [error, setError] = useState<string | null>(null); // Fehlerzustand
  const [quote, setQuote] = useState<string>(""); // Motivationsspruch

  const apiKey = "9c5b3c9d317e4680871143322250405";
  const city = "Mannheim";
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=de`;

  // Hole Wetterdaten beim Laden der Komponente
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Abrufen der Wetterdaten.");
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [apiUrl]);

  // Wähle ein passendes Zitat, wenn Wetterdaten geladen sind
  useEffect(() => {
    if (weather) {
      setQuote(getFunnyQuote(weather.current.condition.text));
    }
  }, [weather]);

  // Zeige Ladezustand, Fehler oder Wetterdaten mit Spruch
  if (loading) return <div>Wetter wird geladen...</div>;
  if (error) return <div>Fehler: {error}</div>;
  if (!weather) return null;

  return (
    <div className="weather-container">
      <h1>Aktuelles Wetter</h1>

      {error ? (
        <p>{error}</p>
      ) : weather ? (
        <div className="weather-content">
          <p>
            {weather.location.name}, {weather.location.country}
          </p>
          <p>{weather.location.localtime}</p>
          <p>
            {weather.current.temp_c}°C{" "}
            <img
              src={`https:${weather.current.condition.icon}`}
              alt={weather.current.condition.text}
            />
          </p>
          <div className="quote">💬 {quote}</div>
        </div>
      </div>
    </div>
  );
}
