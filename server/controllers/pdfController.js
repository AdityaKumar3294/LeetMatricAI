const User = require("../models/User");
const { generateReportPDF } = require("../services/pdfService");

// ==============================
// Download PDF Report
// ==============================
const downloadReport = async (req, res) => {
    try {

        // Find logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Generate PDF
        const pdfBuffer = await generateReportPDF(user);

        // Current Date
        const date = new Date().toISOString().split("T")[0];

        // Safe filename
        const fileName =
            `LeetMetricAI_Report_${user.leetcodeUsername || "UnknownUser"}_${date}.pdf`;

        // Headers
        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );

        // Send PDF
        return res.send(pdfBuffer);

    } catch (error) {

        console.log("PDF Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate PDF report."
        });

    }
};

module.exports = {
    downloadReport
};