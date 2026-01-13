import type { ChatAPI, Conversation, Message } from '@/types/chat';

// Mock admin credentials for testing
export const MOCK_ADMIN_CREDENTIALS = {
  email: 'admin@foodphoto-pro.com',
  password: 'demo1234'
};

// In-memory storage for mock data
const conversations: Map<string, Conversation> = new Map();
const messages: Map<string, Message[]> = new Map();
let mockAdminSession: string | null = null;

const nowISO = () => new Date().toISOString();
const uuid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const MockChatApi: ChatAPI = {
  async start() {
    // Create new conversation for end user with sample data
    const conversationId = uuid();
    const conversation: Conversation = {
      id: conversationId,
      channel: 'web',
      status: 'new',
      last_message_at: nowISO(),
      contact_name: null,
      contact_email: null,
    };
    conversations.set(conversationId, conversation);

    // Initialize with sample conversation
    const sampleMessages: Message[] = [
      {
        id: uuid(),
        conversation_id: conversationId,
        role: 'system',
        source: 'web',
        content: 'はじめまして！料理撮影のプロフェッショナル、PhotoStudioです。メニュー撮影・店舗撮影のご相談、料金プラン、撮影の流れなど、何でもお気軽にお問い合わせください。',
        created_at: new Date(Date.now() - 180000).toISOString(), // 3分前
      },
      {
        id: uuid(),
        conversation_id: conversationId,
        role: 'user',
        source: 'web',
        content: '料金について教えてください',
        created_at: new Date(Date.now() - 150000).toISOString(), // 2.5分前
      },
      {
        id: uuid(),
        conversation_id: conversationId,
        role: 'agent',
        source: 'admin',
        content: 'お問い合わせありがとうございます。\n\n料金プランは以下の3つからお選びいただけます：\n\n【ライトプラン】33,000円（1時間）\n【スタンダードプラン】44,000円（2時間）\n【プレミアムプラン】88,000円（4時間）\n\nいずれも撮影枚数は無制限で、納品は1週間以内です。',
        created_at: new Date(Date.now() - 120000).toISOString(), // 2分前
      },
      {
        id: uuid(),
        conversation_id: conversationId,
        role: 'user',
        source: 'web',
        content: 'スタンダードプランで検討しています。撮影の流れを教えてもらえますか？',
        created_at: new Date(Date.now() - 90000).toISOString(), // 1.5分前
      },
      {
        id: uuid(),
        conversation_id: conversationId,
        role: 'agent',
        source: 'admin',
        content: '撮影の流れをご説明させていただきます。\n\n1. ご予約・お打ち合わせ\n2. 撮影日当日にお伺い\n3. 料理や店内の撮影（2時間）\n4. データ納品（1週間以内）\n\nお料理は温かいうちに撮影させていただくため、調理のタイミングをご相談させていただきます。',
        created_at: new Date(Date.now() - 60000).toISOString(), // 1分前
      },
      {
        id: uuid(),
        conversation_id: conversationId,
        role: 'user',
        source: 'web',
        content: 'ありがとうございます！来週の撮影をお願いできますか？',
        created_at: new Date(Date.now() - 30000).toISOString(), // 30秒前
      },
    ];

    messages.set(conversationId, sampleMessages);

    return { conversationId };
  },

  async listConversations(params) {
    const convList = Array.from(conversations.values());
    
    // Filter by status if provided
    let filtered = params?.status 
      ? convList.filter(c => c.status === params.status)
      : convList;
    
    // Sort by last_message_at desc
    filtered.sort((a, b) => 
      new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    );
    
    // Apply limit if provided
    if (params?.limit) {
      filtered = filtered.slice(0, params.limit);
    }
    
    return filtered;
  },

  async getMessages(conversationId) {
    const msgList = messages.get(conversationId) || [];
    // Sort by created_at asc
    return msgList.sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  },

  async sendMessage({ conversationId, text }) {
    const conversation = conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    // Add user message
    const userMsg: Message = {
      id: uuid(),
      conversation_id: conversationId,
      role: 'user',
      source: 'web',
      content: text,
      created_at: nowISO(),
    };
    
    const msgList = messages.get(conversationId) || [];
    msgList.push(userMsg);
    messages.set(conversationId, msgList);
    
    // Update conversation last_message_at
    conversation.last_message_at = userMsg.created_at;
    conversations.set(conversationId, conversation);
    
    // Simulate auto-reply after delay
    setTimeout(() => {
      const autoReply: Message = {
        id: uuid(),
        conversation_id: conversationId,
        role: 'agent',
        source: 'web',
        content: 'ご質問ありがとうございます。担当者が確認次第、返信させていただきます。',
        created_at: nowISO(),
      };
      msgList.push(autoReply);
      conversation.last_message_at = autoReply.created_at;
    }, 1500);
  },

  async updateContact({ conversationId, name, email }) {
    const conversation = conversations.get(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    
    if (name !== undefined) {
      conversation.contact_name = name || null;
    }
    if (email !== undefined) {
      conversation.contact_email = email || null;
    }
    
    conversations.set(conversationId, conversation);
  },
};

// Mock authentication functions
export const MockAuthApi = {
  async signIn(email: string, password: string) {
    // Check credentials
    if (email === MOCK_ADMIN_CREDENTIALS.email && password === MOCK_ADMIN_CREDENTIALS.password) {
      mockAdminSession = uuid();
      return {
        success: true,
        session: mockAdminSession,
        user: {
          id: 'mock-admin-id',
          email: MOCK_ADMIN_CREDENTIALS.email,
          role: 'admin'
        }
      };
    }
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },
  
  async signOut() {
    mockAdminSession = null;
    return { success: true };
  },
  
  async getSession() {
    if (mockAdminSession) {
      return {
        session: mockAdminSession,
        user: {
          id: 'mock-admin-id',
          email: MOCK_ADMIN_CREDENTIALS.email,
          role: 'admin'
        }
      };
    }
    return null;
  }
};

// Track if mock data has been seeded
let mockDataSeeded = false;

// Add some sample data for admin testing only
export function seedMockData() {
  // Only seed once per session
  if (mockDataSeeded) {
    return;
  }
  mockDataSeeded = true;
  
  // Clear any existing data first
  conversations.clear();
  messages.clear();
  
  // Add multiple sample conversations
  
  // 1. Active conversation - urgent inquiry
  const activeConv1Id = uuid();
  const activeConv1: Conversation = {
    id: activeConv1Id,
    channel: 'web',
    status: 'new',
    contact_name: '鈴木花子',
    contact_email: 'suzuki@restaurant.com',
    last_message_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  };
  conversations.set(activeConv1Id, activeConv1);
  
  const activeConv1Msgs: Message[] = [
    {
      id: uuid(),
      conversation_id: activeConv1Id,
      role: 'system',
      source: 'web',
      content: 'こんにちは！飲食店撮影PhotoStudioへようこそ。お気軽にご質問ください。',
      created_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
    },
    {
      id: uuid(),
      conversation_id: activeConv1Id,
      role: 'user',
      source: 'web',
      content: '急ぎで撮影をお願いしたいのですが、最短でいつ頃可能でしょうか？',
      created_at: new Date(Date.now() - 500000).toISOString(), // 8 minutes ago
    },
    {
      id: uuid(),
      conversation_id: activeConv1Id,
      role: 'user',
      source: 'web',
      content: '来週の金曜日にグランドオープンを控えているので、それまでに撮影を完了させたいです。',
      created_at: new Date(Date.now() - 400000).toISOString(), // 6 minutes ago
    },
    {
      id: uuid(),
      conversation_id: activeConv1Id,
      role: 'agent',
      source: 'admin',
      content: 'ご連絡ありがとうございます。緊急の撮影も対応可能です。明日の午後はいかがでしょうか？',
      created_at: new Date(Date.now() - 350000).toISOString(), // 5.8 minutes ago
    },
    {
      id: uuid(),
      conversation_id: activeConv1Id,
      role: 'user',
      source: 'web',
      content: 'ありがとうございます！明日の午後で大丈夫です。14時頃はどうでしょうか？',
      created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    },
  ];
  messages.set(activeConv1Id, activeConv1Msgs);
  
  // 2. Active conversation - pricing inquiry
  const activeConv2Id = uuid();
  const activeConv2: Conversation = {
    id: activeConv2Id,
    channel: 'web',
    status: 'new',
    contact_name: null,
    contact_email: null,
    last_message_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  };
  conversations.set(activeConv2Id, activeConv2);
  
  const activeConv2Msgs: Message[] = [
    {
      id: uuid(),
      conversation_id: activeConv2Id,
      role: 'system',
      source: 'web',
      content: 'こんにちは！飲食店撮影PhotoStudioへようこそ。お気軽にご質問ください。',
      created_at: new Date(Date.now() - 2000000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: activeConv2Id,
      role: 'user',
      source: 'web',
      content: '居酒屋の撮影を検討しています。メニュー30品程度の撮影だといくらくらいになりますか？',
      created_at: new Date(Date.now() - 1900000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: activeConv2Id,
      role: 'agent',
      source: 'admin',
      content: 'お問い合わせありがとうございます。30品程度でしたら、2時間のスタンダードプラン（44,000円）がおすすめです。時間内であれば撮影枚数は無制限です。',
      created_at: new Date(Date.now() - 1850000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: activeConv2Id,
      role: 'user',
      source: 'web',
      content: '店内の雰囲気写真も撮影してもらえますか？',
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
  ];
  messages.set(activeConv2Id, activeConv2Msgs);
  
  // 3. Active conversation - location inquiry
  const activeConv3Id = uuid();
  const activeConv3: Conversation = {
    id: activeConv3Id,
    channel: 'web',
    status: 'new',
    contact_name: '田中一郎',
    contact_email: 'tanaka@cafe.jp',
    last_message_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  };
  conversations.set(activeConv3Id, activeConv3);
  
  const activeConv3Msgs: Message[] = [
    {
      id: uuid(),
      conversation_id: activeConv3Id,
      role: 'system',
      source: 'web',
      content: 'こんにちは！飲食店撮影PhotoStudioへようこそ。お気軽にご質問ください。',
      created_at: new Date(Date.now() - 4000000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: activeConv3Id,
      role: 'user',
      source: 'web',
      content: '千葉県の柏市でカフェを経営しています。出張撮影は可能でしょうか？',
      created_at: new Date(Date.now() - 3800000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: activeConv3Id,
      role: 'agent',
      source: 'admin',
      content: '柏市への出張も対応可能です。別途交通費（実費）をいただいておりますが、撮影料金は同じです。',
      created_at: new Date(Date.now() - 3700000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: activeConv3Id,
      role: 'user',
      source: 'web',
      content: 'ありがとうございます。来月の撮影を検討しているので、詳細を相談させてください。',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
  messages.set(activeConv3Id, activeConv3Msgs);
  
  // 4. Closed conversation - completed
  const closedConv1Id = uuid();
  const closedConv1: Conversation = {
    id: closedConv1Id,
    channel: 'web',
    status: 'closed',
    contact_name: '山田太郎',
    contact_email: 'yamada@example.com',
    last_message_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  };
  conversations.set(closedConv1Id, closedConv1);
  
  const closedConv1Msgs: Message[] = [
    {
      id: uuid(),
      conversation_id: closedConv1Id,
      role: 'user',
      source: 'web',
      content: '料金について教えてください',
      created_at: new Date(Date.now() - 90000000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: closedConv1Id,
      role: 'agent',
      source: 'admin',
      content: 'お問い合わせありがとうございます。基本プランは1時間33,000円からとなっております。',
      created_at: new Date(Date.now() - 89000000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: closedConv1Id,
      role: 'user',
      source: 'web',
      content: 'ありがとうございます。検討してみます。',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
  messages.set(closedConv1Id, closedConv1Msgs);
  
  // 5. Closed conversation - resolved
  const closedConv2Id = uuid();
  const closedConv2: Conversation = {
    id: closedConv2Id,
    channel: 'web',
    status: 'closed',
    contact_name: '佐藤美咲',
    contact_email: 'sato@bakery.com',
    last_message_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  };
  conversations.set(closedConv2Id, closedConv2);
  
  const closedConv2Msgs: Message[] = [
    {
      id: uuid(),
      conversation_id: closedConv2Id,
      role: 'user',
      source: 'web',
      content: 'パン屋の商品撮影をお願いしたいです。',
      created_at: new Date(Date.now() - 180000000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: closedConv2Id,
      role: 'agent',
      source: 'admin',
      content: 'パン屋様の撮影も多数実績がございます。焼きたての美味しさが伝わる撮影を心がけています。',
      created_at: new Date(Date.now() - 179000000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: closedConv2Id,
      role: 'user',
      source: 'web',
      content: '明日お電話でご相談させていただきます。',
      created_at: new Date(Date.now() - 178000000).toISOString(),
    },
    {
      id: uuid(),
      conversation_id: closedConv2Id,
      role: 'agent',
      source: 'admin',
      content: 'お電話お待ちしております。よろしくお願いいたします。',
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
  messages.set(closedConv2Id, closedConv2Msgs);
}

// DO NOT automatically seed data - only seed when explicitly called from admin pages