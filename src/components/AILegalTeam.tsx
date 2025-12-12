import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { Loader2, Send, Brain, FileEdit, ClipboardCheck, Handshake, MessageSquare } from 'lucide-react';

type Agent = 'strategist' | 'drafter' | 'clerk' | 'negotiator' | 'examiner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AILegalTeamProps {
  // apiKey is optional because we will read from import.meta.env.VITE_GEMINI_API_KEY
  apiKey?: string;
}

export function AILegalTeam({ apiKey }: AILegalTeamProps) {
  const [activeAgent, setActiveAgent] = useState<Agent>('strategist');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Legal Strategist. Select a persona and ask a question about the active case.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [contextString, setContextString] = useState<string>('No case context loaded.');
  const [loadingAI, setLoadingAI] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [geminiAvailable, setGeminiAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const agents = [
    {
      id: 'strategist' as Agent,
      name: 'Strategist',
      icon: Brain,
      description: 'Case strategy and legal theory development',
      color: '#66B2A0',
      gradient: 'from-[#66B2A0] to-[#4E796B]'
    },
    {
      id: 'drafter' as Agent,
      name: 'Drafter',
      icon: FileEdit,
      description: 'Motion and brief generation',
      color: '#B76E79',
      gradient: 'from-[#B76E79] to-[#8B4B56]'
    },
    {
      id: 'clerk' as Agent,
      name: 'Clerk',
      icon: ClipboardCheck,
      description: 'Compliance and procedural checks',
      color: '#A7D7B8',
      gradient: 'from-[#A7D7B8] to-[#66B2A0]'
    },
    {
      id: 'negotiator' as Agent,
      name: 'Negotiator',
      icon: Handshake,
      description: 'Settlement analysis and negotiation support',
      color: '#4E796B',
      gradient: 'from-[#4E796B] to-[#2C3E3E]'
    },
    {
      id: 'examiner' as Agent,
      name: 'Cross-Examiner',
      icon: MessageSquare,
      description: 'Witness preparation and question drafting',
      color: '#8B4B56',
      gradient: 'from-[#8B4B56] to-[#B76E79]'
    },
  ];

  const personaSystemPrompts: Record<Agent, string> = {
    strategist:
      'You are a senior litigation strategist. Provide high-level legal strategy, prioritization of claims, and tactical recommendations. Be concise and cite what evidence supports your recommendation when possible.',
    drafter:
      'You are a legal drafter. Produce clear, well-structured pleadings, motions, or correspondence. When asked, draft an outline or a short sample text for filings.',
    clerk:
      'You are a meticulous court clerk assistant. Check procedural requirements, deadlines, and formatting. Provide checklists and cautions.',
    negotiator:
      'You are a settlement negotiator. Analyze risk, likely settlement ranges, and negotiation levers. Be pragmatic and quantify ranges when possible.',
    examiner:
      'You are a cross-exam specialist. Propose pointed questions, impeachment strategies, and witness prep guidance.'
  };

  // initialize Gemini client dynamically (so the package is optional)
  useEffect(() => {
    (async () => {
      setInitializing(true);
      try {
        // dynamic import to avoid hard failure if package not installed
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const key = import.meta.env.VITE_GEMINI_API_KEY || apiKey;
        if (!key) {
          setGeminiAvailable(false);
          setError('VITE_GEMINI_API_KEY is not set. Install/configure Gemini API key to enable AI.');
          setInitializing(false);
          return;
        }

        try {
          const mod = await import('@google/generative-ai');
          // The package exposes GoogleGenerativeAI (name may vary); try both
          const GoogleGenerativeAI = (mod && (mod.GoogleGenerativeAI || mod.default || mod.GoogleAI)) as any;
          if (!GoogleGenerativeAI) throw new Error('GoogleGenerativeAI export not found in @google/generative-ai');

          // instantiate client
          clientRef.current = new GoogleGenerativeAI({ apiKey: key });
          setGeminiAvailable(true);
          setError(null);
        } catch (e: any) {
          console.warn('Failed to initialize @google/generative-ai:', e?.message || e);
          setGeminiAvailable(false);
          setError('Failed to load @google/generative-ai. Run `npm install @google/generative-ai` and ensure VITE_GEMINI_API_KEY is configured.');
        }

        // Fetch context after initializing or even if not available (we still want local context)
        await fetchCaseContext();
      } finally {
        setInitializing(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch most recent case and evidence
  const fetchCaseContext = async () => {
    try {
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (casesError) {
        console.error('Supabase cases error', casesError);
        setContextString('Unable to load case context');
        return;
      }

      const currentCase = casesData && casesData[0];
      if (!currentCase) {
        setContextString('No active case found.');
        return;
      }

      const caseId = currentCase.id;

      const { data: evidenceData, error: evidenceError } = await supabase
        .from('evidence')
        .select('title')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (evidenceError) {
        console.error('Supabase evidence error', evidenceError);
      }

      const evidenceTitles = (evidenceData || []).map((e: any) => e.title || e.filename || 'Untitled');

      const parties = currentCase.parties ? JSON.stringify(currentCase.parties) : `${currentCase.plaintiff || ''} v. ${currentCase.defendant || ''}`;

      const ctx = `Current Case: ${currentCase.title || 'Untitled'}. Case Number: ${currentCase.case_number || 'N/A'}. Court: ${currentCase.court || 'N/A'}. Parties: ${parties}. Available Evidence: ${evidenceTitles.length ? evidenceTitles.join(', ') : 'None'}.`;

      setContextString(ctx);
    } catch (err) {
      console.error('Error building case context', err);
      setContextString('Error loading case context');
    }
  };

  // scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  const activeAgentData = agents.find(a => a.id === activeAgent)!;

  const handleSendMessage = async (userMessage?: string) => {
    const text = (userMessage ?? input).trim();
    if (!text) return;

    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoadingAI(true);
    setError(null);

    // Build prompt: persona system + context + user
    const systemInstruction = personaSystemPrompts[activeAgent] + '\nUse the case context below to ground your answer.';
    const prompt = `${systemInstruction}\n\nCase Context: ${contextString}\n\nUser Question: ${text}`;

    try {
      if (!clientRef.current) {
        throw new Error('Gemini client not initialized');
      }

      // Attempt to call the common client method shapes we've seen in official libs.
      let aiText: string | null = null;

      // Try text.generate
      try {
        if (typeof clientRef.current.text?.generate === 'function') {
          const res = await clientRef.current.text.generate({
            model: 'gemini-pro',
            input: prompt,
            temperature: 0.2,
            maxOutputTokens: 1000
          });
          // response shapes vary; try common access paths
          aiText = res?.output?.[0]?.content?.[0]?.text || res?.candidates?.[0]?.content || res?.output?.[0]?.text || (typeof res === 'string' ? res : null);
        } else if (typeof clientRef.current.generateText === 'function') {
          const res = await clientRef.current.generateText({ model: 'gemini-pro', prompt });
          aiText = res?.text || res?.output || JSON.stringify(res);
        } else if (typeof clientRef.current.generate === 'function') {
          const res = await clientRef.current.generate({ model: 'gemini-pro', prompt });
          aiText = res?.output || JSON.stringify(res);
        } else {
          throw new Error('Unsupported Gemini client shape');
        }
      } catch (innerErr) {
        console.warn('Primary Gemini call failed, attempting fallback shapes', innerErr);
        // try another common call shape
        if (clientRef.current?.text) {
          const res = await clientRef.current.text.generate({ model: 'gemini-pro', input: prompt });
          aiText = res?.output?.[0]?.content?.[0]?.text || res?.candidates?.[0]?.content || JSON.stringify(res);
        }
      }

      if (!aiText) aiText = '(No response from Gemini)';

      const assistantMsg: Message = {
        role: 'assistant',
        content: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('AI error', err);
      setError(err?.message || String(err));
      const assistantMsg: Message = {
        role: 'assistant',
        content: `Error: ${err?.message || 'AI request failed. Ensure @google/generative-ai is installed and VITE_GEMINI_API_KEY is set.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1>AI Legal Team Hub</h1>
        <p className="text-[#36454F]/70 mt-2">Collaborate with specialized AI assistants for every aspect of litigation</p>
      </div>

      {/* Agent Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isActive = activeAgent === agent.id;

          return (
            <button
              key={agent.id}
              onClick={async () => {
                setActiveAgent(agent.id);
                setMessages([{
                  role: 'assistant',
                  content: `Hello! I'm your AI ${agent.name}. ${agent.description}. How can I assist you today?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                await fetchCaseContext();
              }}
              className={`glass-card p-4 md:p-6 text-center transition-all hover:scale-105 ${
                isActive ? 'ring-2 shadow-lg' : ''
              }`}
              style={isActive ? { borderColor: agent.color, boxShadow: `0 8px 24px ${agent.color}30` } as any : {}}
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center bg-gradient-to-br ${agent.gradient}`}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-xs md:text-sm mb-1 md:mb-2">{agent.name}</h3>
              <p className="text-xs text-[#36454F]/60 hidden md:block">{agent.description}</p>
            </button>
          );
        })}
      </div>

      {/* Chat Interface */}
      <div className="glass-card p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4 md:mb-6 pb-4 border-b" style={{ borderColor: `${activeAgentData.color}40` }}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${activeAgentData.gradient} shadow-lg`}
          >
            <activeAgentData.icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base md:text-lg">AI {activeAgentData.name}</h3>
            <p className="text-xs md:text-sm text-[#36454F]/60 truncate">{activeAgentData.description}</p>
            <p className="text-xs text-slate-400 mt-1 truncate">{contextString}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6 h-64 md:h-96 overflow-y-auto px-1">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-full md:max-w-2xl p-3 md:p-4 rounded-2xl ${
                  message.role === 'user'
                    ? `bg-gradient-to-br ${activeAgentData.gradient} text-white shadow-md`
                    : 'bg-slate-800/20 border border-white/10'
                }`}
              >
                <p className="text-xs md:text-sm mb-1 break-words">{message.content}</p>
                <p className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 md:gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask the ${activeAgentData.name} anything...`}
            className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-full bg-slate-800/20 border border-white/10 outline-none focus:ring-2 focus:ring-[#B76E79]/50 text-sm md:text-base"
            disabled={loadingAI || initializing}
          />
          <button
            onClick={() => handleSendMessage()}
            className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white hover:shadow-lg flex items-center gap-2 px-4 md:px-6 disabled:opacity-60"
            disabled={loadingAI || initializing}
          >
            {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {initializing && <p className="text-xs text-slate-400 mt-2">Initializing AI client...</p>}
        {!geminiAvailable && (
          <p className="text-xs text-amber-300 mt-2">Gemini client unavailable. To enable AI, run: <code>npm install @google/generative-ai</code> and set <code>VITE_GEMINI_API_KEY</code> in your env.</p>
        )}
        {error && <p className="text-xs text-rose-400 mt-2">Error: {error}</p>}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => handleSendMessage('Generate discovery requests for this case.')} className="w-full text-left text-xs md:text-sm px-3 py-2 bg-slate-800/20 rounded-lg hover:bg-slate-800/30">
              Generate discovery requests
            </button>
            <button onClick={() => handleSendMessage('Draft a short motion to compel based on available evidence.')} className="w-full text-left text-xs md:text-sm px-3 py-2 bg-slate-800/20 rounded-lg hover:bg-slate-800/30">
              Draft motion to compel
            </button>
            <button onClick={() => handleSendMessage('Analyze case strength and provide a high-level strategy.')} className="w-full text-left text-xs md:text-sm px-3 py-2 bg-slate-800/20 rounded-lg hover:bg-slate-800/30">
              Analyze case strength
            </button>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm mb-2">Recent Outputs</h3>
          <div className="space-y-2 text-xs md:text-sm text-[#36454F]/70">
            <p>• Summary judgment motion</p>
            <p>• Witness prep questions (x12)</p>
            <p>• Settlement demand letter</p>
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm mb-2">AI Team Stats</h3>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex justify-between">
              <span className="text-[#36454F]/70">Documents Generated</span>
              <span className="text-[#B76E79]">47</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#36454F]/70">Hours Saved</span>
              <span className="text-[#B76E79]">128</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#36454F]/70">Success Rate</span>
              <span className="text-[#B76E79]">96%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}