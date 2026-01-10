import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Medical FAQ knowledge base for embedding and retrieval
const MEDICAL_KNOWLEDGE_BASE = [
  {
    id: "fever-management",
    content: "Fever Management: A fever is typically defined as a body temperature above 100.4°F (38°C). For mild fevers, rest and hydration are key. Drink plenty of fluids like water, clear broths, and electrolyte drinks. Over-the-counter medications like acetaminophen or ibuprofen can help reduce fever. Seek medical attention if fever exceeds 103°F (39.4°C), lasts more than 3 days, or is accompanied by severe symptoms like difficulty breathing, chest pain, or confusion.",
    category: "general-health",
    keywords: ["fever", "temperature", "bukhar", "ज्वर", "बुखार"]
  },
  {
    id: "headache-relief",
    content: "Headache Relief: Tension headaches can be managed with rest, hydration, and over-the-counter pain relievers. Apply a cold or warm compress to your forehead. Reduce screen time and practice relaxation techniques. Migraines may require prescription medications. Seek immediate medical help for sudden severe headaches, headaches with fever and stiff neck, or headaches after head injury.",
    category: "general-health",
    keywords: ["headache", "migraine", "head pain", "सिरदर्द", "माइग्रेन"]
  },
  {
    id: "cold-flu-symptoms",
    content: "Cold and Flu: Common cold symptoms include runny nose, sore throat, and mild cough. Flu symptoms are more severe with high fever, body aches, and fatigue. Rest, fluids, and over-the-counter medications help manage symptoms. Antiviral medications for flu work best within 48 hours of symptom onset. Seek care for difficulty breathing, persistent chest pain, or symptoms that worsen after initial improvement.",
    category: "general-health",
    keywords: ["cold", "flu", "cough", "सर्दी", "जुकाम", "खांसी", "influenza"]
  },
  {
    id: "diabetes-management",
    content: "Diabetes Management: Type 2 diabetes requires lifestyle modifications including regular exercise, balanced diet low in refined sugars, and weight management. Monitor blood sugar levels regularly. Take medications as prescribed. Watch for signs of low blood sugar (shakiness, sweating, confusion) and high blood sugar (increased thirst, frequent urination). Regular checkups with your healthcare provider are essential.",
    category: "chronic-conditions",
    keywords: ["diabetes", "blood sugar", "glucose", "मधुमेह", "शुगर"]
  },
  {
    id: "blood-pressure",
    content: "Blood Pressure Management: Normal blood pressure is below 120/80 mmHg. Elevated blood pressure increases risk of heart disease and stroke. Lifestyle changes include reducing sodium intake, regular exercise, maintaining healthy weight, limiting alcohol, and managing stress. Take prescribed medications consistently. Monitor blood pressure at home and report significant changes to your doctor.",
    category: "chronic-conditions",
    keywords: ["blood pressure", "hypertension", "bp", "रक्तचाप", "बीपी"]
  },
  {
    id: "medication-reminders",
    content: "Medication Reminders: Taking medications as prescribed is crucial for treatment success. Set daily alarms or use pill organizers. Take medications at the same time each day. Never skip doses or double up on missed doses without consulting your doctor. Keep a medication list with you. Store medications properly and check expiration dates regularly.",
    category: "wellness",
    keywords: ["medication", "medicine", "reminder", "pills", "दवाई", "गोली"]
  },
  {
    id: "appointment-scheduling",
    content: "Medical Appointment Tips: Schedule annual checkups for preventive care. Bring a list of current medications, symptoms, and questions to appointments. Arrive 15 minutes early with insurance information. For specialists, obtain referrals if required. Keep records of test results and treatment plans. Follow up on any pending results or recommendations.",
    category: "wellness",
    keywords: ["appointment", "doctor", "checkup", "visit", "अपॉइंटमेंट", "डॉक्टर"]
  },
  {
    id: "first-aid-basics",
    content: "First Aid Basics: For minor cuts, clean with water, apply antibiotic ointment, and cover with bandage. For burns, run cool water over the area for 10-20 minutes. For sprains, use RICE: Rest, Ice, Compression, Elevation. For choking, perform abdominal thrusts. Learn CPR for emergencies. Keep a first aid kit at home and in your car.",
    category: "emergency",
    keywords: ["first aid", "injury", "burn", "cut", "चोट", "जलन", "प्राथमिक चिकित्सा"]
  },
  {
    id: "mental-health",
    content: "Mental Health Support: Mental health is as important as physical health. Common conditions include anxiety and depression. Practice self-care: adequate sleep, exercise, social connections, and stress management. Professional help includes therapy and medications when needed. Crisis resources are available 24/7. Reach out if you're struggling - seeking help is a sign of strength.",
    category: "wellness",
    keywords: ["mental health", "anxiety", "depression", "stress", "मानसिक स्वास्थ्य", "चिंता", "तनाव"]
  },
  {
    id: "nutrition-basics",
    content: "Nutrition Basics: A balanced diet includes fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, added sugars, and excessive salt. Stay hydrated with 8 glasses of water daily. Portion control helps maintain healthy weight. Consider dietary needs based on age, activity level, and health conditions. Consult a dietitian for personalized advice.",
    category: "wellness",
    keywords: ["nutrition", "diet", "food", "eating", "पोषण", "आहार", "खाना"]
  }
];

// Simple text similarity function using keyword matching and term frequency
function calculateSimilarity(query: string, content: string, keywords: string[]): number {
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();
  
  let score = 0;
  
  // Check keyword matches (higher weight)
  for (const keyword of keywords) {
    if (queryLower.includes(keyword.toLowerCase())) {
      score += 10;
    }
  }
  
  // Check word overlap
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  const contentWords = new Set(contentLower.split(/\s+/));
  
  for (const word of queryWords) {
    if (contentWords.has(word)) {
      score += 1;
    }
  }
  
  return score;
}

// Retrieve relevant documents based on query
function retrieveRelevantDocs(query: string, topK: number = 3): typeof MEDICAL_KNOWLEDGE_BASE {
  const scored = MEDICAL_KNOWLEDGE_BASE.map(doc => ({
    ...doc,
    score: calculateSimilarity(query, doc.content, doc.keywords)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  return scored.filter(doc => doc.score > 0).slice(0, topK);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, action } = await req.json();
    const PINECONE_API_KEY = Deno.env.get('PINECONE_API_KEY');
    
    if (!PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not configured');
    }

    if (action === 'search') {
      // Retrieve relevant documents
      const relevantDocs = retrieveRelevantDocs(query);
      
      // Format context for the AI
      const context = relevantDocs.map(doc => doc.content).join('\n\n');
      
      return new Response(
        JSON.stringify({
          success: true,
          context,
          sources: relevantDocs.map(doc => ({
            id: doc.id,
            category: doc.category
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'list-categories') {
      const categories = [...new Set(MEDICAL_KNOWLEDGE_BASE.map(doc => doc.category))];
      return new Response(
        JSON.stringify({ success: true, categories }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default: return all knowledge base entries
    return new Response(
      JSON.stringify({
        success: true,
        entries: MEDICAL_KNOWLEDGE_BASE.length,
        categories: [...new Set(MEDICAL_KNOWLEDGE_BASE.map(doc => doc.category))]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Pinecone RAG error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
