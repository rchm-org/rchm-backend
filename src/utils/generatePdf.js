import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Helper to fetch image buffer from a URL
 */
const fetchImageBuffer = async (url) => {
    if (!url) return null;
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    } catch (err) {
        console.error("Failed to fetch image for PDF:", err);
        return null;
    }
};

/**
 * Generates a PDF receipt buffer for an admission application
 * @param {Object} admission The saved admission document
 * @returns {Promise<Buffer>} The generated PDF as a buffer
 */
export const generateAdmissionPDF = async (admission) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: "A4" });
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // --- Download Photo if available ---
            let photoBuffer = null;
            if (admission.documents?.photograph) {
                photoBuffer = await fetchImageBuffer(admission.documents.photograph);
            }

            // --- Header Region ---
            doc.rect(0, 0, doc.page.width, 100).fill("#0f172a"); // Dark slate background

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const logoPath = path.join(__dirname, "logo.png");

            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 20, { width: 60, height: 60 });
            }

            doc.fillColor("#ffffff")
                .fontSize(18).font("Helvetica-Bold")
                .text("Royal College of Hospitality & Management", 120, 32);

            doc.fontSize(11).font("Helvetica")
                .text("Official Application Receipt", 120, 56);

            // --- Reset Color ---
            doc.fillColor("#1e293b");

            // --- Photo Placeholder (Top Right) ---
            // We draw the photo below the header, aligned to the right.
            const photoX = doc.page.width - 150; // 50px right margin + 100px width
            const photoY = 130;
            const photoWidth = 100;
            const photoHeight = 120; // 5x6 aspect ratio approx

            if (photoBuffer) {
                // Draw image
                try {
                    doc.image(photoBuffer, photoX, photoY, {
                        fit: [photoWidth, photoHeight],
                        align: 'center',
                        valign: 'center'
                    });
                    // Draw a border around it
                    doc.rect(photoX, photoY, photoWidth, photoHeight).strokeColor("#cbd5e1").lineWidth(1).stroke();
                } catch (imgErr) {
                    console.error("PDF Image Error:", imgErr);
                    doc.rect(photoX, photoY, photoWidth, photoHeight).strokeColor("#cbd5e1").lineWidth(1).stroke();
                    doc.fontSize(10).text("Photo Error", photoX + 20, photoY + 50);
                }
            } else {
                // Placeholder
                doc.rect(photoX, photoY, photoWidth, photoHeight).strokeColor("#cbd5e1").lineWidth(1).stroke();
                doc.fontSize(10).fillColor("#94a3b8").text("No Photo\nProvided", photoX, photoY + 45, { width: photoWidth, align: "center" });
            }

            // --- Content Region (Left Side) ---
            doc.fillColor("#1e293b");
            const contentStartY = 130;
            doc.y = contentStartY;
            doc.x = 50;

            const addField = (label, value) => {
                doc.fillColor("#64748b").fontSize(10).font("Helvetica-Bold").text(label.toUpperCase());
                doc.moveDown(0.2);
                doc.fillColor("#0f172a").fontSize(12).font("Helvetica").text(value || "N/A");
                doc.moveDown(1);
            };

            doc.fontSize(16).font("Helvetica-Bold").fillColor("#0f172a").text("Applicant Details");
            doc.moveDown(1.5);

            addField("Application ID", admission.applicationId);
            addField("Date Submitted", new Date(admission.createdAt).toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
            }));
            addField("Full Name", admission.name);
            addField("Email Address", admission.email);
            addField("Phone Number", admission.phone);
            addField("Course Selected", admission.course);

            // --- Footer ---
            doc.moveDown(2);
            doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).strokeColor("#e2e8f0").stroke();
            doc.moveDown(1.5);

            doc.fontSize(10).font("Helvetica-Oblique").fillColor("#64748b")
                .text("This is an electronically generated receipt. " +
                    "Your application status is currently pending review. " +
                    "Our admissions team will contact you shortly.", { align: "center", width: doc.page.width - 100 });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
