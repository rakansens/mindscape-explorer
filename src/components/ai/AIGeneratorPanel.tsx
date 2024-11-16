import { Panel } from 'reactflow';
import { Settings2 } from 'lucide-react';
import { Button } from '../ui/button';
import { AIGeneratorForm } from './AIGeneratorForm';
import { AIGeneratorButton } from './AIGeneratorButton';
import { APIKeyInputDialog } from '../api/APIKeyInputDialog';
import { useApiKeyStore } from '../../store/apiKeyStore';
import { ModelType } from '../../types/models';

interface APIKeyConfig {
  type: ModelType;
  apiKey: string;
  geminiKey?: string;
}

export function AIGeneratorPanel() {
  const { openaiKey, setOpenAIKey, setGeminiKey } = useApiKeyStore();
  const [showAPIKeyInput, setShowAPIKeyInput] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleAPIKeySubmit = (config: APIKeyConfig) => {
    if (config.type.includes('GEMINI')) {
      setGeminiKey(config.geminiKey || '');
    } else {
      setOpenAIKey(config.apiKey);
    }
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
            <AIGeneratorForm onClose={() => setIsOpen(false)} />
          ) : (
            <AIGeneratorButton onClick={() => setIsOpen(true)} />
          )}
        </div>
      </Panel>
    </>
  );
}