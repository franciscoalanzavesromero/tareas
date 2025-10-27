import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";

export const exportTaskToWord = async (task) => {
  const safeTask = task || {};

  // Decodificar entidades HTML (&nbsp; &ndash; etc.)
  const decodeHtmlEntities = (str) => {
    if (!str) return "";
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  // Convertir texto con saltos de línea en párrafos y limpiar HTML
  const textToParagraphs = (text) => {
    if (!text) return [new Paragraph({ text: "No especificado", italics: true })];

    let cleanText = decodeHtmlEntities(text);
    cleanText = cleanText.replace(/<(div|p|br)[^>]*>/gi, "\n");
    cleanText = cleanText.replace(/<[^>]+>/g, "");

    const lines = cleanText.split("\n").filter(line => line.trim() !== "");
    
    if (lines.length === 0) {
      return [new Paragraph({ text: "No especificado", italics: true })];
    }

    return lines.map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 24, // tamaño 12pt
              preserveWhitespace: true,
            }),
          ],
          spacing: { after: 100 },
        })
    );
  };

  // Título de sección con línea separadora
  const sectionTitle = (text) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 32, color: "2E75B6" })],
      spacing: { after: 200 },
      border: {
        bottom: { color: "AAAAAA", style: BorderStyle.SINGLE, size: 3 },
      },
    });

  // Función para crear filas de tabla informativa
  const createInfoRow = (label, value) => {
    const displayValue = value && value.toString().trim() !== "" 
      ? value 
      : "No especificado";
    
    return new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({ 
                  text: label, 
                  bold: true, 
                  size: 24,
                  color: "2E75B6"
                })
              ],
            })
          ],
          width: { size: 35, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ text: displayValue, size: 24 })],
          width: { size: 65, type: WidthType.PERCENTAGE },
        }),
      ],
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Cabecera
          new Paragraph({
            children: [
              new TextRun({
                text: "Gestor de Proyectos",
                bold: true,
                size: 48,
                color: "1F4E79",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: safeTask["Nombre Tarea"] || "Tarea sin nombre",
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Información básica en tabla
          sectionTitle("Información de la Tarea"),
          
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            },
            rows: [
              createInfoRow("ID Proyecto", safeTask["ID Proyecto"]),
              createInfoRow("Nombre de Tarea", safeTask["Nombre Tarea"]),
              createInfoRow("Estado", safeTask["Estado"]),
              createInfoRow("Prioridad", safeTask["Prioridad"]),
              createInfoRow("Subtareas", safeTask["Subtareas"]),
              createInfoRow("Enlace", safeTask["Enlace"]),
              createInfoRow("Fecha de Exportación", new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })),
            ],
          }),

          // Espacio extra antes de las secciones detalladas
          new Paragraph({ text: "", spacing: { after: 400 } }),

          // Secciones detalladas
          ...["Descripción Detallada", "Requisitos", "Notas"].flatMap(
            (section) => [
              sectionTitle(section),
              ...textToParagraphs(safeTask[section]),
              new Paragraph({ text: "", spacing: { after: 200 } }),
            ]
          ),

          // Línea final separadora
          new Paragraph({
            border: {
              top: { color: "AAAAAA", style: BorderStyle.SINGLE, size: 3 },
            },
            spacing: { before: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Documento generado por el Gestor de Proyectos",
                italics: true,
                size: 20,
                color: "999999",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Exportado el ${new Date().toLocaleDateString()}`,
                italics: true,
                size: 18,
                color: "777777",
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  
  // Generar nombre de archivo más descriptivo
  const projectId = safeTask["ID Proyecto"]?.toString().trim() || "sin_id";
  const taskName = safeTask["Nombre Tarea"]?.toString().trim() || "sin_nombre";
  
  // Limpiar nombre de archivo para que sea válido
  const cleanFileName = `${projectId}_${taskName}`
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, "")
    .replace(/\s+/g, "_")
    .substring(0, 100); // Limitar longitud
    
  saveAs(blob, `${cleanFileName}.docx`);
};