const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Code review endpoint
exports.codeReview = async (req, res) => {
  try {
    const { code, problemStatement, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    // Use the BEST model for code review - FAST and COST EFFECTIVE
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-1.5-flash",  // ✅ Best choice!
      generationConfig: {
        temperature: 0.1,  // Lower temperature for more deterministic code analysis
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,  // Limit response length for code reviews
      },
    });
    
    // Create a prompt for code review
    const prompt = `
      Please review the following code and provide concise feedback:
      
      ${problemStatement ? `Problem Statement: ${problemStatement}` : ''}
      
      Programming Language: ${language || 'Not specified'}
      
      Code:
      ${code}
      
      Please provide a comprehensive code review including:
      1. Code efficiency and time complexity analysis
      2. Best practices followed or violated
      3. Potential bugs or edge cases not handled
      4. Suggestions for improvement
      5. Alternative approaches if applicable
      
      Format your response with clear sections and bullet points.
      Be concise and focus on actionable feedback.
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ review: text });
  } catch (error) {
    console.error('Error generating code review:', error);
    res.status(500).json({ 
      error: 'Failed to generate code review',
      details: error.message 
    });
  }
};

// Code explanation endpoint
exports.codeExplanation = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    // Use the same optimal model
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-1.5-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });
    
    // Create a prompt for code explanation
    const prompt = `
      Please explain the following code in detail:
      
      ${code}
      
      Provide a comprehensive explanation including:
      1. What the code does
      2. How it works step by step
      3. Key algorithms or data structures used
      4. Time and space complexity analysis
      
      Format your response with clear sections.
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ explanation: text });
  } catch (error) {
    console.error('Error generating code explanation:', error);
    res.status(500).json({ 
      error: 'Failed to generate code explanation',
      details: error.message 
    });
  }
};