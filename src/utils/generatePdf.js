import PDFDocument from "pdfkit";

/**
 * Generates a PDF receipt buffer for an admission application
 * @param {Object} admission The saved admission document
 * @returns {Promise<Buffer>} The generated PDF as a buffer
 */
export const generateAdmissionPDF = (admission) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            doc.on("data", buffers.push.bind(buffers));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", reject);

            // Header
            doc.fontSize(20).font("Helvetica-Bold")
                .text("Royal College of Hospitality & Management", { align: "center" });
            doc.moveDown(0.5);
            doc.fontSize(14).font("Helvetica")
                .text("Application Receipt", { align: "center" });
            doc.moveDown(2);

            // Content
            doc.fontSize(12);

            const addField = (label, value) => {
                doc.font("Helvetica-Bold").text(`${label}: `, { continued: true })
                    .font("Helvetica").text(value || "N/A");
                doc.moveDown(0.5);
            };

            addField("Application ID", admission._id.toString());
            addField("Date Submitted", new Date(admission.createdAt).toLocaleString("en-IN"));
            doc.moveDown(1);

            addField("Full Name", admission.name);
            addField("Email Address", admission.email);
            addField("Phone Number", admission.phone);
            addField("Course Selected", admission.course);

            doc.moveDown(1);
            doc.font("Helvetica-Oblique")
                .text("Application status is pending. You can track this using your email address.");

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};
