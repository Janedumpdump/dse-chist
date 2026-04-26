const { useState, useEffect, useRef, useCallback } = React;

// ==========================================
// 🚩 1. 動態題庫與專屬 AI 提示配置
// ==========================================
// ==========================================
// 📚 1. 動態題庫與專屬 AI 提示配置
// ==========================================
const QUESTIONS_DB = [
  {
    id: 'q_confucius_pol',
    title: '孔子政治主張 (25分)',
    text: '孔子提出了什麼政治主張以回應所身處時代的問題？又他的主張為什麼不見用於當時的國君？',
    logicWords: ['因此', '所以', '導致', '以致', '為此', '故', '可見', '因為', '由於', '反映了', '於是'],
    matrix: {
      prop1: {
        name: '仁政德治',
        bg: { label: '時代亂象', words: ['苛法', '嚴刑峻法', '加徵賦稅', '攻打別國', '苛政猛于虎', '私利', '篡弑兼併', '不恤民情'] },
        idea: { label: '政治主張', words: ['仁政', '德治', '為政以德', '天下為公', '仁者愛人'] },
        eg: { label: '史實例子', words: ['中庸', '安居樂業', '以身作則', '不違農時', '節約用度', '為仁由己', '感化'] },
        fail: { label: '不見用原因', words: ['功利', '急欲富強', '難見成效', '衛靈公', '被監視'] }
      },
      prop2: {
        name: '恢復禮治',
        bg: { label: '時代亂象', words: ['禮崩樂壞', '周文疲弊', '僭禮', '八佾舞於庭', '南子', '季氏'] },
        idea: { label: '政治主張', words: ['禮治', '克己復禮', '教化', '規範', '匡正時弊', '依禮行事'] },
        eg: { label: '史實例子', words: ['夾谷之會', '大司寇', '萊人獻舞', '防止犯罪', '真心誠服'] },
        fail: { label: '不見用原因', words: ['不適應時勢', '制肘', '晏嬰', '繁文縟節', '復古'] }
      },
      prop3: {
        name: '正名主張',
        bg: { label: '時代亂象', words: ['兼併', '僭越', '世卿專權', '170多國', '名不正', '以下犯上'] },
        idea: { label: '政治主張', words: ['正名', '君君臣臣', '父父子子', '撥亂反正', '上下有序'] },
        eg: { label: '史實例子', words: ['墮三都', '三桓', '名不正則言不順', '小康之世'] },
        fail: { label: '不見用原因', words: ['不合時宜', '篡位得國', '戒心', '背道而馳', '維護封建'] }
      }
    },
    hintsConfig: {
      errTrigger: ['平民', '墮三都'],
      errMsg: "🚨 錯誤邏輯糾正：請注意「平民崛起」與「墮三都」之間並無直接因果關係，請重新檢視推論。",
      ideaWords: ['仁政', '德治', '為政以德', '禮治', '正名'],
      failWords: ['功利', '急欲富強', '難見成效', '不適應時勢', '不合時宜'],
      bgWords: ['苛法', '嚴刑峻法', '苛政', '禮崩樂壞', '僭越'],
      lvl3Msg: "🔍 Level 3 (邏輯深挖)：你提出了政治主張，但似乎缺少了討論其「不見用的原因」，既然對百姓好，為何當時的君主不願採用？試從諸侯的「爭霸/功利」思考。",
      lvl2Msg: "💡 Level 2 (關聯填補)：你提到了當時的社會亂象，那麼孔子提出了什麼「對策」來解決這個問題呢？",
      lvl1Msg: "⏳ Level 1 (停滯引導)：發呆超過 5 秒了喔！試想當時春秋時代的時空背景，諸侯之間的情況如何？",
      timeUpMsg: "📝 答題骨架 (測驗結束)：\n1. 時代苛政 -> 仁政主張 -> 中庸例子 -> 功利不見用。\n2. 僭禮八佾 -> 禮治主張 -> 夾谷之會 -> 繁文縟節不見用。\n3. 三桓專權 -> 正名主張 -> 墮三都 -> 諸侯戒心不見用。"
    }
  },
  {
    id: 'q_confucius_practice',
    title: '孔子實踐理想的途徑 (25分)',
    text: '孔子一生抱持濟世的政治理想。試分析他為實踐其政治理想，在「從政為官」、「周遊列國」及「聚徒講學與整理典籍」三方面作出了什麼努力？其結果又如何？',
    logicWords: ['因此', '所以', '導致', '以致', '為此', '故', '可見', '因為', '由於', '反映了', '最終', '可惜', '然而'],
    matrix: {
      prop1: {
        name: '從政為官',
        bg: { label: '出仕背景', words: ['魯國', '三桓專權', '季氏', '禮崩樂壞', '僭越'] },
        idea: { label: '實踐途徑', words: ['從政為官', '大司寇', '中都宰', '親身參政', '撥亂反正'] },
        eg: { label: '史實例子', words: ['夾谷之會', '墮三都', '齊使女樂', '齊人歸女樂', '魯定公'] },
        fail: { label: '最終結果', words: ['失敗', '受制肘', '辭官', '政權旁落', '不見用'] }
      },
      prop2: {
        name: '周遊列國',
        bg: { label: '出走背景', words: ['辭去魯官', '失望', '霸道橫行', '功利主義'] },
        idea: { label: '實踐途徑', words: ['周遊列國', '遊說諸侯', '宣揚理念', '推廣主張', '宣揚濟世'] },
        eg: { label: '史實例子', words: ['陳蔡之絕', '畏於匡', '衛靈公', '十四年', '楚國'] },
        fail: { label: '最終結果', words: ['不見用於諸侯', '不合時宜', '顛沛流離', '無功而還'] }
      },
      prop3: {
        name: '教育與學術',
        bg: { label: '晚年背景', words: ['大道不行', '政治失意', '晚年歸魯', '學在官府'] },
        idea: { label: '實踐途徑', words: ['聚徒講學', '整理典籍', '有教無類', '作育英才', '私人講學'] },
        eg: { label: '史實例子', words: ['詩書禮樂', '春秋', '三千弟子', '七十二賢'] },
        fail: { label: '最終結果', words: ['萬世師表', '承傳文化', '儒家學派', '影響深遠', '樹立榜樣'] }
      }
    },
    hintsConfig: {
      errTrigger: ['有教無類', '齊使女樂'],
      errMsg: "🚨 錯誤邏輯糾正：「有教無類」是教育主張，「齊使女樂」是導致孔子辭官的政治事件，兩者無直接關聯，請將它們分段論述。",
      ideaWords: ['從政為官', '周遊列國', '聚徒講學', '整理典籍', '大司寇'],
      failWords: ['失敗', '不見用', '受制肘', '辭官', '萬世師表', '影響深遠', '顛沛流離'],
      bgWords: ['季氏', '禮崩樂壞', '霸道橫行', '晚年', '政治失意', '學在官府'],
      lvl3Msg: "🔍 Level 3 (邏輯深挖)：你提到了孔子實踐理想的行動（如從政或周遊），但最終的「結果」是什麼？是成功還是失敗？對後世有何影響？",
      lvl2Msg: "💡 Level 2 (關聯填補)：你提到了當時孔子所處的環境或困境，那他選擇了什麼「實際行動（如從政、講學）」來應對呢？",
      lvl1Msg: "⏳ Level 1 (停滯引導)：發呆超過 5 秒了喔！孔子為了推銷他的理念，曾經做過官，也曾經離開魯國，甚至晚年還做了什麼？",
      timeUpMsg: "📝 答題骨架 (測驗結束)：\n1. 三桓專權 -> 從政為官(大司寇) -> 墮三都/齊使女樂 -> 辭官失敗。\n2. 魯國失意 -> 周遊列國 -> 陳蔡之絕 -> 不合時宜無功而還。\n3. 晚年歸魯 -> 聚徒講學 -> 整理六經 -> 成為萬世師表。"
    }
  }
];

