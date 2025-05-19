const TimeAnchor = {
    FIRST_KNOW: new Date(2022, 5, 13),
    GRADUATION: new Date(2030, 6, 1)
};

const SpecialDays = [
    { date: new Date(2008, 6, 26),  desc: "生日快乐！！❤️", isBirthday: true },
    { date: new Date(2007, 10, 20),  desc: "快祝我生日快乐（（什么", isBirthday: true },
    { date: new Date(0, 1, 14),  desc: "情人节快乐～❤️", isBirthday: true },
    { date: new Date(2022, 5, 13),  desc: "故事开始的第一页" },
    { date: new Date(2023, 0, 10),  desc: "初雪落下的第一次触碰" },
    { date: new Date(2023, 3, 7),   desc: "凌晨的温柔陪伴" },
    { date: new Date(2023, 6, 15),  desc: "第一个永恒的印记" },
    { date: new Date(2024, 1, 1),  desc: "在你的城市陪你" }
];

class Firework {
    static create(x, y) {
        const colors = ['var(--neon-blue)', 'var(--neon-pink)', '#fff'];
        const particleCount = 16;

        for(let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 50 + Math.random() * 80;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.animationDelay = `${Math.random() * 0.2}s`;

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
}

class StarryBackground {
    constructor() {
        this.maxStars = 50;
        this.container = document.body;
        this.createStars();
        this.startStarCycle();
    }

    createStar() {
        const star = document.createElement('div');
        star.className = 'star';
        
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        
        const duration = 2 + Math.random() * 3;
        star.style.setProperty('--duration', `${duration}s`);
        
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        star.addEventListener('animationend', () => {
            star.remove();
            this.createStar();
        });
        
        this.container.appendChild(star);
    }

    createStars() {
        for (let i = 0; i < this.maxStars; i++) {
            this.createStar();
        }
    }

    startStarCycle() {
        setInterval(() => {
            const currentStars = document.querySelectorAll('.star').length;
            if (currentStars < this.maxStars) {
                for (let i = 0; i < this.maxStars - currentStars; i++) {
                    this.createStar();
                }
            }
        }, 1000);
    }
}

class LoveChronicle {
    constructor() {
        this.now = new Date();
        this.content = document.getElementById('content');
        this.mainHeader = document.getElementById('mainHeader');
        this.totalDays = Math.ceil((TimeAnchor.GRADUATION - TimeAnchor.FIRST_KNOW) / 86400000);
        this.passedDays = Math.ceil((this.now - TimeAnchor.FIRST_KNOW) / 86400000);
        this.progress = Math.min(100, (this.passedDays / this.totalDays * 100)).toFixed(1);
        this.todaySpecial = this.getTodaySpecial();
        this.lastMemories = new Set();
        this.lastDate = this.now.getDate();
        this.hasAnimatedProgress = false;
        this.animatedProgress = 0;

        document.addEventListener('click', this.handleClick.bind(this));
        
        this.startTimers();
    }

    startTimers() {
        setInterval(() => {
            this.updateTime();
        }, 1000);

        setInterval(() => {
            this.updateMemories();
        }, 5000);

        setInterval(() => {
            const currentDate = new Date().getDate();
            if (currentDate !== this.lastDate) {
                this.lastDate = currentDate;
                this.todaySpecial = this.getTodaySpecial();
                this.lastMemories.clear();
                this.updateAll();
            }
        }, 1000);
    }

    updateTime() {
        this.now = new Date();
        this.passedDays = Math.ceil((this.now - TimeAnchor.FIRST_KNOW) / 86400000);
        this.progress = Math.min(100, (this.passedDays / this.totalDays * 100)).toFixed(1);
        
        const timeSection = this.content.querySelector('.content-section:first-child');
        if (timeSection) {
            const titleElem = timeSection.querySelector('div:first-child');
            const timeContent = document.createElement('div');
            timeContent.innerHTML = `
                <div>📆 此刻定格 ${this.formatDate(this.now)}</div>
                <div>❤️ 在一起 ${this.passedDays} 个昼夜</div>
            `;
            
            timeSection.innerHTML = '';
            timeSection.appendChild(titleElem);
            timeSection.appendChild(timeContent);
        }

        const futureSection = this.content.querySelector('.content-section:last-child');
        if (futureSection) {
            const titleElem = futureSection.querySelector('div:first-child');
            
            const futureContent = document.createElement('div');
            futureContent.innerHTML = `<div>🏡 在一起的计划...</div>`;
            
            const progressBar = document.createElement('div');
            progressBar.style.marginTop = '0.8rem';
            
            const barContainer = document.createElement('div');
            barContainer.className = 'progress-bar';
            const barFill = document.createElement('div');
            barFill.className = 'progress-fill';
            barContainer.appendChild(barFill);
            
            const textContainer = document.createElement('div');
            textContainer.style.marginTop = '0.4rem';
            
            progressBar.appendChild(barContainer);
            progressBar.appendChild(textContainer);
            
            this.animateProgress(container, barFill, textContainer);
            
            futureSection.innerHTML = '';
            futureSection.appendChild(titleElem);
            futureSection.appendChild(futureContent);
            futureSection.appendChild(progressBar);
        }
    }

    updateMemories() {
        const memorySection = this.content.querySelector('.content-section:nth-child(2)');
        if (memorySection) {
            const titleElem = memorySection.querySelector('div:first-child');
            
            memorySection.innerHTML = '';
            memorySection.appendChild(titleElem);
            
            if (this.todaySpecial) {
                const elem = document.createElement('div');
                elem.className = 'memory-highlight';
                if (this.todaySpecial.isBirthday) {
                    elem.innerHTML = `<span>🎉 ${this.todaySpecial.desc}</span>`;
                } else {
                    const daysDiff = Math.ceil((this.now - this.todaySpecial.date) / 86400000);
                    elem.innerHTML = `<span>🎉 ${daysDiff} 天前 ${this.todaySpecial.desc} [今天]</span>`;
                }
                memorySection.appendChild(elem);
            }

            const memories = this.selectMemories();
            memories.forEach(mem => {
                const daysDiff = Math.ceil((this.now - mem.date) / 86400000);
                const text = `⌛ ${daysDiff} 天前 ${mem.desc}`;
                const elem = document.createElement('div');
                elem.textContent = text;
                memorySection.appendChild(elem);
            });
        }
    }

    updateAll() {
        this.updateTime();
        this.updateMemories();
    }

    selectMemories() {
        const availableMemories = SpecialDays
            .filter(d => !d.isBirthday || this.isBirthdayToday(d))
            .filter(d => d !== this.todaySpecial);

        const newMemories = new Set();
        while (newMemories.size < 2 && availableMemories.length > newMemories.size) {
            const memory = availableMemories[Math.floor(Math.random() * availableMemories.length)];
            if (!this.lastMemories.has(memory) && !newMemories.has(memory)) {
                newMemories.add(memory);
            }
        }

        this.lastMemories = newMemories;
        return Array.from(newMemories);
    }

    formatDate(date) {
        return date.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        }).replace(/\//g, '-');
    }

    handleClick(e) {
        Firework.create(e.clientX, e.clientY);
    }

    getTodaySpecial() {
        const currentMonth = this.now.getMonth();
        const currentDate = this.now.getDate();
        return SpecialDays.find(d => 
            d.date.getMonth() === currentMonth &&
            d.date.getDate() === currentDate &&
            (d.isBirthday ? (d.date.getDate() === currentDate) : true)
        );
    }

    isBirthdayToday(memory) {
        return memory.isBirthday && 
               this.now.getMonth() === memory.date.getMonth() &&
               this.now.getDate() === memory.date.getDate();
    }

    init() {
        this.createMainHeader();
        this.createSection('时光刻度', this.createTimeContent());
        this.createSection('记忆标本', this.createMemoryContent());
        this.createSection('未来之书', this.createFutureContent());
        this.checkMilestone();
        this.checkFor520Special();
    }

    createMainHeader() {
        const title = "📜 时光情书记录仪";
        const elem = document.createElement('h1');
        elem.style.fontSize = '1.8rem';
        elem.style.background = 'linear-gradient(45deg, var(--neon-blue), var(--neon-pink))';
        elem.style.webkitBackgroundClip = 'text';
        elem.style.webkitTextFillColor = 'transparent';
        elem.style.letterSpacing = '-0.03em';
        elem.style.filter = 'drop-shadow(0 0 12px var(--neon-blue))';
        elem.textContent = title;
        this.mainHeader.appendChild(elem);
    }

    createSection(title, contentFn) {
        const section = document.createElement('div');
        section.className = 'content-section';
        
        const titleElem = document.createElement('div');
        titleElem.style.color = 'var(--neon-blue)';
        titleElem.innerHTML = `📌 ${title}`;
        section.appendChild(titleElem);
        
        contentFn(section);
        this.content.appendChild(section);
    }

    createTimeContent() {
        return (container) => {
            const timeContent = document.createElement('div');
            timeContent.innerHTML = `
                <div>📆 此刻定格 ${this.formatDate(this.now)}</div>
                <div>❤️ 在一起 ${this.passedDays} 个昼夜</div>
            `;
            container.appendChild(timeContent);
        };
    }

    createMemoryContent() {
        return (container) => {
            if(this.todaySpecial) {
                const elem = document.createElement('div');
                elem.className = 'memory-highlight';
                if (this.todaySpecial.isBirthday) {
                    elem.innerHTML = `<span>🎉 ${this.todaySpecial.desc}</span>`;
                } else {
                    const daysDiff = Math.ceil((this.now - this.todaySpecial.date) / 86400000);
                    elem.innerHTML = `<span>🎉 ${daysDiff} 天前 ${this.todaySpecial.desc} [今天]</span>`;
                }
                container.appendChild(elem);
            }

            const memories = this.selectMemories();
            memories.forEach(mem => {
                const daysDiff = Math.ceil((this.now - mem.date) / 86400000);
                const text = `⌛ ${daysDiff} 天前 ${mem.desc}`;
                const elem = document.createElement('div');
                elem.textContent = text;
                container.appendChild(elem);
            });
        };
    }

    createFutureContent() {
        return (container) => {
            const futureContent = document.createElement('div');
            futureContent.innerHTML = `<div>🏡 在一起的计划...</div>`;
            
            const progressBar = document.createElement('div');
            progressBar.style.marginTop = '0.8rem';
            
            const barContainer = document.createElement('div');
            barContainer.className = 'progress-bar';
            const barFill = document.createElement('div');
            barFill.className = 'progress-fill';
            barContainer.appendChild(barFill);
            
            const textContainer = document.createElement('div');
            textContainer.style.marginTop = '0.4rem';
            
            progressBar.appendChild(barContainer);
            progressBar.appendChild(textContainer);
            
            this.animateProgress(container, barFill, textContainer);
            
            futureContent.appendChild(progressBar);
            container.appendChild(futureContent);
        };
    }

    animateProgress(container, progressFill, textContainer) {
        if (!this.hasAnimatedProgress) {
            progressFill.style.width = '0%';
            this.animatedProgress = 0;
            textContainer.textContent = `旅程进度 0%`;

            const targetProgress = parseFloat(this.progress);
            const duration = 250;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                this.animatedProgress = progress * targetProgress;
                
                const currentProgress = Math.round(this.animatedProgress * 10) / 10;
                progressFill.style.width = `${currentProgress}%`;
                textContainer.textContent = `旅程进度 ${currentProgress}%`;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.hasAnimatedProgress = true;
                }
            };

            requestAnimationFrame(animate);
        } else {
            progressFill.style.width = `${this.progress}%`;
            textContainer.textContent = `旅程进度 ${this.progress}%`;
        }
    }

    checkMilestone() {
        if (parseFloat(this.progress) >= 100) {
            const createSparkles = () => {
                const bar = document.querySelector('.progress-bar');
                for(let i=0; i<8; i++) {
                    const fw = document.createElement('div');
                    fw.className = 'firework';
                    fw.style.left = Math.random()*100 + '%';
                    fw.style.top = Math.random()*100 + '%';
                    bar.appendChild(fw);
                }
                setTimeout(() => bar.querySelectorAll('.firework').forEach(e => e.remove()), 800);
            };
            createSparkles();
            setInterval(createSparkles, 1200);
        }
    }

    checkFor520Special() {
        const today = this.now;
        if (today.getMonth() === 4 && today.getDate() === 20) {
            const currentYear = today.getFullYear();
            if (currentYear >= 2023) {
                const count = currentYear - 2023 + 1;
                this.show520HeartEffect(count);
            }
        }
    }

    show520HeartEffect(count) {
        const overlay = document.createElement('div');
        overlay.id = 'loveDayOverlay';

        const messageEl = document.createElement('p');
        messageEl.textContent = `💖 陪你的第 ${count} 个 520～ 💖`;
        overlay.appendChild(messageEl);

        const hintEl = document.createElement('div');
        hintEl.className = 'close-hint';
        hintEl.textContent = '点击任意处关闭';
        overlay.appendChild(hintEl);

        document.body.appendChild(overlay);

        this.launchHeartParticles(overlay);

        overlay.addEventListener('animationend', function handleFadeInEnd(event) {
            if (event.animationName === 'fadeInOverlay') {
                overlay.addEventListener('click', function handleCloseClick() {
                    overlay.classList.add('closing');
                    overlay.style.pointerEvents = 'none';
                    
                    overlay.addEventListener('animationend', function handleFadeOutEnd(closeEvent) {
                        if (closeEvent.animationName === 'fadeOutSlideDownOverlay') {
                            if (overlay.parentNode) {
                                overlay.parentNode.removeChild(overlay);
                            }
                        }
                    }, { once: true });
                }, { once: true });
            }
        }, { once: true });
    }

    launchHeartParticles(overlayElement) {
        const heartColors = ['var(--neon-pink)', '#ff89ab', '#ffb3c6', '#fff1f2', 'white'];
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const particleCount = 70;
        const heartScale = 7;

        for (let i = 0; i < particleCount; i++) {
            const t = (Math.PI * 2 * i) / particleCount;

            const heartX = heartScale * (16 * Math.pow(Math.sin(t), 3));
            const heartY = -heartScale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

            const particle = document.createElement('div');
            particle.className = 'heart-particle';
            
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;
            particle.style.background = heartColors[Math.floor(Math.random() * heartColors.length)];
            
            particle.style.setProperty('--heart-tx', `${heartX}px`);
            particle.style.setProperty('--heart-ty', `${heartY - (heartScale * 4)}px`); 

            particle.style.animationDelay = `${i * 15}ms`;

            overlayElement.appendChild(particle);

            const totalDuration = (i * 15) + 1200 + 300;
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, totalDuration);
        }
    }
}

window.addEventListener('load', () => {
    new StarryBackground();
    new LoveChronicle().init();
});
