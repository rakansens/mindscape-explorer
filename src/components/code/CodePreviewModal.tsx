import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CodeBlock } from './CodeBlock';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>コードプレビュー</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="preview" className="w-full h-full">
          <TabsList>
            <TabsTrigger value="preview">プレビュー</TabsTrigger>
            {codes.html && <TabsTrigger value="html">HTML</TabsTrigger>}
            {codes.css && <TabsTrigger value="css">CSS</TabsTrigger>}
            {codes.javascript && <TabsTrigger value="js">JavaScript</TabsTrigger>}
          </TabsList>
          <TabsContent value="preview" className="h-full">
            <div className="w-full h-full border rounded-lg p-4 overflow-auto">
              {preview ? (
                <iframe
                  srcDoc={preview}
                  className="w-full h-full border-none"
                  title="Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  プレビューはありません
                </div>
              )}
            </div>
          </TabsContent>
          {codes.html && (
            <TabsContent value="html">
              <CodeBlock code={codes.html} language="html" />
            </TabsContent>
          )}
          {codes.css && (
            <TabsContent value="css">
              <CodeBlock code={codes.css} language="css" />
            </TabsContent>
          )}
          {codes.javascript && (
            <TabsContent value="js">
              <CodeBlock code={codes.javascript} language="javascript" />
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};