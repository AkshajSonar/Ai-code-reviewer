import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { geminiAPI } from '../services/api';

const CodeEditor = ({ problem, onReviewComplete }) => {
  const [code, setCode] = useState(`# Your solution for ${problem?.name || 'the problem'}\n\ndef solution():\n    # Write your code here\n    pass`);
  const [language, setLanguage] = useState('python');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeReview = async () => {
    if (!code.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await geminiAPI.codeReview({
        code,
        problemStatement: problem?.name,
        language
      });
      
      onReviewComplete(response.data.review, code);
    } catch (error) {
      console.error('Review failed:', error);
      alert('Failed to get code review. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <h3>Code Editor</h3>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="language-selector"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
        </select>
      </div>

      <div className="editor-wrapper">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={setCode}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on'
          }}
        />
      </div>

      <div className="editor-actions">
        <button 
          onClick={handleCodeReview}
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? 'Analyzing...' : 'Get AI Review'}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;