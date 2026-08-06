import type { ToolContent } from './types';

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'XLS in XLSX umwandeln — im Browser, ohne Upload | runlocally',
    description:
      'Eine Excel-97–2003-Datei im Browser von .xls in .xlsx umwandeln. Blattnamen und Zellwerte werden übertragen; Makros, Diagramme, Formulare, Formeln und Formatierungen nicht.',
    ogTitle: 'XLS im Browser in XLSX umwandeln',
    ogDescription:
      'Blattnamen und Zellwerte einer .xls-Arbeitsmappe in eine neue .xlsx-Datei schreiben. Die Datei bleibt auf dem Gerät.',
  },

  hero: {
    h1: 'XLS in XLSX umwandeln',
    tagline:
      'Eine Excel-97–2003-Arbeitsmappe im Browser von .xls in .xlsx umwandeln. Kein Upload.',
  },

  intro: {
    h2: 'Eine ältere XLS-Arbeitsmappe als XLSX speichern',
    paras: [
      'Das .xls-Format speichert Excel-Arbeitsmappen im binären BIFF-Format. Dieses Werkzeug liest die Datei mit SheetJS, legt mit ExcelJS eine neue OOXML-Arbeitsmappe an und gibt sie als .xlsx aus.',
      'Übertragen werden die Blattnamen und Zellwerte. Die ursprüngliche Arbeitsmappe wird nicht vollständig nachgebildet: Makros, Formeln, Zellformatierungen, Diagramme, Formulare und andere Arbeitsmappenobjekte fehlen in der neuen Datei.',
    ],
  },

  privacy: {
    h2: 'Die Arbeitsmappe bleibt auf deinem Gerät',
    lead:
      'Sowohl das Lesen der Eingabe als auch das Schreiben der XLSX-Datei findet im Browser statt:',
    points: [
      'Die Arbeitsmappe wird nicht an einen Konvertierungsdienst gesendet.',
      'SheetJS liest die XLS-Daten und die Codepage lokal.',
      'ExcelJS erstellt die neue XLSX-Datei im Browser.',
      'Der Quellcode ist unter der MIT-Lizenz einsehbar.',
    ],
    note:
      'Im Netzwerk-Panel des Browsers lässt sich während der Umwandlung prüfen, dass keine Anfrage die Arbeitsmappe enthält.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So wird XLS in XLSX umgewandelt',
    steps: [
      {
        h3: 'Eine XLS-Datei auswählen',
        p: 'Wähle eine .xls-Datei oder lege sie auf der Seite ab. Eine vorhandene .xlsx-Datei wird ebenfalls angenommen, benötigt aber keine Formatumwandlung.',
      },
      {
        h3: 'Zellwerte übertragen lassen',
        p: 'Das Werkzeug liest jedes Tabellenblatt und fügt dessen Zellwerte in eine neue Arbeitsmappe ein. Beachte den Hinweis zu den nicht übernommenen Inhalten.',
      },
      {
        h3: 'XLSX herunterladen',
        p: 'Die neue Datei erhält den ursprünglichen Basisnamen mit der Endung .xlsx. Die Eingabedatei wird nicht überschrieben.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wird meine Excel-Datei hochgeladen?',
      a: 'Nein. Die Arbeitsmappe wird im Browser gelesen und neu aufgebaut. Es gibt keinen serverseitigen Konvertierungsschritt.',
    },
    {
      q: 'Welche Inhalte werden in die XLSX-Datei übernommen?',
      a: 'Blattnamen und Zellwerte. Bei einer Formel wird das gespeicherte Ergebnis übernommen, sofern es vorhanden ist; die Formel selbst wird nicht übertragen.',
    },
    {
      q: 'Welche Inhalte gehen bei der Umwandlung verloren?',
      a: 'Makros, Formeln, Zellformatierungen, Diagramme, Formulare, Zeichnungsobjekte und Verknüpfungen zwischen Arbeitsmappenobjekten werden nicht in die neue Datei geschrieben.',
    },
    {
      q: 'Bleiben japanische Zeichen aus einer XLS-Datei erhalten?',
      a: 'SheetJS liest die Codepage unterstützter XLS-Arbeitsmappen und liefert Text als Unicode. Die Testdatei enthält japanischen Text in einer BIFF-Arbeitsmappe, der auch in der XLSX-Ausgabe geprüft wird.',
    },
    {
      q: 'Kann ich eine XLSX-Datei auswählen?',
      a: 'Ja. Sie wird als wertebasierte XLSX-Kopie neu aufgebaut. Wenn die vorhandene XLSX-Datei direkt genutzt werden kann, ist dieser Schritt nicht erforderlich.',
    },
    {
      q: 'Werden XLSM-Dateien oder Makros unterstützt?',
      a: 'Nein. XLSM-Eingaben und die Übernahme von Makros gehören nicht zum Funktionsumfang.',
    },
    {
      q: 'Funktioniert die Umwandlung offline?',
      a: 'Nachdem die PWA die Seitendateien und Konvertierungsbibliotheken zwischengespeichert hat, kann sie ohne Netzwerkverbindung arbeiten.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Werkzeuge, die lokal auf deinem Gerät laufen.',
    colophon:
      'Entwickelt und gepflegt von Geppetto. Bei Teilen des Codes kommt KI-Unterstützung zum Einsatz; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },

  related: {
    h2: 'Ähnliche Tools',
    blogLinkText: 'Technische Hintergründe lesen',
  },
};
