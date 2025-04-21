# GPT Integration Setup for Sarkari Sahayak

This project uses OpenAI's GPT-3.5 Turbo to provide detailed information about government schemes.

## Setting up the OpenAI API Key

1. Sign up for an OpenAI account at [https://platform.openai.com/signup](https://platform.openai.com/signup) if you don't have one.

2. Get your API key from the OpenAI dashboard:
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new secret key
   - Copy the key (you won't be able to see it again)

3. Add your API key to the `.env.local` file:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```
   Replace `your-api-key-here` with your actual OpenAI API key.

4. Restart your development server after adding the API key.

## Important Notes

- Keep your API key secure and never expose it publicly.
- Don't commit the `.env.local` file to public repositories.
- OpenAI API usage incurs costs based on the number of tokens processed.
- You can add rate limiting to prevent excessive API calls.

## Troubleshooting

If the API integration isn't working:

1. Verify your API key is correct in the `.env.local` file.
2. Check the server logs for any errors.
3. Ensure your OpenAI account has a valid payment method set up.
4. Check if you've reached your API usage limit.

## API Response Formatting

The responses from GPT are formatted with HTML to provide structured information:
- Headings for sections
- Bullet points for lists
- Paragraphs for descriptions

This ensures a consistent and readable format for government scheme information. 