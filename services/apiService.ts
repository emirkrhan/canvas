import { ExtractedData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://graphic-abstract-api.vercel.app/api';

export const extractArticleData = async (url: string): Promise<ExtractedData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.data) {
        throw new Error(result.message || 'Extraction failed');
    }

    return result.data;
  } catch (error) {
    console.error("Extraction error:", error);
    throw error;
  }
};

export const polishText = async (
  originalText: string,
  instruction: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/polish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: originalText,
        instruction: instruction
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.polishedText) {
        throw new Error(result.message || 'Text polishing failed');
    }

    return result.polishedText;
  } catch (error) {
    console.error("Text polish error:", error);
    return originalText; // Return original text on error
  }
};

export const sendChatMessage = async (
  history: { role: string; text: string }[],
  message: string
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        history: history,
        message: message
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.response) {
        throw new Error(result.message || 'Chat failed');
    }

    return result.response;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

export const extractArticleFromPdf = async (pdfFile: File): Promise<ExtractedData> => {
  try {
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    const response = await fetch(`${API_BASE_URL}/pdf/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.data) {
        throw new Error(result.message || 'PDF extraction failed');
    }

    return result.data;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw error;
  }
};
