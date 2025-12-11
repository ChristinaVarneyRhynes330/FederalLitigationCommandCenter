import { useState, useRef, useEffect } from 'react';
import { Brain, FileEdit, ClipboardCheck, Handshake, MessageSquare, Send, Loader2, FileText, Sparkles } from 'lucide-react';
import { callGemini, AI_PROMPTS } from '../utils/gemini';
import { AIAgent } from './illustrations/AIAgent';

type Agent = 'strategist' | 'drafter' | 'clerk' | 'negotiator' | 'examiner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AILegalTeamEnhancedProps {
  apiKey: string;
}

export function AILegalTeamEnhanced({ apiKey }: AILegalTeamEnhancedProps) {
  const [activeAgent, setActiveAgent] = useState<Agent>('strategist');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Legal Strategist. I can help you develop case strategy, identify legal theories, and plan your litigation approach. What would you like to discuss?',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents = [
    {
      id: 'strategist' as Agent,
      name: 'Strategist',
      icon: Brain,
      description: 'Case strategy and legal theory development',
      color: '#4B5563',
      gradient: 'from-gray-600 to-gray-700',
      welcomeMessage: 'Hello! I\'m your AI Legal Strategist. I help develop case strategy, identify legal theories, and plan litigation approaches. What would you like to discuss?'
    },
    {
      id: 'drafter' as Agent,
      name: 'Drafter',
      icon: FileEdit,
      description: 'Motion and brief generation',
      color: '#B76E79',
      gradient: 'from-[#B76E79] to-[#8B4B56]',
      welcomeMessage: 'Hello! I\'m your AI Drafter. I can help you draft motions, briefs, and legal documents. What would you like me to write?'
    },
    {
      id: 'clerk' as Agent,
      name: 'Clerk',
      icon: ClipboardCheck,
      description: 'Compliance and procedural checks',
      color: '#0D9488',
      gradient: 'from-[#0D9488] to-[#0F766E]',
      welcomeMessage: 'Hello! I\'m your AI Clerk. I ensure procedural compliance and check filing requirements. What would you like me to review?'
    },
    {
      id: 'negotiator' as Agent,
      name: 'Negotiator',
      icon: Handshake,
      description: 'Settlement analysis and negotiation support',
      color: '#6B7280',
      gradient: 'from-gray-500 to-gray-600',
      welcomeMessage: 'Hello! I\'m your AI Negotiator. I analyze settlement opportunities and develop negotiation strategies. How can I assist?'
    },
    {
      id: 'examiner' as Agent,
      name: 'Cross-Examiner',
      icon: MessageSquare,
      description: 'Witness preparation and question drafting',
      color: '#8B4B56',
      gradient: 'from-[#8B4B56] to-[#B76E79]',
      welcomeMessage: 'Hello! I\'m your AI Cross-Examiner. I help prepare witness examinations and draft impeachment questions. Who are we examining?'
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const promptMap: Record<Agent, string> = {
        strategist: AI_PROMPTS.strategist,
        drafter: AI_PROMPTS.drafter,
        clerk: AI_PROMPTS.clerk,
        negotiator: AI_PROMPTS.negotiator,
        examiner: AI_PROMPTS.examiner,
      };

      const response = await callGemini(
        input,
        promptMap[activeAgent],
        apiKey
      );

      const aiResponse: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `⚠️ ${error instanceof Error ? error.message : 'Failed to get response'}. Please check your API key in Settings.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const activeAgentData = agents.find(a => a.id === activeAgent)!;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1>AI Legal Team Hub</h1>
        <p className="text-[#36454F]/70 mt-2">Collaborate with specialized AI assistants powered by Gemini</p>
      </div>

      {/* Agent Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isActive = activeAgent === agent.id;
          
          return (
            <button
              key={agent.id}
              onClick={() => {
                setActiveAgent(agent.id);
                setMessages([{
                  role: 'assistant',
                  content: agent.welcomeMessage,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                }]);
              }}
              className={`glass-card p-4 md:p-6 text-center transition-all hover:scale-105 ${
                isActive ? 'ring-2 shadow-lg' : ''
              }`}
              style={isActive ? { borderColor: agent.color, boxShadow: `0 8px 24px ${agent.color}30` } : {}}
            >
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full mx-auto mb-2 md:mb-3 flex items-center justify-center bg-gradient-to-br ${agent.gradient} shadow-md`}
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
          <div className="min-w-0 flex-1">
            <h3 className="text-base md:text-lg">AI {activeAgentData.name}</h3>
            <p className="text-xs md:text-sm text-[#36454F]/60 truncate">{activeAgentData.description}</p>
          </div>
          {!apiKey && (
            <div className="hidden md:block">
              <span className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full">
                API Key Required
              </span>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6 h-64 md:h-96 overflow-y-auto pr-2">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-full md:max-w-2xl p-3 md:p-4 rounded-2xl ${
                  message.role === 'user'
                    ? `bg-gradient-to-br ${activeAgentData.gradient} text-white shadow-md`
                    : 'bg-white/60 border border-[#E1EAE5]'
                }`}
              >
                <p className="text-xs md:text-sm mb-1 break-words whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-[#36454F]/50'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/60 border border-[#E1EAE5] p-4 rounded-2xl flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: activeAgentData.color }} />
                <span className="text-sm text-[#36454F]/70">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${activeAgentData.name} anything...`}
            disabled={isLoading || !apiKey}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-[#E1EAE5] focus:border-teal focus:outline-none bg-white/60 resize-none text-sm md:text-base disabled:opacity-50"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim() || !apiKey}
            className={`pill-button bg-gradient-to-br ${activeAgentData.gradient} text-white px-6 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ boxShadow: `0 4px 12px ${activeAgentData.color}30` }}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {!apiKey && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              ⚠️ No API key configured. Please add your Gemini API key in Settings to use AI features.
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-card-teal p-6 border border-teal/30">
        <h3 className="mb-3 text-teal flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Quick Tips for {activeAgentData.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#36454F]/80">
          {activeAgent === 'strategist' && (
            <>
              <div>• "What legal theories apply to my breach of contract case?"</div>
              <div>• "How should I respond to defendant's motion to dismiss?"</div>
              <div>• "What are the strengths and weaknesses of my case?"</div>
              <div>• "What discovery should I pursue?"</div>
            </>
          )}
          {activeAgent === 'drafter' && (
            <>
              <div>• "Draft a motion for extension of time"</div>
              <div>• "Write an opposition to summary judgment"</div>
              <div>• "Create a demand letter"</div>
              <div>• "Draft discovery requests"</div>
            </>
          )}
          {activeAgent === 'clerk' && (
            <>
              <div>• "Check my filing deadlines"</div>
              <div>• "Review this motion for procedural compliance"</div>
              <div>• "What are the local rules for expert disclosure?"</div>
              <div>• "Is my brief properly formatted?"</div>
            </>
          )}
          {activeAgent === 'negotiator' && (
            <>
              <div>• "What's my case worth for settlement?"</div>
              <div>• "Analyze this settlement offer"</div>
              <div>• "What's my negotiation leverage?"</div>
              <div>• "Draft a settlement counter-proposal"</div>
            </>
          )}
          {activeAgent === 'examiner' && (
            <>
              <div>• "Draft cross-examination questions for [witness]"</div>
              <div>• "How do I impeach this witness?"</div>
              <div>• "Prepare direct examination outline"</div>
              <div>• "What objections should I anticipate?"</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}