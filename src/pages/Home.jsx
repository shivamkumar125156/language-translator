import React, { useState } from 'react';
// I added languages in other js file "data.js" 
import { languages } from '../data';
import { FaMicrophone } from "react-icons/fa";
import { HiSpeakerWave } from "react-icons/hi2";
import img from "../assets/bg1.jpg";
const Home=()=>{
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [fromLang, setFromLang] = useState('en-US');
    const [toLang, setToLang] = useState('tr-TR');
    const [loading, setLoading] = useState(false);
    const [recognizing, setRecognizing] = useState(false);

    const translateText = async () => {
        if (!text) return;
        setLoading(true);
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLang}|${toLang}`);
            const data = await response.json();
            setTranslatedText(data.responseData.translatedText);
        } catch (error) {
            console.error('Error translating text:', error);
        }
        setLoading(false);
    };
    const readAloud = () => {
        if (translatedText) {
            const utterance = new SpeechSynthesisUtterance(translatedText);
            utterance.lang = toLang;
            window.speechSynthesis.speak(utterance);
        }
    };

    const startRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Speech Recognition not supported in this browser.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = fromLang;

        recognition.onstart = () => {
            setRecognizing(true);
        };

        recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            setText(spokenText);
            setRecognizing(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech Recognition error:', event.error);
            setRecognizing(false);
        };

        recognition.onend = () => {
            setRecognizing(false);
        };

        recognition.start();
    };
    return(
        <div className="flex items-center justify-center h-screen bg-yellow-100"
        style={{backgroundImage:`url(${img})`, backgroundSize:"fit-content"}}>
            <div>
                <h2 className="text-2xl font-bold mb-2 text-center bg-white  py-3 rounded-lg   ">Please Enter the text or Speak the word</h2>
                <div className="bg-gray-100   p-6 rounded-lg shadow-lg">
                    <div className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                            <select
                                value={fromLang}
                                onChange={(e) => setFromLang(e.target.value)}
                                className="p-2 border rounded-md outline-none focus:outline-2 focus:outline-sky-400"
                            >
                                {
                                    languages.map((lang) => (
                                        <option key={lang.id} value={lang.id}>
                                            {lang.name}
                                        </option>
                                    ))
                                }
                            </select>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter Text"
                                className="p-2 border rounded-md flex-1 
                                outline-none focus:outline-2 focus:outline-sky-400"
                                rows="4"
                            ></textarea>
                            <button
                                onClick={startRecognition}
                                className="bg-yellow-400 font-bold py-2 px-4 rounded-md"
                                disabled={recognizing}
                            >
                                <div className='flex flex-col items-center'>
                                    <FaMicrophone/>
                                    {recognizing ? 'Listening...' : 'Speak'}
                                </div>
                            </button>
                        </div>
                        <div className="flex space-x-4">
                            <select
                                value={toLang}
                                onChange={(e) => setToLang(e.target.value)}
                                className="p-2 border rounded-md outline-none focus:outline-2 focus:outline-sky-400"
                            >
                                {
                                    languages.map((lang) => (
                                        <option key={lang.id} value={lang.id}>
                                        {lang.name}
                                        </option>
                                    ))
                                }
                            </select>
                            <textarea
                                value={translatedText}
                                readOnly
                                placeholder="Translation"
                                className="border rounded-md flex-1 outline-none focus:outline-2 focus:outline-sky-400"
                                rows="4"
                            ></textarea>
                        </div>
                        <button
                            onClick={translateText}
                            className="bg-yellow-400 font-bold py-2 px-4 rounded-md"
                        >
                            {loading ? 'Translating...' : 'Translate Text'}
                        </button>
                        {
                            text && (
                                <button
                                    onClick={() => {
                                        setText('');
                                        setTranslatedText('');
                                    }}
                                    className="text-gray-500 mt-2"
                                >
                                    Clear
                                </button>
                            )}
                        {
                            translatedText && (
                                    <button onClick={readAloud} className="bg-green-400 font-bold py-2 px-4 rounded-md mt-2">
                                        <div className='flex items-center gap-x-2 justify-center'>
                                            <p>Read Aloud</p>
                                            <HiSpeakerWave/> 
                                        </div>
                                    </button>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;