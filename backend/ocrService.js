const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
            mimeType
        },
    };
}

async function processMedicalDocument(filePath, mimeType) {
    const ai = getClient();
    if (!ai) {
        console.warn('GEMINI_API_KEY is not configured. Returning MOCK data for testing.');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    patientName: "John Doe (MOCK)",
                    diagnoses: ["Viral Fever", "Mild Dehydration"],
                    prescriptions: [
                        { medicineName: "Paracetamol 650mg", dosage: "1 tab", frequency: "SOS", duration: "3 days" }
                    ]
                });
            }, 1500); // simulate delay
        });
    }

    const documentPart = fileToGenerativePart(filePath, mimeType);

    const prompt = `
You are an expert medical transcriptionist and clinical assistant. 
Please carefully read this medical document (which may have very poor handwriting).
Extract the following information and return it ONLY as a valid JSON object. 
Do not include markdown blocks or any other text outside the JSON.

Expected JSON Structure:
{
  "patientName": "string or null",
  "patientAge": "string or null",
  "patientGender": "string or null",
  "hospitalOrClinicName": "string or null",
  "doctorName": "string or null",
  "date": "string or null",
  "chiefComplaints": ["string"],
  "diagnoses": ["string"],
  "prescriptions": [
    {
      "medicineName": "string",
      "dosage": "string",
      "frequency": "string",
      "duration": "string",
      "instructions": "string"
    }
  ],
  "vitalSigns": {
    "bloodPressure": "string or null",
    "pulse": "string or null",
    "temperature": "string or null",
    "weight": "string or null"
  },
  "clinicalNotes": "string (any other inferences or notes written by the doctor)"
}

If any field is completely illegible or missing, use null or an empty array. Do your best to interpret medical abbreviations and doctor's shorthand.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [documentPart, { text: prompt }]
                }
            ],
            config: {
                temperature: 0.1,
                responseMimeType: 'application/json'
            }
        });

        const jsonText = response.text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Error during Gemini OCR processing:', error);
        throw error;
    }
}

module.exports = {
    processMedicalDocument
};
