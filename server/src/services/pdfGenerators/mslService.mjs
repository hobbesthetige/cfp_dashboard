import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import CustomPDFDocument from "./CustomPDFDocument.mjs";
import { getFilteredEventLogs } from "../../models/eventLog.mjs";
import { getPDFNamespace } from "../../sockets/socketNamespaces.mjs";
import { updateGeneratedPdf } from "../../models/generatedPdfs.mjs";

// Utility to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Letter 612x792
const docSize = { width: 612, height: 792 };
const borderMargin = 20;
const border = {
  x: borderMargin,
  y: borderMargin * 3,
  width: docSize.width - borderMargin,
  height: docSize.height - borderMargin * 4,
};
const columnWidthPercentages = [0.2, 0.125, 0.125, 0.55];
let currentPage = 1;
let floatingY = border.y + 70;

async function generatePDF(docId, settings) {
  const { start, end, categories, logLevels, includeSystemEvents } = settings;
  const events = await getFilteredEventLogs(
    start,
    end,
    categories,
    logLevels,
    includeSystemEvents,
    1
  );
  let namespace = getPDFNamespace();
  namespace.emit("pdfGenerationStarted", docId);
  try {
    const filepath = await createDocument(docId, settings, events);
    await updateGeneratedPdf(docId, { status: "complete", filepath });
    namespace.emit("pdfGenerationComplete", docId);
  } catch (error) {
    console.error("Error creating PDF: ", error);
    await updateGeneratedPdf(docId, { status: "error", error });
    namespace.emit("pdfGenerationError", docId, error);
  }
}

async function createDocument(docId, settings, events) {
  const filename = `../../files/output/MSL_${docId}.pdf`;
  const filePath = path.join(__dirname, filename);
  const doc = new CustomPDFDocument();

  // Event listener for new pages
  doc.on("pageAdded", () => {
    currentPage++;
    drawPageOutline(doc, doc.pageNumber, settings);
    floatingY = border.y + 70;
  });

  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  drawPageOutline(doc, 1, settings);
  drawEvents(doc, events, settings.includeLogLevel);

  doc.end();
  return await new Promise((resolve, reject) => {
    writeStream.on("finish", () => {
      console.log(`PDF written to ${filePath}`);
      resolve(filePath);
    });
    writeStream.on("error", (error) => {
      reject(error);
    });
  });
}

function drawPageOutline(doc, pageNumber, settings) {
  drawPageBorder(doc, border);
  const pageNumberFrame = {
    x: border.x + border.width - 50,
    y: border.y - 10,
    width: 50,
    height: 10,
  };
  drawPageNumber(doc, pageNumber, pageNumberFrame);
  const mslTitleFrame = {
    x: border.x,
    y: border.y,
    width: 300,
    height: 50,
  };
  drawMSLTitle(doc, mslTitleFrame);
  const facilityFrame = {
    x: mslTitleFrame.x + mslTitleFrame.width,
    y: border.y,
    width: 75,
    height: 50,
  };
  drawFacility(doc, facilityFrame, settings.facilityName || "Default");
  const documentDateFrame = {
    x: facilityFrame.x + facilityFrame.width,
    y: border.y,
    width: border.width - facilityFrame.width - mslTitleFrame.width - border.x,
    height: 50,
  };
  const { startDate, endDate } = settings;
  drawDocumentDate(
    doc,
    documentDateFrame,
    startDate || new Date().toISOString(),
    endDate || new Date().toISOString()
  );
  const columnHeadersFrame = {
    x: border.x,
    y: border.y + 50,
    width: border.width - border.x,
    height: 20,
  };
  const columnHeaders = ["CHANNEL", "ZULU TIME", "OP INIT", "ACTION/EVENT"];
  drawColumnHeaders(
    doc,
    columnHeadersFrame,
    columnHeaders,
    columnWidthPercentages
  );
}

function drawPageBorder(doc, border) {
  doc.rect(border.x, border.y, border.width, border.height).stroke();
}

function drawPageNumber(doc, pageNumber, frame) {
  doc.fontSize(8).text(`PAGE ${pageNumber}`, frame.x, frame.y);
}

