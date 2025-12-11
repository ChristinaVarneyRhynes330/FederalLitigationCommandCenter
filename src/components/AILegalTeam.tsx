import { useState } from 'react';
import { Brain, FileEdit, ClipboardCheck, Handshake, MessageSquare, Send } from 'lucide-react';

type Agent = 'strategist' | 'drafter' | 'clerk' | 'negotiator' | 'examiner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function AILegalTeam() {
  const [activeAgent, setActiveAgent] = useState<Agent>('strategist');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Legal Strategist. I can help you develop case strategy, identify legal theories, and plan your litigation approach. What would you like to discuss?',
      timestamp: '10:30 AM'
    }
  ]);

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

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        strategist: 'Based on the facts of your case, I recommend focusing on the breach of contract theory. The email evidence from EX-001-0045 strongly supports your position. Consider also developing a promissory estoppel argument as an alternative theory.',
        drafter: 'I\'ve drafted a Motion for Summary Judgment based on the evidence in your vault. The motion emphasizes the unambiguous contract terms and the defendant\'s clear breach. Would you like me to add any specific legal arguments?',
        clerk: 'I\'ve reviewed your proposed filing. Please note: The local rules require a separate statement of material facts. Also, your expert disclosure deadline is in 14 days. All procedural requirements are otherwise met.',
        negotiator: 'Analyzing settlement value: Based on comparable cases and your evidence strength (87%), I estimate settlement range of $250K-$450K. The defendant\'s recent financial disclosures suggest they may be motivated to settle quickly.',
        examiner: 'For your witness Jane Doe, I recommend these cross-examination questions: 1) "You stated in your deposition that you never saw the contract, correct?" 2) "But you were present at the meeting on March 15th?" This creates foundation for impeachment.'
      };

      const aiResponse: Message = {
        role: 'assistant',
        content: responses[activeAgent],
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const activeAgentData = agents.find(a => a.id === activeAgent)!;

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
              onClick={() => {
                setActiveAgent(agent.id);
                setMessages([{
                  role: 'assistant',
                  content: `Hello! I'm your AI ${agent.name}. ${agent.description}. How can I assist you today?`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                }]);
              }}
              className={`glass-card p-4 md:p-6 text-center transition-all hover:scale-105 ${
                isActive ? 'ring-2 shadow-lg' : ''
              }`}
              style={isActive ? { borderColor: agent.color, boxShadow: `0 8px 24px ${agent.color}30` } : {}}
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
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6 h-64 md:h-96 overflow-y-auto">
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
                <p className="text-xs md:text-sm mb-1 break-words">{message.content}</p>
                <p className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-[#36454F]/50'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 md:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask the ${activeAgentData.name} anything...`}
            className="flex-1 px-3 md:px-4 py-2 md:py-3 rounded-full bg-white/60 border border-white/80 outline-none focus:ring-2 focus:ring-[#B76E79]/50 text-sm md:text-base"
          />
          <button
            onClick={handleSend}
            className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white hover:shadow-lg flex items-center gap-2 px-4 md:px-6"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-xs md:text-sm px-3 py-2 bg-white/40 rounded-lg hover:bg-white/60">
              Generate discovery requests
            </button>
            <button className="w-full text-left text-xs md:text-sm px-3 py-2 bg-white/40 rounded-lg hover:bg-white/60">
              Draft motion to compel
            </button>
            <button className="w-full text-left text-xs md:text-sm px-3 py-2 bg-white/40 rounded-lg hover:bg-white/60">
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