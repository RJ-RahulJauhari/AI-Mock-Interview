import { NextResponse } from 'next/server';
import { PdfReader } from 'pdfreader';

export const runtime = 'nodejs';

// Helper function to extract text from a single PDF buffer
async function extractTextFromPDFBuffer(buffer) {
  const pages = [];
  let currentPage = [];

  await new Promise((resolve, reject) => {
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) return reject(err);
      if (!item) {
        // End of file
        if (currentPage.length > 0) {
          pages.push(currentPage);
        }
        return resolve();
      }

      if (item.page) {
        // When a new page starts, push the previous page's items (if any)
        if (currentPage.length > 0) {
          pages.push(currentPage);
        }
        currentPage = [];
      }

      if (item.text) {
        // Each text item has coordinates and text
        currentPage.push(item);
      }
    });
  });

  // Function to group items by Y coordinate
  function groupByY(items) {
    const lines = {};
    items.forEach((item) => {
      const y = Math.round(item.y * 100); // rounding helps handle floating precision
      if (!lines[y]) {
        lines[y] = [];
      }
      lines[y].push(item);
    });
    return lines;
  }

  let allPagesText = [];

  pages.forEach((pageItems) => {
    const lines = groupByY(pageItems);
    // Sort lines by their Y coordinate
    const sortedY = Object.keys(lines)
      .map((y) => parseFloat(y))
      .sort((a, b) => a - b);

    const pageText = sortedY.map((y) => {
      // Within a line, sort items by x coordinate
      const lineItems = lines[y].sort((a, b) => a.x - b.x);
      // Join all text from the line
      return lineItems.map((it) => it.text).join('');
    });

    allPagesText.push(pageText.join('\n'));
  });

  // Combine all pages into a single text
  return allPagesText.join('\n\n');
}

export async function POST(request) {
  try {
    // Retrieve all files under the 'pdfFile' field
    const formData = await request.formData();
    const files = formData.getAll('pdfFile');

    // Validate input
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    const results = {};

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Ensure file is a File object
      if (!(file instanceof File)) {
        continue; // skip if not a valid file
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text from the current PDF
      const text = await extractTextFromPDFBuffer(buffer);
      
      // Use file name as key if available, otherwise use index
      const key = file.name || `file_${i}`;
      results[key] = text;
    }

    // Return all extracted text results
    return NextResponse.json({ strings: results });
  } catch (err) {
    console.error('Error extracting PDF data:', err);
    return NextResponse.json({ error: 'Error extracting PDF data' }, { status: 500 });
  }
}
