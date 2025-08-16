import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from '../hooks/use-toast';
import { extractPDFText } from '../utils/api';

const FileUpload = ({ onFileSelect, onTextInput, placeholder, accept = ".pdf,.txt,.doc,.docx" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'text'
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      if (selectedFile.type === 'application/pdf') {
        // Extract text from PDF
        const result = await extractPDFText(selectedFile);
        onFileSelect && onFileSelect(result.extracted_text, selectedFile.name);
        
        toast({
          title: "PDF processed successfully!",
          description: `Extracted text from ${result.page_count} page(s)`,
        });
      } else {
        // Handle text files
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          onFileSelect && onFileSelect(text, selectedFile.name);
        };
        reader.readAsText(selectedFile);
        
        toast({
          title: "File uploaded successfully!",
          description: `Processed ${selectedFile.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "File processing failed",
        description: error.message,
        variant: "destructive",
      });
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTextInput && onTextInput(textInput.trim());
      toast({
        title: "Text processed successfully!",
        description: "Your text has been added.",
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setTextInput('');
    onFileSelect && onFileSelect('', '');
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <Button
          variant={inputMode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('upload')}
          disabled={isProcessing}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <Button
          variant={inputMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('text')}
          disabled={isProcessing}
        >
          <FileText className="w-4 h-4 mr-2" />
          Paste Text
        </Button>
      </div>

      {inputMode === 'upload' ? (
        <div className="space-y-4">
          {!file ? (
            <Card 
              className={`border-2 border-dashed transition-colors cursor-pointer hover:border-primary/50 ${
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
              } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
            >
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {isProcessing ? (
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      {isProcessing ? 'Processing...' : placeholder}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {isProcessing ? 'Extracting text from file' : 'Drag and drop or click to browse'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports PDF, DOC, DOCX, TXT files
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">{file.name}</p>
                      <p className="text-sm text-green-700">
                        {file.type === 'application/pdf' ? 'PDF processed' : `${(file.size / 1024).toFixed(1)} KB`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-green-700 hover:bg-green-100"
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            disabled={isProcessing}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`Paste your ${placeholder.toLowerCase()} text here...`}
            className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isProcessing}
          />
          <Button
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Process Text'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;