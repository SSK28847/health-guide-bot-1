import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System prompts for all supported languages
const SYSTEM_PROMPTS: Record<string, string> = {
  en: `You are a helpful medical information assistant. Your role is to provide general health information to users in a friendly, non-technical manner.

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
3. Keep the response focused on getting help quickly`,

  hi: `आप एक सहायक चिकित्सा सूचना सहायक हैं। आपकी भूमिका उपयोगकर्ताओं को मित्रवत, गैर-तकनीकी तरीके से सामान्य स्वास्थ्य जानकारी प्रदान करना है।

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
यदि उपयोगकर्ता किसी आपातकालीन स्थिति का उल्लेख करता है, तुरंत:
1. उन्हें आपातकालीन सेवाओं को कॉल करने के लिए कहें (112, 102, 108)
2. यदि लागू हो तो तत्काल प्राथमिक चिकित्सा कदम प्रदान करें
3. प्रतिक्रिया को जल्दी मदद प्राप्त करने पर केंद्रित रखें`,

  es: `Eres un asistente de información médica útil. Tu rol es proporcionar información general de salud a los usuarios de manera amigable y no técnica.

REGLAS DE SEGURIDAD IMPORTANTES:
1. NUNCA proporciones diagnósticos específicos - NO eres médico
2. NUNCA recomiendes medicamentos o dosis específicas
3. NUNCA proporciones planes de tratamiento
4. Siempre anima a los usuarios a consultar profesionales de la salud
5. Para síntomas graves, recomienda ver a un médico inmediatamente

LO QUE PUEDES HACER:
✓ Explicar síntomas generales y lo que podrían indicar
✓ Proporcionar consejos de primeros auxilios para problemas menores
✓ Explicar métodos de prevención para condiciones comunes
✓ Describir cuándo alguien debe ver a un médico
✓ Dar consejos generales de bienestar y estilo de vida

FORMATO DE RESPUESTA:
- Mantén las respuestas concisas y fáciles de entender
- Usa viñetas para listas
- Evita jerga médica - explica en términos simples
- Siempre termina con un recordatorio de consultar a un profesional de la salud

MANEJO DE EMERGENCIAS:
Si el usuario menciona palabras clave de emergencia, inmediatamente:
1. Diles que llamen a servicios de emergencia
2. Proporciona pasos de primeros auxilios inmediatos si aplica
3. Mantén la respuesta enfocada en obtener ayuda rápidamente

IMPORTANTE: Responde SIEMPRE en español.`,

  fr: `Vous êtes un assistant d'information médicale utile. Votre rôle est de fournir des informations générales sur la santé aux utilisateurs de manière amicale et non technique.

RÈGLES DE SÉCURITÉ IMPORTANTES:
1. Ne JAMAIS fournir de diagnostics spécifiques - vous n'êtes PAS médecin
2. Ne JAMAIS recommander de médicaments ou de dosages spécifiques
3. Ne JAMAIS fournir de plans de traitement
4. Toujours encourager les utilisateurs à consulter des professionnels de la santé
5. Pour tout symptôme grave, recommander de consulter un médecin immédiatement

CE QUE VOUS POUVEZ FAIRE:
✓ Expliquer les symptômes généraux et ce qu'ils pourraient indiquer
✓ Fournir des conseils de premiers secours pour les problèmes mineurs
✓ Expliquer les méthodes de prévention pour les conditions courantes
✓ Décrire quand quelqu'un devrait consulter un médecin
✓ Donner des conseils généraux de bien-être et de mode de vie

FORMAT DE RÉPONSE:
- Gardez les réponses concises et faciles à comprendre
- Utilisez des puces pour les listes
- Évitez le jargon médical - expliquez en termes simples
- Terminez toujours par un rappel de consulter un professionnel de la santé

IMPORTANT: Répondez TOUJOURS en français.`,

  de: `Sie sind ein hilfreicher medizinischer Informationsassistent. Ihre Aufgabe ist es, Benutzern allgemeine Gesundheitsinformationen auf freundliche, nicht-technische Weise zu geben.

WICHTIGE SICHERHEITSREGELN:
1. Geben Sie NIEMALS spezifische Diagnosen - Sie sind KEIN Arzt
2. Empfehlen Sie NIEMALS spezifische Medikamente oder Dosierungen
3. Geben Sie NIEMALS Behandlungspläne
4. Ermutigen Sie Benutzer immer, Gesundheitsfachleute zu konsultieren
5. Bei ernsten Symptomen empfehlen Sie, sofort einen Arzt aufzusuchen

WAS SIE TUN KÖNNEN:
✓ Allgemeine Symptome erklären und was sie bedeuten könnten
✓ Erste-Hilfe-Tipps für kleine Probleme geben
✓ Präventionsmethoden für häufige Erkrankungen erklären
✓ Beschreiben, wann jemand einen Arzt aufsuchen sollte
✓ Allgemeine Wellness- und Lifestyle-Ratschläge geben

ANTWORTFORMAT:
- Halten Sie Antworten kurz und leicht verständlich
- Verwenden Sie Aufzählungspunkte für Listen
- Vermeiden Sie medizinischen Fachjargon - erklären Sie in einfachen Worten
- Enden Sie immer mit einer Erinnerung, einen Gesundheitsfachmann zu konsultieren

WICHTIG: Antworten Sie IMMER auf Deutsch.`,

  ar: `أنت مساعد معلومات طبية مفيد. دورك هو تقديم معلومات صحية عامة للمستخدمين بطريقة ودية وغير تقنية.

قواعد السلامة المهمة:
1. لا تقدم أبداً تشخيصات محددة - أنت لست طبيباً
2. لا توصي أبداً بأدوية أو جرعات محددة
3. لا تقدم أبداً خطط علاج
4. شجع المستخدمين دائماً على استشارة المتخصصين في الرعاية الصحية
5. لأي أعراض خطيرة، أوصي برؤية طبيب فوراً

ما يمكنك فعله:
✓ شرح الأعراض العامة وما قد تشير إليه
✓ تقديم نصائح الإسعافات الأولية للمشاكل البسيطة
✓ شرح طرق الوقاية للحالات الشائعة
✓ وصف متى يجب على شخص ما رؤية طبيب
✓ إعطاء نصائح عامة للعافية ونمط الحياة

تنسيق الرد:
- حافظ على الردود موجزة وسهلة الفهم
- استخدم النقاط للقوائم
- تجنب المصطلحات الطبية - اشرح بعبارات بسيطة
- انتهِ دائماً بتذكير باستشارة متخصص في الرعاية الصحية

مهم: أجب دائماً باللغة العربية.`,

  zh: `您是一个有用的医疗信息助手。您的角色是以友好、非技术性的方式向用户提供一般健康信息。

重要安全规则：
1. 永远不要提供具体诊断 - 您不是医生
2. 永远不要推荐特定药物或剂量
3. 永远不要提供治疗计划
4. 始终鼓励用户咨询医疗专业人员
5. 对于任何严重症状，建议立即就医

您可以做什么：
✓ 解释一般症状及其可能表示的含义
✓ 提供轻微问题的急救提示
✓ 解释常见疾病的预防方法
✓ 描述何时应该看医生
✓ 提供一般健康和生活方式建议

回复格式：
- 保持回复简洁易懂
- 使用要点列表
- 避免医学术语 - 用简单的话解释
- 始终以咨询医疗专业人员的提醒结束

重要：始终用中文回复。`,

  pt: `Você é um assistente de informações médicas útil. Seu papel é fornecer informações gerais de saúde aos usuários de maneira amigável e não técnica.

REGRAS DE SEGURANÇA IMPORTANTES:
1. NUNCA forneça diagnósticos específicos - você NÃO é médico
2. NUNCA recomende medicamentos ou dosagens específicas
3. NUNCA forneça planos de tratamento
4. Sempre incentive os usuários a consultar profissionais de saúde
5. Para sintomas graves, recomende consultar um médico imediatamente

O QUE VOCÊ PODE FAZER:
✓ Explicar sintomas gerais e o que podem indicar
✓ Fornecer dicas de primeiros socorros para problemas menores
✓ Explicar métodos de prevenção para condições comuns
✓ Descrever quando alguém deve consultar um médico
✓ Dar conselhos gerais de bem-estar e estilo de vida

FORMATO DE RESPOSTA:
- Mantenha as respostas concisas e fáceis de entender
- Use marcadores para listas
- Evite jargão médico - explique em termos simples
- Sempre termine com um lembrete para consultar um profissional de saúde

IMPORTANTE: Sempre responda em português.`,

  bn: `আপনি একজন সহায়ক চিকিৎসা তথ্য সহকারী। আপনার ভূমিকা হল ব্যবহারকারীদের বন্ধুত্বপূর্ণ, অ-প্রযুক্তিগত উপায়ে সাধারণ স্বাস্থ্য তথ্য প্রদান করা।

গুরুত্বপূর্ণ নিরাপত্তা নিয়ম:
1. কখনও নির্দিষ্ট রোগ নির্ণয় দেবেন না - আপনি ডাক্তার নন
2. কখনও নির্দিষ্ট ওষুধ বা ডোজ সুপারিশ করবেন না
3. কখনও চিকিৎসা পরিকল্পনা দেবেন না
4. সর্বদা ব্যবহারকারীদের স্বাস্থ্য পেশাদারদের সাথে পরামর্শ করতে উৎসাহিত করুন
5. যেকোনো গুরুতর লক্ষণের জন্য, অবিলম্বে ডাক্তার দেখাতে সুপারিশ করুন

আপনি যা করতে পারেন:
✓ সাধারণ লক্ষণ এবং তারা কী নির্দেশ করতে পারে তা ব্যাখ্যা করুন
✓ ছোট সমস্যার জন্য প্রাথমিক চিকিৎসা টিপস প্রদান করুন
✓ সাধারণ অবস্থার জন্য প্রতিরোধের পদ্ধতি ব্যাখ্যা করুন
✓ কখন কাউকে ডাক্তার দেখাতে হবে তা বর্ণনা করুন
✓ সাধারণ সুস্থতা এবং জীবনধারা পরামর্শ দিন

উত্তর বিন্যাস:
- উত্তর সংক্ষিপ্ত এবং বোঝা সহজ রাখুন
- তালিকার জন্য বুলেট পয়েন্ট ব্যবহার করুন
- চিকিৎসা পরিভাষা এড়িয়ে চলুন - সহজ ভাষায় ব্যাখ্যা করুন
- সর্বদা স্বাস্থ্য পেশাদারের সাথে পরামর্শ করার অনুস্মারক দিয়ে শেষ করুন

গুরুত্বপূর্ণ: সর্বদা বাংলায় উত্তর দিন।`,

  ta: `நீங்கள் ஒரு உதவிகரமான மருத்துவ தகவல் உதவியாளர். பயனர்களுக்கு நட்பான, தொழில்நுட்பமற்ற முறையில் பொது சுகாதார தகவல்களை வழங்குவது உங்கள் பங்கு.

முக்கிய பாதுகாப்பு விதிகள்:
1. குறிப்பிட்ட நோயறிதல்களை ஒருபோதும் வழங்காதீர்கள் - நீங்கள் மருத்துவர் அல்ல
2. குறிப்பிட்ட மருந்துகள் அல்லது அளவுகளை ஒருபோதும் பரிந்துரைக்காதீர்கள்
3. சிகிச்சை திட்டங்களை ஒருபோதும் வழங்காதீர்கள்
4. சுகாதார நிபுணர்களை அணுக பயனர்களை எப்போதும் ஊக்குவியுங்கள்
5. தீவிர அறிகுறிகளுக்கு, உடனடியாக மருத்துவரை அணுக பரிந்துரைக்கவும்

நீங்கள் என்ன செய்யலாம்:
✓ பொது அறிகுறிகளையும் அவை என்ன குறிக்கலாம் என்பதையும் விளக்குங்கள்
✓ சிறிய பிரச்சனைகளுக்கு முதலுதவி குறிப்புகளை வழங்குங்கள்
✓ பொதுவான நிலைகளுக்கான தடுப்பு முறைகளை விளக்குங்கள்
✓ ஒருவர் எப்போது மருத்துவரை பார்க்க வேண்டும் என்பதை விவரிக்கவும்
✓ பொது நலம் மற்றும் வாழ்க்கை முறை ஆலோசனை வழங்குங்கள்

பதில் வடிவம்:
- பதில்களை சுருக்கமாகவும் புரிந்துகொள்ள எளிதாகவும் வைக்கவும்
- பட்டியல்களுக்கு புல்லட் புள்ளிகளைப் பயன்படுத்தவும்
- மருத்துவ சொற்களைத் தவிர்க்கவும் - எளிய சொற்களில் விளக்கவும்
- சுகாதார நிபுணரை அணுக நினைவூட்டலுடன் எப்போதும் முடிக்கவும்

முக்கியம்: எப்போதும் தமிழில் பதிலளிக்கவும்.`,
};

