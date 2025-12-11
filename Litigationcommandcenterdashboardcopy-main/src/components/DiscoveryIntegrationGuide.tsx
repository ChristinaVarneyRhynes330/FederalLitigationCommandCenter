import { X, Zap, Shield, Copy, Tag, FileSearch, Brain, CheckCircle, AlertTriangle } from 'lucide-react';

interface GuideProps {
  onClose: () => void;
}

export function DiscoveryIntegrationGuide({ onClose }: GuideProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-card max-w-4xl w-full my-8 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B76E79] to-[#8B4B56] flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl">AI Discovery Automation Guide</h2>
          </div>
          <button onClick={onClose} className="pill-button bg-white/60 hover:bg-white/80 text-[#36454F]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-[#36454F]/80">
          <section>
            <h3 className="mb-3">How It Works (Real-World Implementation)</h3>
            <p className="mb-4">
              The Discovery Manager simulates AI-powered automation for organizing incoming discovery. 
              In a production environment, these features would integrate with actual AI services:
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-[#B76E79]" />
                <h4>Auto-Categorization</h4>
              </div>
              <p className="text-sm mb-3">
                Uses machine learning to classify documents by type (contracts, emails, pleadings, etc.)
              </p>
              <div className="bg-[#36454F]/5 p-3 rounded-lg text-xs">
                <strong>Real Implementation:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>OpenAI GPT-4 Vision API for document analysis</li>
                  <li>Google Cloud Document AI</li>
                  <li>AWS Textract + Comprehend</li>
                  <li>Custom trained models (Hugging Face)</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-red-600" />
                <h4>Privilege Detection</h4>
              </div>
              <p className="text-sm mb-3">
                Automatically flags attorney-client privileged communications
              </p>
              <div className="bg-[#36454F]/5 p-3 rounded-lg text-xs">
                <strong>Real Implementation:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>NLP keyword detection (attorney, privileged, etc.)</li>
                  <li>Email header analysis (sender/recipient)</li>
                  <li>Document metadata extraction</li>
                  <li>Legal-specific AI models</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Copy className="w-5 h-5 text-blue-600" />
                <h4>Duplicate Detection</h4>
              </div>
              <p className="text-sm mb-3">
                Identifies and flags duplicate files using hash comparison
              </p>
              <div className="bg-[#36454F]/5 p-3 rounded-lg text-xs">
                <strong>Real Implementation:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>MD5/SHA-256 hash comparison</li>
                  <li>Near-duplicate detection (fuzzy matching)</li>
                  <li>Email thread deduplication</li>
                  <li>Version control tracking</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileSearch className="w-5 h-5 text-green-600" />
                <h4>OCR Text Extraction</h4>
              </div>
              <p className="text-sm mb-3">
                Extracts searchable text from images and scanned PDFs
              </p>
              <div className="bg-[#36454F]/5 p-3 rounded-lg text-xs">
                <strong>Real Implementation:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Tesseract OCR engine</li>
                  <li>Google Cloud Vision API</li>
                  <li>AWS Textract</li>
                  <li>Azure Computer Vision</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-purple-600" />
                <h4>Smart Tagging</h4>
              </div>
              <p className="text-sm mb-3">
                Automatically generates relevant metadata tags
              </p>
              <div className="bg-[#36454F]/5 p-3 rounded-lg text-xs">
                <strong>Real Implementation:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Named Entity Recognition (NER)</li>
                  <li>Topic modeling algorithms</li>
                  <li>Custom keyword extraction</li>
                  <li>Contextual embedding analysis</li>
                </ul>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-[#B76E79]" />
                <h4>Bates Numbering</h4>
              </div>
              <p className="text-sm mb-3">
                Applies sequential identification numbers to documents
              </p>
              <div className="bg-[#36454F]/5 p-3 rounded-lg text-xs">
                <strong>Real Implementation:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Sequential counter with prefix/suffix</li>
                  <li>Page-level stamping for multi-page docs</li>
                  <li>QR code embedding for tracking</li>
                  <li>Watermark application</li>
                </ul>
              </div>
            </div>
          </div>

          <section className="glass-card p-5 bg-blue-50/50 border border-blue-200">
            <h4 className="mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Zero-Cost Implementation Options
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Current Demo:</strong> All AI features are simulated client-side with no external dependencies.
              </div>
              <div>
                <strong>Free Tier Options for Production:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li><strong>Tesseract.js:</strong> Free, open-source OCR that runs in browser</li>
                  <li><strong>Transformers.js:</strong> Run AI models directly in browser (no server needed)</li>
                  <li><strong>OpenAI Free Tier:</strong> Limited free credits for GPT-based categorization</li>
                  <li><strong>Google Cloud Free Tier:</strong> Document AI with monthly quotas</li>
                  <li><strong>Web Crypto API:</strong> Built-in browser API for file hashing (duplicate detection)</li>
                  <li><strong>IndexedDB:</strong> Browser storage for file metadata and processing history</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="glass-card p-5 bg-green-50/50 border border-green-200">
            <h4 className="mb-3">Recommended Workflow</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Receive Discovery:</strong> Upload files via drag-and-drop or folder import</li>
              <li><strong>AI Processing:</strong> System auto-categorizes, extracts text, detects duplicates</li>
              <li><strong>Review Flagged Items:</strong> Manually review privileged or duplicate detections</li>
              <li><strong>Apply Bates Numbers:</strong> Auto-stamp approved documents sequentially</li>
              <li><strong>Organize & Tag:</strong> AI suggests tags, manual refinement as needed</li>
              <li><strong>Export to Evidence Vault:</strong> Transfer processed files to main repository</li>
            </ol>
          </section>

          <section className="glass-card p-5 bg-yellow-50/50 border border-yellow-200">
            <h4 className="mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Best Practices
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Always manually review privilege flags</strong> - AI is not 100% accurate</li>
              <li>• <strong>Verify duplicate detection</strong> before deleting files</li>
              <li>• <strong>Back up original files</strong> before applying Bates stamping</li>
              <li>• <strong>Maintain audit logs</strong> of all automated processing</li>
              <li>• <strong>Test AI accuracy</strong> with sample batches before full production use</li>
              <li>• <strong>Keep human oversight</strong> for critical categorization decisions</li>
            </ul>
          </section>

          <section>
            <h4 className="mb-3">Integration Timeline</h4>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-[#B76E79]">Week 1-2</div>
                <div className="flex-1 text-sm">Set up file upload system, implement hash-based duplicate detection</div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-[#B76E79]">Week 3-4</div>
                <div className="flex-1 text-sm">Integrate OCR (Tesseract.js), basic text extraction</div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-[#B76E79]">Week 5-6</div>
                <div className="flex-1 text-sm">Add AI categorization (API integration or local model)</div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-[#B76E79]">Week 7-8</div>
                <div className="flex-1 text-sm">Implement privilege detection, auto-tagging, and Bates numbering</div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-[#B76E79]">Week 9-10</div>
                <div className="flex-1 text-sm">Testing, refinement, accuracy tuning</div>
              </div>
            </div>
          </section>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#B76E79]/20">
            <button onClick={onClose} className="pill-button bg-gradient-to-r from-[#B76E79] to-[#8B4B56] text-white">
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}