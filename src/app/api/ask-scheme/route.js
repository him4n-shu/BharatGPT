import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query, context = 'scheme', language = 'english' } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    // Context-specific prompts for different service pages
    let systemPrompt = 'You are a helpful assistant that provides information about Indian government schemes and services.';
    let contextPrompt = '';
    
    switch (context) {
      case 'elderly':
        systemPrompt = 'You are a specialized assistant for elderly care services in India, with expertise in government schemes, benefits, and support programs for senior citizens.';
        contextPrompt = `
Focus specifically on information relevant to elderly care in India, including:
- Government pension schemes for senior citizens
- Healthcare benefits and insurance for the elderly
- Concessions and special privileges available to senior citizens
- Elder care facilities and support services
- Legal protections and rights of senior citizens
`;
        break;
        
      case 'form':
        systemPrompt = 'You are a specialized assistant for explaining government forms, documentation requirements, and application procedures in India.';
        contextPrompt = `
Focus specifically on information about government forms and applications in India, including:
- Document requirements for various government applications
- Step-by-step guidance for completing specific forms
- Explanations of complex terminology used in government forms
- Common mistakes to avoid when filling applications
- Where and how to submit completed forms
`;
        break;
        
      case 'money':
        systemPrompt = 'You are a specialized assistant for financial savings, government subsidies, and cost-cutting schemes available in India.';
        contextPrompt = `
Focus specifically on information about saving money and financial benefits in India, including:
- Government subsidies available for various services
- Financial assistance programs for different categories of citizens
- Tips for reducing household expenses
- Free government resources and services
- Financial literacy and management advice
`;
        break;
        
      case 'agriculture':
        systemPrompt = 'You are a specialized agriculture assistant for farmers in India, with expertise in crop management, farming techniques, agricultural schemes, and rural development programs.';
        contextPrompt = `
Focus specifically on agriculture-related information relevant to Indian farmers, including:
- Crop-specific cultivation techniques and best practices
- Pest management and disease control for various crops
- Soil health management and irrigation techniques
- Agricultural subsidies and government schemes for farmers
- Weather forecasting and seasonal guidance
- Market information and commodity pricing
- Organic farming and sustainable agriculture practices
- Farm equipment and technology recommendations
- Seed selection and crop rotation advice
- Post-harvest processing and storage solutions
`;
        break;
        
      default: 
        systemPrompt = 'You are a helpful assistant that provides information about Indian government schemes and services.';
        contextPrompt = `
Focus specifically on information about government schemes in India, including:
- Eligibility criteria for various schemes
- Benefits provided under different government programs
- Application processes for government schemes
- Important deadlines and requirements
- Contact information for relevant government departments
`;
        break;
    }
    
    // Language-specific instructions
    const languageInstructions = language === 'hindi' 
      ? `
IMPORTANT LANGUAGE REQUIREMENT: 
- आपको पूरा जवाब हिंदी में देना है (Respond completely in Hindi)
- सभी heading, content, और instructions हिंदी में लिखें
- Government scheme के नाम अंग्रेजी में हो सकते हैं लेकिन उनकी explanation हिंदी में दें
- HTML tags का उपयोग करें लेकिन content हिंदी में हो

Example format:
<h3>प्रधानमंत्री आवास योजना (PMAY)</h3>
<h4>फायदे:</h4>
<ul><li>वित्तीय सहायता...</li></ul>
`
      : `
IMPORTANT LANGUAGE REQUIREMENT:
- Respond completely in English
- All headings, content, and instructions should be in English
- Government scheme names can be in Hindi but provide English explanations
`;

    // Construct the prompt for context-aware responses
    const prompt = `
You are an AI assistant specialized in providing information about Indian government services and schemes.
Answer the following query in detail, using visually appealing and well-organized formatting.

${contextPrompt}

${languageInstructions}

FORMAT REQUIREMENTS:
- Use HTML: <h3> for main heading, <h4> for sections (Benefits, Eligibility, How to Apply)
- Lists: <ul><li> for benefits/features, <ol><li> for steps
- Emphasis: <strong> for important terms
- Style sections: style="background-color:#f8f8f8;padding:12px;border-radius:8px;border-left:4px solid #138808;"
- Include: Benefits, Eligibility, Application Process
- Be concise but comprehensive

Provide only verified government scheme information.

Query: ${query}
`;

    // Make a request to OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get a response from AI service' },
        { status: 500 }
      );
    }

    const data = await openaiResponse.json();
    const formattedResponse = data.choices[0].message.content;
    
    // Check if response was truncated due to token limit
    const finishReason = data.choices[0].finish_reason;
    console.log('OpenAI response finish reason:', finishReason);
    console.log('Response length:', formattedResponse.length);
    
    // Add truncation warning if needed
    let finalResponse = formattedResponse;
    if (finishReason === 'length') {
      const truncationWarning = language === 'hindi' 
        ? '<div style="background-color:#fff3cd;border:1px solid #ffeaa7;border-radius:6px;padding:15px;margin:20px 0;color:#856404;"><strong>नोट:</strong> यह जानकारी अधिक विस्तृत हो सकती है। पूरी जानकारी के लिए संबंधित सरकारी वेबसाइट पर जाएं।</div>'
        : '<div style="background-color:#fff3cd;border:1px solid #ffeaa7;border-radius:6px;padding:15px;margin:20px 0;color:#856404;"><strong>Note:</strong> This information may be more detailed. For complete details, please visit the relevant government website.</div>';
      
      finalResponse += truncationWarning;
    }
    
    return NextResponse.json({ 
      response: finalResponse,
      metadata: {
        finishReason,
        responseLength: formattedResponse.length,
        language: language
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 