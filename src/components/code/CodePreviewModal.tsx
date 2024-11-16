import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CodeBlock } from './CodeBlock';
import { ScrollArea } from '../ui/scroll-area';

interface CodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  codes: {
    html?: string;
    css?: string;
    javascript?: string;
  };
  preview?: string;
}

export const CodePreviewModal: React.FC<CodePreviewModalProps> = ({
  isOpen,
  onClose,
  codes,
  preview
}) => {
  const getPreviewContent = () => {
    if (!preview) return '';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:">
          <title>Preview</title>
        </head>
        <body>${preview}</body>
      </html>
    `;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>コードプレビュー</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="preview" className="flex-1 flex flex-col">
          <TabsList className="mb-2">
            <TabsTrigger value="preview">プレビュー</TabsTrigger>
            {codes.html && <TabsTrigger value="html">HTML</TabsTrigger>}
            {codes.css && <TabsTrigger value="css">CSS</TabsTrigger>}
            {codes.javascript && <TabsTrigger value="js">JavaScript</TabsTrigger>}
          </TabsList>

          <div className="flex-1 min-h-0">
            <TabsContent value="preview" className="h-full m-0">
              <div className="w-full h-full border rounded-lg overflow-hidden bg-white">
                {preview ? (
                  <iframe
                    srcDoc={getPreviewContent()}
                    className="w-full h-full border-none"
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    プレビューはありません
                  </div>
                )}
              </div>
            </TabsContent>

            {codes.html && (
              <TabsContent value="html" className="m-0 h-full">
                <ScrollArea className="h-full rounded-md">
                  <CodeBlock code={codes.html} language="html" />
                </ScrollArea>
              </TabsContent>
            )}

            {codes.css && (
              <TabsContent value="css" className="m-0 h-full">
                <ScrollArea className="h-full rounded-md">
                  <CodeBlock code={codes.css} language="css" />
                </ScrollArea>
              </TabsContent>
            )}

            {codes.javascript && (
              <TabsContent value="js" className="m-0 h-full">
                <ScrollArea className="h-full rounded-md">
                  <CodeBlock code={codes.javascript} language="javascript" />
                </ScrollArea>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};