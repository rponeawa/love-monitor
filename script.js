const TimeAnchor = {
    FIRST_KNOW: new Date(2022, 5, 13),
    GRADUATION: new Date(2027, 5, 1)
};

const SpecialDays = [
    { date: new Date(2008, 6, 26),  desc: "生日快乐❤️！！", isBirthday: true },
    { date: new Date(2022, 5, 13),  desc: "故事开始的第一页" },
    { date: new Date(2023, 0, 10),  desc: "初雪落下的第一次触碰" },
    { date: new Date(2023, 3, 7),   desc: "凌晨的温柔陪伴" },
    { date: new Date(2023, 6, 15),  desc: "第一个永恒的印记" }
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
            futureContent.innerHTML = `<div>🏡 共同生活计划</div>`;
            
            const progressBar = document.createElement('div');
            progressBar.style.marginTop = '0.8rem';
            
            const barContainer = document.createElement('div');
            barContainer.className = 'progress-bar';
            const barFill = document.createElement('div');
            barFill.className = 'progress-fill';
            barFill.style.width = `${this.progress}%`;
            barContainer.appendChild(barFill);
            
            const textContainer = document.createElement('div');
            textContainer.style.marginTop = '0.4rem';
            textContainer.textContent = `旅程进度 ${this.progress}%`;
            
            progressBar.appendChild(barContainer);
            progressBar.appendChild(textContainer);
            
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
            const specialDay = memorySection.querySelector('.memory-highlight');
            
            memorySection.innerHTML = '';
            memorySection.appendChild(titleElem);
            
            if (this.todaySpecial) {
                memorySection.appendChild(specialDay || (() => {
                    const elem = document.createElement('div');
                    elem.className = 'memory-highlight';
                    elem.innerHTML = `<span>🎉 ${this.todaySpecial.desc} [今天]</span>`;
                    return elem;
                })());
            }

            const memories = this.selectMemories();
            memories.forEach(mem => {
                const text = `⌛ ${mem.date.getFullYear()}-${
                    (mem.date.getMonth()+1).toString().padStart(2,'0')}-${
                    mem.date.getDate().toString().padStart(2,'0')} ${
                    mem.desc}`;
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
                elem.innerHTML = `
                    <span>🎉 ${this.todaySpecial.desc} [今天]</span>
                `;
                container.appendChild(elem);
            }

            const memories = this.selectMemories();
            memories.forEach(mem => {
                const text = `⌛ ${mem.date.getFullYear()}-${ 
                    (mem.date.getMonth()+1).toString().padStart(2,'0')}-${
                    mem.date.getDate().toString().padStart(2,'0')} ${
                    mem.desc}`;
                const elem = document.createElement('div');
                elem.textContent = text;
                container.appendChild(elem);
            });
        };
    }

    createFutureContent() {
        return (container) => {
            const futureContent = document.createElement('div');
            futureContent.innerHTML = `<div>🏡 共同生活计划</div>`;
            
            const progressBar = document.createElement('div');
            progressBar.style.marginTop = '0.8rem';
            
            const barContainer = document.createElement('div');
            barContainer.className = 'progress-bar';
            const barFill = document.createElement('div');
            barFill.className = 'progress-fill';
            barFill.style.width = `${this.progress}%`;
            barContainer.appendChild(barFill);
            
            const textContainer = document.createElement('div');
            textContainer.style.marginTop = '0.4rem';
            textContainer.textContent = `旅程进度 ${this.progress}%`;
            
            progressBar.appendChild(barContainer);
            progressBar.appendChild(textContainer);
            futureContent.appendChild(progressBar);
            container.appendChild(futureContent);
        };
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
}

window.addEventListener('load', () => {
    new StarryBackground();
    new LoveChronicle().init();
});