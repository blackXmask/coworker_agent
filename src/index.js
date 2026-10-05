export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }
    
    try {
      const data = await request.json();
      const input = data.input || data.task || data.prompt || data.topic || '';
      const style = data.style || data.voice || data.tone || '';
      const niche = data.niche || data.industry || '';
      
      const prompt = `You are a LinkedIn Post Agent that writes posts in the user's exact style.

Create a high-performing LinkedIn post based on:
- Topic/Input: ${input}
- Style/Tone: ${style || 'professional, engaging'}
- Niche: ${niche || 'general'}

Generate:
1. Hook (attention-grabbing first line)
2. Post body (value-driven, conversational)
3. CTA (engagement question)
4. 3-5 relevant hashtags

Format nicely as the complete post ready to publish. Keep it authentic, avoid AI clichés.`;
      
      const response = await fetch('https://api.openrouter.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });
      
      const result = await response.json();
      const post = result.choices?.[0]?.message?.content || 'Unable to generate post';
      
      return new Response(JSON.stringify({ 
        result: post,
        success: true 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message,
        success: false 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};