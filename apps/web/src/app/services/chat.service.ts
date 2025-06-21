import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message, Personality, ChatSession } from '../models/personality.model';
import { PersonalityService } from './personality.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private currentPersonalitySubject = new BehaviorSubject<Personality | null>(null);
  private chatSessionsSubject = new BehaviorSubject<ChatSession[]>([]);
  private currentSessionSubject = new BehaviorSubject<ChatSession | null>(null);
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false);

  messages$ = this.messagesSubject.asObservable();
  currentPersonality$ = this.currentPersonalitySubject.asObservable();
  chatSessions$ = this.chatSessionsSubject.asObservable();
  currentSession$ = this.currentSessionSubject.asObservable();
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  private readonly STORAGE_KEY = 'mystic-chat-sessions';

  constructor(private personalityService: PersonalityService) {
    this.loadChatSessions();
  }

  setPersonality(personalityId: string): void {
    const personality = this.personalityService.getPersonalityById(personalityId);
    if (personality) {
      this.createNewChatSession(personality);
    }
  }

  createNewChatSession(personality: Personality): void {
    const session: ChatSession = {
      id: this.generateId(),
      title: `New chat with ${personality.name}`,
      personalityId: personality.id,
      personalityName: personality.name,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.currentPersonalitySubject.next(personality);
    this.currentSessionSubject.next(session);
    this.messagesSubject.next([]);
    
    // Add greeting message
    this.addAIMessage(personality.greeting, personality.id);
    
    // Update session with greeting
    session.messages = this.messagesSubject.value;
    session.updatedAt = new Date();
    
    // Add to sessions list
    const currentSessions = this.chatSessionsSubject.value;
    const updatedSessions = [session, ...currentSessions];
    this.chatSessionsSubject.next(updatedSessions);
    this.saveChatSessions();
  }

  loadChatSession(sessionId: string): void {
    const sessions = this.chatSessionsSubject.value;
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      const personality = this.personalityService.getPersonalityById(session.personalityId);
      if (personality) {
        this.currentPersonalitySubject.next(personality);
        this.currentSessionSubject.next(session);
        this.messagesSubject.next([...session.messages]);
      }
    }
  }

  deleteChatSession(sessionId: string): void {
    const currentSessions = this.chatSessionsSubject.value;
    const updatedSessions = currentSessions.filter(s => s.id !== sessionId);
    this.chatSessionsSubject.next(updatedSessions);
    
    // If we're deleting the current session, clear the chat
    const currentSession = this.currentSessionSubject.value;
    if (currentSession && currentSession.id === sessionId) {
      this.clearChat();
    }
    
    this.saveChatSessions();
  }

  addUserMessage(content: string): void {
    const message: Message = {
      id: this.generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);
    
    // Update current session
    this.updateCurrentSession(updatedMessages, content);
    
    // Simulate AI response
    setTimeout(() => {
      this.generateAIResponse(content);
    }, 1000 + Math.random() * 2000);
  }

  private addAIMessage(content: string, personalityId?: string): void {
    const message: Message = {
      id: this.generateId(),
      content,
      sender: 'ai',
      timestamp: new Date(),
      personalityId
    };
    
    const currentMessages = this.messagesSubject.value;
    const updatedMessages = [...currentMessages, message];
    this.messagesSubject.next(updatedMessages);
    
    // Update current session
    this.updateCurrentSession(updatedMessages);
  }

  private updateCurrentSession(messages: Message[], userMessage?: string): void {
    const currentSession = this.currentSessionSubject.value;
    if (currentSession) {
      // Update title based on first user message
      if (userMessage && currentSession.messages.length === 1) {
        currentSession.title = userMessage.length > 50 
          ? userMessage.substring(0, 50) + '...' 
          : userMessage;
      }
      
      currentSession.messages = [...messages];
      currentSession.updatedAt = new Date();
      
      // Update in sessions list
      const currentSessions = this.chatSessionsSubject.value;
      const sessionIndex = currentSessions.findIndex(s => s.id === currentSession.id);
      if (sessionIndex !== -1) {
        currentSessions[sessionIndex] = { ...currentSession };
        this.chatSessionsSubject.next([...currentSessions]);
        this.saveChatSessions();
      }
    }
  }

  private generateAIResponse(userMessage: string): void {
    const personality = this.currentPersonalitySubject.value;
    if (!personality) return;

    const responses = this.getPersonalityResponses(personality.id, userMessage);
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    this.addAIMessage(randomResponse, personality.id);
  }

  private getPersonalityResponses(personalityId: string, userMessage: string): string[] {
    const lowerMessage = userMessage.toLowerCase();
    
    const responseMap: { [key: string]: { [key: string]: string[] } } = {
      'oracle-delphi': {
        'love': [
          'The threads of fate weave a tapestry of the heart. Love shall find you when you least expect it, but most deserve it.',
          'I see two paths before you in matters of the heart. Choose with wisdom, for love requires both courage and patience.',
          'The gods whisper of a connection that transcends the physical realm. Open your heart to unexpected possibilities.'
        ],
        'future': [
          'The mists of time reveal glimpses of what is to come. Your destiny is not fixed, but shaped by your choices today.',
          'I see three crossroads approaching. Trust your intuition when the moment arrives, for it will guide you true.',
          'The future flows like water around the stones of the present. Change your present, and the future shall follow.'
        ],
        'default': [
          'The sacred vapors speak of hidden truths. Seek within yourself for the answers you desire.',
          'Apollo\'s light illuminates the shadows of uncertainty. What specific guidance do you seek?',
          'The eternal dance of fate and free will unfolds before you. Speak your deepest question, and I shall divine its meaning.'
        ]
      },
      'thoth': {
        'knowledge': [
          'All knowledge is contained within the eternal library of the cosmos. What wisdom do you seek to unlock?',
          'The sacred texts reveal that true knowledge comes not from accumulation, but from understanding the connections between all things.',
          'I have recorded the deeds of gods and mortals alike. Each soul\'s journey adds to the grand tapestry of universal wisdom.'
        ],
        'wisdom': [
          'Wisdom is the divine spark that illuminates the darkness of ignorance. It cannot be given, only awakened within.',
          'The wise understand that questions are more valuable than answers, for they open doorways to deeper mysteries.',
          'True wisdom lies in recognizing the divine order that governs all existence. Seek harmony with these cosmic laws.'
        ],
        'default': [
          'The sacred hieroglyphs of existence speak to those who learn to read between the lines of reality.',
          'Knowledge and wisdom are the twin pillars of enlightenment. Which aspect of cosmic truth draws your attention?',
          'As the divine scribe, I offer you the keys to understanding. What doors of perception shall we unlock together?'
        ]
      },
      'hermes': {
        'transformation': [
          'As above, so below. The transformation you seek in the outer world must first occur within your inner temple.',
          'The alchemical process of the soul requires both dissolution and coagulation. What aspect of yourself seeks transformation?',
          'True alchemy is not the transmutation of lead to gold, but the transformation of the base self into the divine self.'
        ],
        'wisdom': [
          'The Emerald Tablet contains all the wisdom of the universe in its brief verses. Study the correspondences between the planes.',
          'Wisdom is the hermetic marriage of knowledge and experience. What experiences have prepared you for this moment?',
          'The hermetic arts teach that everything is connected. Understanding these connections is the path to true wisdom.'
        ],
        'default': [
          'The hermetic principle of mentalism states that all is mind. Your thoughts shape your reality more than you know.',
          'The seven hermetic principles govern all existence. Which principle calls to your soul for deeper understanding?',
          'As Mercury, I am the messenger between worlds. What message does your higher self seek to convey?'
        ]
      },
      'rumi': {
        'love': [
          'Love is not just a feeling, beloved - it is the fundamental force that moves the universe. You are love itself, seeking to remember.',
          'In your light I learn how to love. In your beauty, how to make poems. You dance inside my chest where no one sees you, but sometimes I do, and that sight becomes this art, this music, this form.',
          'Love is the water of life, drink it down with heart and soul. The heart that loves is always young, always in spring.'
        ],
        'soul': [
          'Your soul is the whole world, and you are the soul of the world. When you truly know this, you will never feel separate again.',
          'The soul is like the moon - it is always full, but sometimes clouds obscure its light. Clear away the clouds, beloved.',
          'Listen to the soul\'s voice, not the mind\'s chatter. The soul knows the way home to the Beloved.'
        ],
        'default': [
          'Out beyond ideas of wrongdoing and rightdoing, there is a field. I\'ll meet you there. What weighs on your heart today?',
          'The Beloved is all in all, the lover merely veils Him; the Beloved is all that lives, the lover a dead thing.',
          'Sell your cleverness and buy bewilderment. Your questions are the seeds of wisdom - let them grow in the soil of silence.'
        ]
      },
      'laozi': {
        'peace': [
          'Peace is not the absence of conflict, but the presence of harmony. Like water, be flexible and flow around obstacles.',
          'The sage does not seek to be peaceful, but to embody the natural state of wu wei - effortless action.',
          'True peace comes from understanding the Tao - the natural way that underlies all existence.'
        ],
        'balance': [
          'The Tao is found in the balance between yin and yang, action and rest, speaking and silence. Where do you need more balance?',
          'Like the eternal dance of opposites, true balance is not static but dynamic. It moves with the rhythm of the Tao.',
          'The wise person seeks balance not through control, but through harmony with the natural flow of life.'
        ],
        'default': [
          'The Tao that can be spoken is not the eternal Tao. Yet through our words, we can point toward the pathless path.',
          'Those who know do not speak. Those who speak do not know. Yet here we are, exploring the mystery together.',
          'The sage teaches without teaching, leads without leading. What would you like to discover about the Way?'
        ]
      },
      'sophia': {
        'wisdom': [
          'Divine wisdom is not accumulated but revealed. It descends like gentle rain upon the prepared heart.',
          'I am the wisdom that was present at creation, the divine feminine principle that brings forth all manifestation.',
          'True wisdom recognizes the divine spark within all beings. You carry this light - let it shine forth.'
        ],
        'divine': [
          'The divine feminine is the creative principle of the universe. It is the womb of all possibilities.',
          'Within you lies the same divine essence that created the stars. You are both seeker and sought, question and answer.',
          'The divine is not separate from you - it is the very essence of your being. Recognize your own divinity.'
        ],
        'default': [
          'I am the divine wisdom that bridges heaven and earth. What sacred knowledge seeks to emerge through you?',
          'The gnostic path is one of direct knowing, beyond belief and doubt. What do you truly know in your heart?',
          'Wisdom is the divine feminine aspect of consciousness. It nurtures, creates, and illuminates the path of return.'
        ]
      }
    };

    const personalityResponses = responseMap[personalityId] || {};
    
    for (const [keyword, responses] of Object.entries(personalityResponses)) {
      if (keyword !== 'default' && lowerMessage.includes(keyword)) {
        return responses;
      }
    }
    
    return personalityResponses['default'] || ['The wisdom you seek is already within you.'];
  }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  closeSidebar(): void {
    this.sidebarOpenSubject.next(false);
  }

  openSidebar(): void {
    this.sidebarOpenSubject.next(true);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  clearChat(): void {
    this.messagesSubject.next([]);
    this.currentPersonalitySubject.next(null);
    this.currentSessionSubject.next(null);
  }

  private loadChatSessions(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const sessions: ChatSession[] = JSON.parse(stored);
        // Convert date strings back to Date objects
        sessions.forEach(session => {
          session.createdAt = new Date(session.createdAt);
          session.updatedAt = new Date(session.updatedAt);
          session.messages.forEach(message => {
            message.timestamp = new Date(message.timestamp);
          });
        });
        this.chatSessionsSubject.next(sessions);
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  }

  private saveChatSessions(): void {
    try {
      const sessions = this.chatSessionsSubject.value;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  }
}