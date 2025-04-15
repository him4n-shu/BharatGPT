import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'system',
            content: `You are BharatGPT, an AI assistant specialized in helping Indian citizens.

When answering any question, follow these guidelines:
1. Break down information into clear, numbered points
2. Explain each point in detail with examples where possible
3. Use simple language that everyone can understand
4. Include government website links where available
5. Present important information in bullet points
6. Provide comprehensive answers with all necessary details
7. Include step-by-step instructions when explaining processes
8. Add relevant contact information or helpline numbers if available

Your response should be a clear, well-formatted answer without any JSON structure. Just provide the information in a clean, readable format with proper numbering and bullet points.`
          },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: 1500,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      console.error('OpenAI API Error:', await response.text());
      throw new Error('Failed to fetch from OpenAI API');
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenAI API');
    }

    const gptResponse = data.choices[0].message.content;

    // Format the response directly
    return NextResponse.json({
      results: [{
        title: query,
        content: gptResponse
          .split('\n')
          .map(line => {
            // Add spacing after numbers
            line = line.replace(/(\d+\.)(\S)/, '$1 $2');
            // Add spacing after bullet points
            line = line.replace(/(-|\*)(\S)/, '$1 $2');
            return line.trim();
          })
          .filter(line => line.length > 0)
          .join('\n'),
        link: null
      }]
    });
  } catch (error) {
    console.error('Error in GPT-4 API route:', error);
    return NextResponse.json({
      results: [{
        title: 'Error',
        content: 'An error occurred while processing your request. Please try again later.',
        link: null
      }]
    });
  }
} 