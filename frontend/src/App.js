import React, { useState } from 'react';
import './App.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { Toaster } from './components/ui/toaster';
import { Badge } from './components/ui/badge';
import { FileText, Target, Zap, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import FileUpload from './components/FileUpload';
import CustomizedResume from './components/CustomizedResume';
import { processResume } from './components/mock';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeText, setResumeText] = useState('');
  const [jobDescText, setJobDescText] = useState('');
  const [customizedResume, setCustomizedResume] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResumeUpload = (text, filename) => {
    setResumeText(text);
    if (text && jobDescText) {
      setCurrentStep(3);
    }
  };

  const handleJobDescUpload = (text, filename) => {
    setJobDescText(text);
    if (resumeText && text) {
      setCurrentStep(3);
    }
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    setCurrentStep(4);
    
    try {
      const result = await processResume(resumeText, jobDescText);
      setCustomizedResume(result.customizedResume);
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setResumeText('');
    setJobDescText('');
    setCustomizedResume('');
    setIsProcessing(false);
  };

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "ATS Optimization",
      description: "Automatically optimize your resume with relevant keywords and formatting for ATS systems"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Matching",
      description: "AI-powered analysis matches your experience with job requirements for maximum relevance"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Professional Formatting",
      description: "Maintains clean, professional formatting that both ATS and human recruiters love"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            ATS Resume Customization Agent
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your resume with AI-powered optimization. Get past ATS systems and land more interviews 
            with resumes tailored to each job description.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[
              { number: 1, label: 'Upload Resume', active: currentStep >= 1 },
              { number: 2, label: 'Add Job Description', active: currentStep >= 2 },
              { number: 3, label: 'Customize', active: currentStep >= 3 },
              { number: 4, label: 'Download', active: currentStep >= 4 }
            ].map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step.active 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.active && step.number < currentStep ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step.active ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content */}
        {currentStep <= 3 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Resume Upload */}
            <Card className={`transition-all duration-300 ${resumeText ? 'ring-2 ring-green-200' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Step 1: Upload Your Resume
                  {resumeText && <CheckCircle className="w-5 h-5 text-green-500" />}
                </CardTitle>
                <CardDescription>
                  Upload your current resume or paste the text directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={handleResumeUpload}
                  onTextInput={handleResumeUpload}
                  placeholder="Upload Your Resume"
                  accept=".pdf,.txt,.doc,.docx"
                />
              </CardContent>
            </Card>

            {/* Job Description Upload */}
            <Card className={`transition-all duration-300 ${jobDescText ? 'ring-2 ring-green-200' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Step 2: Add Job Description
                  {jobDescText && <CheckCircle className="w-5 h-5 text-green-500" />}
                </CardTitle>
                <CardDescription>
                  Paste the job description you're applying for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={handleJobDescUpload}
                  onTextInput={handleJobDescUpload}
                  placeholder="Job Description"
                  accept=".pdf,.txt,.doc,.docx"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Process Button */}
        {currentStep === 3 && resumeText && jobDescText && !customizedResume && (
          <div className="text-center mb-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Ready to Customize!</h3>
                  <p className="text-gray-600">
                    Your resume and job description are ready. Let our AI optimize your resume for this specific role.
                  </p>
                  <Button 
                    onClick={handleProcess} 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Customize My Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Customized Resume</h2>
              <Button 
                onClick={handleReset} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Start Over
              </Button>
            </div>
            
            <CustomizedResume
              originalResume={resumeText}
              jobDescription={jobDescText}
              customizedResume={customizedResume}
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Features Section (only show on initial screen) */}
        {currentStep === 1 && !resumeText && !jobDescText && (
          <div className="mt-16">
            <Separator className="mb-12" />
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Why Use Our ATS Agent?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered system analyzes job descriptions and optimizes your resume 
                to pass ATS filters and impress hiring managers.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  AI-Powered
                </Badge>
                <span className="text-sm">Upload your resume to get started</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;