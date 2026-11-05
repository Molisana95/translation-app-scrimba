export const handler = async (event) => {
    /* check if the request is valid */
    try {
        ({ userTextInput, selectedLanguage } = JSON.parse(event.body || '{}'));
    } catch {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON request body' }),
        };
    }
    /* validate input */
    if (typeof userTextInput !== 'string' || !userTextInput.trim() ||
        typeof selectedLanguage !== 'string' || !selectedLanguage.trim()) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Text and language are required' }),
        };
    }

    /* validate environment variables */

    const apiKey = process.env.AI_KEY;
    const model = process.env.AI_MODEL;
    

    if (!apiKey || !model) {
        console.error('AI_KEY and AI_MODEL must be set in the Netlify environment');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'AI service is not configured' }),
        };
    }

    try {
        const response = await fetch('https://openrouter.ai/api/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                input: [{ role: 'system', content: `You are a translator. Translate the user's text into ${selectedLanguage}. Reply with only the most accurate translation you can make, without any additional text.` }, 
                        { role: 'user', content: userTextInput }],
                        
                "reasoning": { "effort": "none" } // Disable reasoning to speed up the response, since we only need a direct translation without additional reasoning or explanation.
            }),
        });
        const data = await response.json();

        if (!response.ok) {
            console.error('OpenRouter request failed with status:', response.status);
            return {
                statusCode: 502,
                body: JSON.stringify({ error: 'AI translation request failed' }),
            };
        }
        console.log('OpenRouter response data:', data.output?.[0]?.content?.[0]);
        const translation = data.output?.[0]?.content?.[0]?.text;
        if (typeof translation !== 'string') {
            console.error('OpenRouter response did not contain a translation');
            return {
                statusCode: 502,
                body: JSON.stringify({ error: 'AI returned an invalid response' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ translation }),
        };
    } catch (error) {
        console.error('Error calling OpenRouter:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'AI request failed' }),
        };
    }
};


/* original code

export default async function handler(event, context) {
    const AI_KEY = process.env.AI_KEY;
    const AI_MODEL = process.env.AI_MODEL;
    
    const { userTextInput, selectedLanguage } = JSON.parse(event.body || "{}");

    try {
        const res = await fetch('https://openrouter.ai/api/v1/responses', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${AI_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: AI_MODEL,
                instructions: `You are a translator. Translate the user's text into ${selectedLanguage}. Reply with only the translation.`,
                input: userTextInput,
            }),
        });
        const data = await res.json();
        const answer = data.output[0].content[0].text ?? ""
        console.log(answer)
        return {
            statusCode: 200,
            body: JSON.stringify({ translation: answer }),
        }

    } catch (error) {
        console.error('Error in handler function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "AI request failed" }),
        };
    }

    
}
*/
