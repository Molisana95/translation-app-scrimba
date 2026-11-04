import React from 'react';

export default function Card() {
    const [selectedLanguage, setSelectedLanguage] = React.useState('english');
    const [inputText, setInputText] = React.useState('');
    const [outputText, setOutputText] = React.useState('');

    

    function handleLanguageChange(event) {
        console.log('Selected Language:', selectedLanguage);
        console.log('Input Text:', inputText);
    }

    return (
        <div className="card-container">
        <label htmlFor="input-text">Enter text to translate:</label>
        <textarea id="input-text" maxLength="200" placeholder="Type the text you want to translate here..." value={inputText} onChange={(e) => setInputText(e.target.value)}></textarea>
            <div className="lang-selection">
                <input type="radio" id="english" name="language" value="english" onClick={() => setSelectedLanguage('english')} />
                <label htmlFor="english">English</label>
                <input type="radio" id="spanish" name="language" value="spanish" onClick={() => setSelectedLanguage('spanish')} />
                <label htmlFor="spanish">Spanish</label>
                <input type="radio" id="french" name="language" value="french" onClick={() => setSelectedLanguage('french')} />
                <label htmlFor="french">French</label>
                <input type="radio" id="german" name="language" value="german" onClick={() => setSelectedLanguage('german')} />
                <label htmlFor="german">German</label>
            </div>
            <button onClick={handleLanguageChange}>Translate</button>
            <div className="output-container">
                <p>{outputText || 'Translated text will appear here.'}</p>
            </div>
        </div>
    )
}