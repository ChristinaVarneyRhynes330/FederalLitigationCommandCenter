import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { callGemini } from '../utils/gemini';
import { Mic, AlertCircle, Save, Loader2 } from 'lucide-react';

export default function HearingMode({ onExit }: { onExit: () => void }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [liveObjection, setLiveObjection] = useState<string | null>(null);
    const [script, setScript] = useState('');
    const [title, setTitle] = useState('');
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    const newText = transcript + ' ' + finalTranscript;
                    setTranscript(newText);
                    analyzeForObjection(finalTranscript); // Real-time check
                }
            };
        }
    }, [transcript]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
        }
        setIsListening(!isListening);
    };

    const analyzeForObjection = async (text: string) => {
        if (text.length < 15) return;

        // Quick check with Gemini
        const prompt = `
      Analyze this testimony immediately: "${text}"
      If there is a valid legal objection (Hearsay, Speculation, Leading, Relevance, Lack of Foundation), 
      return ONLY the objection name and a 5-word reason. 
      If no objection, return "None".
    `;

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const response = await callGemini(prompt, "You are a legal assistant.", apiKey);
            if (response && !response.includes("None")) {
                setLiveObjection(response);
                setTimeout(() => setLiveObjection(null), 8000);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const saveScript = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('hearing_scripts').insert([{
            user_id: user.id,
            title: title || 'Untitled Hearing',
            content: script,
            transcript: transcript
        }]);

        if (error) alert('Error saving script');
        else alert('Script & Transcript Saved!');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></span>
                        Live Hearing Mode
                    </h1>
                    <p className="text-slate-400">Real-time transcript & objection monitor</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={saveScript} className="btn bg-teal-600 hover:bg-teal-700 border-none text-white flex gap-2">
                        <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={onExit} className="btn bg-white/10 hover:bg-white/20 border-none text-white">
                        Exit
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <input
                            className="bg-transparent border-none text-2xl font-bold text-white placeholder-white/30 w-full mb-4 focus:ring-0"
                            placeholder="Hearing Title / Witness Name"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        <textarea
                            className="w-full h-40 bg-black/20 rounded-lg p-4 text-slate-300 border-none focus:ring-1 focus:ring-teal-500 resize-none font-mono"
                            placeholder="Paste your direct examination script here..."
                            value={script}
                            onChange={e => setScript(e.target.value)}
                        />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Mic className={isListening ? "text-red-400" : "text-slate-500"} />
                                Live Transcript
                            </h2>
                            <button
                                onClick={toggleListening}
                                className={`btn ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-600 hover:bg-teal-700'} border-none text-white`}
                            >
                                {isListening ? 'Stop Listening' : 'Start Listening'}
                            </button>
                        </div>
                        <div className="p-4 bg-black/40 rounded-lg h-64 overflow-y-auto font-mono text-sm leading-relaxed text-slate-300">
                            {transcript || "Waiting for speech..."}
                        </div>
                    </div>
                </div>

                {/* Right Column: Objection Monitor */}
                <div className="space-y-6">
                    <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${liveObjection ? 'bg-red-900/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-white/5 border-white/10'}`}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className={liveObjection ? "text-red-500" : "text-slate-600"} />
                            Objection Monitor
                        </h2>

                        {liveObjection ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4">
                                <p className="text-xs text-red-300 uppercase tracking-widest font-bold mb-2">Potential Objection Detected</p>
                                <div className="text-2xl font-bold text-white mb-2">
                                    {liveObjection.split(':')[0]}
                                </div>
                                <p className="text-slate-300 text-sm">
                                    {liveObjection.split(':')[1] || "Grounds detected."}
                                </p>
                                <button className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold uppercase tracking-wide text-sm shadow-lg">
                                    OBJECT NOW
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-12 opacity-50">
                                <div className="w-16 h-16 rounded-full border-4 border-slate-700 mx-auto mb-4 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-ping" />
                                </div>
                                <p className="text-sm">Listening for grounds...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}