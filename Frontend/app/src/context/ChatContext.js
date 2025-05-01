import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (text, attachment = null) => {
    try {
      // Add user message
      const userMessage = { 
        id: Date.now(), 
        text, 
        isUser: true, 
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // In a real app, you'd connect to your backend here
      // For now, mock a response after a delay
      await new Promise(r => setTimeout(r, 2000));
      
      let responseText = '';
      
      if (text.toLowerCase().includes('contract')) {
        responseText = 'A legally binding contract requires several key components: (1) Offer - a clear proposal, (2) Acceptance - unambiguous agreement to the terms, (3) Consideration - something of value exchanged, (4) Legal capacity of all parties, (5) Legal purpose, and (6) Mutual assent or "meeting of the minds." Missing any of these elements could make the contract unenforceable.';
      } 
      else if (text.toLowerCase().includes('force majeure')) {
        responseText = 'Force majeure clauses excuse a party from performance when extraordinary events prevent fulfillment of contract obligations. These events typically include "acts of God," natural disasters, war, government actions, or other circumstances beyond reasonable control. Courts generally interpret these clauses narrowly, so specific language matters. During the COVID-19 pandemic, many force majeure clauses were tested in unprecedented ways, leading to new legal interpretations.';
      } 
      else if (text.toLowerCase().includes('gdpr')) {
        responseText = 'GDPR (General Data Protection Regulation) key requirements include:\n\n• Lawful basis for processing personal data\n• Data minimization and purpose limitation\n• Storage limitation (retention policies)\n• Privacy by design and default\n• Documented consent management\n• Data subject rights (access, erasure, portability)\n• 72-hour breach notification\n• Data Protection Impact Assessments\n• Records of processing activities\n• Data Protection Officer appointment (when required)';
      } 
      else if (text.toLowerCase().includes('fiduciary duty')) {
        responseText = 'Fiduciary duty is a legal obligation where one party (the fiduciary) must act in the best interest of another (the principal or beneficiary). Its the highest standard of care in law, requiring loyalty, good faith, and full disclosure. Common fiduciary relationships include attorney-client, trustee-beneficiary, corporate director-shareholders, and financial advisor-client relationships. Breach of fiduciary duty can result in significant legal consequences.';
      } 
      else if (text.toLowerCase().includes('implied warranty')) {
        responseText = 'An implied warranty is an unwritten guarantee that automatically exists by law when products are sold. The two main types are: (1) Implied warranty of merchantability - assurance that goods are reasonably fit for ordinary purposes, and (2) Implied warranty of fitness for a particular purpose - applies when a seller knows the specific use intended for their product. Unlike express warranties, they aren\'t explicitly stated but are still legally enforceable in most jurisdictions.';
      } 
      else if (text.toLowerCase().includes('privacy')) {
        responseText = 'Privacy laws like GDPR (EU), CCPA/CPRA (California), and PIPEDA (Canada) regulate how organizations handle personal data. Key principles include: transparency about data collection, purpose limitation, data minimization, individual rights (access, deletion), security requirements, and limitations on data sharing. Organizations must implement comprehensive privacy programs with appropriate technical and organizational measures to ensure compliance.';
      } 
      else {
        responseText = 'I can help with legal questions about contracts, regulations, compliance, and document analysis. Please feel free to ask about specific legal concepts, document types, or regulatory requirements you need guidance on.';
      }
      
      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to get response');
      setIsLoading(false);
    }
  };
  
  const clearChat = () => setMessages([]);

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isLoading, 
      error, 
      sendMessage,
      clearChat 
    }}>
      {children}
    </ChatContext.Provider>
  );
};