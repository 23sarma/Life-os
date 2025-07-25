import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Brain, 
  Heart, 
  Calendar, 
  Shield, 
  Settings,
  Send,
  User,
  Bot,
  Activity,
  Zap,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Core AI Brain Class
class AIBrain {
  private memory: Map<string, any> = new Map();
  private learningData: any[] = [];
  private mood: string = 'neutral';
  private userName: string = 'User';

  constructor() {
    this.loadMemory();
  }

  private loadMemory() {
    const saved = localStorage.getItem('lifeos_memory');
    if (saved) {
      const data = JSON.parse(saved);
      this.memory = new Map(data.memory || []);
      this.learningData = data.learningData || [];
      this.mood = data.mood || 'neutral';
      this.userName = data.userName || 'User';
    }
  }

  private saveMemory() {
    const data = {
      memory: Array.from(this.memory.entries()),
      learningData: this.learningData,
      mood: this.mood,
      userName: this.userName
    };
    localStorage.setItem('lifeos_memory', JSON.stringify(data));
  }

  remember(key: string, value: any) {
    this.memory.set(key, value);
    this.learningData.push({ key, value, timestamp: Date.now() });
    this.saveMemory();
  }

  recall(key: string) {
    return this.memory.get(key);
  }

  processCommand(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Learn from user input
    this.learningData.push({ input, timestamp: Date.now() });
    this.saveMemory();

    // Command processing logic
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return `Hello ${this.userName}! I'm LifeOS, your AI life assistant. How can I help you today?`;
    }
    
    if (lowerInput.includes('schedule') || lowerInput.includes('meeting')) {
      return "I'll help you schedule that. What time and date works best for you?";
    }
    
    if (lowerInput.includes('health') || lowerInput.includes('feel')) {
      return "I'm monitoring your wellness. Remember to stay hydrated and take breaks. How are you feeling today?";
    }
    
    if (lowerInput.includes('learn') || lowerInput.includes('study')) {
      return "Great! I can help you learn. What subject interests you? I have modules for programming, languages, science, and more.";
    }
    
    if (lowerInput.includes('finance') || lowerInput.includes('money')) {
      return "I can help with budget planning and financial advice. What specific area would you like guidance on?";
    }
    
    if (lowerInput.includes('mood') || lowerInput.includes('emotion')) {
      this.detectEmotion(input);
      return `I sense you're feeling ${this.mood}. I'm here to support you. Would you like to talk about it?`;
    }

    if (lowerInput.includes('name')) {
      const nameMatch = input.match(/my name is (\w+)/i);
      if (nameMatch) {
        this.userName = nameMatch[1];
        this.remember('userName', this.userName);
        return `Nice to meet you, ${this.userName}! I'll remember that.`;
      }
    }
    
    // Default intelligent response
    return "I understand you're asking about: " + input + ". Let me process this and provide the best assistance. I'm continuously learning to serve you better.";
  }

  private detectEmotion(input: string) {
    const happyWords = ['happy', 'great', 'good', 'awesome', 'excellent'];
    const sadWords = ['sad', 'bad', 'terrible', 'awful', 'down'];
    const stressedWords = ['stress', 'tired', 'overwhelmed', 'busy'];
    
    const lowerInput = input.toLowerCase();
    
    if (happyWords.some(word => lowerInput.includes(word))) {
      this.mood = 'happy';
    } else if (sadWords.some(word => lowerInput.includes(word))) {
      this.mood = 'sad';
    } else if (stressedWords.some(word => lowerInput.includes(word))) {
      this.mood = 'stressed';
    } else {
      this.mood = 'neutral';
    }
    
    this.remember('lastMood', this.mood);
  }

  getSystemStatus() {
    return {
      memorySize: this.memory.size,
      learningEntries: this.learningData.length,
      currentMood: this.mood,
      userName: this.userName,
      uptime: Date.now(),
      health: 'optimal'
    };
  }
}

// Voice Recognition System
class VoiceSystem {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  startListening(onResult: (text: string) => void, onError?: (error: string) => void) {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    this.recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    this.recognition.onerror = (event: any) => {
      onError?.(event.error);
    };

    this.recognition.start();
    this.isListening = true;
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isActive() {
    return this.isListening;
  }
}

// Life Planner System
class LifePlanner {
  private tasks: any[] = [];
  private goals: any[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const saved = localStorage.getItem('lifeos_planner');
    if (saved) {
      const data = JSON.parse(saved);
      this.tasks = data.tasks || [];
      this.goals = data.goals || [];
    }
  }

