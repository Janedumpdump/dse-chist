import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- 1. 內建 SVG 圖標組件 (免安裝外部套件) ---
const Icon = ({ path, className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    {path}
  </svg>
);
const Lightbulb = (p) => <Icon {...p} path={<><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></>} />;
const Target = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>} />;
const AlertTriangle = (p) => <Icon {...p} path={<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></>} />;
const MessageSquare = (p) => <Icon {...p} path={<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>} />;
const Flame = (p) => <Icon {...p} path={<><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></>} />;
const BookOpen = (p) => <Icon {...p} path={<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>} />;
const GitBranch = (p) => <Icon {...p} path={<><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></>} />;
const RefreshCw = (p) => <Icon {...p} path={<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></>} />;
const CheckCircle = (p) => <Icon {...p} path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>} />;
const BarChart3 = (p) => <Icon {...p} path={<><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></>} />;
const GraduationCap = (p) => <Icon {...p} path={<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>} />;
const Clock = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>} />;

// --- 2. 系統核心邏輯與設定 ---
const QUESTIONS = [
  {
    id: 'q_pol',
    title: '【政治主張與不見用原因】',
    text: '孔子提出了什麽政治主張以回應所身處時代的問題？又他的主張爲什麽不見用於當時的國君？（25分）',
    focusNodes: ['bg_pol', 'bg_soc', 'idea_zheng', 'idea_ren', 'idea_li', 'limit_fail'],
    hint: '💡 提示：本題重點在「政治與局限」。請先指出春秋時代的亂象(背景)，對應孔子的政治主張，最後解釋為何諸侯不採用(原因)。',
    skeleton: "就政治方面而言，春秋時代面臨著 ______ 的問題。為此，孔子提出了三大政治主張以作回應。\n\n首先，他主張 ______ ；其次，他提倡 ______ ；最後，他強調 ______ 。\n\n然而，孔子的政治主張最終不見用於當時的國君。這是因為當時諸侯普遍追求 ______ ，例如 ______ 。可見，孔子的主張被視為 ______ ，與當時的霸政文化相違背，故未被採納。",
    graphColumns: ['一、時代亂象', '二、政治主張', '三、不見用原因'],
    nodes: {
      bg_pol: { x: 150, y: 180 }, bg_soc: { x: 150, y: 420 },
      idea_zheng: { x: 450, y: 150 }, idea_ren: { x: 450, y: 300 }, idea_li: { x: 450, y: 450 },
      limit_fail: { x: 750, y: 300 }
    },
    edges: [
      { source: 'bg_pol', target: 'idea_zheng', type: 'cause' }, { source: 'bg_soc', target: 'idea_ren', type: 'anti' }, { source: 'bg_pol', target: 'idea_li', type: 'cause' },
      { source: 'idea_zheng', target: 'limit_fail', type: 'conflict' }, { source: 'idea_ren', target: 'limit_fail', type: 'conflict' }, { source: 'idea_li', target: 'limit_fail', type: 'conflict' }
    ]
  },
  {
    id: 'q_edu',
    title: '【教育及學術貢獻】',
    text: '試根據史實，從孔子的教育及學術兩方面，分析他在兩者上的貢獻。 （25分）',
    focusNodes: ['bg_edu', 'idea_edu', 'act_xue', 'act_duo'], 
    hint: '💡 提示：本題重點在「教育與文化」。請說明孔子如何打破貴族壟斷，及其具體的教育實踐與文化貢獻。',
    skeleton: "在教育與學術方面，春秋時期的背景是 ______ 。孔子為此作出了巨大貢獻。\n\n在教育方面，他提出了 ______ 的理念，打破了階級限制。具體實踐上，他 ______ ，培育了大量人才。\n\n在學術方面，他致力於 ______ ，將古代典籍傳承至後世。因此，他對中國文化有著深遠的影響。",
    graphColumns: ['一、教育背景', '二、教育理念', '三、實踐與貢獻'],
    nodes: { bg_edu: { x: 150, y: 300 }, idea_edu: { x: 450, y: 300 }, act_xue: { x: 750, y: 200 }, act_duo: { x: 750, y: 400 } },
    edges: [ { source: 'bg_edu', target: 'idea_edu', type: 'cause' }, { source: 'idea_edu', target: 'act_xue', type: 'action' }, { source: 'idea_edu', target: 'act_duo', type: 'action' } ]
  },
  {
    id: 'q_action',
    title: '【實踐理想的方法與社會責任】',
    text: '孔子還透過什麽方法實踐其政治理想？試從他從政、教學和編書的經歷，論證他具備知識分子應有的社會責任心。（25分）',
    focusNodes: ['idea_zheng', 'idea_ren', 'act_duo', 'act_zhou', 'act_xue'], 
    hint: '💡 提示：本題重點在「具體行動」。不要只寫思想，請舉出孔子「做過什麼」來拯救時代，如出仕、周遊列國和辦學。',
    skeleton: "孔子不僅提出政治主張，更透過具體行動實踐理想。\n\n在從政方面，他主張 ______ ，並親自 ______ ，展現了濟世的決心。\n\n在教學方面，他提倡 ______ ，並首創 ______ ，培育了大量人才。\n\n在編書方面，他晚年整理典籍，作 ______ ，做到微言大義。可見，孔子具備強烈的社會責任心。",
    graphColumns: ['一、核心理想', '二、實踐方法 (從政/教學)', '三、學術傳承 (編書)'],
    nodes: {
      idea_zheng: { x: 150, y: 200 }, idea_ren: { x: 150, y: 400 },
      act_zhou: { x: 450, y: 150 }, act_xue: { x: 450, y: 450 },
      act_duo: { x: 750, y: 300 }
    },
    edges: [
      { source: 'idea_zheng', target: 'act_zhou', type: 'action' },
      { source: 'idea_ren', target: 'act_xue', type: 'action' },
      { source: 'idea_zheng', target: 'act_duo', type: 'action' }
    ]
  }
];

