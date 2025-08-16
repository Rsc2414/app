import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, Copy, Edit3, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CustomizedResume = ({ originalResume, jobDescription, customizedResume, isProcessing }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedResume, setEditedResume] = useState(customizedResume);
  const { toast } = useToast();

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

  const mockImprovements = [
    "Added 15 relevant keywords for ATS optimization",
    "Restructured experience to match job requirements",
    "Enhanced skills section with job-specific technologies",
    "Optimized formatting for ATS scanning",
    "Tailored summary to align with role expectations"
  ];

  const mockKeywords = [
    "React", "JavaScript", "Node.js", "Python", "AWS", "Docker", 
    "Agile", "Scrum", "API Development", "Database Design"
  ];

  if (isProcessing) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium">Customizing your resume...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Analyzing job requirements and optimizing content
          </p>
        </CardContent>
      </Card>
    );
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
                {mockImprovements.map((improvement, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Added Keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {mockKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
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