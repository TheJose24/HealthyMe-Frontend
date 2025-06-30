export interface IChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
  metadata?: {
    confidence?: number;
    modelUsed?: string;
    processingTime?: number;
  };
}

export interface IChatSession {
  id: string;
  messages: IChatMessage[];
  startTime: Date;
  isActive: boolean;
  patientContext?: IPatientContext;
}

export interface IPatientContext {
  symptoms?: string[];
  medicalHistory?: string;
  currentMedications?: string[];
  allergies?: string[];
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

export interface IChatState {
  currentSession: IChatSession | null;
  isConnected: boolean;
  isTyping: boolean;
  lastError: string | null;
}
