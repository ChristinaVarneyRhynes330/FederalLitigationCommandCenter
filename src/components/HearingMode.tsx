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

    useEffect(() => {
        // Setup Speech Recognition
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
                    analyzeForObjection(finalTranscript);
                }
            };
        }
    }, [transcript]);

    const toggleListening = () => {
        if (isListening) recognitionRef.current?.stop();
        else recognitionRef.current?.start();
        setIsListening(!isListening);
    };

    const analyzeForObjection = async (text: string) => {
        if (text.length < 10) return;
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const prompt = `Analyze this courtroom statement: "${text}". If there is a valid objection (Hearsay, Speculation, Leading, Relevance), return ONLY the objection name and a 5-word reason. If none, return "None".`;
            const response = await callGemini(prompt, "You are a legal assistant.", apiKey);
            if (response && !response.includes("None")) {
                setLiveObjection(response);
                setTimeout(() => setLiveObjection(null), 8000); // Clear after 8s
            }
        } catch (e) { console.error(e); }
    };

    const saveScript = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { error } = await supabase.from('hearing_scripts').insert([{
            user_id: user.id, title: title || 'Untitled', content: script, transcript: transcript
        }]);
        if (error) alert('Error saving script'); else alert('Saved!');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
                    Live Hearing Mode
                </h1>
                <div className="flex gap-3">
                    <button onClick={saveScript} className="btn bg-teal-600 hover:bg-teal-700 text-white border-none flex gap-2"><Save className="w-4 h-4"/> Save</button>
                    <button onClick={onExit} className="btn bg-white/10 hover:bg-white/20 text-white border-none">Exit</button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <input className="bg-transparent text-2xl font-bold w-full mb-4 focus:outline-none" placeholder="Hearing Title..." value={title} onChange={e => setTitle(e.target.value)} />
                        <textarea className="w-full h-40 bg-black/20 rounded p-4 text-slate-300 resize-none focus:ring-1 focus:ring-teal-500" placeholder="Paste your script here..." value={script} onChange={e => setScript(e.target.value)} />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 min-h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex gap-2"><Mic className={isListening ? "text-red-400" : "text-slate-500"} /> Transcript</h2>
                            <button onClick={toggleListening} className={`btn ${isListening ? 'bg-red-500' : 'bg-teal-600'} text-white border-none`}>{isListening ? 'Stop' : 'Start'}</button>
                        </div>
                        <div className="p-4 bg-black/40 rounded h-64 overflow-y-auto font-mono text-sm text-slate-300">{transcript || "Waiting for audio..."}</div>
                    </div>
                </div>

                <div className={`p-6 rounded-xl border-2 transition-all ${liveObjection ? 'bg-red-900/20 border-red-500' : 'bg-white/5 border-white/10'}`}>
                    <h2 className="text-xl font-bold mb-4 flex gap-2"><AlertCircle className={liveObjection ? "text-red-500" : "text-slate-600"} /> Objection Monitor</h2>
                    {liveObjection ? (
                        <div>
                            <div className="text-2xl font-bold text-white mb-2">{liveObjection.split(':')[0]}</div>
                            <p className="text-slate-300 text-sm">{liveObjection.split(':')[1]}</p>
                            <button className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 rounded font-bold">OBJECT NOW</button>
                        </div>
                    ) : <p className="text-center opacity-50 py-12">Listening for grounds...</p>}
                </div>
            </div>
        </div>
    );
}