const LOGIC_CONNECTIVES = ['因此', '所以', '導致', '以致', '為此', '於是', '故', '從而', '藉此', '為了', '可見', '加上', '面對', '針對', '以期', '因為', '由於'];

const Q_POL_SCHEMA = [
  {
    theme: "仁政德治", nodeId: "idea_ren",
    a_politics: ["仁政德治", "仁政", "為政以德", "不違農時", "大同世界", "道之以德"],
    b_context: ["苛法", "加徵賦稅", "攻打別國", "苛政猛於虎", "急功近利"],
    c_failure: ["功利主義", "短時間難見成效", "衛靈公問陣", "不合時宜"],
    evidences: ["苛政猛於虎", "《禮記·中庸》", "仁者愛人", "不違農時", "為政以德", "為仁由己", "大同世界", "春秋時期", "功利主義", "衛靈公", "兵陣"]
  },
  {
    theme: "禮治教化", nodeId: "idea_li",
    a_politics: ["恢復禮治", "克己復禮", "禮教防止犯罪", "禮治", "齊之以禮"],
    b_context: ["禮崩樂壞", "季氏八佾舞於庭", "南子同車", "周文疲弊", "秩序混亂"],
    c_failure: ["不適應時勢", "晏嬰批評繁文縟節", "繁文縟節"],
    evidences: ["季氏", "八佾舞於庭", "南子", "夾谷會齊", "大司寇", "魯定公", "萊人獻舞", "克己復禮", "晏嬰", "繁文縟節"]
  },
  {
    theme: "正名主張", nodeId: "idea_zheng",
    a_politics: ["正名", "君君臣臣父父子子", "君君臣臣", "墮三都"],
    b_context: ["兼併篡弒", "170多國", "世卿專權", "僭越", "臣弒君"],
    c_failure: ["維護封建不合時宜", "篡位擅權者之戒心", "篡位得國", "霸政"],
    evidences: ["君君臣臣父父子子", "170多國", "墮三都", "魯之三桓", "名不正則言不順", "西周封建秩序", "篡位得國"]
  }
];

const DICTIONARY = {
  bg_pol: { id: 'bg_pol', label: '禮崩樂壞', type: 'root', argumentGroups: [Q_POL_SCHEMA[1].b_context, Q_POL_SCHEMA[2].b_context] },
  bg_soc: { id: 'bg_soc', label: '急功近利/峻法', type: 'root', argumentGroups: [Q_POL_SCHEMA[0].b_context] },
  bg_edu: { id: 'bg_edu', label: '學在官府', type: 'root', argumentGroups: [['學在官府', '學在王官', '貴族之學', '貴族壟斷', '不流入平民', '受教權限制'], ['典籍散佚', '王公失守']] },
  idea_zheng: { id: 'idea_zheng', label: '正名 / 尊王', type: 'trunk', argumentGroups: [Q_POL_SCHEMA[2].a_politics] },
  idea_ren: { id: 'idea_ren', label: '仁政 / 德治', type: 'trunk', argumentGroups: [Q_POL_SCHEMA[0].a_politics] },
  idea_li: { id: 'idea_li', label: '禮治 / 教化', type: 'trunk', argumentGroups: [Q_POL_SCHEMA[1].a_politics] },
  idea_edu: { id: 'idea_edu', label: '有教無類', type: 'trunk', argumentGroups: [['有教無類', '教育平民', '打破階級'], ['因材施教', '啟發誘導', '學思並重']] },
  act_duo: { id: 'act_duo', label: '從政 / 編典籍', type: 'leaf_act', argumentGroups: [['墮三都', '大司寇', '夾谷會齊', '從政', '治績'], ['編纂', '整理典籍', '刪詩書', '六經', '作春秋', '微言大義']] },
  act_xue: { id: 'act_xue', label: '聚徒講學', type: 'leaf_act', argumentGroups: [['私人講學', '聚徒講學', '創辦私學', '杏壇'], ['三千弟子', '七十二賢', '作育英才']] },
  act_zhou: { id: 'act_zhou', label: '周遊列國', type: 'leaf_act', argumentGroups: [['周遊列國', '出仕', '十四年', '遊說', '列國'], ['推廣道義', '社會責任', '濟世', '知其不可而為之']] },
  limit_fail: { id: 'limit_fail', label: '不見用於諸侯', type: 'leaf_limit', argumentGroups: [Q_POL_SCHEMA[0].c_failure, Q_POL_SCHEMA[1].c_failure, Q_POL_SCHEMA[2].c_failure] },
};

