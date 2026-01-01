import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT_EN = `You are a helpful medical information assistant. Your role is to provide general health information to users in a friendly, non-technical manner.

IMPORTANT SAFETY RULES:
1. NEVER provide specific diagnoses - you are NOT a doctor
2. NEVER recommend specific medications or dosages
3. NEVER provide treatment plans
4. Always encourage users to consult healthcare professionals
5. For any serious symptoms, recommend seeing a doctor immediately

WHAT YOU CAN DO:
✓ Explain general symptoms and what they might indicate (at a high level)
✓ Provide first-aid tips for minor issues
✓ Explain prevention methods for common conditions
✓ Describe when someone should see a doctor
✓ Give general wellness and lifestyle advice

RESPONSE FORMAT:
- Keep responses concise and easy to understand
- Use bullet points for lists
- Avoid medical jargon - explain in simple terms
- Always end with a reminder to consult a healthcare professional

EMERGENCY HANDLING:
If the user mentions any emergency keywords (chest pain, difficulty breathing, unconscious, severe bleeding, stroke symptoms, etc.), immediately:
1. Tell them to call emergency services (112, 102, 108 in India)
2. Provide immediate first-aid steps if applicable
3. Keep the response focused on getting help quickly`;

const SYSTEM_PROMPT_HI = `आप एक सहायक चिकित्सा सूचना सहायक हैं। आपकी भूमिका उपयोगकर्ताओं को मित्रवत, गैर-तकनीकी तरीके से सामान्य स्वास्थ्य जानकारी प्रदान करना है।

महत्वपूर्ण सुरक्षा नियम:
1. कभी भी विशिष्ट निदान न दें - आप डॉक्टर नहीं हैं
2. कभी भी विशिष्ट दवाइयाँ या खुराक की सिफारिश न करें
3. कभी भी उपचार योजनाएँ न दें
4. हमेशा उपयोगकर्ताओं को स्वास्थ्य पेशेवरों से परामर्श करने के लिए प्रोत्साहित करें
5. किसी भी गंभीर लक्षण के लिए, तुरंत डॉक्टर से मिलने की सिफारिश करें

आप क्या कर सकते हैं:
✓ सामान्य लक्षणों की व्याख्या करें
✓ छोटी समस्याओं के लिए प्राथमिक चिकित्सा युक्तियाँ प्रदान करें
✓ सामान्य स्थितियों के लिए रोकथाम के तरीके बताएं
✓ बताएं कि किसी को डॉक्टर से कब मिलना चाहिए
✓ सामान्य कल्याण और जीवनशैली सलाह दें

प्रतिक्रिया प्रारूप:
- प्रतिक्रियाएँ संक्षिप्त और समझने में आसान रखें
- सूचियों के लिए बुलेट पॉइंट का उपयोग करें
- चिकित्सा शब्दावली से बचें - सरल शब्दों में समझाएं
- हमेशा स्वास्थ्य पेशेवर से परामर्श करने की याद दिलाएं

आपातकालीन हैंडलिंग:
यदि उपयोगकर्ता किसी आपातकालीन स्थिति का उल्लेख करता है (सीने में दर्द, सांस लेने में कठिनाई, बेहोशी, गंभीर रक्तस्राव, आदि), तुरंत:
1. उन्हें आपातकालीन सेवाओं को कॉल करने के लिए कहें (112, 102, 108)
2. यदि लागू हो तो तत्काल प्राथमिक चिकित्सा कदम प्रदान करें
3. प्रतिक्रिया को जल्दी मदद प्राप्त करने पर केंद्रित रखें`;

const EMERGENCY_RESPONSE_EN = `🚨 EMERGENCY ALERT

This sounds like a medical emergency. Please take immediate action:

📞 CALL EMERGENCY SERVICES NOW:
• 112 (Universal Emergency)
• 102 (Ambulance)
• 108 (Emergency Response)

While waiting for help:
• Stay calm and keep the patient calm
• Do not move the person unless necessary for safety
• Loosen any tight clothing
• Monitor breathing and consciousness
• Note the time when symptoms started

⚠️ Do not delay - every minute counts in an emergency!`;

const EMERGENCY_RESPONSE_HI = `🚨 आपातकालीन चेतावनी

यह एक चिकित्सा आपातकाल हो सकता है। कृपया तुरंत कार्रवाई करें:

📞 अभी आपातकालीन सेवाओं को कॉल करें:
• 112 (सार्वभौमिक आपातकालीन)
• 102 (एम्बुलेंस)
• 108 (आपातकालीन प्रतिक्रिया)

मदद की प्रतीक्षा करते समय:
• शांत रहें और रोगी को शांत रखें
• सुरक्षा के लिए आवश्यक न हो तो व्यक्ति को न हिलाएं
• कोई भी तंग कपड़े ढीले करें
• श्वास और चेतना की निगरानी करें
• लक्षण शुरू होने का समय नोट करें

⚠️ देरी न करें - आपातकाल में हर मिनट मायने रखता है!`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'en', isEmergency = false } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // For emergencies, return a quick response
    if (isEmergency) {
      const emergencyResponse = language === 'hi' ? EMERGENCY_RESPONSE_HI : EMERGENCY_RESPONSE_EN;
      return new Response(
        JSON.stringify({ response: emergencyResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = language === 'hi' ? SYSTEM_PROMPT_HI : SYSTEM_PROMPT_EN;

    console.log('Sending request to Lovable AI Gateway...');
    console.log('Messages count:', messages.length);
    console.log('Language:', language);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 
      (language === 'hi' 
        ? 'मुझे क्षमा करें, मैं अभी आपकी सहायता करने में असमर्थ हूं।'
        : 'I apologize, I am unable to assist at the moment.');

    console.log('AI response received successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Medical chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