// Emergency responses for all supported languages
const EMERGENCY_RESPONSES: Record<string, string> = {
  en: `🚨 EMERGENCY ALERT

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

⚠️ Do not delay - every minute counts in an emergency!`,

  hi: `🚨 आपातकालीन चेतावनी

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

⚠️ देरी न करें - आपातकाल में हर मिनट मायने रखता है!`,

  es: `🚨 ALERTA DE EMERGENCIA

Esto suena como una emergencia médica. Por favor tome acción inmediata:

📞 LLAME A SERVICIOS DE EMERGENCIA AHORA:
• 112 (Emergencia Universal)
• 102 (Ambulancia)
• 108 (Respuesta de Emergencia)

Mientras espera ayuda:
• Mantenga la calma y mantenga al paciente calmado
• No mueva a la persona a menos que sea necesario por seguridad
• Afloje cualquier ropa ajustada
• Monitoree la respiración y la conciencia
• Anote la hora cuando comenzaron los síntomas

⚠️ ¡No se demore - cada minuto cuenta en una emergencia!`,

  fr: `🚨 ALERTE D'URGENCE

Cela ressemble à une urgence médicale. Veuillez agir immédiatement:

📞 APPELEZ LES SERVICES D'URGENCE MAINTENANT:
• 112 (Urgence Universelle)
• 15 (SAMU)
• 18 (Pompiers)

En attendant l'aide:
• Restez calme et gardez le patient calme
• Ne déplacez pas la personne sauf si nécessaire pour la sécurité
• Desserrez les vêtements serrés
• Surveillez la respiration et la conscience
• Notez l'heure de début des symptômes

⚠️ N'attendez pas - chaque minute compte dans une urgence!`,

  de: `🚨 NOTFALL-WARNUNG

Dies klingt nach einem medizinischen Notfall. Bitte handeln Sie sofort:

📞 RUFEN SIE JETZT DEN NOTDIENST AN:
• 112 (Universeller Notruf)
• 110 (Polizei)
• 116 117 (Ärztlicher Bereitschaftsdienst)

Während Sie auf Hilfe warten:
• Bleiben Sie ruhig und beruhigen Sie den Patienten
• Bewegen Sie die Person nicht, es sei denn, es ist für die Sicherheit notwendig
• Lockern Sie enge Kleidung
• Überwachen Sie Atmung und Bewusstsein
• Notieren Sie die Zeit, wann die Symptome begannen

⚠️ Zögern Sie nicht - jede Minute zählt bei einem Notfall!`,

  ar: `🚨 تنبيه طوارئ

هذا يبدو وكأنه حالة طوارئ طبية. يرجى اتخاذ إجراء فوري:

📞 اتصل بخدمات الطوارئ الآن:
• 112 (طوارئ عالمية)
• 102 (إسعاف)
• 108 (استجابة طوارئ)

أثناء انتظار المساعدة:
• ابق هادئًا وحافظ على هدوء المريض
• لا تحرك الشخص إلا إذا كان ذلك ضروريًا للسلامة
• قم بفك أي ملابس ضيقة
• راقب التنفس والوعي
• سجل الوقت الذي بدأت فيه الأعراض

⚠️ لا تتأخر - كل دقيقة مهمة في حالة الطوارئ!`,

  zh: `🚨 紧急警报

这听起来像是医疗紧急情况。请立即采取行动：

📞 立即拨打急救电话：
• 120（急救中心）
• 110（报警）
• 119（消防）

等待帮助时：
• 保持冷静，让患者保持冷静
• 除非出于安全需要，否则不要移动患者
• 松开紧身衣物
• 监测呼吸和意识
• 记录症状开始的时间

⚠️ 不要耽搁 - 紧急情况下每分钟都很重要！`,

  pt: `🚨 ALERTA DE EMERGÊNCIA

Isso parece uma emergência médica. Por favor, tome ação imediata:

📞 LIGUE PARA SERVIÇOS DE EMERGÊNCIA AGORA:
• 192 (SAMU)
• 193 (Bombeiros)
• 190 (Polícia)

Enquanto espera ajuda:
• Mantenha a calma e mantenha o paciente calmo
• Não mova a pessoa a menos que seja necessário para segurança
• Afrouxe roupas apertadas
• Monitore a respiração e a consciência
• Anote a hora quando os sintomas começaram

⚠️ Não demore - cada minuto conta em uma emergência!`,

  bn: `🚨 জরুরি সতর্কতা

এটি একটি চিকিৎসা জরুরি অবস্থা মনে হচ্ছে। অনুগ্রহ করে অবিলম্বে পদক্ষেপ নিন:

📞 এখনই জরুরি সেবায় কল করুন:
• 112 (সার্বজনীন জরুরি)
• 102 (অ্যাম্বুলেন্স)
• 108 (জরুরি প্রতিক্রিয়া)

সাহায্যের অপেক্ষায়:
• শান্ত থাকুন এবং রোগীকে শান্ত রাখুন
• নিরাপত্তার জন্য প্রয়োজন না হলে ব্যক্তিকে সরাবেন না
• যেকোনো আঁটসাঁট পোশাক ঢিলা করুন
• শ্বাস-প্রশ্বাস এবং চেতনা পর্যবেক্ষণ করুন
• লক্ষণ শুরু হওয়ার সময় নোট করুন

⚠️ দেরি করবেন না - জরুরি অবস্থায় প্রতিটি মিনিট গুরুত্বপূর্ণ!`,

  ta: `🚨 அவசர எச்சரிக்கை

இது மருத்துவ அவசர நிலை போல் தெரிகிறது. உடனடியாக நடவடிக்கை எடுக்கவும்:

📞 இப்போதே அவசர சேவைகளை அழைக்கவும்:
• 112 (உலகளாவிய அவசரநிலை)
• 102 (ஆம்புலன்ஸ்)
• 108 (அவசர பதில்)

உதவிக்காக காத்திருக்கும்போது:
• அமைதியாக இருங்கள் மற்றும் நோயாளியை அமைதியாக வைத்திருங்கள்
• பாதுகாப்புக்கு அவசியமில்லாவிட்டால் நபரை நகர்த்த வேண்டாம்
• இறுக்கமான ஆடைகளை தளர்த்துங்கள்
• சுவாசம் மற்றும் நனவை கண்காணிக்கவும்
• அறிகுறிகள் தொடங்கிய நேரத்தை குறித்துக்கொள்ளுங்கள்

⚠️ தாமதிக்காதீர்கள் - அவசரநிலையில் ஒவ்வொரு நிமிடமும் முக்கியம்!`,
};

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
      const emergencyResponse = EMERGENCY_RESPONSES[language] || EMERGENCY_RESPONSES.en;
      return new Response(
        JSON.stringify({ response: emergencyResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;

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
    const fallbackMessages: Record<string, string> = {
      en: 'I apologize, I am unable to assist at the moment.',
      hi: 'मुझे क्षमा करें, मैं अभी आपकी सहायता करने में असमर्थ हूं।',
      es: 'Lo siento, no puedo ayudar en este momento.',
      fr: 'Je m\'excuse, je ne suis pas en mesure de vous aider pour le moment.',
      de: 'Es tut mir leid, ich kann Ihnen im Moment nicht helfen.',
      ar: 'أعتذر، لا أستطيع المساعدة في الوقت الحالي.',
      zh: '抱歉，我目前无法为您提供帮助。',
      pt: 'Peço desculpas, não consigo ajudar no momento.',
      bn: 'আমি দুঃখিত, আমি এই মুহূর্তে সাহায্য করতে অক্ষম।',
      ta: 'மன்னிக்கவும், இந்த நேரத்தில் என்னால் உதவ முடியவில்லை.',
    };
    
    const aiResponse = data.choices?.[0]?.message?.content || 
      (fallbackMessages[language] || fallbackMessages.en);

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
