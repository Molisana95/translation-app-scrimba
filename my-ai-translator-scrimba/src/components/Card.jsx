import React from 'react';

export default function Card() {
    const [selectedLanguage, setSelectedLanguage] = React.useState('english');
    const [inputText, setInputText] = React.useState('');
    const [outputText, setOutputText] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleTranslate = async () => {
        if(!inputText.trim()) return; // Do not proceed if input is empty

        setIsLoading(true); // Set loading state to true while fetching translation

        try {
            const response = await fetch("/.netlify/functions/ai-serverless", {
                method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userTextInput: inputText, selectedLanguage }),
                });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
                const data = await response.json();
                setOutputText(data.translation);
            } catch (error) {
                console.error('Error fetching translation:', error);
            } finally {
                setIsLoading(false);
            }
        }
        
    return (
        <div className="card-container">
        <label htmlFor="input-text">Enter text to translate:</label>
        <textarea id="input-text" maxLength="200" placeholder="Type the text you want to translate here..." value={inputText} onChange={(e) => setInputText(e.target.value)}></textarea>
            <div className="lang-selection">
                <div className="lang-option">
                    <input type="radio" id="english" name="language" value="english" onClick={() => setSelectedLanguage('english')} />
                    <label htmlFor="english">English</label>
                </div>
                <div className="lang-option">
                    <input type="radio" id="spanish" name="language" value="spanish" onClick={() => setSelectedLanguage('spanish')} />
                    <label htmlFor="spanish">Spanish</label>
                </div>
                <div className="lang-option">
                    <input type="radio" id="french" name="language" value="french" onClick={() => setSelectedLanguage('french')} />
                    <label htmlFor="french">French</label>
                </div>
                <div className="lang-option">
                    <input type="radio" id="german" name="language" value="german" onClick={() => setSelectedLanguage('german')} />
                    <label htmlFor="german">German</label>
                </div>
            </div>
            <button onClick={handleTranslate} disabled={isLoading}>
                {isLoading ? 'Translating...' : 'Translate'}
            </button>
            <div className="output-container">
                <p>{outputText || 'Translated text will appear here.'}</p>
            </div>
        </div>
    )
}