import { LanguageProvider } from '@/contexts/LanguageContext';
import MedicalChatbot from '@/components/medical/MedicalChatbot';

const Index = () => {
  return (
    <LanguageProvider>
      <MedicalChatbot />
    </LanguageProvider>
  );
};

export default Index;
