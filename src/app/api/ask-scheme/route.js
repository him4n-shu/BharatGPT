import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query, context = 'scheme' } = await request.json();
    
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
    
    // Construct the prompt for context-aware responses
    const prompt = `
You are an AI assistant specialized in providing information about Indian government services and schemes.
Answer the following query in detail, using visually appealing and well-organized formatting.

${contextPrompt}

FORMAT YOUR RESPONSE WITH THE FOLLOWING ELEMENTS:
1. Use HTML tags to create a visually structured response
2. Main heading should be in <h3> tags with the scheme name or query topic
3. Add visual separator elements using <div> tags with appropriate styling
4. Use <strong> tags for important terms, scheme names, and key points
5. Create sections with <h4> tags for Benefits, Eligibility, How to Apply, etc.
6. Use bullet points (<ul><li>) for listing features, benefits, or criteria
7. Use numbered lists (<ol><li>) for step-by-step instructions
8. Add a background color to important sections using inline styles (e.g., style="background-color:#f8f8f8;padding:12px;border-radius:8px;border-left:4px solid #138808;")
9. Highlight important warnings or notes in a special format
10. Use a proper conclusion section that summarizes key points

Only provide information about verified government schemes and programs.
Include eligibility criteria, benefits, and application process if applicable.
If you don't know the answer or if the query is not relevant to the context, politely say so.

IMPORTANT: Format your response to be easily scannable and visually appealing when rendered as HTML.

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
        max_tokens: 1000
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
    
    return NextResponse.json({ response: formattedResponse });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 