'use server'

import { GoogleGenAI } from "@google/genai"
import PDFParser from "pdf2json"

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! })

/**
 * Helper function to extract text from PDF Buffer using pdf2json
 * This avoids the DOMMatrix/Canvas errors found in other libraries
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true); // 1 = Text content only

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      console.error(errData.parserError);
      reject(new Error("Failed to parse PDF data"));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      // pdf2json returns URL-encoded text segments. We need to decode and join them.
      try {
        const text = pdfParser.getRawTextContent();
        resolve(text);
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function parseResumeFromPdf(formData: FormData) {
  console.log("📂 Starting PDF Parse...")
  
  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  try {
    // 1. Extract Text (Using the new safe method)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const resumeText = await extractTextFromPDF(buffer)
    
    console.log("✅ PDF Text Extracted. Length:", resumeText.length)

    // 2. Prepare Prompt
    const prompt = `
      You are a data extraction AI. 
      Extract data from the following resume text and return it STRICTLY as a JSON object.
      
      Target JSON Structure:
      {
        "contact": { "fullName": "", "email": "", "linkedin": "", "portfolio": "", "location": "", "phone": "" },
        "summary": "",
        "workExperience": [ { "company": "", "role": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM", "current": boolean, "description": "bullet points" } ],
        "education": [ { "school": "", "degree": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM" } ],
        "projects": [ { "name": "", "description": "", "link": "" } ],
        "skills": "comma separated list of skills"
      }

      Resume Text:
      ${resumeText}
    `

    // 3. Call Gemini
    // Note: We use "gemini-1.5-flash" because "gemini-2.5-flash" is not widely available via API yet.
    // If you have specific access, you can change it back.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [
        {
          role: "user",
          parts: [ { text: prompt } ]
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    })

    // 4. Parse Response
    // The new SDK returns the response object nested inside
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text
    
    console.log("🤖 AI Response Received")

    if (!text) throw new Error("Empty response from AI")

    return JSON.parse(text)

  } catch (error) {
    console.error("❌ ERROR in parseResumeFromPdf:", error)
    throw new Error("Failed to parse resume")
  }
}