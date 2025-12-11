import { X, FileText, Timer, Sparkles, Loader2, Gavel as GavelIcon } from 'lucide-react';
import { useState } from 'react';
import { Courtroom } from './illustrations/Courtroom';
import { Gavel } from './illustrations/Gavel';

interface HearingModeProps {
  onExit: () => void;
  onSimulateJudge?: (script: string) => Promise<string>;
}

export function HearingMode({ onExit, onSimulateJudge }: HearingModeProps) {
  const [hearingScript, setHearingScript] = useState('');
  const [judgeQuestions, setJudgeQuestions] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateJudge = async () => {
    if (!hearingScript.trim()) {
      alert('Please enter your hearing script first');
      return;
    }

    setIsSimulating(true);
    setJudgeQuestions('');

    try {
      if (onSimulateJudge) {
        const questions = await onSimulateJudge(hearingScript);
        setJudgeQuestions(questions);
      }
    } catch (error) {
      setJudgeQuestions('⚠️ Unable to simulate judge questions. Please check your API key.');
    } finally {
      setIsSimulating(false);
    }
  };

  const openingStatements = [
    'May it please the Court, counsel, ladies and gentlemen of the jury',
    'This case is about a broken promise and a breach of trust',
    'The evidence will show that on March 15, 2024, the defendant entered into a clear, unambiguous contract',
    'You will hear from witnesses who were present when this agreement was made',
    'The documentary evidence - particularly Exhibit 1, the signed contract - speaks for itself',
    'At the conclusion of this trial, we will ask you to hold the defendant accountable',
  ];

  const exhibits = [
    { number: 'EX-001-0001', name: 'Employment Contract', category: 'Key Evidence' },
    { number: 'EX-001-0045', name: 'Email Thread - Project Alpha', category: 'Correspondence' },
    { number: 'EX-002-0001', name: 'Witness Interview - Jane Doe', category: 'Testimony' },
    { number: 'EX-003-0001', name: 'Security Footage - Lobby', category: 'Surveillance' },
    { number: 'EX-004-0001', name: 'Product Defect Photo', category: 'Physical Evidence' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#B76E79] to-[#8B4B56] flex items-center justify-center">
              <Timer className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl md:text-3xl">Hearing Mode</h1>
              <p className="text-white/60 mt-1 text-sm md:text-base">Focus Mode • Courtroom Prep</p>
            </div>
          </div>
          <button
            onClick={onExit}
            className="pill-button bg-white/10 text-white hover:bg-white/20 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <X className="w-4 h-4" />
            Exit Hearing Mode
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Script Editor - Takes 2/3 width */}
          <div className="lg:col-span-2 glass-card-dark p-4 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg md:text-2xl">Hearing Script</h2>
              <button
                onClick={handleSimulateJudge}
                disabled={isSimulating}
                className="pill-button bg-gradient-to-r from-[#66B2A0] to-[#4E796B] text-white text-sm flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSimulating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Simulate Judge
              </button>
            </div>
            
            <textarea
              value={hearingScript}
              onChange={(e) => setHearingScript(e.target.value)}
              placeholder="Type your opening statement, argument outline, or witness examination script here...

Example:
'May it please the Court. This case concerns a clear breach of contract. The evidence will show that the defendant failed to perform their obligations under the March 15, 2024 agreement, specifically...'

The AI will predict questions the judge might ask based on your script."
              className="w-full h-96 md:h-[500px] bg-[#1a1a1a] text-white/90 placeholder-white/30 border border-white/10 rounded-lg p-6 outline-none focus:ring-2 focus:ring-teal/50 resize-none text-base md:text-lg font-serif leading-relaxed"
            />
          </div>

          {/* Judge Simulator - Takes 1/3 width */}
          <div className="space-y-4 md:space-y-6">
            <div className="glass-card-dark p-4 md:p-6">
              <h3 className="text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal" />
                Judge Questions
              </h3>
              
              {!judgeQuestions && !isSimulating && (
                <p className="text-white/50 text-sm">
                  Click "Simulate Judge" to predict questions the judge might ask based on your script.
                </p>
              )}

              {isSimulating && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-teal animate-spin" />
                  <span className="ml-3 text-white/70 text-sm">Analyzing argument...</span>
                </div>
              )}

              {judgeQuestions && !isSimulating && (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {judgeQuestions.split('\n').filter(q => q.trim()).map((question, idx) => (
                    <div key={idx} className="p-3 bg-white/5 rounded-lg border-l-4 border-teal">
                      <p className="text-white/90 text-sm leading-relaxed">{question}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-3">
              <div className="glass-card-dark p-4 text-center">
                <p className="text-white/70 text-xs mb-1">Script Words</p>
                <p className="text-white text-xl">{hearingScript.split(/\s+/).filter(w => w).length}</p>
              </div>
              <div className="glass-card-dark p-4 text-center">
                <p className="text-white/70 text-xs mb-1">Est. Speaking Time</p>
                <p className="text-white text-xl">
                  {Math.ceil(hearingScript.split(/\s+/).filter(w => w).length / 150)} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exhibit Reference - Below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Opening Statement */}
          <div className="glass-card-dark p-4 md:p-8">
            <h2 className="text-white mb-4 md:mb-6 text-lg md:text-2xl">Opening Statement</h2>
            <div className="space-y-3 md:space-y-4">
              {openingStatements.map((statement, idx) => (
                <div key={idx} className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#B76E79]/30 text-white flex items-center justify-center text-xs md:text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-white/90 text-sm md:text-lg leading-relaxed">{statement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exhibit List */}
          <div className="glass-card-dark p-4 md:p-8">
            <h2 className="text-white mb-4 md:mb-6 text-lg md:text-2xl">Exhibit List</h2>
            <div className="space-y-2 md:space-y-3">
              {exhibits.map((exhibit, idx) => (
                <div key={idx} className="p-3 md:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-[#B76E79] flex-shrink-0" />
                    <span className="px-2 md:px-3 py-1 bg-[#B76E79]/30 text-white rounded-full text-xs md:text-sm whitespace-nowrap">
                      {exhibit.number}
                    </span>
                  </div>
                  <p className="text-white text-sm md:text-lg mb-1">{exhibit.name}</p>
                  <p className="text-white/60 text-xs md:text-sm">{exhibit.category}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Reference */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
          <div className="glass-card-dark p-4 md:p-6 text-center">
            <p className="text-white/70 text-xs md:text-sm mb-2">Key Witnesses</p>
            <p className="text-white text-xl md:text-2xl">4</p>
          </div>
          <div className="glass-card-dark p-4 md:p-6 text-center">
            <p className="text-white/70 text-xs md:text-sm mb-2">Total Exhibits</p>
            <p className="text-white text-xl md:text-2xl">{exhibits.length}</p>
          </div>
          <div className="glass-card-dark p-4 md:p-6 text-center">
            <p className="text-white/70 text-xs md:text-sm mb-2">Trial Day</p>
            <p className="text-white text-xl md:text-2xl">1 of 5</p>
          </div>
        </div>

        {/* Notes Area */}
        <div className="glass-card-dark p-4 md:p-8 mt-4 md:mt-6">
          <h3 className="text-white mb-4">Live Trial Notes</h3>
          <textarea
            placeholder="Type notes during the hearing..."
            className="w-full h-32 md:h-40 bg-white/5 text-white placeholder-white/40 border border-white/10 rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#B76E79]/50 resize-none text-sm md:text-base"
          />
        </div>
      </div>
    </div>
  );
}