export default function App() {
  const [isMounted, setIsMounted] = useState(false);
  
  // ⚙️ 狀態管理
  const [currentQId, setCurrentQId] = useState(QUESTIONS_DB[0].id);
  const currentQuestion = QUESTIONS_DB.find(q => q.id === currentQId) || QUESTIONS_DB[0];

  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(1800);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState('U');
  const [hints, setHints] = useState([]);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [matrixStatus, setMatrixStatus] = useState({});

  const textareaRef = useRef(null);
  const backdropRef = useRef(null);
  const hintsEndRef = useRef(null);

  // 安全修復：等畫面載入完成後，才去讀取 localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedQId = localStorage.getItem('dse_qid');
        if (savedQId && QUESTIONS_DB.find(q => q.id === savedQId)) {
          setCurrentQId(savedQId);
        }
      }
    } catch (e) {}
    setIsMounted(true);
  }, []);

  // 切換題目與讀取紀錄
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (typeof window !== 'undefined') {
        const savedQId = localStorage.getItem('dse_qid');
        if (savedQId === currentQId) {
          const savedText = localStorage.getItem('dse_text');
          const savedTime = localStorage.getItem('dse_time');
          if (savedText) setText(savedText);
          if (savedTime) setTimeLeft(parseInt(savedTime, 10));
        } else {
          resetSystem(true);
        }
        localStorage.setItem('dse_qid', currentQId);
      }
    } catch (e) {}
    
    const initialStatus = {};
    Object.keys(currentQuestion.matrix).forEach(key => {
      initialStatus[key] = { bg: false, idea: false, eg: false, fail: false };
    });
    setMatrixStatus(initialStatus);
  }, [currentQId, isMounted]);

  useEffect(() => {
    if (isMounted && text) analyzeText(text);
  }, [isMounted]);

  const resetSystem = (clearStorage = false) => {
    setText('');
    setTimeLeft(1800);
    setScore(0);
    setLevel('U');
    setIsTimeUp(false);
    setHints([{ id: 'start', text: `💡 提示：本題 25 分。必須涵蓋三個核心重點的完整結構。`, type: 'info' }]);
    if (clearStorage) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dse_text');
          localStorage.removeItem('dse_time');
        }
      } catch(e) {}
    }
  };

  // 計時器
  useEffect(() => {
    if (!isMounted || timeLeft <= 0) {
      if (timeLeft <= 0) setIsTimeUp(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(t => {
        const newTime = t - 1;
        try { if (typeof window !== 'undefined') localStorage.setItem('dse_time', newTime.toString()); } catch(e) {}
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isMounted]);

  useEffect(() => {
    if (hintsEndRef.current) hintsEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [hints]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  const handleReset = () => {
    if(window.confirm('確定要清空所有內容重新開始嗎？無法復原喔！')) {
      resetSystem(true);
    }
  };

  // 🧠 動態評分大腦
  const analyzeText = useCallback((val) => {
    if (isTimeUp || !currentQuestion) return;

    let currentScore = 0;
    const newStatus = {};

    Object.keys(currentQuestion.matrix).forEach(propKey => {
      const prop = currentQuestion.matrix[propKey];
      newStatus[propKey] = { bg: false, idea: false, eg: false, fail: false };
      
      if (prop.bg.words.some(w => val.includes(w))) { newStatus[propKey].bg = true; currentScore += 2; }
      if (prop.idea.words.some(w => val.includes(w))) { newStatus[propKey].idea = true; currentScore += 2; }
      if (prop.eg.words.some(w => val.includes(w)) || val.includes('《')) { newStatus[propKey].eg = true; currentScore += 2; }
      if (prop.fail.words.some(w => val.includes(w))) { newStatus[propKey].fail = true; currentScore += 2; }
    });

    if (currentQuestion.logicWords.filter(w => val.includes(w)).length >= 3) currentScore += 1;
    
    currentScore = Math.min(currentScore, 25);
    setScore(currentScore);
    setMatrixStatus(newStatus);

    if (currentScore >= 22) setLevel('5**');
    else if (currentScore >= 16) setLevel('4');
    else if (currentScore >= 10) setLevel('3');
    else if (currentScore >= 6) setLevel('2');
    else if (currentScore > 0) setLevel('1');
    else setLevel('U');

    // 💡 動態 Scaffolding AI (根據題目配置)
    const config = currentQuestion.hintsConfig;
    let currentHints = [];

    if (val.includes(config.errTrigger[0]) && val.includes(config.errTrigger[1])) {
      currentHints.push({ id: 'err', text: config.errMsg, type: "error" });
    }

    const hasIdea = config.ideaWords.some(w => val.includes(w));
    const hasFail = config.failWords.some(w => val.includes(w));
    const hasBg = config.bgWords.some(w => val.includes(w));

    if (hasIdea && !hasFail) {
      currentHints.push({ id: 'lvl3', text: config.lvl3Msg, type: "warning" });
    }
    if (hasBg && !hasIdea) {
      currentHints.push({ id: 'lvl2', text: config.lvl2Msg, type: "info" });
    }

    if (currentHints.length > 0) {
      setHints(currentHints);
    } else if (val.length === 0) {
      setHints([{ id: 'start', text: "💡 提示：本題 25 分。必須涵蓋三個核心重點的完整結構。", type: 'info' }]);
    }
  }, [isTimeUp, currentQuestion]);

  // Level 1 發呆偵測
  useEffect(() => {
    if (isTimeUp || !isMounted) return;
    const idleTimer = setTimeout(() => {
      setHints(prev => {
        if (prev.some(h => h.type === 'error')) return prev;
        const config = currentQuestion.hintsConfig;
        const l1Hint = { id: 'lvl1', text: config.lvl1Msg, type: "warning" };
        return [l1Hint, ...prev.filter(h => h.id !== 'lvl1')].slice(0, 3);
      });
    }, 5000);
    return () => clearTimeout(idleTimer);
  }, [text, isTimeUp, isMounted, currentQuestion]);

  // 測驗結束載入骨架
  useEffect(() => {
    if (isTimeUp) {
      setHints([{
        id: 'timeup',
        text: currentQuestion.hintsConfig.timeUpMsg,
        type: 'info'
      }]);
    }
  }, [isTimeUp, currentQuestion]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setText(val);
    try { if (typeof window !== 'undefined') localStorage.setItem('dse_text', val); } catch(e) {}
    analyzeText(val);
  };

  const handleScroll = () => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const getHighlightedText = (contentToHighlight) => {
    if (!contentToHighlight) return "";
    const allWords = [];
    Object.values(currentQuestion.matrix).forEach(prop => {
      allWords.push(...prop.bg.words, ...prop.idea.words, ...prop.eg.words, ...prop.fail.words);
    });
    
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeAllWords = allWords.map(escapeRegExp);
    const safeLogicWords = currentQuestion.logicWords.map(escapeRegExp);
    
    const pattern = `(《[^》]+》|${[...safeAllWords, ...safeLogicWords].join('|')})`;
    const parts = contentToHighlight.split(new RegExp(pattern, 'g'));

    return parts.map((part, i) => {
      if (/^《.*》$/.test(part)) return <mark key={i} className="bg-cyan-200 text-transparent border-b-2 border-cyan-400 px-0.5 rounded">{part}</mark>;
      if (allWords.includes(part)) return <mark key={i} className="bg-green-300 text-transparent px-0.5 rounded">{part}</mark>;
      if (currentQuestion.logicWords.includes(part)) return <mark key={i} className="bg-yellow-300 text-transparent px-0.5 rounded">{part}</mark>;
      return <span key={i}>{part}</span>;
    });
  };

  if (!isMounted) return <div className="h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-bold">載入中...</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* 左側面版：作答與嚴格評分 */}
      <div className="w-full lg:w-1/2 flex flex-col p-4 lg:p-6 border-b lg:border-r bg-white shadow-2xl z-10 overflow-y-auto lg:h-full h-[60vh]">
        <header className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
          <div className="flex items-center gap-2 font-black text-lg lg:text-xl text-blue-800 tracking-tight">
            <FileText className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600"/> DSE 考評題庫系統
          </div>
          <div className="flex items-center gap-2 w-full lg:w-auto">
            {/* 🔽 下拉選單：動態切換題目 */}
            <div className="relative w-full lg:w-48">
               <select 
                 value={currentQId} 
                 onChange={(e) => setCurrentQId(e.target.value)}
                 className="w-full appearance-none bg-blue-50 border border-blue-200 text-blue-800 py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold outline-none cursor-pointer hover:bg-blue-100 transition-colors"
               >
                 {QUESTIONS_DB.map(q => (
                   <option key={q.id} value={q.id}>{q.title}</option>
                 ))}
               </select>
               <ChevronDown className="absolute right-2 top-1.5 w-4 h-4 text-blue-500 pointer-events-none"/>
            </div>
            
            <button onClick={handleReset} className="text-xs text-slate-400 hover:text-red-500 transition-colors shrink-0">重置</button>
            <div className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1 shrink-0 ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              <Clock className="w-3 h-3"/> {formatTime(timeLeft)}
            </div>
          </div>
        </header>

        <div className="bg-slate-900 text-white p-4 lg:p-5 rounded-2xl mb-4 shadow-lg border-l-8 border-blue-500 transition-all">
          <h3 className="text-[10px] font-bold text-blue-400 uppercase mb-2 tracking-widest flex items-center gap-2">
            <Target className="w-3 h-3"/> 真題核對 ({currentQuestion.title})
          </h3>
          <p className="text-xs lg:text-sm font-medium leading-relaxed">
            {currentQuestion.text}
          </p>
        </div>

        <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-center lg:justify-start gap-6">
            <div className="text-center bg-slate-50 p-3 lg:p-4 rounded-xl border border-slate-200 min-w-[80px] lg:min-w-[100px]">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</div>
              <div className="text-3xl lg:text-4xl font-black text-slate-700">{score}<span className="text-sm lg:text-lg text-slate-400">/25</span></div>
            </div>
            <div className="text-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DSE Level</div>
              <div className={`text-4xl lg:text-5xl font-black italic tracking-tighter leading-none ${level.includes('5') ? 'text-blue-600' : 'text-slate-400'}`}>{level}</div>
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col relative min-h-[250px]">
          <div className="flex justify-between items-center mb-2">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
               答題區 <span className="text-blue-500 lowercase ml-2">({text.replace(/\s+/g, '').length} 字)</span>
             </div>
             <button onClick={handleCopy} className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded transition-colors ${copySuccess ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
               {copySuccess ? <CheckCircle className="w-3 h-3"/> : <Copy className="w-3 h-3"/>} {copySuccess ? '已複製！' : '複製答案'}
             </button>
          </div>
          
          {isTimeUp && (
             <div className="absolute top-8 left-0 w-full z-20 bg-amber-500 text-white text-center py-2 text-xs font-bold rounded-t-2xl shadow-md">
               <AlertTriangle className="w-4 h-4 inline mr-1"/> 測驗結束！請參考右側進行覆盤。
             </div>
          )}
          
          <div className={`relative flex-grow border-2 rounded-2xl overflow-hidden transition-all bg-slate-50 ${isTimeUp ? 'border-amber-400 pt-8' : 'border-slate-200 focus-within:border-blue-500 focus-within:shadow-xl'}`}>
            <div ref={backdropRef} className="absolute inset-0 p-4 lg:p-6 pt-10 w-full h-full whitespace-pre-wrap break-words text-transparent leading-[2] pointer-events-none z-0 text-sm lg:text-[15px]">
              {getHighlightedText(text)}
            </div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              disabled={isTimeUp}
              onScroll={handleScroll}
              className="absolute inset-0 p-4 lg:p-6 pt-10 w-full h-full bg-transparent text-slate-700 leading-[2] outline-none resize-none overflow-y-auto z-10 text-sm lg:text-[15px]"
              placeholder="請開始作答..."
            />
          </div>
        </div>
      </div>

      {/* 右側面版：迷霧矩陣腦圖 */}
      <div className="w-full lg:w-1/2 flex flex-col p-4 lg:p-8 bg-slate-900 relative lg:h-full h-[60vh]">
        <div className="flex-grow bg-slate-800/50 rounded-2xl lg:rounded-[2.5rem] border border-slate-700 flex flex-col p-4 lg:p-8 relative shadow-2xl overflow-y-auto">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 lg:mb-6">
            <Target className="w-4 h-4 text-blue-500"/> 核心概念矩陣 (輸入正確關鍵字解鎖)
          </div>

          <div className="flex flex-col gap-4 lg:gap-6 w-full">
             {Object.keys(currentQuestion.matrix).map(key => {
               const prop = currentQuestion.matrix[key];
               const status = matrixStatus[key] || { bg: false, idea: false, eg: false, fail: false }; 
               const isComplete = status.bg && status.idea && status.eg && status.fail;
               const hasAnyHit = status.bg || status.idea || status.eg || status.fail;
               
               return (
                 <div key={key} className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all duration-700 flex flex-col gap-2 lg:gap-3 ${isComplete ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-900/80 border-slate-700'}`}>
                    <div className="flex justify-between items-center px-1 lg:px-2">
                       <span className={`font-black text-xs lg:text-sm transition-colors duration-500 ${isComplete ? 'text-blue-400' : hasAnyHit ? 'text-slate-300' : 'text-slate-600'}`}>
                         {hasAnyHit ? prop.name : '❓ 核心論點 (待解鎖)'}
                       </span>
                       {isComplete && <CheckCircle className="w-4 h-4 text-blue-400 animate-pulse"/>}
                    </div>
                    <div className="grid grid-cols-4 gap-1 lg:gap-2">
                       <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl text-center flex flex-col items-center justify-center border transition-all duration-500 ${status.bg ? 'bg-red-900/40 border-red-500 text-red-200 shadow-[0_0_15px_rgba(248,113,113,0.3)]' : 'border-slate-800 bg-slate-800/50 text-slate-700'}`}>
                         <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full mb-1 lg:mb-2 ${status.bg ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]' : 'bg-slate-700'}`}></div>
                         <span className="text-[8px] lg:text-[10px] font-bold">{status.bg ? prop.bg.label : '???'}</span>
                       </div>
                       <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl text-center flex flex-col items-center justify-center border transition-all duration-500 ${status.idea ? 'bg-blue-900/40 border-blue-500 text-blue-200 shadow-[0_0_15px_rgba(96,165,250,0.3)]' : 'border-slate-800 bg-slate-800/50 text-slate-700'}`}>
                         <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full mb-1 lg:mb-2 ${status.idea ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' : 'bg-slate-700'}`}></div>
                         <span className="text-[8px] lg:text-[10px] font-bold">{status.idea ? prop.idea.label : '???'}</span>
                       </div>
                       <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl text-center flex flex-col items-center justify-center border transition-all duration-500 ${status.eg ? 'bg-green-900/40 border-green-500 text-green-200 shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'border-slate-800 bg-slate-800/50 text-slate-700'}`}>
                         <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full mb-1 lg:mb-2 ${status.eg ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]' : 'bg-slate-700'}`}></div>
                         <span className="text-[8px] lg:text-[10px] font-bold">{status.eg ? prop.eg.label : '???'}</span>
                       </div>
                       <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl text-center flex flex-col items-center justify-center border transition-all duration-500 ${status.fail ? 'bg-purple-900/40 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(192,132,252,0.3)]' : 'border-slate-800 bg-slate-800/50 text-slate-700'}`}>
                         <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full mb-1 lg:mb-2 ${status.fail ? 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]' : 'bg-slate-700'}`}></div>
                         <span className="text-[8px] lg:text-[10px] font-bold">{status.fail ? prop.fail.label : '???'}</span>
                       </div>
                    </div>
                 </div>
               )
             })}
          </div>
        </div>

        {/* AI 鷹架提示區 */}
        <div className="h-1/3 lg:h-1/4 pt-4 lg:pt-6 flex flex-col gap-2 lg:gap-3">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <AlertTriangle className="w-3 h-3 text-yellow-500"/> Scaffolding AI 智能鷹架提示
           </div>
           <div className="flex-grow space-y-2 overflow-y-auto pr-2 pb-4">
              {hints.map((h, i) => (
                <div key={`${h.id}-${i}`} className={`p-3 lg:p-4 rounded-xl text-xs font-bold leading-relaxed border-l-4 shadow-lg animate-in slide-in-from-right duration-500 ${
                  h.type === 'error' ? 'bg-red-900/30 border-red-500 text-red-100' : 
                  h.type === 'warning' ? 'bg-amber-900/30 border-amber-500 text-amber-100' :
                  'bg-blue-900/30 border-blue-500 text-blue-100'
                }`}>
                  <div className="whitespace-pre-wrap">{h.text}</div>
                </div>
              ))}
              <div ref={hintsEndRef} />
           </div>
        </div>
      </div>
    </div>
  );
}

