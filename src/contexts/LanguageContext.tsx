import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ar' | 'zh' | 'pt' | 'bn' | 'ta';

export const SUPPORTED_LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

interface TranslationEntry {
  en: string;
  hi: string;
  es: string;
  fr: string;
  de: string;
  ar: string;
  zh: string;
  pt: string;
  bn: string;
  ta: string;
}

interface Translations {
  [key: string]: TranslationEntry;
}

const translations: Translations = {
  // Header & Navigation
  appTitle: {
    en: 'Medical Assistant',
    hi: 'चिकित्सा सहायक',
    es: 'Asistente Médico',
    fr: 'Assistant Médical',
    de: 'Medizinischer Assistent',
    ar: 'المساعد الطبي',
    zh: '医疗助手',
    pt: 'Assistente Médico',
    bn: 'চিকিৎসা সহায়ক',
    ta: 'மருத்துவ உதவியாளர்',
  },
  disclaimer: {
    en: 'For informational purposes only. Always consult a healthcare professional.',
    hi: 'केवल जानकारी के लिए। हमेशा स्वास्थ्य पेशेवर से परामर्श करें।',
    es: 'Solo con fines informativos. Siempre consulte a un profesional de la salud.',
    fr: 'À titre informatif uniquement. Consultez toujours un professionnel de santé.',
    de: 'Nur zu Informationszwecken. Konsultieren Sie immer einen Arzt.',
    ar: 'لأغراض إعلامية فقط. استشر دائمًا أخصائي الرعاية الصحية.',
    zh: '仅供参考。请务必咨询医疗专业人员。',
    pt: 'Apenas para fins informativos. Sempre consulte um profissional de saúde.',
    bn: 'শুধুমাত্র তথ্যের জন্য। সর্বদা একজন স্বাস্থ্য পেশাদারের সাথে পরামর্শ করুন।',
    ta: 'தகவல் நோக்கங்களுக்கு மட்டுமே. எப்போதும் சுகாதார நிபுணரை அணுகவும்.',
  },
  // Sidebar
  quickTopics: {
    en: 'Quick Topics',
    hi: 'त्वरित विषय',
    es: 'Temas Rápidos',
    fr: 'Sujets Rapides',
    de: 'Schnelle Themen',
    ar: 'مواضيع سريعة',
    zh: '快速主题',
    pt: 'Tópicos Rápidos',
    bn: 'দ্রুত বিষয়',
    ta: 'விரைவு தலைப்புகள்',
  },
  symptoms: {
    en: 'Symptoms',
    hi: 'लक्षण',
    es: 'Síntomas',
    fr: 'Symptômes',
    de: 'Symptome',
    ar: 'الأعراض',
    zh: '症状',
    pt: 'Sintomas',
    bn: 'লক্ষণ',
    ta: 'அறிகுறிகள்',
  },
  prevention: {
    en: 'Prevention',
    hi: 'रोकथाम',
    es: 'Prevención',
    fr: 'Prévention',
    de: 'Prävention',
    ar: 'الوقاية',
    zh: '预防',
    pt: 'Prevenção',
    bn: 'প্রতিরোধ',
    ta: 'தடுப்பு',
  },
  firstAid: {
    en: 'First Aid',
    hi: 'प्राथमिक चिकित्सा',
    es: 'Primeros Auxilios',
    fr: 'Premiers Secours',
    de: 'Erste Hilfe',
    ar: 'الإسعافات الأولية',
    zh: '急救',
    pt: 'Primeiros Socorros',
    bn: 'প্রাথমিক চিকিৎসা',
    ta: 'முதலுதவி',
  },
  whenToSeeDoctor: {
    en: 'When to See Doctor',
    hi: 'डॉक्टर को कब दिखाएं',
    es: 'Cuándo Ver al Doctor',
    fr: 'Quand Consulter un Médecin',
    de: 'Wann zum Arzt',
    ar: 'متى تزور الطبيب',
    zh: '何时看医生',
    pt: 'Quando Consultar o Médico',
    bn: 'কখন ডাক্তার দেখাবেন',
    ta: 'மருத்துவரை எப்போது பார்க்க வேண்டும்',
  },
  commonConditions: {
    en: 'Common Conditions',
    hi: 'सामान्य स्थितियाँ',
    es: 'Condiciones Comunes',
    fr: 'Conditions Courantes',
    de: 'Häufige Erkrankungen',
    ar: 'الحالات الشائعة',
    zh: '常见病症',
    pt: 'Condições Comuns',
    bn: 'সাধারণ অবস্থা',
    ta: 'பொதுவான நிலைகள்',
  },
  fever: {
    en: 'Fever',
    hi: 'बुखार',
    es: 'Fiebre',
    fr: 'Fièvre',
    de: 'Fieber',
    ar: 'الحمى',
    zh: '发烧',
    pt: 'Febre',
    bn: 'জ্বর',
    ta: 'காய்ச்சல்',
  },
  headache: {
    en: 'Headache',
    hi: 'सिरदर्द',
    es: 'Dolor de Cabeza',
    fr: 'Mal de Tête',
    de: 'Kopfschmerzen',
    ar: 'صداع',
    zh: '头痛',
    pt: 'Dor de Cabeça',
    bn: 'মাথাব্যথা',
    ta: 'தலைவலி',
  },
  cough: {
    en: 'Cough & Cold',
    hi: 'खांसी और जुकाम',
    es: 'Tos y Resfriado',
    fr: 'Toux et Rhume',
    de: 'Husten & Erkältung',
    ar: 'السعال والبرد',
    zh: '咳嗽和感冒',
    pt: 'Tosse e Resfriado',
    bn: 'কাশি এবং সর্দি',
    ta: 'இருமல் & சளி',
  },
  diabetes: {
    en: 'Diabetes',
    hi: 'मधुमेह',
    es: 'Diabetes',
    fr: 'Diabète',
    de: 'Diabetes',
    ar: 'السكري',
    zh: '糖尿病',
    pt: 'Diabetes',
    bn: 'ডায়াবেটিস',
    ta: 'நீரிழிவு',
  },
  dengue: {
    en: 'Dengue',
    hi: 'डेंगू',
    es: 'Dengue',
    fr: 'Dengue',
    de: 'Dengue',
    ar: 'حمى الضنك',
    zh: '登革热',
    pt: 'Dengue',
    bn: 'ডেঙ্গু',
    ta: 'டெங்கு',
  },
  // Chat
  placeholder: {
    en: 'Ask about symptoms, conditions, or first aid...',
    hi: 'लक्षण, स्थितियों, या प्राथमिक चिकित्सा के बारे में पूछें...',
    es: 'Pregunte sobre síntomas, condiciones o primeros auxilios...',
    fr: 'Posez des questions sur les symptômes, conditions ou premiers secours...',
    de: 'Fragen Sie nach Symptomen, Erkrankungen oder Erste Hilfe...',
    ar: 'اسأل عن الأعراض أو الحالات أو الإسعافات الأولية...',
    zh: '询问症状、疾病或急救...',
    pt: 'Pergunte sobre sintomas, condições ou primeiros socorros...',
    bn: 'লক্ষণ, অবস্থা বা প্রাথমিক চিকিৎসা সম্পর্কে জিজ্ঞাসা করুন...',
    ta: 'அறிகுறிகள், நிலைகள் அல்லது முதலுதவி பற்றி கேளுங்கள்...',
  },
  send: {
    en: 'Send',
    hi: 'भेजें',
    es: 'Enviar',
    fr: 'Envoyer',
    de: 'Senden',
    ar: 'إرسال',
    zh: '发送',
    pt: 'Enviar',
    bn: 'পাঠান',
    ta: 'அனுப்பு',
  },
  typing: {
    en: 'Typing...',
    hi: 'टाइप कर रहा है...',
    es: 'Escribiendo...',
    fr: 'En train d\'écrire...',
    de: 'Schreibt...',
    ar: 'يكتب...',
    zh: '正在输入...',
    pt: 'Digitando...',
    bn: 'টাইপ করছে...',
    ta: 'தட்டச்சு செய்கிறது...',
  },
  welcomeTitle: {
    en: 'Welcome to Medical Assistant',
    hi: 'चिकित्सा सहायक में आपका स्वागत है',
    es: 'Bienvenido al Asistente Médico',
    fr: 'Bienvenue chez l\'Assistant Médical',
    de: 'Willkommen beim Medizinischen Assistenten',
    ar: 'مرحبًا بك في المساعد الطبي',
    zh: '欢迎使用医疗助手',
    pt: 'Bem-vindo ao Assistente Médico',
    bn: 'চিকিৎসা সহায়কে স্বাগতম',
    ta: 'மருத்துவ உதவியாளருக்கு வரவேற்கிறோம்',
  },
  welcomeMessage: {
    en: 'I can help you with general health information, symptoms, prevention tips, and first aid guidance. Remember, I provide information only - always consult a doctor for proper diagnosis.',
    hi: 'मैं आपको सामान्य स्वास्थ्य जानकारी, लक्षण, रोकथाम युक्तियाँ और प्राथमिक चिकित्सा मार्गदर्शन में मदद कर सकता हूं। याद रखें, मैं केवल जानकारी प्रदान करता हूं - उचित निदान के लिए हमेशा डॉक्टर से परामर्श करें।',
    es: 'Puedo ayudarte con información general de salud, síntomas, consejos de prevención y guía de primeros auxilios. Recuerda, solo proporciono información - siempre consulta a un médico para un diagnóstico adecuado.',
    fr: 'Je peux vous aider avec des informations générales sur la santé, les symptômes, les conseils de prévention et les premiers secours. N\'oubliez pas, je fournis uniquement des informations - consultez toujours un médecin pour un diagnostic approprié.',
    de: 'Ich kann Ihnen bei allgemeinen Gesundheitsinformationen, Symptomen, Präventionstipps und Erste-Hilfe-Anleitungen helfen. Denken Sie daran, ich gebe nur Informationen - konsultieren Sie immer einen Arzt für eine richtige Diagnose.',
    ar: 'يمكنني مساعدتك بمعلومات صحية عامة، أعراض، نصائح وقائية، وإرشادات إسعافات أولية. تذكر، أقدم معلومات فقط - استشر طبيبًا دائمًا للتشخيص الصحيح.',
    zh: '我可以帮助您获取一般健康信息、症状、预防建议和急救指导。请记住，我只提供信息 - 请务必咨询医生以获得正确诊断。',
    pt: 'Posso ajudá-lo com informações gerais de saúde, sintomas, dicas de prevenção e orientação de primeiros socorros. Lembre-se, eu forneço apenas informações - sempre consulte um médico para diagnóstico adequado.',
    bn: 'আমি আপনাকে সাধারণ স্বাস্থ্য তথ্য, লক্ষণ, প্রতিরোধ টিপস এবং প্রাথমিক চিকিৎসা নির্দেশনায় সাহায্য করতে পারি। মনে রাখবেন, আমি শুধু তথ্য প্রদান করি - সঠিক রোগ নির্ণয়ের জন্য সর্বদা একজন ডাক্তারের সাথে পরামর্শ করুন।',
    ta: 'பொது சுகாதார தகவல், அறிகுறிகள், தடுப்பு குறிப்புகள் மற்றும் முதலுதவி வழிகாட்டுதலில் நான் உங்களுக்கு உதவ முடியும். நினைவில் கொள்ளுங்கள், நான் தகவல் மட்டுமே வழங்குகிறேன் - சரியான நோயறிதலுக்கு எப்போதும் மருத்துவரை அணுகவும்.',
  },
  exampleQuestions: {
    en: 'Example questions:',
    hi: 'उदाहरण प्रश्न:',
    es: 'Preguntas de ejemplo:',
    fr: 'Questions exemples:',
    de: 'Beispielfragen:',
    ar: 'أسئلة نموذجية:',
    zh: '示例问题：',
    pt: 'Perguntas de exemplo:',
    bn: 'উদাহরণ প্রশ্ন:',
    ta: 'எடுத்துக்காட்டு கேள்விகள்:',
  },
  example1: {
    en: 'What are the symptoms of dengue?',
    hi: 'डेंगू के लक्षण क्या हैं?',
    es: '¿Cuáles son los síntomas del dengue?',
    fr: 'Quels sont les symptômes de la dengue?',
    de: 'Was sind die Symptome von Dengue?',
    ar: 'ما هي أعراض حمى الضنك؟',
    zh: '登革热的症状是什么？',
    pt: 'Quais são os sintomas da dengue?',
    bn: 'ডেঙ্গুর লক্ষণ কী?',
    ta: 'டெங்குவின் அறிகுறிகள் என்ன?',
  },
  example2: {
    en: 'How can I prevent diabetes?',
    hi: 'मैं मधुमेह को कैसे रोक सकता हूं?',
    es: '¿Cómo puedo prevenir la diabetes?',
    fr: 'Comment puis-je prévenir le diabète?',
    de: 'Wie kann ich Diabetes vorbeugen?',
    ar: 'كيف يمكنني الوقاية من السكري؟',
    zh: '我如何预防糖尿病？',
    pt: 'Como posso prevenir a diabetes?',
    bn: 'আমি কীভাবে ডায়াবেটিস প্রতিরোধ করতে পারি?',
    ta: 'நீரிழிவை எப்படி தடுக்கலாம்?',
  },
  example3: {
    en: 'What should I do for a mild fever?',
    hi: 'हल्के बुखार के लिए मुझे क्या करना चाहिए?',
    es: '¿Qué debo hacer para una fiebre leve?',
    fr: 'Que dois-je faire pour une légère fièvre?',
    de: 'Was soll ich bei leichtem Fieber tun?',
    ar: 'ماذا يجب أن أفعل للحمى الخفيفة؟',
    zh: '轻微发烧应该怎么办？',
    pt: 'O que devo fazer para uma febre leve?',
    bn: 'হালকা জ্বরের জন্য আমার কী করা উচিত?',
    ta: 'லேசான காய்ச்சலுக்கு நான் என்ன செய்ய வேண்டும்?',
  },
  // Emergency
  emergencyTitle: {
    en: '🚨 EMERGENCY DETECTED',
    hi: '🚨 आपातकालीन स्थिति',
    es: '🚨 EMERGENCIA DETECTADA',
    fr: '🚨 URGENCE DÉTECTÉE',
    de: '🚨 NOTFALL ERKANNT',
    ar: '🚨 تم اكتشاف حالة طوارئ',
    zh: '🚨 检测到紧急情况',
    pt: '🚨 EMERGÊNCIA DETECTADA',
    bn: '🚨 জরুরি অবস্থা সনাক্ত',
    ta: '🚨 அவசரநிலை கண்டறியப்பட்டது',
  },
  emergencyMessage: {
    en: 'This may be a medical emergency. Please call emergency services immediately!',
    hi: 'यह एक चिकित्सा आपातकाल हो सकता है। कृपया तुरंत आपातकालीन सेवाओं को कॉल करें!',
    es: 'Esto puede ser una emergencia médica. ¡Por favor llame a los servicios de emergencia inmediatamente!',
    fr: 'Cela peut être une urgence médicale. Veuillez appeler les services d\'urgence immédiatement!',
    de: 'Dies könnte ein medizinischer Notfall sein. Bitte rufen Sie sofort den Notdienst an!',
    ar: 'قد تكون هذه حالة طوارئ طبية. يرجى الاتصال بخدمات الطوارئ فورًا!',
    zh: '这可能是医疗紧急情况。请立即拨打急救电话！',
    pt: 'Isso pode ser uma emergência médica. Por favor, ligue para os serviços de emergência imediatamente!',
    bn: 'এটি একটি চিকিৎসা জরুরি অবস্থা হতে পারে। অনুগ্রহ করে অবিলম্বে জরুরি সেবায় কল করুন!',
    ta: 'இது மருத்துவ அவசரநிலையாக இருக்கலாம். உடனடியாக அவசர சேவைகளை அழைக்கவும்!',
  },
  emergencyNumbers: {
    en: 'Emergency Numbers (India): 112 | 102 | 108',
    hi: 'आपातकालीन नंबर (भारत): 112 | 102 | 108',
    es: 'Números de Emergencia (India): 112 | 102 | 108',
    fr: 'Numéros d\'Urgence (Inde): 112 | 102 | 108',
    de: 'Notrufnummern (Indien): 112 | 102 | 108',
    ar: 'أرقام الطوارئ (الهند): 112 | 102 | 108',
    zh: '紧急电话（印度）：112 | 102 | 108',
    pt: 'Números de Emergência (Índia): 112 | 102 | 108',
    bn: 'জরুরি নম্বর (ভারত): 112 | 102 | 108',
    ta: 'அவசர எண்கள் (இந்தியா): 112 | 102 | 108',
  },
  // Reminder
  consultDoctor: {
    en: '📋 Please consult a healthcare professional for proper diagnosis and treatment.',
    hi: '📋 कृपया उचित निदान और उपचार के लिए स्वास्थ्य पेशेवर से परामर्श करें।',
    es: '📋 Por favor consulte a un profesional de la salud para diagnóstico y tratamiento adecuados.',
    fr: '📋 Veuillez consulter un professionnel de santé pour un diagnostic et un traitement appropriés.',
    de: '📋 Bitte konsultieren Sie einen Arzt für eine richtige Diagnose und Behandlung.',
    ar: '📋 يرجى استشارة أخصائي الرعاية الصحية للتشخيص والعلاج المناسب.',
    zh: '📋 请咨询医疗专业人员以获得正确的诊断和治疗。',
    pt: '📋 Por favor, consulte um profissional de saúde para diagnóstico e tratamento adequados.',
    bn: '📋 সঠিক রোগ নির্ণয় এবং চিকিৎসার জন্য অনুগ্রহ করে একজন স্বাস্থ্য পেশাদারের সাথে পরামর্শ করুন।',
    ta: '📋 சரியான நோயறிதல் மற்றும் சிகிச்சைக்கு சுகாதார நிபுணரை அணுகவும்.',
  },
  getCheckup: {
    en: '🏥 GET A CHECK-UP',
    hi: '🏥 जांच करवाएं',
    es: '🏥 HÁGASE UN CHEQUEO',
    fr: '🏥 FAITES UN BILAN DE SANTÉ',
    de: '🏥 LASSEN SIE SICH UNTERSUCHEN',
    ar: '🏥 احصل على فحص طبي',
    zh: '🏥 进行检查',
    pt: '🏥 FAÇA UM CHECK-UP',
    bn: '🏥 চেক-আপ করান',
    ta: '🏥 பரிசோதனை செய்யுங்கள்',
  },
  checkupReminder: {
    en: 'This information is not a substitute for professional medical advice. Schedule a check-up with your doctor.',
    hi: 'यह जानकारी पेशेवर चिकित्सा सलाह का विकल्प नहीं है। अपने डॉक्टर के साथ जांच का समय निर्धारित करें।',
    es: 'Esta información no sustituye el consejo médico profesional. Programe una cita con su médico.',
    fr: 'Cette information ne remplace pas un avis médical professionnel. Prenez rendez-vous avec votre médecin.',
    de: 'Diese Informationen ersetzen keine professionelle medizinische Beratung. Vereinbaren Sie einen Termin mit Ihrem Arzt.',
    ar: 'هذه المعلومات ليست بديلاً عن المشورة الطبية المهنية. حدد موعدًا لفحص مع طبيبك.',
    zh: '此信息不能替代专业医疗建议。请与您的医生预约检查。',
    pt: 'Esta informação não substitui o aconselhamento médico profissional. Agende uma consulta com seu médico.',
    bn: 'এই তথ্য পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়। আপনার ডাক্তারের সাথে চেক-আপের সময় নির্ধারণ করুন।',
    ta: 'இந்த தகவல் தொழில்முறை மருத்துவ ஆலோசனைக்கு மாற்றாக இல்லை. உங்கள் மருத்துவரிடம் பரிசோதனை நேரம் திட்டமிடுங்கள்.',
  },
  // Language
  language: {
    en: 'Language',
    hi: 'भाषा',
    es: 'Idioma',
    fr: 'Langue',
    de: 'Sprache',
    ar: 'اللغة',
    zh: '语言',
    pt: 'Idioma',
    bn: 'ভাষা',
    ta: 'மொழி',
  },
  selectLanguage: {
    en: 'Select Language',
    hi: 'भाषा चुनें',
    es: 'Seleccionar Idioma',
    fr: 'Sélectionner la Langue',
    de: 'Sprache Auswählen',
    ar: 'اختر اللغة',
    zh: '选择语言',
    pt: 'Selecionar Idioma',
    bn: 'ভাষা নির্বাচন করুন',
    ta: 'மொழியைத் தேர்ந்தெடுக்கவும்',
  },
};

