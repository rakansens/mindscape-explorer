import React, { useState, useRef, useEffect } from 'react';
import { useMindMapStore } from '../../store/mindMapStore';
import { ModelType, getDefaultModelConfig } from '../../types/models';
import { Settings2 } from 'lucide-react';
import { Button } from '../ui/button';
import { APIKeyInputDialog } from '../api/APIKeyInputDialog';

export const ModelSelector: React.FC = () => {
  const [showAPIKeyInput, setShowAPIKeyInput] = useState(false);
  const modelConfig = useMindMapStore(state => state.modelConfig);
  const setModelConfig = useMindMapStore(state => state.setModelConfig);
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (showAPIKeyInput && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // モーダルが画面右端からはみ出す場合
      if (rect.right > viewportWidth) {
        modalRef.current.style.left = 'auto';
        modalRef.current.style.right = '0';
      }

      // モーダルが画面下端からはみ出す場合
      if (rect.bottom > viewportHeight) {
        modalRef.current.style.top = 'auto';
        modalRef.current.style.bottom = '0';
      }
    }
  }, [showAPIKeyInput]);

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
        <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAPIKeyInput(false)} />
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <APIKeyInputDialog
              onSubmit={(config) => {
                setShowAPIKeyInput(false);
              }}
              onClose={() => setShowAPIKeyInput(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};