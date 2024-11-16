import React, { useState } from 'react';
import { useMindMapStore } from '../../store/mindMapStore';
import { ModelType, getDefaultModelConfig } from '../../types/models';
import { Settings2 } from 'lucide-react';
import { Button } from '../ui/button';
import { APIKeyInputDialog } from '../api/APIKeyInputDialog';

export const ModelSelector: React.FC = () => {
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(false);
  const modelConfig = useMindMapStore(state => state.modelConfig);
  const setModelConfig = useMindMapStore(state => state.setModelConfig);

  const currentModel = modelConfig?.type || 'GPT3.5';

  const handleModelChange = (model: ModelType) => {
    console.log('Changing model to:', model);
    const defaultConfig = getDefaultModelConfig();
    
    const apiKey = model.includes('GEMINI') 
      ? defaultConfig.geminiKey 
      : defaultConfig.apiKey;

    console.log('Using API key type:', model.includes('GEMINI') ? 'Gemini' : 'OpenAI');

    setModelConfig({
      type: model,
      apiKey: apiKey,
      geminiKey: defaultConfig.geminiKey
    });
  };

  return (
    <div className="relative flex items-center gap-2">
      <select
        value={currentModel}
        onChange={(e) => handleModelChange(e.target.value as ModelType)}
        className="px-3 py-1.5 rounded-lg bg-white/50 hover:bg-white/80 
                 border border-blue-100 hover:border-blue-300
                 text-sm text-gray-700 transition-colors
                 cursor-pointer"
        style={{ pointerEvents: 'auto' }}
      >
        <optgroup label="OpenAI GPT">
          <option value="GPT3.5">GPT-3.5</option>
          <option value="GPT4">GPT-4</option>
          <option value="GPT4-Turbo">GPT-4 Turbo</option>
        </optgroup>
        <optgroup label="Google Gemini">
          <option value="GEMINI-PRO">Gemini Pro</option>
          <option value="GEMINI-PRO-VISION">Gemini Pro Vision</option>
          <option value="GEMINI-ULTRA">Gemini Ultra</option>
        </optgroup>
      </select>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowAPIKeyInput(true)}
        className="text-muted-foreground hover:text-foreground"
      >
        <Settings2 className="w-4 h-4" />
      </Button>

      {showAPIKeyInput && (
        <APIKeyInputDialog
          onSubmit={() => setShowAPIKeyInput(false)}
          onClose={() => setShowAPIKeyInput(false)}
        />
      )}
    </div>
  );
};