/**
 * PDF Text Extractor Utility
 * Uses pdf-parse to convert PDF buffers into clean selectable text.
 * Supports both modern PDFParse class and legacy function interfaces.
 */

const pdfModule = require('pdf-parse');

/**
 * Extract text and metadata from PDF buffer
 * @param {Buffer} dataBuffer
 * @returns {Promise<{ text: string, numPages: number, info: object }>}
 */
async function extractTextFromPdf(dataBuffer) {
  try {
    let rawText = '';
    let numPages = 1;

    // Check if new PDFParse class exists
    if (pdfModule.PDFParse) {
      const uint8 = new Uint8Array(dataBuffer);
      const parser = new pdfModule.PDFParse(uint8);
      const result = await parser.getText();
      rawText = result.text || '';
      numPages = result.total || (result.pages ? result.pages.length : 1);
    } else if (typeof pdfModule === 'function') {
      const data = await pdfModule(dataBuffer);
      rawText = data.text || '';
      numPages = data.numpages || 1;
    } else {
      throw new Error('Unsupported pdf-parse module interface.');
    }

    // Clean up pagination artifacts like "-- 1 of 1 --" and carriage returns
    const cleanText = rawText
      .replace(/-- \d+ of \d+ --/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ \u00a0]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return {
      text: cleanText,
      numPages: numPages || 1,
      info: {}
    };
  } catch (error) {
    console.error('[PDF Parser Error]:', error.message);
    throw new Error('Failed to parse PDF document: ' + error.message);
  }
}

module.exports = {
  extractTextFromPdf
};
