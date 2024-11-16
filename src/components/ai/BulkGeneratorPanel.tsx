import React, { useState } from 'react';
import { Panel } from 'reactflow';
import { Settings2 } from 'lucide-react';
import { Button } from '../ui/button';
import { BulkGeneratorForm } from './BulkGeneratorForm';
import { BulkGeneratorButton } from './BulkGeneratorButton';
import { APIKeyInputDialog } from '../APIKeyInputDialog';
import { useApiKeyStore } from '../../store/apiKeyStore';

export function BulkGeneratorPanel() {
  const { openaiKey, setOpenAIKey, setGeminiKey } = useApiKeyStore();
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleAPIKeySubmit = (config: { apiKey: string; geminiKey: string }) => {
    setOpenAIKey(config.apiKey);
    setGeminiKey(config.geminiKey);
    setShowAPIKeyInput(false);
  };

  return (
    <>
      {showAPIKeyInput && (
        <APIKeyInputDialog onSubmit={handleAPIKeySubmit} />
      )}
      <Panel position="bottom-right" className="mr-4 mb-4">
        <div className="flex flex-col gap-2">
          {!openaiKey && (
            <Button
              onClick={() => setShowAPIKeyInput(true)}
              className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              <Settings2 className="w-4 h-4" />
              <span>APIキーを設定</span>
            </Button>
          )}
          {isOpen ? (
            <BulkGeneratorForm 
              onClose={() => setIsOpen(false)} 
              onShowAPIKeyInput={() => setShowAPIKeyInput(true)}
            />
          ) : (
            <BulkGeneratorButton onClick={() => setIsOpen(true)} />
          )}
        </div>
      </Panel>
    </>
  );
}