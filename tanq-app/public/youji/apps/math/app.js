const app = {
    settings: { sound: false, level: 1, count: 5 },
    state: { currentQuestion: 0, score: 0, combo: 0, maxCombo: 0, correctAnswer: 0, currentEquation: '', roundCorrect: 0, roundResults: [] },
    
    // SVG素材（キャラクターとおやつ）
    svg: {
        dog: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#F39C12"/><circle cx="35" cy="40" r="5" fill="#FFF"/><circle cx="65" cy="40" r="5" fill="#FFF"/><circle cx="35" cy="40" r="2" fill="#000"/><circle cx="65" cy="40" r="2" fill="#000"/><ellipse cx="50" cy="60" rx="10" ry="6" fill="#000"/><path d="M 40 70 Q 50 80 60 70" stroke="#000" stroke-width="3" fill="none"/></svg>`,
        cat: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#E74C3C"/><polygon points="10,10 40,20 20,40" fill="#E74C3C"/><polygon points="90,10 60,20 80,40" fill="#E74C3C"/><circle cx="35" cy="45" r="5" fill="#FFF"/><circle cx="65" cy="45" r="5" fill="#FFF"/><circle cx="35" cy="45" r="2" fill="#000"/><circle cx="65" cy="45" r="2" fill="#000"/><polygon points="45,55 55,55 50,65" fill="#F1C40F"/><path d="M 40 70 Q 50 75 60 70" stroke="#000" stroke-width="3" fill="none"/></svg>`,
        snacks: [
            `<svg viewBox="0 0 100 100"><circle cx="50" cy="55" r="40" fill="#E74C3C"/><path d="M 50 15 Q 60 5 70 15" stroke="#27AE60" stroke-width="6" fill="none"/></svg>`, // りんご
            `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#D35400"/><circle cx="30" cy="40" r="4" fill="#6E2C00"/><circle cx="70" cy="45" r="4" fill="#6E2C00"/><circle cx="50" cy="70" r="4" fill="#6E2C00"/><circle cx="45" cy="25" r="4" fill="#6E2C00"/></svg>`, // クッキー
            `<svg viewBox="0 0 100 100"><rect x="30" y="40" width="40" height="20" rx="10" fill="#9B59B6"/><polygon points="10,30 30,40 30,60 10,70" fill="#9B59B6"/><polygon points="90,30 70,40 70,60 90,70" fill="#9B59B6"/></svg>` // キャンディ
        ]
    },
    
    // Audio Context (効果音生成用)
    audioCtx: null,
    
    init() {
        this.loadSettings();
        document.getElementById('menu-characters').innerHTML = `<div class="character">${this.svg.dog}</div><div class="character">${this.svg.cat}</div>`;
        this.updateSettingsUI();
        // updateSettingsUI is defined below, so this works fine
    },

    loadSettings() {
        const saved = localStorage.getItem('mathAppConfigs');
        if(saved) this.settings = JSON.parse(saved);
        this.state.maxCombo = parseInt(localStorage.getItem('mathAppHighScore') || 0);
        document.getElementById('high-score').textContent = `${this.state.maxCombo} かい`;
    },

    saveSettings() {
        localStorage.setItem('mathAppConfigs', JSON.stringify(this.settings));
    },

    goLevel() {
        document.querySelectorAll('[data-lv]').forEach(b =>
            b.classList.toggle('active', parseInt(b.dataset.lv) === this.settings.level));
        this.switchView('view-level');
    },

    selectLevel(n) {
        this.settings.level = n;
        document.querySelectorAll('[data-lv]').forEach(b =>
            b.classList.toggle('active', parseInt(b.dataset.lv) === n));
    },

    goCount() {
        document.querySelectorAll('[data-cnt]').forEach(b =>
            b.classList.toggle('active', parseInt(b.dataset.cnt) === this.settings.count));
        this.switchView('view-count');
    },

    selectCount(n) {
        this.settings.count = n;
        document.querySelectorAll('[data-cnt]').forEach(b =>
            b.classList.toggle('active', parseInt(b.dataset.cnt) === n));
    },

    goNext() {
        document.getElementById('nextBtn').style.display = 'none';
        this.nextQuestion();
    },

    switchView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(viewId).classList.add('active');
    },

    toggleSound() {
        this.settings.sound = !this.settings.sound;
        document.getElementById('btn-sound').textContent = this.settings.sound ? "ON" : "OFF";
        this.saveSettings();
    },

    playSound(type) {
        if (!this.settings.sound) return;
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        
        if (type === 'correct') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(880, this.audioCtx.currentTime);
            gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
            osc.start(); osc.stop(this.audioCtx.currentTime + 0.5);
        } else if (type === 'wrong') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(200, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
            osc.start(); osc.stop(this.audioCtx.currentTime + 0.3);
        }
    },

    speak(text) {
        if (!this.settings.sound || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'ja-JP'; msg.rate = 0.9; msg.pitch = 1.2;
        const v = typeof SpeechUtil !== 'undefined' ? SpeechUtil.getVoice() : null;
        if (v) msg.voice = v;
        window.speechSynthesis.speak(msg);
    },

    startGame() {
        this.state.currentQuestion = 0;
        this.state.combo = 0;
        this.state.roundCorrect = 0;
        this.state.roundResults = [];
        this.saveSettings();
        document.getElementById('character-reaction').innerHTML = `<div class="character" id="game-char">${this.svg.dog}</div>`;
        document.getElementById('nextBtn').style.display = 'none';
        this.switchView('view-game');
        this.nextQuestion();
    },

    quitGame() {
        this.switchView('view-menu');
    },

    nextQuestion() {
        if (this.state.currentQuestion >= this.settings.count) {
            this.showResult();
            return;
        }
        this.state.currentQuestion++;
        document.getElementById('question-counter').textContent = `${this.state.currentQuestion} / ${this.settings.count}`;
        
        // 問題生成ロジック
        let maxNum = this.settings.level === 1 ? 5 : (this.settings.level === 2 ? 10 : 20);
        let isAddition = Math.random() > 0.5;
        let num1, num2, ans;

        if (isAddition) {
            ans = Math.floor(Math.random() * maxNum) + 1;
            num1 = Math.floor(Math.random() * ans);
            num2 = ans - num1;
        } else {
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * num1);
            ans = num1 - num2;
        }
        
        this.state.correctAnswer = ans;
        const operatorStr = isAddition ? "+" : "-";
        const eqText = `${num1} ${operatorStr} ${num2}`;
        this.state.currentEquation = eqText;
        document.getElementById('equation-text').textContent = `${eqText} = ?`;
        
        // 音声読み上げ用フォーマット
        const readOperator = isAddition ? "たす" : "ひく";
        this.speak(`${num1} ${readOperator} ${num2} は？`);

        // おやつの描画
        const snackType = this.svg.snacks[Math.floor(Math.random() * this.svg.snacks.length)];
        let snacksHTML = '';
        const displayCount = isAddition ? ans : num1; // 足し算は答えの数、引き算は元の数だけおやつを表示
        for(let i=0; i<displayCount; i++) {
            snacksHTML += `<div class="snack-icon">${snackType}</div>`;
        }
        document.getElementById('snacks-container').innerHTML = snacksHTML;

        // 選択肢の生成 (正解 + ダミー2つ)
        let choices = new Set([ans]);
        while(choices.size < 3) {
            let dummy = ans + Math.floor(Math.random() * 5) - 2;
            if (dummy >= 0 && dummy <= maxNum && dummy !== ans) choices.add(dummy);
        }
        let choicesArr = Array.from(choices).sort(() => Math.random() - 0.5);
        
        let choicesHTML = '';
        choicesArr.forEach(c => {
            choicesHTML += `<button class="btn btn-choice" onclick="app.checkAnswer(${c})">${c}</button>`;
        });
        document.getElementById('choices-container').innerHTML = choicesHTML;
    },

    checkAnswer(selected) {
        // ボタン無効化
        document.querySelectorAll('.btn-choice').forEach(b => b.disabled = true);
        const charEl = document.getElementById('game-char');
        const isCorrect = selected === this.state.correctAnswer;
        this.state.roundResults.push({ correct: isCorrect, equation: this.state.currentEquation, answer: this.state.correctAnswer });
        if (isCorrect) {
            this.playSound('correct');
            this.speak("せいかい！すごいね！");
            charEl.classList.add('jump');
            this.fireConfetti();
            this.state.roundCorrect++;
            this.state.combo++;
            if(this.state.combo > this.state.maxCombo) {
                this.state.maxCombo = this.state.combo;
                localStorage.setItem('mathAppHighScore', this.state.maxCombo);
                document.getElementById('high-score').textContent = `${this.state.maxCombo} かい`;
            }
            setTimeout(() => charEl.classList.remove('jump'), 1000);
        } else {
            this.playSound('wrong');
            this.speak("おしい！もういっかい！");
            this.state.combo = 0;
            charEl.innerHTML = this.svg.cat;
            setTimeout(() => { charEl.innerHTML = this.svg.dog; }, 1000);
        }
        setTimeout(() => { document.getElementById('nextBtn').style.display = 'block'; }, 600);
    },

    showResult() {
        const correct = this.state.roundCorrect;
        const total = this.settings.count;
        const pct = correct / total;
        let title = pct === 1 ? '💯 かんぺき！！！' : pct >= 0.8 ? '✨ すごい！！' : pct >= 0.5 ? '👍 よくできました！' : '😊 れんしゅうしよう！';
        document.getElementById('result-title').textContent = title;
        document.getElementById('result-correct').textContent = correct;
        document.getElementById('result-total').textContent = total;

        // 星表示
        const stars = Math.round(pct * 3);
        document.getElementById('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

        // キャラ表示
        document.getElementById('result-neko-char').innerHTML = pct >= 0.5
            ? `<div class="character" style="width:120px;height:120px;">${this.svg.dog}</div>`
            : `<div class="character" style="width:120px;height:120px;">${this.svg.cat}</div>`;

        // 結果バッジ（式と答えを表示）
        const badges = document.getElementById('result-badges');
        badges.innerHTML = this.state.roundResults.map(r =>
            `<span class="result-badge ${r.correct ? 'badge-ok' : 'badge-ng'}">
                <span class="badge-mark">${r.correct ? '○' : '✗'}</span>
                <span class="badge-eq">${r.equation} = ${r.answer}</span>
            </span>`
        ).join('');

        this.speak(title + (pct >= 0.8 ? 'おめでとう！' : 'またれんしゅうしてね！'));
        if (pct >= 0.8) this.fireResultConfetti();
        this.switchView('view-result');
    },

    fireResultConfetti() {
        const canvas = document.getElementById('result-confetti');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        let particles = [];
        for(let i = 0; i < 120; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 4 + Math.random() * 8;
            particles.push({
                x: canvas.width / 2, y: canvas.height / 2,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 5,
                r: Math.random() * 6 + 3, dy: 0.3,
                color: ['#FF6B6B','#4ECDC4','#FFE66D','#9B59B6','#FF8C42','#5B8DEF'][Math.floor(Math.random()*6)],
                alpha: 1, shape: Math.random() < 0.5 ? 'rect' : 'circle'
            });
        }
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.vy += p.dy; p.vx *= 0.99; p.alpha -= 0.015;
                if (p.alpha > 0) {
                    active = true;
                    ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
                    ctx.translate(p.x, p.y);
                    if (p.shape === 'rect') ctx.fillRect(-p.r, -p.r/2, p.r*2, p.r);
                    else { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI*2); ctx.fill(); }
                    ctx.restore();
                }
            });
            if (active) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        animate();
    },

    updateSettingsUI() {
        document.getElementById('btn-sound').textContent = this.settings.sound ? 'ON' : 'OFF';
    },

    // 紙吹雪エフェクト (Canvas API)
    fireConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        let particles = [];
        for(let i=0; i<50; i++) {
            particles.push({
                x: canvas.width / 2, y: canvas.height / 2,
                r: Math.random() * 6 + 4,
                dx: Math.random() * 10 - 5, dy: Math.random() * -10 - 5,
                color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#9B59B6'][Math.floor(Math.random()*4)]
            });
        }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            particles.forEach(p => {
                p.x += p.dx; p.y += p.dy; p.dy += 0.5; // 重力
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
                ctx.fillStyle = p.color; ctx.fill();
                if (p.y < canvas.height) active = true;
            });
            if (active) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animate();
    }
};

window.onload = () => app.init();