  private saveData() {
    const data = { tasks: this.tasks, goals: this.goals };
    localStorage.setItem('lifeos_planner', JSON.stringify(data));
  }

  addTask(task: string, priority: string = 'medium') {
    const newTask = {
      id: Date.now(),
      text: task,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    this.saveData();
    return newTask;
  }

  getTasks() {
    return this.tasks;
  }

  completeTask(id: number) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = true;
      this.saveData();
    }
  }

  addGoal(goal: string, deadline?: string) {
    const newGoal = {
      id: Date.now(),
      text: goal,
      deadline,
      progress: 0,
      createdAt: new Date().toISOString()
    };
    this.goals.push(newGoal);
    this.saveData();
    return newGoal;
  }

  getGoals() {
    return this.goals;
  }
}

function App() {
  const [messages, setMessages] = useState<Array<{id: number, text: string, isUser: boolean, timestamp: Date}>>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [activeTab, setActiveTab] = useState('chat');
  const [aiResponse, setAiResponse] = useState('');
  
  const aiBrain = useRef(new AIBrain());
  const voiceSystem = useRef(new VoiceSystem());
  const planner = useRef(new LifePlanner());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize system
    setMessages([{
      id: 1,
      text: "Hello! I'm LifeOS, your AI life assistant. I'm ready to help you with planning, learning, health, finance, and much more. Try saying 'Hello' or ask me anything!",
      isUser: false,
      timestamp: new Date()
    }]);

    updateSystemStatus();
    
    // Update system status every 5 seconds
    const interval = setInterval(updateSystemStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateSystemStatus = () => {
    const status = aiBrain.current.getSystemStatus();
    setSystemStatus(status);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Process with AI Brain
    const response = aiBrain.current.processCommand(inputText);
    
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputText('');
    updateSystemStatus();
  };

  const handleVoiceInput = () => {
    if (isListening) {
      voiceSystem.current.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceSystem.current.startListening(
        (text: string) => {
          setInputText(text);
          setIsListening(false);
        },
        (error: string) => {
          console.error('Voice error:', error);
          setIsListening(false);
        }
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                <Brain className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">LifeOS</h1>
                <p className="text-cyan-300 text-sm">AI Operating System for Life</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm">Online</span>
              </div>
              <div className="text-white text-sm">
                Memory: {systemStatus.memorySize || 0} | Learning: {systemStatus.learningEntries || 0}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-black/20 backdrop-blur-md rounded-xl border border-cyan-500/20 p-4">
            <nav className="space-y-2">
              {[
                { id: 'chat', icon: Bot, label: 'AI Chat' },
                { id: 'planner', icon: Calendar, label: 'Life Planner' },
                { id: 'health', icon: Heart, label: 'Health Monitor' },
                { id: 'learning', icon: Brain, label: 'Learning Center' },
                { id: 'security', icon: Shield, label: 'Security' },
                { id: 'settings', icon: Settings, label: 'Settings' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* System Status */}
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
              <h3 className="text-cyan-300 font-medium mb-3">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Health:</span>
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Optimal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Mood:</span>
                  <span className="text-cyan-400 capitalize">{systemStatus.currentMood || 'Neutral'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">User:</span>
                  <span className="text-white">{systemStatus.userName || 'User'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'chat' && (
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-cyan-500/20 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-cyan-500/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                    <Bot className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">AI Assistant</h2>
                    <p className="text-cyan-300 text-sm">Ready to help with anything</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-lg ${
                        message.isUser 
                          ? 'bg-cyan-500/20 text-cyan-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {message.isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.isUser 
                          ? 'bg-cyan-500/10 border border-cyan-500/20' 
                          : 'bg-blue-500/10 border border-blue-500/20'
                      }`}>
                        <p className="text-white">{message.text}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-cyan-500/20">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything or give me a command..."
                      className="w-full bg-white/5 border border-cyan-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 resize-none"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleVoiceInput}
                    className={`p-3 rounded-lg transition-all ${
                      isListening 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' 
                        : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                    }`}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'planner' && (
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Life Planner</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Today's Tasks */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                  <h3 className="text-cyan-300 font-semibold mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Today's Tasks
                  </h3>
                  <div className="space-y-2">
                    {planner.current.getTasks().slice(0, 5).map(task => (
                      <div key={task.id} className="flex items-center space-x-3 p-2 bg-white/5 rounded">
                        <CheckCircle className={`w-4 h-4 ${task.completed ? 'text-green-400' : 'text-gray-400'}`} />
                        <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                    <button 
                      onClick={() => planner.current.addTask('New task from planner')}
                      className="w-full text-cyan-400 text-sm py-2 border border-cyan-500/30 rounded hover:bg-cyan-500/10 transition-all"
                    >
                      + Add Task
                    </button>
                  </div>
                </div>

                {/* Goals */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-blue-300 font-semibold mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Goals & Progress
                  </h3>
                  <div className="space-y-3">
                    {planner.current.getGoals().slice(0, 3).map(goal => (
                      <div key={goal.id} className="p-2 bg-white/5 rounded">
                        <span className="text-white text-sm">{goal.text}</span>
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => planner.current.addGoal('New goal from planner')}
                      className="w-full text-blue-400 text-sm py-2 border border-blue-500/30 rounded hover:bg-blue-500/10 transition-all"
                    >
                      + Add Goal
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Heart, label: 'Health Check', color: 'red' },
                  { icon: Brain, label: 'Learn Something', color: 'cyan' },
                  { icon: Calendar, label: 'Schedule Time', color: 'blue' },
                  { icon: Shield, label: 'Security Scan', color: 'green' }
                ].map(action => (
                  <button
                    key={action.label}
                    className={`p-4 bg-${action.color}-500/10 border border-${action.color}-500/30 rounded-lg hover:bg-${action.color}-500/20 transition-all group`}
                  >
                    <action.icon className={`w-6 h-6 text-${action.color}-400 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                    <span className={`text-${action.color}-300 text-sm block`}>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Heart className="w-8 h-8 text-red-400 mr-3" />
                Health Monitor
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-500/20">
                  <h3 className="text-red-300 font-semibold mb-4">Physical Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Heart Rate</span>
                      <span className="text-red-400">72 BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sleep</span>
                      <span className="text-green-400">7.5 hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Water</span>
                      <span className="text-blue-400">6/8 glasses</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg p-4 border border-green-500/20">
                  <h3 className="text-green-300 font-semibold mb-4">Mental Health</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Mood</span>
                      <span className="text-green-400 capitalize">{systemStatus.currentMood || 'Good'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Stress Level</span>
                      <span className="text-yellow-400">Low</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Focus</span>
                      <span className="text-cyan-400">High</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-blue-300 font-semibold mb-4">Recommendations</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-white">• Take a 10-minute walk</p>
                    <p className="text-white">• Drink more water</p>
                    <p className="text-white">• Practice deep breathing</p>
                    <p className="text-white">• Get 8 hours of sleep</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Brain className="w-8 h-8 text-cyan-400 mr-3" />
                Learning Center
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-cyan-300 font-semibold">Available Courses</h3>
                  {[
                    { name: 'Python Programming', progress: 65, color: 'cyan' },
                    { name: 'Machine Learning', progress: 30, color: 'blue' },
                    { name: 'Web Development', progress: 80, color: 'green' },
                    { name: 'Data Science', progress: 45, color: 'purple' }
                  ].map(course => (
                    <div key={course.name} className="p-4 bg-white/5 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{course.name}</span>
                        <span className={`text-${course.color}-400 text-sm`}>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r from-${course.color}-400 to-${course.color}-600 h-2 rounded-full`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-cyan-300 font-semibold">Learning Stats</h3>
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-cyan-400">127</div>
                        <div className="text-gray-300 text-sm">Hours Learned</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-400">23</div>
                        <div className="text-gray-300 text-sm">Certificates</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">89</div>
                        <div className="text-gray-300 text-sm">Projects</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">156</div>
                        <div className="text-gray-300 text-sm">Skills</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-8 h-8 text-green-400 mr-3" />
                Security Center
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg p-4 border border-green-500/20">
                  <h3 className="text-green-300 font-semibold mb-4">System Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Firewall</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Encryption</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Data Privacy</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Backup Status</span>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
                  <h3 className="text-yellow-300 font-semibold mb-4">Security Alerts</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-white text-sm">Password expires in 7 days</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-white/5 rounded">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm">All systems secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-black/20 backdrop-blur-md rounded-xl border border-cyan-500/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Settings className="w-8 h-8 text-gray-400 mr-3" />
                System Settings
              </h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-500/10 to-cyan-500/10 rounded-lg p-4 border border-gray-500/20">
                  <h3 className="text-cyan-300 font-semibold mb-4">AI Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Auto Learning</span>
                      <div className="w-12 h-6 bg-cyan-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Voice Recognition</span>
                      <div className="w-12 h-6 bg-cyan-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Emotion Detection</span>
                      <div className="w-12 h-6 bg-cyan-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-blue-300 font-semibold mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Local Data Only</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Encrypted Storage</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30 rounded-lg py-3 hover:from-red-500/30 hover:to-orange-500/30 transition-all">
                  Reset AI Memory
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;