const COLORS = {
  root: { inactive: '#f3f4f6', active: '#fee2e2', border: '#ef4444', text: '#991b1b' },       
  trunk: { inactive: '#f3f4f6', active: '#fef3c7', border: '#eab308', text: '#854d0e' },      
  leaf_act: { inactive: '#f3f4f6', active: '#dcfce7', border: '#22c55e', text: '#166534' },   
  leaf_limit: { inactive: '#f3f4f6', active: '#ffedd5', border: '#f97316', text: '#9a3412' }, 
};

const generateUniqueId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);

// --- 主 React 組件 ---
export default function App() {
  const [currentQId, setCurrentQId] = useState(QUESTIONS[0].id);
  const [text, setText] = useState('');
  
  const [activeNodes, setActiveNodes] = useState(new Set());
  const [activeArgsCount, setActiveArgsCount] = useState({});
  const [evidenceList, setEvidenceList] = useState([]); 
  const [activeEdges, setActiveEdges] = useState(new Set());
  const [usedConnectivesCount, setUsedConnectivesCount] = useState(0); 

  const [progressMetrics, setProgressMetrics] = useState({ coverage: 0, argumentSufficiency: 0, logicDensity: 0 });
  const [markerFeedback, setMarkerFeedback] = useState({ level: 'U', count: 0, text: '請開始作答。' });
  const [hints, setHints] = useState([]);
  
  const typingTimer = useRef(null);
  const idleHintTimer = useRef(null);
  const idleSkeletonTimer = useRef(null);
  const textareaRef = useRef(null);
  const backdropRef = useRef(null);
  const latestNodesRef = useRef(activeNodes); 

  const [forceShowAll, setForceShowAll] = useState(false); 
  const [timeLeft, setTimeLeft] = useState(1200); 

  const currentQuestion = QUESTIONS.find(q => q.id === currentQId);

  useEffect(() => {
    latestNodesRef.current = activeNodes;
  }, [activeNodes]);

  const addHint = useCallback((level, hintText, type) => {
    setHints(prev => {
      if (prev.length > 0 && prev[0].text === hintText) return prev;
      return [{ id: generateUniqueId(), level, text: hintText, type }, ...prev].slice(0, 2);
    });
  }, []);

  const evaluatePoliticalAnswer = (currentText, totalEvidences) => {
    let completedThemes = 0;
    let feedbackMsgs = [];
    
    Q_POL_SCHEMA.forEach(schema => {
      const hasA = schema.a_politics.some(kw => currentText.includes(kw));
      const hasB = schema.b_context.some(kw => currentText.includes(kw));
      const hasC = schema.c_failure.some(kw => currentText.includes(kw));
      
      if (hasA) {
        if (hasB && hasC) {
          completedThemes++;
        } else {
          let missing = [];
          if (!hasB) missing.push('時代背景(b)');
          if (!hasC) missing.push('不見用原因(c)');
          feedbackMsgs.push(`你的「${schema.theme}」段落缺乏 ${missing.join(' 及 ')}。`);
        }
      }
    });

    let dseLevel = '1';
    let feedback = '';

    if (completedThemes === 0) {
      dseLevel = currentText.length > 50 ? '2' : '1';
      feedback = '嚴重失分！你未有提出任何結構完整的政治主張 (需具備: 背景+主張+原因)。' + (feedbackMsgs.length > 0 ? ' ' + feedbackMsgs[0] : '');
    } else if (completedThemes === 1) {
      dseLevel = '2';
      feedback = '嚴重失分！題目要求涵蓋多個政治主張，你只完整寫了「一個」面向。按 DSE 標準分數封頂至 Level 2。必須寫齊三大主張。';
    } else if (completedThemes === 2) {
      dseLevel = totalEvidences >= 8 ? '4' : '3';
      feedback = '達標水平。你完整論述了兩個主張。若要突破 Level 4，必須涵蓋第三個政治主張(正名/仁政/禮治)。';
    } else if (completedThemes === 3) {
      if (totalEvidences >= 15) {
        dseLevel = '5**';
        feedback = '論證極之豐富！三大主張結構嚴謹，史論結合完美扣連春秋霸政文化。';
      } else if (totalEvidences >= 10) {
        dseLevel = '5';
        feedback = '優秀！結構完整且史實充足。可再補充更多細節史實(如衛靈公問陣、晏嬰評孔)以衝擊 5**。';
      } else {
        dseLevel = '4';
        feedback = '結構完整，但史實密度(Evidence)不足，論述略顯空泛。請補充更多歷史名詞。';
      }
    }

    return { dseLevel, feedback, completedThemes };
  };

  const evaluateEducationalAnswer = (activeNodeSet, totalEvidences) => {
    const hasEdu = activeNodeSet.has('idea_edu') || activeNodeSet.has('act_xue');
    const hasAca = activeNodeSet.has('act_duo');

    if (!hasEdu && !hasAca) return { dseLevel: '1', feedback: '未提出任何教育/學術貢獻。' };
    if (!hasEdu || !hasAca) return { dseLevel: '2', feedback: '嚴重失分！題目要求「教育」及「學術」兩方面，你只回答了其中一面，分數封頂至 Level 2。' };
    
    if (totalEvidences >= 10) return { dseLevel: '5**', feedback: '論證極之豐富，教育與學術雙軌並行，史論結合嚴謹！' };
    if (totalEvidences >= 6) return { dseLevel: '4', feedback: '雙軌論證充足。建議補充更多如「刪詩書、定禮樂」等學術史實以衝擊 Level 5。' };
    return { dseLevel: '3', feedback: '涵蓋了兩方面，但史實例子不足，流於空論。' };
  };

  const evaluateActionAnswer = (activeNodeSet, totalEvidences) => {
    const hasPolitics = activeNodeSet.has('act_duo') || activeNodeSet.has('act_zhou');
    const hasEdu = activeNodeSet.has('act_xue');
    const hasBook = activeNodeSet.has('act_duo') && Array.from(evidenceList).some(e => ['編纂', '作春秋', '六經', '整理典籍'].includes(e.word));

    let aspectsCount = 0;
    if (hasPolitics) aspectsCount++;
    if (hasEdu) aspectsCount++;
    if (hasBook) aspectsCount++;

    if (aspectsCount === 0) return { dseLevel: '1', feedback: '未提出任何孔子的具體實踐行動。' };
    if (aspectsCount < 3) return { dseLevel: '2', feedback: '嚴重失分！題目要求從「從政、教學、編書」三方面論證，你漏了其中一面，分數封頂至 Level 2。' };

    if (totalEvidences >= 12) return { dseLevel: '5**', feedback: '論證極之豐富！三方面實踐齊備，史論結合嚴謹，充分展現了孔子的社會責任心！' };
    if (totalEvidences >= 8) return { dseLevel: '4', feedback: '結構完整，論證充足。建議補充更多具體史實(如墮三都、作春秋的微言大義)以衝擊 Level 5。' };
    return { dseLevel: '3', feedback: '三方面皆有提及，但史實例子不足，論點欠缺說服力。' };
  };

  const analyzeText = useCallback((currentText) => {
    const newActiveNodes = new Set();
    const newActiveArgsCount = {};
    let foundEvidences = [];
    
    Object.values(DICTIONARY).forEach(node => {
      node.argumentGroups.forEach(group => {
        if (group.some(kw => currentText.includes(kw))) {
          newActiveNodes.add(node.id);
          newActiveArgsCount[node.id] = (newActiveArgsCount[node.id] || 0) + 1;
        }
      });
    });

    if (currentQId === 'q_pol') {
      Q_POL_SCHEMA.forEach(schema => {
        schema.evidences.forEach(evi => {
          if (currentText.includes(evi) && !foundEvidences.some(e => e.word === evi)) {
            foundEvidences.push({ word: evi, index: currentText.indexOf(evi) });
          }
        });
      });
    } else if (currentQId === 'q_edu') {
      ['創辦私學', '有教無類', '因材施教', '學在官府', '刪詩書', '定禮樂', '作春秋', '三千弟子', '七十二賢', '六經'].forEach(evi => {
        if (currentText.includes(evi) && !foundEvidences.some(e => e.word === evi)) {
          foundEvidences.push({ word: evi, index: currentText.indexOf(evi) });
        }
      });
    } else if (currentQId === 'q_action') {
       ['墮三都', '中都宰', '夾谷會齊', '作春秋', '周遊列國', '創辦私學', '三千弟子', '六經', '知其不可而為之', '濟世'].forEach(evi => {
        if (currentText.includes(evi) && !foundEvidences.some(e => e.word === evi)) {
          foundEvidences.push({ word: evi, index: currentText.indexOf(evi) });
        }
      });
    }
    foundEvidences.sort((a, b) => a.index - b.index);

    const newActiveEdges = new Set();
    currentQuestion.edges.forEach(edge => {
      if (newActiveNodes.has(edge.source) && newActiveNodes.has(edge.target)) {
        newActiveEdges.add(`${edge.source}-${edge.target}`);
      }
    });

    let connectivesCount = 0;
    LOGIC_CONNECTIVES.forEach(conn => {
      if (currentText.includes(conn)) connectivesCount++;
    });

    let metrics = { coverage: 0, argumentSufficiency: 0, logicDensity: 0 };
    let finalLevel = 'U';
    let finalFeedback = '請開始作答。';

    if (currentText.length > 5) {
      if (currentQId === 'q_pol') {
        const evalResult = evaluatePoliticalAnswer(currentText, foundEvidences.length);
        finalLevel = evalResult.dseLevel;
        finalFeedback = evalResult.feedback;
        metrics.coverage = Math.min((evalResult.completedThemes / 3) * 100, 100); 
      } else if (currentQId === 'q_edu') {
        const evalResult = evaluateEducationalAnswer(newActiveNodes, foundEvidences.length);
        finalLevel = evalResult.dseLevel;
        finalFeedback = evalResult.feedback;
        const activatedFocusNodes = currentQuestion.focusNodes.filter(id => newActiveNodes.has(id));
        let rawCoverage = currentQuestion.focusNodes.length > 0 ? Math.round((activatedFocusNodes.length / currentQuestion.focusNodes.length) * 100) : 0;
        const hasEdu = newActiveNodes.has('idea_edu') || newActiveNodes.has('act_xue');
        const hasAca = newActiveNodes.has('act_duo');
        if (!hasEdu || !hasAca) rawCoverage = Math.min(rawCoverage, 45);
        metrics.coverage = rawCoverage;
      } else if (currentQId === 'q_action') {
        const evalResult = evaluateActionAnswer(newActiveNodes, foundEvidences.length);
        finalLevel = evalResult.dseLevel;
        finalFeedback = evalResult.feedback;
        const activatedFocusNodes = currentQuestion.focusNodes.filter(id => newActiveNodes.has(id));
        let rawCoverage = currentQuestion.focusNodes.length > 0 ? Math.round((activatedFocusNodes.length / currentQuestion.focusNodes.length) * 100) : 0;
        const actionsCount = ['act_duo', 'act_zhou', 'act_xue'].filter(id => newActiveNodes.has(id)).length;
        if (actionsCount === 1) rawCoverage = Math.min(rawCoverage, 35); 
        if (actionsCount === 2) rawCoverage = Math.min(rawCoverage, 65);
        metrics.coverage = rawCoverage;
      }
      
      let totalExpectedArgs = currentQuestion.focusNodes.length * 3; 
      let currentArgsScore = 0;
      currentQuestion.focusNodes.forEach(id => { currentArgsScore += Math.min(newActiveArgsCount[id] || 0, 3); });
      metrics.argumentSufficiency = totalExpectedArgs > 0 ? Math.round((currentArgsScore / totalExpectedArgs) * 100) : 0;

      metrics.logicDensity = currentQuestion.edges.length > 0 ? Math.round((newActiveEdges.size / currentQuestion.edges.length) * 100) : 0;
      if (metrics.logicDensity > 0 && connectivesCount === 0) metrics.logicDensity = Math.max(10, Math.round(metrics.logicDensity * 0.3));

      if (metrics.coverage < 5 && metrics.argumentSufficiency < 5) {
        finalLevel = 'U';
        finalFeedback = '論點與論據極度貧乏，未能達到 DSE 最低評級要求，不予評級。';
      }
    }

    setActiveNodes(newActiveNodes);
    setActiveArgsCount(newActiveArgsCount);
    setEvidenceList(foundEvidences);
    setActiveEdges(newActiveEdges);
    setUsedConnectivesCount(connectivesCount);
    setProgressMetrics(metrics);
    setMarkerFeedback({ level: finalLevel, count: foundEvidences.length, text: finalFeedback });

  }, [currentQuestion, currentQId]);

  const resetIdleTimers = useCallback(() => {
    if (idleHintTimer.current) clearTimeout(idleHintTimer.current);
    if (idleSkeletonTimer.current) clearTimeout(idleSkeletonTimer.current);
    
    if (text.trim() === '') {
      idleHintTimer.current = setTimeout(() => {
        if (!forceShowAll) {
          const hintText = currentQId === 'q_pol' 
            ? '💡 系統發現你尚未作答。試想當時的諸侯和權臣如何破壞秩序？這反映了什麼問題？' 
            : currentQId === 'q_edu' 
            ? '💡 系統發現你尚未作答。試想春秋時期的教育權力掌握在誰手上？平民有機會讀書嗎？'
            : '💡 系統發現你尚未作答。孔子除了講學，還做過哪些官？編過哪些書？';
          addHint(1, hintText, 'info');
        }
      }, 30000); 

      idleSkeletonTimer.current = setTimeout(() => {
        if (!forceShowAll) {
          setText(currentQuestion.skeleton);
          analyzeText(currentQuestion.skeleton);
          addHint(1, '💡 你似乎不知從何下筆。系統已為你載入「答題骨架」，請嘗試填上空格！', 'info');
        }
      }, 300000); 
    }
  }, [text, currentQId, currentQuestion.skeleton, analyzeText, forceShowAll, addHint]);

  useEffect(() => {
    setText('');
    setActiveNodes(new Set());
    setActiveArgsCount({});
    setEvidenceList([]);
    setActiveEdges(new Set());
    setUsedConnectivesCount(0);
    setForceShowAll(false);
    setTimeLeft(1200); 
    setProgressMetrics({ coverage: 0, argumentSufficiency: 0, logicDensity: 0 });
    setMarkerFeedback({ level: 'U', count: 0, text: '請開始作答，系統將即時評核。' });
    setHints([{ id: generateUniqueId(), level: 0, text: currentQuestion.hint, type: 'info' }]);

    const countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setForceShowAll(true);
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [currentQId, currentQuestion.hint]);

  useEffect(() => {
    resetIdleTimers();
    return () => {
      if (idleHintTimer.current) clearTimeout(idleHintTimer.current);
      if (idleSkeletonTimer.current) clearTimeout(idleSkeletonTimer.current);
    };
  }, [text, resetIdleTimers]);

  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleTextChange = (e) => {
    if (forceShowAll) return;
    const val = e.target.value;
    setText(val);
    analyzeText(val);

    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => { triggerScaffoldingHint(val); }, 5000); 
  };

  const triggerScaffoldingHint = (currentText) => {
    const currentNodes = latestNodesRef.current;
    
    if (currentText.length < 5) return;

    if (currentQId === 'q_pol' && currentNodes.has('idea_ren') && !currentNodes.has('limit_fail')) {
      addHint(3, "🤔 Level 3 提示：既然『仁政』對百姓好，為何當時的君主不用？試著引導出「諸侯求功利」的衝突。", 'warning');
      return;
    }

    const activatedFocusEdges = currentQuestion.edges.filter(e => currentQuestion.focusNodes.includes(e.source) && currentQuestion.focusNodes.includes(e.target) && currentNodes.has(e.source) && currentNodes.has(e.target));
    if (activatedFocusEdges.length > 0 && usedConnectivesCount === 0) {
      addHint(3, `🔗 發現堆砌史實！缺少「因此、導致、面對」等推論詞彙，會被視為欠缺邏輯連貫。`, 'warning');
      return;
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getHighlightedText = () => {
    if (!text) return text;
    
    const matches = [
      ...evidenceList.map(e => ({ word: e.word, isEvidence: true })),
      ...LOGIC_CONNECTIVES.filter(c => text.includes(c)).map(c => ({ word: c, isConnective: true }))
    ].sort((a, b) => b.word.length - a.word.length);

    if (matches.length === 0) return text;

    const regexStr = matches.map(m => m.word).join('|');
    const regex = new RegExp(`(${regexStr})`, 'g');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const match = matches.find(m => m.word === part);
      if (match) {
        if (match.isConnective) {
          return <mark key={`highlight-${i}`} className="rounded text-transparent bg-yellow-300/50">{part}</mark>;
        } else if (match.isEvidence) {
          return <mark key={`highlight-${i}`} className="rounded text-transparent bg-green-300/50">{part}</mark>;
        }
      }
      return <span key={`highlight-${i}`}>{part}</span>;
    });
  };

  const renderNode = (id, node) => {
    const coords = currentQuestion.nodes[id];
    if (!coords) return null; 

    const isFocus = currentQuestion.focusNodes.includes(id);
    const effectivelyActive = activeNodes.has(id) || (forceShowAll && isFocus);
    
    const colorTheme = COLORS[node.type];
    const opacity = isFocus ? 1 : 0.15; 
    const scale = isFocus ? 1 : 0.85;
    
    const bgColor = effectivelyActive ? colorTheme.active : '#374151';
    const borderColor = effectivelyActive ? colorTheme.border : '#4b5563';
    const textColor = effectivelyActive ? colorTheme.text : '#d1d5db';
    const shadow = effectivelyActive ? `drop-shadow(0 0 10px ${colorTheme.border}90)` : 'none';

    let argsMatched = 0;
    node.argumentGroups.forEach(group => {
      if (group.some(kw => text.includes(kw))) argsMatched++;
    });
    
    const showArgsCounter = isFocus && effectivelyActive && !forceShowAll;
    
    const schemaForNode = Q_POL_SCHEMA.find(s => s.nodeId === id);
    let matchedWords = [];
    if (schemaForNode && currentQId === 'q_pol') {
       matchedWords = evidenceList.filter(e => schemaForNode.evidences.includes(e.word)).map(e => e.word);
    } else {
       matchedWords = evidenceList.filter(e => node.argumentGroups.flat().includes(e.word)).map(e => e.word);
    }

    return (
      <g key={id} transform={`translate(${coords.x}, ${coords.y}) scale(${scale})`} style={{ filter: shadow, transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', opacity }}>
        <g transform={`translate(-70, -25)`}>
          <rect width="140" height="50" rx="25" fill={bgColor} stroke={borderColor} strokeWidth={effectivelyActive ? 3 : 1} />
          
          {showArgsCounter && (
             <g transform="translate(125, -5)">
               <circle cx="0" cy="0" r="10" fill={argsMatched >= 3 ? '#22c55e' : '#f59e0b'} />
               <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold">
                 {argsMatched >= 3 ? '✓' : `${argsMatched}/3`}
               </text>
             </g>
          )}

          {effectivelyActive ? (
            <>
              <text x="70" y="25" textAnchor="middle" dominantBaseline="middle" fill={textColor} fontWeight="bold" fontSize="14">
                {node.label}
              </text>
              {!forceShowAll && matchedWords.length > 0 && (
                <text x="70" y="65" textAnchor="middle" fill="#9ca3af" fontSize="10" className="opacity-80">
                  {matchedWords.slice(0, 3).join(' • ')}
                  {matchedWords.length > 3 ? '...' : ''}
                </text>
              )}
            </>
          ) : (
            <circle cx="70" cy="25" r="4" fill="#6b7280" />
          )}
        </g>
      </g>
    );
  };

  const renderEdge = (edge, index) => {
    const source = currentQuestion.nodes[edge.source];
    const target = currentQuestion.nodes[edge.target];
    if (!source || !target) return null; 

    const edgeId = `${edge.source}-${edge.target}`;
    
    const isFocusEdge = currentQuestion.focusNodes.includes(edge.source) && currentQuestion.focusNodes.includes(edge.target);
    const effectivelyActiveEdge = activeEdges.has(edgeId) || (forceShowAll && isFocusEdge);
    const opacity = isFocusEdge ? 1 : 0.05; 

    const x1 = source.x + 70;
    const y1 = source.y;
    const x2 = target.x - 70;
    const y2 = target.y;
    const pathD = `M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`;
    
    const isConflict = edge.type === 'conflict';
    const strokeColor = effectivelyActiveEdge ? (isConflict ? '#ef4444' : '#eab308') : '#4b5563';
    const strokeWidth = effectivelyActiveEdge ? 3 : 1.5;
    const strokeDasharray = isConflict ? "5,5" : "none";
    
    const animateNode = effectivelyActiveEdge && !isConflict ? (
      <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
    ) : null;

    return (
      <path
        key={`edge-${edge.source}-${edge.target}`}
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={effectivelyActiveEdge && !isConflict ? "10,10" : strokeDasharray}
        style={{ transition: 'all 0.5s ease', opacity }}
      >
        {animateNode}
      </path>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* 左側面板 */}
      <div className="w-full md:w-5/12 lg:w-[42%] flex flex-col p-4 md:p-6 border-r border-gray-200 overflow-y-auto bg-white shadow-xl z-10">
        
        <header className="mb-4 flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-700" />
            <h1 className="text-lg font-bold text-gray-800">DSE 中史審題訓練</h1>
          </div>
          <div className={`flex items-center gap-1 text-sm font-mono font-bold px-3 py-1 rounded-full ${forceShowAll ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
            <Clock className="w-4 h-4" />
            {forceShowAll ? "超時鎖定" : formatTime(timeLeft)}
          </div>
        </header>

        {/* 題目選擇區 */}
        <section className="mb-5 shrink-0">
          <div className="flex justify-between items-end mb-2">
             <label className="text-xs font-bold text-gray-600">📋 選擇題型：</label>
          </div>
          <select 
            className="w-full p-2 mb-3 border border-blue-300 rounded-lg bg-blue-50/50 text-blue-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
            value={currentQId}
            onChange={(e) => setCurrentQId(e.target.value)}
          >
            {QUESTIONS.map(q => (
              <option key={q.id} value={q.id}>{q.title}</option>
            ))}
          </select>
          
          <div className="mt-3 bg-blue-50/80 p-4 rounded-xl border-l-4 border-blue-500 text-base leading-relaxed text-blue-900 font-bold shadow-sm">
            {currentQuestion.text}
          </div>
        </section>

        {/* 精簡版 DSE 評級標籤 */}
        <div className="flex items-center gap-3 mb-5 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 min-w-[65px]">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Level</span>
            <span className={`text-2xl font-black leading-none ${markerFeedback.level === 'U' ? 'text-gray-400' : markerFeedback.level.includes('5') ? 'text-amber-500' : markerFeedback.level.includes('4') ? 'text-green-500' : markerFeedback.level.includes('3') ? 'text-blue-500' : 'text-red-500'}`}>
              {markerFeedback.level}
            </span>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-xs text-gray-500 font-bold mb-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3"/> 評析 (史實數: {markerFeedback.count})
            </span>
            <span className={`text-[11px] font-medium leading-tight ${markerFeedback.text.includes('嚴重失分') || markerFeedback.text.includes('極度貧乏') ? 'text-red-600' : 'text-gray-700'}`}>{markerFeedback.text}</span>
          </div>
        </div>

        {/* 三維度評分系統 */}
        <section className="mb-5 shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600">
                <span>1. 知識點命中率 (藍色)</span><span>{progressMetrics.coverage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5"><div className={`h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] ${progressMetrics.coverage < 50 && progressMetrics.coverage > 0 ? 'bg-red-400' : 'bg-blue-500'}`} style={{ width: `${progressMetrics.coverage}%` }}></div></div>
              {progressMetrics.coverage < 50 && progressMetrics.coverage > 0 && <p className="text-[10px] text-red-500 mt-1">⚠️ 結構嚴重不全，分數封頂！</p>}
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600">
                <span>2. 論據充足度 (綠色)</span><span>{progressMetrics.argumentSufficiency}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" style={{ width: `${progressMetrics.argumentSufficiency}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600">
                <span>3. 論證連貫度 (金色)</span><span>{progressMetrics.logicDensity}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]" style={{ width: `${progressMetrics.logicDensity}%` }}></div></div>
            </div>
          </div>
        </section>

        {/* 沉浸式答題區 */}
        <section className="flex-grow flex flex-col mb-4 relative min-h-[220px]">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> 答題區
            </label>
            <div className="flex gap-2">
              <button onClick={() => setText('')} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1">
                <RefreshCw className="w-3 h-3"/> 清空
              </button>
            </div>
          </div>
          
          <div className="relative flex-grow rounded-xl border border-gray-300 shadow-inner bg-white overflow-hidden group focus-within:ring-2 focus-within:ring-blue-500">
            <div 
              ref={backdropRef}
              className="absolute inset-0 p-4 w-full h-full text-transparent whitespace-pre-wrap break-words overflow-y-auto pointer-events-none font-sans text-sm leading-loose"
            >
              {getHighlightedText()}
            </div>
            <textarea 
              ref={textareaRef}
              className="absolute inset-0 w-full h-full p-4 bg-transparent resize-none outline-none font-sans text-sm leading-loose text-gray-800 z-10"
              placeholder="請開始作答。系統會偵測你的邏輯，卡關時將會自動給予引導..."
              value={text}
              onChange={handleTextChange}
              onScroll={handleScroll}
              readOnly={forceShowAll}
              spellCheck="false"
            />
          </div>
        </section>

        {/* 鷹架提示區 */}
        <section className="shrink-0 flex flex-col gap-2">
          {hints.map((hint, i) => (
            <div key={hint.id} className={`p-3 rounded-lg text-xs flex gap-2 animate-fade-in ${
              hint.type === 'error' ? 'bg-red-50 text-red-800 border border-red-100' :
              hint.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-100' :
              'bg-blue-50 text-blue-800 border border-blue-100'
            }`} style={{ opacity: 1 - i * 0.3 }}>
              {hint.type === 'error' && <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              {hint.type === 'warning' && <Flame className="w-4 h-4 flex-shrink-0" />}
              {hint.type === 'info' && <Lightbulb className="w-4 h-4 flex-shrink-0" />}
              <div className="leading-relaxed font-medium">{hint.text}</div>
            </div>
          ))}
        </section>

      </div>

      {/* 右側面板：樹冠圖譜 */}
      <div className="w-full md:w-7/12 lg:w-[58%] bg-[#0f172a] relative overflow-hidden flex flex-col">
        
        <div className="absolute top-4 left-4 z-20 bg-slate-800/80 backdrop-blur-md text-slate-200 px-4 py-2 rounded-lg text-sm border border-slate-700 shadow-xl flex items-center gap-4">
          <div className="font-semibold flex items-center gap-2"><GitBranch className="w-4 h-4 text-green-400"/> 邏輯樹冠圖 </div>
          <div className="text-xs text-slate-400 hidden md:block">解鎖盲盒以顯示結構路徑</div>
        </div>

        <div className="flex-grow w-full h-full relative" style={{ minHeight: '600px' }}>
          <svg viewBox="0 0 900 600" className="w-full h-full">
            <line x1="150" y1="50" x2="150" y2="550" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="450" y1="50" x2="450" y2="550" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="750" y1="50" x2="750" y2="550" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />

            <text x="150" y="40" fill="#64748b" textAnchor="middle" fontWeight="bold" fontSize="16" letterSpacing="2">{currentQuestion.graphColumns[0]}</text>
            <text x="450" y="40" fill="#64748b" textAnchor="middle" fontWeight="bold" fontSize="16" letterSpacing="2">{currentQuestion.graphColumns[1]}</text>
            <text x="750" y="40" fill="#64748b" textAnchor="middle" fontWeight="bold" fontSize="16" letterSpacing="2">{currentQuestion.graphColumns[2]}</text>

            {currentQuestion.edges.map((edge, index) => renderEdge(edge, index))}
            {Object.keys(currentQuestion.nodes).map((id) => renderNode(id, DICTIONARY[id]))}
          </svg>
        </div>
      </div>
      
    </div>
  );
}
