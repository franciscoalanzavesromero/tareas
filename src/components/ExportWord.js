import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";

export const exportTaskToWord = async (task) => {
  const safeTask = task || {};

  // Función para convertir texto con saltos de línea en párrafos y limpiar HTML
  const textToParagraphs = (text) => {
    if (!text) return [new Paragraph("")];
    const cleanText = text.replace(/<[^>]+>/g, "");
    return cleanText.split("\n").map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
          spacing: { after: 100 },
        })
    );
  };

  // Función para crear título con línea separadora debajo
  const sectionTitle = (text) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 32, color: "2E75B6" })],
      spacing: { after: 100 },
      border: { bottom: { color: "AAAAAA", style: BorderStyle.SINGLE, size: 3 } },
    });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Cabecera
          new Paragraph({
            children: [new TextRun({ text: "Capgemini", bold: true, size: 48, color: "1F4E79" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${safeTask.DRS || ""} ${safeTask.Descripcion || ""}`, bold: true, size: 28 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),

          // Información básica
          sectionTitle("Información General"),
          ...[
            ["Nombre", safeTask.DRS || ""],
            ["Test", safeTask["Casos de prueba"] || ""],
            ["Fecha", new Date().toLocaleDateString()],
          ].map(
            ([label, value], index, arr) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `${label}: `, bold: true }),
                  new TextRun({ text: value }),
                ],
                // Mayor espacio después de la última línea (fecha)
                spacing: { after: index === arr.length - 1 ? 300 : 100 },
              })
          ),

          // Espacio extra antes de Detalles
          new Paragraph({ text: "" }),

          // Secciones: Detalles, Precondiciones, Comentarios, Capturas
          ...["Detalles", "Precondiciones", "Comentarios", "Capturas"].flatMap((section) => [
            sectionTitle(section),
            ...textToParagraphs(safeTask[section] || ""),
            new Paragraph({ text: "" }),
          ]),

          // Línea final separadora
          new Paragraph({
            border: { top: { color: "AAAAAA", style: BorderStyle.SINGLE, size: 3 } },
            spacing: { before: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Documento generado por Capgemini", italics: true, size: 20, color: "999999" }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  const fileName =
    (safeTask["Casos de prueba"] && safeTask["Casos de prueba"].toString().trim()) || "sin_nombre";

  saveAs(blob, `${fileName}.docx`);
};
