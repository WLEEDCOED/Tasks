import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Calendar, Star, Moon, Sun } from 'lucide-react';

export default function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, text: 'مراجعة البريد الإلكتروني', completed: false, priority: 'high' },
      { id: 2, text: 'اجتماع الفريق الساعة 3', completed: false, priority: 'medium' },
      { id: 3, text: 'إنهاء التقرير الشهري', completed: false, priority: 'high' },
    ];
  });
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [showReward, setShowReward] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  useEffect(() => {
    const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);
    const justCompleted = completedCount > previousCompletedCount && allCompleted;
    
    if (justCompleted && !showReward) {
      setShowReward(true);
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2
      }));
      setConfetti(newConfetti);
      setTimeout(() => {
        setShowReward(false);
        setConfetti([]);
      }, 5000);
    }
    
    setPreviousCompletedCount(completedCount);
  }, [completedCount, tasks, previousCompletedCount, showReward]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: priority
      }]);
      setNewTask('');
      setPriority('medium');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        console.log('Audio not supported');
      }
    }
    
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const getPriorityColor = (p) => {
    if (p === 'high') return 'from-pink-400 to-pink-600';
    if (p === 'medium') return 'from-purple-400 to-purple-600';
    return 'from-blue-400 to-blue-600';
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200';
  const cardBg = darkMode ? 'bg-gray-800/50' : 'bg-white/90';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const subTextClass = darkMode ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgClass} transition-all duration-500 p-4 sm:p-8 relative overflow-hidden`}>
      <div className="fixed top-20 left-10 text-5xl opacity-30 animate-pulse" style={{animationDuration: '2s'}}>
        ⭐
      </div>
      <div className="fixed top-60 left-20 text-4xl opacity-25 animate-pulse" style={{animationDuration: '3s', animationDelay: '0.5s'}}>
        ✨
      </div>
      <div className="fixed bottom-40 left-16 text-3xl opacity-20 animate-pulse" style={{animationDuration: '2.5s', animationDelay: '1s'}}>
        🌟
      </div>
      <div className="fixed top-32 right-10 text-5xl opacity-30 animate-pulse" style={{animationDuration: '2.8s', animationDelay: '0.3s'}}>
        ⭐
      </div>
      <div className="fixed bottom-60 right-20 text-4xl opacity-25 animate-pulse" style={{animationDuration: '3.2s', animationDelay: '1.2s'}}>
        ✨
      </div>
      <div className="fixed top-80 right-32 text-3xl opacity-20 animate-pulse" style={{animationDuration: '2.3s', animationDelay: '0.8s'}}>
        🌟
      </div>
      
      <div className="fixed bottom-20 right-10 text-6xl opacity-20 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
        💖
      </div>
      <div className="fixed top-40 left-1/2 text-4xl opacity-20 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
        🌸
      </div>
      
      {showReward && confetti.map(c => (
        <div
          key={c.id}
          className="absolute w-3 h-3 rounded-full animate-bounce"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            background: `hsl(${Math.random() * 360}, 70%, 60%)`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            animation: `fall ${c.duration}s ease-in ${c.delay}s forwards`
          }}
        />
      ))}
      
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute right-0 top-0 p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110 transition-transform shadow-lg"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="mb-6 relative inline-block">
            <div className="absolute -top-2 -right-2 text-4xl animate-spin" style={{animationDuration: '3s'}}>
              ✨
            </div>
            <div className="absolute -top-2 -left-2 text-4xl animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}>
              ⭐
            </div>
            <div className="bg-white/40 backdrop-blur-sm rounded-full p-6 shadow-2xl border-4 border-pink-300">
              <svg width="120" height="120" viewBox="0 0 120 120" className="animate-bounce" style={{animationDuration: '2s'}}>
                <ellipse cx="60" cy="65" rx="45" ry="42" fill="#FFFFFF"/>
                <ellipse cx="30" cy="30" rx="18" ry="22" fill="#FFFFFF"/>
                <ellipse cx="30" cy="32" rx="12" ry="15" fill="#FFB6C1"/>
                <ellipse cx="90" cy="30" rx="18" ry="22" fill="#FFFFFF"/>
                <ellipse cx="90" cy="32" rx="12" ry="15" fill="#FFB6C1"/>
                <ellipse cx="85" cy="25" rx="15" ry="12" fill="#FF1493"/>
                <ellipse cx="105" cy="25" rx="15" ry="12" fill="#FF1493"/>
                <circle cx="95" cy="25" r="8" fill="#FF69B4"/>
                <circle cx="95" cy="25" r="4" fill="#FFB6C1"/>
                <ellipse cx="45" cy="60" rx="4" ry="8" fill="#000000"/>
                <ellipse cx="75" cy="60" rx="4" ry="8" fill="#000000"/>
                <ellipse cx="60" cy="70" rx="3" ry="4" fill="#FFD700"/>
                <line x1="25" y1="68" x2="42" y2="68" stroke="#000000" strokeWidth="1.5"/>
                <line x1="25" y1="73" x2="42" y2="71" stroke="#000000" strokeWidth="1.5"/>
                <line x1="25" y1="78" x2="42" y2="75" stroke="#000000" strokeWidth="1.5"/>
                <line x1="78" y1="68" x2="95" y2="68" stroke="#000000" strokeWidth="1.5"/>
                <line x1="78" y1="71" x2="95" y2="73" stroke="#000000" strokeWidth="1.5"/>
                <line x1="78" y1="75" x2="95" y2="78" stroke="#000000" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 text-4xl animate-pulse">
              💖
            </div>
            <div className="absolute -bottom-2 -left-2 text-4xl animate-pulse" style={{animationDelay: '0.5s'}}>
              🌸
            </div>
          </div>
          
          {showReward && (
            <div className="mb-6 animate-pulse">
              <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white rounded-3xl px-8 py-6 shadow-2xl transform scale-110 inline-block">
                <div className="text-6xl mb-3">🎉 🏆 ✨</div>
                <h2 className="text-3xl font-bold mb-2">مبروك! أنجزت كل المهام!</h2>
                <p className="text-lg opacity-90">وش مهامك لليوم الثاني؟ 📝</p>
              </div>
            </div>
          )}
          
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white rounded-3xl px-8 py-4 shadow-2xl transform hover:scale-105 transition-transform border-4 border-white/30">
              <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                <span>🎀</span>
                مدير المهام اليومية
                <span>🎀</span>
              </h1>
              <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          <div className={`${cardBg} backdrop-blur-lg rounded-2xl p-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
            <div className="flex justify-between mb-3">
              <span className={`${textClass} font-semibold`}>التقدم اليومي</span>
              <span className={`${subTextClass} font-bold`}>{completedCount} / {tasks.length}</span>
            </div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-500 relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${cardBg} backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl border ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="أضف مهمة جديدة..."
              className={`flex-1 px-5 py-4 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-purple-300 text-gray-900'} focus:border-purple-500 focus:outline-none transition-all text-lg`}
            />
            
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`px-4 py-4 rounded-xl border-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-purple-300 text-gray-900'} focus:border-purple-500 focus:outline-none transition-all`}
            >
              <option value="low">أولوية منخفضة</option>
              <option value="medium">أولوية متوسطة</option>
              <option value="high">أولوية عالية</option>
            </select>

            <button
              onClick={addTask}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`${cardBg} backdrop-blur-lg rounded-2xl p-5 shadow-lg border ${darkMode ? 'border-gray-700' : 'border-purple-200'} transform hover:scale-[1.02] transition-all duration-200`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500'
                      : darkMode ? 'border-gray-600 hover:border-purple-500' : 'border-gray-300 hover:border-purple-500'
                  }`}
                >
                  {task.completed && <Check className="w-5 h-5 text-white" />}
                </button>

                <div className={`flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)}`}></div>

                <span className={`flex-1 text-lg ${task.completed ? 'line-through opacity-50' : ''} ${textClass}`}>
                  {task.text}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all hover:scale-110"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className={`${cardBg} backdrop-blur-lg rounded-2xl p-12 text-center shadow-xl border ${darkMode ? 'border-gray-700' : 'border-purple-200'}`}>
              <Star className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-purple-300'}`} />
              <p className={`${subTextClass} text-xl`}>لا توجد مهام بعد. ابدأ بإضافة مهمة جديدة!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}