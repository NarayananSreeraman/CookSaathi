export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 2. Get the API Key from the Vercel Environment Variable
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Server API key configuration missing' });
        }

        // 3. Forward the request to Google (using the v1alpha endpoint for 2.5-flash as you requested)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1alpha/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body) // Pass the prompt and image data from your frontend
        });

        const data = await response.json();

        // 4. Return Google's response back to your frontend
        return res.status(200).json(data);

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}