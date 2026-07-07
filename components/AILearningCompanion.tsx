'use client';

import React, { useState } from 'react';
import { Send, MessageCircle, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function AILearningCompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello! I\'m your AI learning companion at Westhampton Day School. I\'m here to discuss and help you think through lesson plans, classroom activities, teaching strategies, and professional development. What would you like to explore today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [discussionTopic, setDiscussionTopic] = useState<'lesson_plan' | 'activity' | 'strategy' | null>(null);

  const suggestedTopics = [
    {
      emoji: '📋',
      title: 'Design a Lesson Plan',
      subtitle: 'Create engaging lessons for your age group',
      topic: 'lesson_plan' as const
    },
    {
      emoji: '🎨',
      title: 'Plan a Classroom Activity',
      subtitle: 'Brainstorm creative learning activities',
      topic: 'activity' as const
    },
    {
      emoji: '💡',
      title: 'Teaching Strategies',
      subtitle: 'Discuss best practices and techniques',
      topic: 'strategy' as const
    }
  ];

  // Mock AI response logic
  const generateAIResponse = (userMessage: string, topic: string | null): string => {
    const responses: { [key: string]: string[] } = {
      lesson_plan: [
        'Great! Let\'s design a lesson. What age group are you teaching, and what theme or concept would you like to focus on? Consider incorporating:\n\n• Circle time introduction\n• Hands-on learning activities\n• Art or sensory components\n• Outdoor/movement time\n• Closing reflection',
        'I love that idea! To make it WDS-aligned, remember our values of nurturing and creativity. You could incorporate:\n\n• Natural materials from nature walks\n• Collaborative group work\n• Documentation of learning\n• Connections to family and community',
        'That\'s a wonderful theme! Here\'s how I\'d structure the week:\n\n• Monday: Introduction & exploration\n• Tuesday-Thursday: Deep learning activities\n• Friday: Review & celebration\n\nWhat materials or resources do you have available?'
      ],
      activity: [
        'What a creative idea! For this activity, think about:\n\n• Age-appropriate safety considerations\n• Sensory engagement (touch, sight, sound)\n• Learning objectives it addresses\n• Group size and pacing\n• How it connects to your curriculum theme',
        'I can see how this aligns with our WDS values of creativity and community! To enhance it further:\n\n• Could you add a collaborative element?\n• How will you document children\'s learning?\n• Is there a way to involve families?\n• What follow-up discussions could deepen learning?',
        'This activity hits multiple developmental areas! Consider:\n\n• How it builds on previous learning\n• Scaffolding for different skill levels\n• Transition strategies for smooth flow\n• Integration with other classroom routines'
      ],
      strategy: [
        'That\'s an important teaching challenge. At WDS, we emphasize warm, nurturing approaches. Consider:\n\n• Building individual relationships with each child\n• Creating a predictable, safe environment\n• Using positive reinforcement\n• Understanding developmental readiness\n• Collaborating with families',
        'I appreciate your focus on this! Research shows that:\n\n• Consistent routines build security\n• Individual attention strengthens bonds\n• Celebrating small wins boosts confidence\n• Professional development supports growth\n• Peer collaboration enriches practice',
        'This connects beautifully to WDS values. You might:\n\n• Attend professional development sessions\n• Watch teaching technique videos\n• Reflect on your practice with colleagues\n• Document and review your interactions\n• Set specific, achievable goals'
      ],
      default: [
        'That\'s an interesting perspective! Can you tell me more about what you\'re trying to accomplish? I\'d like to understand your goals better.',
        'I appreciate your input. How does this connect to your classroom routines or curriculum goals? What outcome are you hoping for?',
        'That\'s worth exploring. What have you already tried? What worked well, and what might you adjust next time?'
      ]
    };

    const topicResponses = responses[topic || 'default'] || responses.default;
    return topicResponses[Math.floor(Math.random() * topicResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(input, discussionTopic ? discussionTopic.replace('_', ' ') : null),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleTopicSelection = (topic: 'lesson_plan' | 'activity' | 'strategy') => {
    setDiscussionTopic(topic);
    const topicMessages: { [key: string]: string } = {
      lesson_plan: 'Let\'s design a lesson plan together. What would you like to teach?',
      activity: 'Great! I\'d love to help you plan an engaging classroom activity. What age group and theme?',
      strategy: 'Teaching strategies are so important. What specific challenge are you working through?'
    };
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: topicMessages[topic],
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse('', topic),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-slate-900">AI Learning Companion</h2>
      </div>

      {/* Suggested Topics (only show if no topic selected) */}
      {!discussionTopic && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {suggestedTopics.map((topic) => (
            <button
              key={topic.topic}
              onClick={() => handleTopicSelection(topic.topic)}
              className="p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left group"
            >
              <div className="text-3xl mb-2">{topic.emoji}</div>
              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 mb-1">{topic.title}</h3>
              <p className="text-sm text-slate-600">{topic.subtitle}</p>
            </button>
          ))}
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden flex flex-col h-96">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50 to-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-emerald-100' : 'text-slate-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Share your thoughts or ask a question..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-900 mb-1">How the AI Learning Companion Works</p>
            <ul className="text-xs text-emerald-800 space-y-1">
              <li>• I learn from Westhampton Day School's curriculum and values</li>
              <li>• I help you think through classroom decisions and lesson design</li>
              <li>• I grow smarter as you engage more and share feedback</li>
              <li>• Your insights help me better support the entire WDS team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