// Helper to get questions in the selected language
export const getQuickQuestions = (language: Language) => ({
  symptoms: {
    en: 'What are common symptoms I should watch out for?',
    hi: 'मुझे किन सामान्य लक्षणों पर ध्यान देना चाहिए?',
    es: '¿Cuáles son los síntomas comunes que debo tener en cuenta?',
    fr: 'Quels sont les symptômes courants auxquels je dois faire attention?',
    de: 'Auf welche häufigen Symptome sollte ich achten?',
    ar: 'ما هي الأعراض الشائعة التي يجب أن أنتبه لها؟',
    zh: '我应该注意哪些常见症状？',
    pt: 'Quais são os sintomas comuns que devo observar?',
    bn: 'কোন সাধারণ লক্ষণগুলি আমার লক্ষ্য রাখা উচিত?',
    ta: 'நான் கவனிக்க வேண்டிய பொதுவான அறிகுறிகள் என்ன?',
  }[language],
  prevention: {
    en: 'How can I prevent common illnesses?',
    hi: 'मैं सामान्य बीमारियों को कैसे रोक सकता हूं?',
    es: '¿Cómo puedo prevenir enfermedades comunes?',
    fr: 'Comment puis-je prévenir les maladies courantes?',
    de: 'Wie kann ich häufige Krankheiten vorbeugen?',
    ar: 'كيف يمكنني الوقاية من الأمراض الشائعة؟',
    zh: '我如何预防常见疾病？',
    pt: 'Como posso prevenir doenças comuns?',
    bn: 'আমি কীভাবে সাধারণ রোগ প্রতিরোধ করতে পারি?',
    ta: 'பொதுவான நோய்களை எப்படி தடுக்கலாம்?',
  }[language],
  firstAid: {
    en: 'What are basic first aid tips?',
    hi: 'बुनियादी प्राथमिक चिकित्सा युक्तियाँ क्या हैं?',
    es: '¿Cuáles son los consejos básicos de primeros auxilios?',
    fr: 'Quels sont les conseils de base en premiers secours?',
    de: 'Was sind grundlegende Erste-Hilfe-Tipps?',
    ar: 'ما هي نصائح الإسعافات الأولية الأساسية؟',
    zh: '基本急救技巧是什么？',
    pt: 'Quais são as dicas básicas de primeiros socorros?',
    bn: 'প্রাথমিক চিকিৎসার মৌলিক টিপস কী?',
    ta: 'அடிப்படை முதலுதவி குறிப்புகள் என்ன?',
  }[language],
  whenToSeeDoctor: {
    en: 'When should I see a doctor?',
    hi: 'मुझे डॉक्टर से कब मिलना चाहिए?',
    es: '¿Cuándo debo ver a un médico?',
    fr: 'Quand devrais-je consulter un médecin?',
    de: 'Wann sollte ich einen Arzt aufsuchen?',
    ar: 'متى يجب أن أزور الطبيب؟',
    zh: '我什么时候应该看医生？',
    pt: 'Quando devo consultar um médico?',
    bn: 'কখন আমার ডাক্তার দেখানো উচিত?',
    ta: 'எப்போது மருத்துவரை பார்க்க வேண்டும்?',
  }[language],
  fever: {
    en: 'What should I do for a fever?',
    hi: 'बुखार होने पर मुझे क्या करना चाहिए?',
    es: '¿Qué debo hacer si tengo fiebre?',
    fr: 'Que dois-je faire en cas de fièvre?',
    de: 'Was soll ich bei Fieber tun?',
    ar: 'ماذا يجب أن أفعل في حالة الحمى؟',
    zh: '发烧时我应该怎么办？',
    pt: 'O que devo fazer se tiver febre?',
    bn: 'জ্বর হলে কী করা উচিত?',
    ta: 'காய்ச்சல் வந்தால் என்ன செய்ய வேண்டும்?',
  }[language],
  headache: {
    en: 'What causes headaches and how to relieve them?',
    hi: 'सिरदर्द का कारण क्या है और इसे कैसे कम करें?',
    es: '¿Qué causa los dolores de cabeza y cómo aliviarlos?',
    fr: 'Quelles sont les causes des maux de tête et comment les soulager?',
    de: 'Was verursacht Kopfschmerzen und wie kann man sie lindern?',
    ar: 'ما الذي يسبب الصداع وكيفية تخفيفه؟',
    zh: '什么导致头痛以及如何缓解？',
    pt: 'O que causa dores de cabeça e como aliviá-las?',
    bn: 'মাথাব্যথার কারণ কী এবং কীভাবে উপশম করা যায়?',
    ta: 'தலைவலி எதனால் வருகிறது மற்றும் எப்படி நிவாரணம் பெறுவது?',
  }[language],
  cough: {
    en: 'How do I treat a cough and cold at home?',
    hi: 'घर पर खांसी और जुकाम का इलाज कैसे करें?',
    es: '¿Cómo puedo tratar la tos y el resfriado en casa?',
    fr: 'Comment traiter la toux et le rhume à la maison?',
    de: 'Wie behandle ich Husten und Erkältung zu Hause?',
    ar: 'كيف أعالج السعال والبرد في المنزل؟',
    zh: '如何在家治疗咳嗽和感冒？',
    pt: 'Como posso tratar tosse e resfriado em casa?',
    bn: 'বাড়িতে কাশি এবং সর্দি কীভাবে চিকিৎসা করব?',
    ta: 'வீட்டில் இருமல் மற்றும் சளியை எப்படி சிகிச்சை செய்வது?',
  }[language],
  diabetes: {
    en: 'How can I prevent diabetes?',
    hi: 'मैं मधुमेह को कैसे रोक सकता हूं?',
    es: '¿Cómo puedo prevenir la diabetes?',
    fr: 'Comment puis-je prévenir le diabète?',
    de: 'Wie kann ich Diabetes vorbeugen?',
    ar: 'كيف يمكنني الوقاية من السكري؟',
    zh: '我如何预防糖尿病？',
    pt: 'Como posso prevenir a diabetes?',
    bn: 'আমি কীভাবে ডায়াবেটিস প্রতিরোধ করতে পারি?',
    ta: 'நீரிழிவை எப்படி தடுக்கலாம்?',
  }[language],
  dengue: {
    en: 'What are the symptoms of dengue?',
    hi: 'डेंगू के लक्षण क्या हैं?',
    es: '¿Cuáles son los síntomas del dengue?',
    fr: 'Quels sont les symptômes de la dengue?',
    de: 'Was sind die Symptome von Dengue?',
    ar: 'ما هي أعراض حمى الضنك؟',
    zh: '登革热的症状是什么？',
    pt: 'Quais são os sintomas da dengue?',
    bn: 'ডেঙ্গুর লক্ষণ কী?',
    ta: 'டெங்குவின் அறிகுறிகள் என்ன?',
  }[language],
});

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('medical-chatbot-language');
    return (saved as Language) || 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('medical-chatbot-language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
