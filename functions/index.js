const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');
const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
const MODEL = 'gemini-3.8-flash';
const MAX_TEXT = 180000;
const MAX_FILE_BYTES = 7 * 1024 * 1024;

function cors(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

function clean(value, max = MAX_TEXT) {
  return String(value ?? '').slice(0, max);
}

function buildPrompt(body) {
  const agent = clean(body.agent || 'Career Navigator', 120);
  const description = clean(body.description || '', 1000);
  const question = clean(body.question || '', 12000);
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

  let prompt = `You are the Elevate 360 AI Career Hub, a practical professional-development assistant.\n\n` +
    `Specialist: ${agent}\n${description}\n\n` +
    `Give concise, professional, actionable guidance about career planning, CVs, cover letters, interviews, study habits, leadership, workplace skills and professional growth. ` +
    `For CV requests, help create, improve, restructure and tailor CV content while preserving facts supplied by the user. ` +
    `Never invent employment history, qualifications, dates, employers, achievements or other personal facts. ` +
    `When a document is attached, use it as the primary source for document-specific questions and say when information is not present.\n\n`;

  if (history.length) {
    prompt += 'RECENT CONVERSATION:\n';
    for (const item of history) {
      prompt += `User: ${clean(item.q || item.question, 4000)}\n`;
      prompt += `Assistant: ${clean(item.answer, 6000)}\n`;
    }
    prompt += '\n';
  }

  prompt += `CURRENT USER QUESTION:\n${question}`;
  return prompt;
}

function makeContents(body) {
  const parts = [{ text: buildPrompt(body) }];
  const documents = Array.isArray(body.documents)
    ? body.documents.slice(0, 5)
    : (body.document ? [body.document] : []);

  for (const document of documents) {
    const name = clean(document.name || 'attachment', 200);
    parts.push({ text: `ATTACHED FILE: ${name}` });

    if (document.dataBase64) {
      const raw = String(document.dataBase64);
      const approxBytes = Math.floor(raw.length * 0.75);
      if (approxBytes > MAX_FILE_BYTES) {
        throw new Error(`${name} is too large. Please use a file smaller than 7 MB.`);
      }
      const mimeType = clean(document.mimeType || 'application/octet-stream', 120);
      parts.push({ inlineData: { mimeType, data: raw } });
    } else if (document.text) {
      parts.push({ text: clean(document.text, MAX_TEXT) });
    }
  }

  return [{ role: 'user', parts }];
}

exports.elevate360AI = onRequest(
  {
    region: 'us-central1',
    secrets: [GEMINI_API_KEY],
    timeoutSeconds: 120,
    memory: '512MiB',
    maxInstances: 10
  },
  async (req, res) => {
    cors(res);

    if (req.method === 'OPTIONS') return res.status(204).send('');
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST requests only.' });

    try {
      const body = req.body || {};
      const question = clean(body.question, 12000).trim();
      if (!question) return res.status(400).json({ error: 'Please enter a question.' });

      const apiKey = GEMINI_API_KEY.value();
      if (!apiKey) {
        logger.error('GEMINI_API_KEY is not available to elevate360AI.');
        return res.status(500).json({ error: 'AI backend is not configured. Add the GEMINI_API_KEY secret and redeploy the function.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: makeContents(body),
        config: {
          temperature: 0.55,
          maxOutputTokens: 1800
        }
      });

      const answer = String(response?.text || '').trim();
      if (!answer) {
        logger.error('AI returned no text', { response: JSON.stringify(response).slice(0, 2000) });
        return res.status(502).json({ error: 'The AI service returned an empty response.' });
      }

      return res.status(200).json({ answer });
    } catch (error) {
      logger.error('Elevate 360 AI request failed', {
        message: error?.message,
        status: error?.status,
        stack: error?.stack
      });

      // Keep the browser message useful without exposing the API key or provider internals.
      const message = String(error?.message || 'The AI service could not complete the request.');
      let safe = 'The AI service could not complete the request. Please try again.';
      if (/API key|authentication|permission|unauthorized|forbidden/i.test(message)) {
        safe = 'The AI connection is not authorised yet. Check the GEMINI_API_KEY secret and redeploy the AI function.';
      } else if (/quota|resource exhausted|rate limit/i.test(message)) {
        safe = 'The AI service is temporarily unavailable because the request limit or quota was reached.';
      } else if (/model|not found|404/i.test(message)) {
        safe = 'The selected AI model is unavailable for this project. Check the deployed AI function configuration.';
      } else if (/too large|size|payload/i.test(message)) {
        safe = message;
      }
      return res.status(500).json({ error: safe });
    }
  }
);
