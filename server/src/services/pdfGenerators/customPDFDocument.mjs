import PDFDocument from "pdfkit";

class CustomPDFDocument extends PDFDocument {
  constructor(options) {
    super(options);
  }

  boldFont() {
    return this.font("Helvetica-Bold");
  }

  regularFont() {
    return this.font("Helvetica");
  }

  textWithBold(doc, text, boldText, x, y) {
    const textParts = text.split(boldText);
    return this.text(textParts[0], x, y)
      .font("Helvetica-Bold")
      .text(boldText, { continued: true })
      .font("Helvetica")
      .text(textParts[1]);
  }
}

export default CustomPDFDocument;
