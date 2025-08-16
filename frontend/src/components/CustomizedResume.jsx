import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, Copy, Edit3, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CustomizedResume = ({ originalResume, jobDescription, customizationResult, isProcessing }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedResume, setEditedResume] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (customizationResult?.customized_resume) {
      setEditedResume(customizationResult.customized_resume);
    }
  }, [customizationResult]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedResume);
      toast({
        title: "Copied to clipboard!",
        description: "Resume text has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editedResume], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "customized-resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started!",
      description: "Your customized resume is being downloaded.",
    });
  };

  const improvements = customizationResult?.improvements || [
    "Processing your resume with AI optimization..."
  ];

  const keywords = customizationResult?.keywords_added || [];

  if (isProcessing) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium">Customizing your resume...</p>
          <p className="text-sm text-muted-foreground mt-2">
            AI is analyzing job requirements and optimizing content
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!customizationResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Improvements Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Optimization Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Key Improvements:</h4>
              <ul className="space-y-1">
                {improvements.map((improvement, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Keywords Added:</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.length > 0 ? (
                  keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Keywords will be shown after processing</p>
                )}
              </div>
            </div>
            {customizationResult?.processing_time && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Processing time: {customizationResult.processing_time}s</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customized Resume */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Your Customized Resume</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {editMode ? 'Save' : 'Edit'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <textarea
              value={editedResume}
              onChange={(e) => setEditedResume(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-gray-800">
                {editedResume}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomizedResume;