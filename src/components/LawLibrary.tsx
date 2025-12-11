import { useState } from 'react';
import { BookOpen, Search, ExternalLink, Sparkles, Scale, Loader2 } from 'lucide-react';
import { callGemini, AI_PROMPTS } from '../utils/gemini';

interface LegalConcept {
  id: string;
  term: string;
  category: string;
  definition: string;
  keyPoints: string[];
  scholarLink: string;
}

interface LawLibraryProps {
  apiKey: string;
}

export function LawLibrary({ apiKey }: LawLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<LegalConcept | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResearch = async () => {
    if (!aiQuestion.trim()) return;
    
    setIsLoading(true);
    setAiResponse('');

    try {
      const response = await callGemini(aiQuestion, AI_PROMPTS.researcher, apiKey);
      setAiResponse(response);
    } catch (error) {
      setAiResponse(`⚠️ ${error instanceof Error ? error.message : 'Failed to get response'}. Please check your API key in Settings.`);
    } finally {
      setIsLoading(false);
    }
  };

  const legalConcepts: LegalConcept[] = [
    {
      id: '1',
      term: 'Summary Judgment',
      category: 'Civil Procedure',
      definition: 'A judgment entered by a court for one party against another party without a full trial. Summary judgment is granted when there is no genuine dispute as to any material fact and the movant is entitled to judgment as a matter of law.',
      keyPoints: [
        'Federal Rule of Civil Procedure 56',
        'Moving party must show no genuine dispute of material fact',
        'Court views evidence in light most favorable to non-moving party',
        'Standard: "reasonable jury could not return verdict for non-moving party"'
      ],
      scholarLink: 'https://scholar.google.com/scholar?q=summary+judgment+federal+rule+56'
    },
    {
      id: '2',
      term: 'Bates Stamping',
      category: 'Evidence',
      definition: 'A method of indexing legal documents by placing identifying numbers or marks on documents. Named after the Bates automatic numbering machine. Essential for organizing evidence and maintaining chain of custody.',
      keyPoints: [
        'Ensures documents can be easily referenced',
        'Creates audit trail for discovery',
        'Format typically: PREFIX-NUMBER-PAGE (e.g., EX-001-0045)',
        'Required in most litigation for exhibit identification'
      ],
      scholarLink: 'https://scholar.google.com/scholar?q=bates+stamping+evidence+discovery'
    },
    {
      id: '3',
      term: 'Promissory Estoppel',
      category: 'Contract Law',
      definition: 'A legal principle that a promise is enforceable by law even if made without formal consideration when a promisor has made a promise to a promisee who relies on that promise to their detriment.',
      keyPoints: [
        'Elements: (1) Promise, (2) Reliance, (3) Injustice without enforcement',
        'Alternative to traditional contract formation',
        'Restatement (Second) of Contracts § 90',
        'Commonly used when contract fails for lack of consideration'
      ],
      scholarLink: 'https://scholar.google.com/scholar?q=promissory+estoppel+restatement+contracts'
    },
    {
      id: '4',
      term: 'Discovery',
      category: 'Civil Procedure',
      definition: 'The pre-trial phase in a lawsuit where each party can obtain evidence from the other party through interrogatories, depositions, requests for production, and requests for admission.',
      keyPoints: [
        'Federal Rules 26-37 govern discovery',
        'Types: Interrogatories, RFP, RFA, Depositions',
        'Scope: relevant to claims or defenses',
        'Subject to privilege and work product protection'
      ],
      scholarLink: 'https://scholar.google.com/scholar?q=federal+rules+civil+procedure+discovery'
    },
    {
      id: '5',
      term: 'Expert Witness',
      category: 'Evidence',
      definition: 'A witness who has specialized knowledge, skill, experience, training, or education that qualifies them to provide opinion testimony to assist the trier of fact in understanding evidence or determining a fact in issue.',
      keyPoints: [
        'Federal Rule of Evidence 702',
        'Must meet Daubert/Frye standards for admissibility',
        'Required disclosures under Rule 26(a)(2)',
        'May provide opinions on ultimate issues (Rule 704)'
      ],
      scholarLink: 'https://scholar.google.com/scholar?q=expert+witness+testimony+daubert+standard'
    },
  ];

  const filteredConcepts = legalConcepts.filter(concept =>
    concept.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concept.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAskAI = () => {
    if (!aiQuestion.trim()) return;
    
    // Simulate AI response
    setSelectedConcept({
      id: 'ai-response',
      term: 'AI Legal Analysis',
      category: 'AI Explanation',
      definition: `Based on your question: "${aiQuestion}" - In the context of your case, this legal concept is particularly relevant because it addresses the core issues of contract formation and enforcement. The court will likely consider whether all essential elements were met and whether any defenses apply.`,
      keyPoints: [
        'Review relevant case law in your jurisdiction',
        'Consider recent precedents from controlling courts',
        'Analyze factual distinctions from cited cases',
        'Prepare arguments for alternative legal theories'
      ],
      scholarLink: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(aiQuestion)
    });
    setAiQuestion('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1>Law Library</h1>
        <p className="text-[#36454F]/70 mt-2">AI-powered legal research and explanations</p>
      </div>

      {/* AI Question Interface */}
      <div className="panel panel-accent-gray p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-wrapper icon-wrapper-gray">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg md:text-2xl">Ask AI Legal Assistant</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleResearch()}
            placeholder="Ask about any legal concept or case strategy..."
            className="input"
            disabled={isLoading}
          />
          <button
            onClick={handleResearch}
            disabled={isLoading || !aiQuestion.trim()}
            className="btn btn-outline-gray whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Researching...
              </>
            ) : (
              'Get Explanation'
            )}
          </button>
        </div>
        
        {/* AI Response */}
        {aiResponse && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Concept Browser */}
        <div className="lg:col-span-1 glass-card p-4 md:p-6">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-[#36454F]/40" />
              <input
                type="text"
                placeholder="Search concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[#36454F] placeholder-[#36454F]/40 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-96 lg:max-h-[600px] overflow-y-auto">
            {filteredConcepts.map((concept) => (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept)}
                className={`w-full text-left p-3 rounded-lg transition-all text-sm md:text-base ${
                  selectedConcept?.id === concept.id
                    ? 'bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              >
                <p className="mb-1">{concept.term}</p>
                <p className={`text-xs ${
                  selectedConcept?.id === concept.id ? 'text-white/70' : 'text-[#36454F]/60'
                }`}>
                  {concept.category}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Concept Details */}
        <div className="lg:col-span-2 glass-card p-4 md:p-6">
          {selectedConcept ? (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="mb-2 text-xl md:text-2xl">{selectedConcept.term}</h2>
                  <span className="px-3 py-1 bg-[#B76E79]/20 text-[#B76E79] rounded-full text-sm">
                    {selectedConcept.category}
                  </span>
                </div>
                <a
                  href={selectedConcept.scholarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pill-button bg-white/60 hover:bg-white/80 text-[#36454F] flex items-center gap-2 text-sm whitespace-nowrap self-start"
                >
                  <ExternalLink className="w-4 h-4" />
                  Google Scholar
                </a>
              </div>

              <div className="mb-6">
                <h3 className="mb-3">Definition</h3>
                <p className="text-[#36454F]/80 leading-relaxed text-sm md:text-base">
                  {selectedConcept.definition}
                </p>
              </div>

              <div>
                <h3 className="mb-3">Key Points</h3>
                <div className="space-y-3">
                  {selectedConcept.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-white/40 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#B76E79]/20 text-[#B76E79] flex items-center justify-center text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-xs md:text-sm text-[#36454F]/80">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs md:text-sm text-blue-900">
                  <strong>💡 Practice Tip:</strong> Always verify legal research with current case law 
                  and consult local rules, as legal standards may vary by jurisdiction.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 md:py-20">
              <Scale className="w-16 h-16 md:w-20 md:h-20 text-[#36454F]/20 mb-4" />
              <h3 className="mb-2">Select a Legal Concept</h3>
              <p className="text-sm md:text-base text-[#36454F]/60">
                Choose a topic from the list or ask the AI assistant a question
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Reference Cards */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <div className="glass-card p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-[#B76E79]" />
            <h3 className="text-xs md:text-sm">Total Concepts</h3>
          </div>
          <p className="text-xl md:text-2xl text-[#B76E79]">{legalConcepts.length}</p>
        </div>
        <div className="glass-card p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#B76E79]" />
            <h3 className="text-xs md:text-sm">AI Explanations</h3>
          </div>
          <p className="text-xl md:text-2xl text-[#B76E79]">Unlimited</p>
        </div>
        <div className="glass-card p-3 md:p-4">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-[#B76E79]" />
            <h3 className="text-xs md:text-sm">Scholar Links</h3>
          </div>
          <p className="text-xl md:text-2xl text-[#B76E79]">Verified</p>
        </div>
      </div>
    </div>
  );
}