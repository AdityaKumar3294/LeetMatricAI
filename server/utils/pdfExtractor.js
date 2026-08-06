const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
    try {

        // Read PDF
        const buffer = fs.readFileSync(filePath);

        // Create parser
        const parser = new PDFParse({
            data: buffer
        });

        // Parse PDF
        const result = await parser.getText();

        // Free memory
        await parser.destroy();

        return result.text;

    } catch (error) {

        console.log(error);
        throw new Error("Failed to extract PDF text");

    }
};

module.exports = extractTextFromPDF;