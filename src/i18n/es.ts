import type { ToolContent } from './types';

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Convertir XLS a XLSX en el navegador — sin subir archivos | runlocally',
    description:
      'Convierte un libro de Excel 97–2003 de .xls a .xlsx en el navegador. Conserva nombres de hojas y valores; no transfiere macros, gráficos, formularios, fórmulas ni formato.',
    ogTitle: 'Convertir XLS a XLSX en el navegador',
    ogDescription:
      'Crea un .xlsx nuevo con los nombres de las hojas y los valores de un libro .xls. El archivo se procesa en tu dispositivo.',
  },

  hero: {
    h1: 'Convertir XLS a XLSX',
    tagline:
      'Pasa un libro de Excel 97–2003 de .xls a .xlsx en el navegador. El archivo no se sube.',
  },

  intro: {
    h2: 'Pasar un libro XLS antiguo a XLSX',
    paras: [
      'El formato .xls guarda los libros de Excel como datos binarios BIFF. Esta herramienta lee el archivo con SheetJS, crea un libro OOXML nuevo con ExcelJS y lo entrega con la extensión .xlsx.',
      'La conversión se basa en valores: se copian los nombres de las hojas y los valores de las celdas. No se reproduce toda la estructura del original, por lo que las macros, fórmulas, formatos de celda, gráficos, formularios y otros objetos no pasan al archivo nuevo.',
    ],
  },

  privacy: {
    h2: 'El libro permanece en tu dispositivo',
    lead:
      'Tanto la lectura del archivo como la creación del XLSX se realizan con código que se ejecuta en el navegador:',
    points: [
      'El libro no se envía a un servicio de conversión.',
      'SheetJS lee en el dispositivo los datos XLS y su página de códigos.',
      'ExcelJS genera el XLSX nuevo dentro del navegador.',
      'El código fuente está publicado con licencia MIT.',
    ],
    note:
      'Puedes abrir el panel Red del navegador durante la conversión y comprobar que ninguna solicitud contiene el libro.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo convertir XLS a XLSX',
    steps: [
      {
        h3: 'Selecciona un libro XLS',
        p: 'Elige un archivo .xls o suéltalo en la página. También se acepta un .xlsx existente, aunque no necesita cambiar de formato.',
      },
      {
        h3: 'Espera mientras se copian los valores',
        p: 'La herramienta lee cada hoja y añade sus valores a un libro nuevo. Revisa el aviso sobre los elementos que no se transfieren.',
      },
      {
        h3: 'Descarga el XLSX',
        p: 'El archivo nuevo conserva el nombre base y usa la extensión .xlsx. El original no se sobrescribe.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi archivo de Excel?',
      a: 'No. El libro se lee y se vuelve a crear en el navegador. No hay una conversión en el servidor.',
    },
    {
      q: '¿Qué contenido se copia al XLSX?',
      a: 'Los nombres de las hojas y los valores de las celdas. En una celda con fórmula se copia el resultado guardado, si existe, pero no la fórmula.',
    },
    {
      q: '¿Qué se pierde durante la conversión?',
      a: 'No se trasladan macros, fórmulas, formatos de celda, gráficos, formularios, dibujos ni relaciones entre otros objetos del libro.',
    },
    {
      q: '¿Se conservan los textos japoneses de un XLS?',
      a: 'SheetJS lee la página de códigos de los libros XLS compatibles y devuelve el texto como Unicode. La prueba usa un libro BIFF con texto japonés y comprueba ese texto en el XLSX resultante.',
    },
    {
      q: '¿Puedo seleccionar un archivo XLSX?',
      a: 'Sí. La herramienta lo reconstruye como otra copia XLSX basada solo en valores. Si puedes usar el XLSX original, no hace falta convertirlo.',
    },
    {
      q: '¿Convierte archivos XLSM o conserva macros?',
      a: 'No. Los archivos .xlsm y la transferencia de macros quedan fuera del alcance de esta herramienta.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Cuando la PWA ya ha guardado los archivos de la página y las bibliotecas de conversión, puede convertir sin conexión de red.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que se ejecutan en tu dispositivo.',
    colophon:
      'Desarrollado y mantenido por Geppetto. Parte del código cuenta con ayuda de IA; la revisión y las decisiones corresponden al responsable del proyecto.',
    securityText: 'Seguridad',
  },
};
