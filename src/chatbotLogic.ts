import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
  role: string;
  content: string; 
}


export async function shouldBotTextYet(chatHistory: any[]) {

    // Get time since last bot message
    const lastBotMsg = chatHistory.filter((m: { role: string; }) => m.role === 'assistant').slice(-1)[0];
    const timeSinceLastBot = Date.now() - lastBotMsg.timestamp;  
  
    // Check if enough time has passed
    const timePassed = timeSinceLastBot > 120000; // 2 mins 
    
    
    const context = chatHistory.slice(-2).map((m: { content: any; }) => m.content).join('\n');
  
    const prompt = `The last 2 messages were:
    ${context}
  
    Based on this context, should the assistant bot respond?`;

    let res = await openai.chat.completions.create({
      model: 'text-davinci-003', 
      messages: [
        {
          role: "system",
          content: prompt
        }
      ] 
    ,
    });
    
    // Parse yes/no response
    const shouldText = res.choices[0].message.content.includes('yes'); 
  
    return timePassed && shouldText;
  
  }

  export async function getBotResponse(chatHistory: ChatMessage[]) {

    const context = chatHistory.slice(-2).map(m => m.content).join('\n');
  
    const response = await openai.chat.completions.create({
      model: 'text-davinci-003',
      messages: [{
        role: 'system',
        content: context
      }]
    });
  
    return response.choices[0].message.content;
  
  }