function drawMSLTitle(doc, frame) {
  const text = "MASTER STATION LOG";
  const textOptions = { width: frame.width, align: "center" };
  const textHeight = doc.heightOfString(text, textOptions);
  const textY = frame.y + (frame.height - textHeight) / 2;
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(text, frame.x, textY, textOptions);
  doc.rect(frame.x, frame.y, frame.width, frame.height).stroke();
  doc.font("Helvetica");
}

function drawFacility(doc, frame, facilityName) {
  doc
    .boldFont()
    .fontSize(8)
    .text("FACILITY", frame.x + 2, frame.y + 2, {
      width: frame.width - 4,
      align: "left",
    });
  doc.moveDown();
  doc.regularFont().text(facilityName, frame.x + 2, doc.y, {
    width: frame.width,
    align: "left",
  });
  doc.rect(frame.x, frame.y, frame.width, frame.height).stroke();
}

function drawDocumentDate(doc, frame, startDateString, endDateString) {
  const startDate = formatTimestampInLocalandZulu(startDateString);
  const endDate = formatTimestampInLocalandZulu(endDateString);
  doc
    .boldFont()
    .fontSize(8)
    .text("DATE", frame.x + 2, frame.y + 2, {
      width: frame.width - 4,
      align: "left",
    });
  doc.moveDown();
  doc
    .regularFont()
    .text(`FROM: ${startDate}`, { width: frame.width, align: "left" });
  doc.moveDown(0.5);
  doc.text(`TO: ${endDate}`, { width: frame.width, align: "left" });
  doc.rect(frame.x, frame.y, frame.width, frame.height).stroke();
}

function drawColumnHeaders(doc, frame, headers, columnWidthPercentages) {
  let floatingX = frame.x;
  headers.forEach((header, index) => {
    const width = columnWidthPercentages[index] * frame.width;
    const textOptions = { width: frame.width, align: "center" };
    const textHeight = doc.heightOfString(header, textOptions);
    const textY = frame.y + (frame.height - textHeight) / 2;
    doc.boldFont().fontSize(8).text(header, floatingX, textY, {
      width: width,
      align: "center",
    });
    doc.rect(floatingX, frame.y, width, frame.height).stroke();
    floatingX += width;
  });
}

function drawEvents(doc, events, includeLogLevel = false) {
  let floatingX = border.x;
  let floatingY = border.y + 70;

  // doc.moveTo(floatingX, floatingY);
  events.forEach((event) => {
    let message = event.title
      ? `${event.title.trim()} - ${event.message.trim()}`
      : event.message.trim();

    if (includeLogLevel) {
      message = `*${event.level}* ${message}`;
    }

    const eventColumns = [
      event.category,
      formatTimestampInLocalandZulu(event.timestamp),
      event.author,
      message.trim(),
    ];

    // Calculate the height needed for the event
    let maxHeight = 0;
    eventColumns.forEach((header, index) => {
      const width = columnWidthPercentages[index] * border.width - 4;
      const textOptions = {
        width: width,
        align: "left",
      };
      const textHeight = doc.heightOfString(header, textOptions);
      maxHeight = Math.max(maxHeight, textHeight);
    });

    // Check if the event fits in the remaining space on the current page
    const remainingHeight = border.y + border.height - doc.y;
    console.log("Remaining height: ", remainingHeight, maxHeight);
    if (maxHeight > remainingHeight) {
      console.log("Adding page");
      doc.addPage();
      floatingX = border.x;
      floatingY = border.y + 70;
      doc.moveTo(floatingX, floatingY);
    }

    // Draw the event
    eventColumns.forEach((header, index) => {
      const width = columnWidthPercentages[index] * border.width - 4;
      const textOptions = {
        width: width - 8,
        height: maxHeight,
        align: "left",
        // continued: true,
      };
      doc
        .regularFont()
        .fontSize(8)
        .text(header, floatingX + 4, floatingY + 4, textOptions);
      floatingX += width;
    });

    // Move to the next line
    doc.moveDown(maxHeight / doc.currentLineHeight());
    floatingX = border.x;
    floatingY = doc.y;
  });
}

function formatTimestampInLocalandZulu(timestamp) {
  const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
  const formattedLocalDate = new Intl.DateTimeFormat(
    "en-GB",
    dateOptions
  ).format(new Date(timestamp));
  const zuluTime = new Date(timestamp).toISOString().slice(11, 16) + " Zulu";

  const combinedText = `${formattedLocalDate} ${zuluTime}`;
  return combinedText;
}

export { generatePDF };
