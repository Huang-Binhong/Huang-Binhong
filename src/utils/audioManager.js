// src/utils/audioManager.js
class AudioManager {
    constructor() {
        this.sounds = {};
        this.currentSound = null;
        this.isMuted = false;
        this.isInitialized = false;
        this.fadeIntervals = new Map();
    }

    init() {
        if (this.isInitialized) {
            return Promise.resolve();
        }
        this.isInitialized = true;
        return Promise.resolve();
    }

    loadSound(name, url) {
        return new Promise((resolve) => {
            try {
                const audio = new Audio();
                audio.loop = true;
                audio.volume = 0;
                audio.preload = 'auto';

                // 添加错误处理
                audio.addEventListener('error', (e) => {
                    console.warn(`音频加载失败: ${name}`, e);
                    resolve(); // 即使失败也resolve，不阻塞其他音频
                });

                audio.addEventListener('canplaythrough', () => {
                    this.sounds[name] = audio;
                    resolve();
                }, { once: true });

                audio.src = url;
                audio.load();

                // 超时保护
                setTimeout(() => {
                    if (!this.sounds[name]) {
                        console.warn(`音频加载超时: ${name}`);
                        resolve();
                    }
                }, 5000);
            } catch (error) {
                console.warn(`加载音效失败: ${name}`, error);
                resolve();
            }
        });
    }

    play(name) {
        if (this.isMuted || !this.sounds[name]) return;

        try {
            const sound = this.sounds[name];

            if (this.currentSound && this.currentSound !== sound) {
                this.fadeOut(this.currentSound);
            }

            this.fadeIn(sound);
            this.currentSound = sound;
        } catch (error) {
            console.warn(`播放失败: ${name}`, error);
        }
    }

    fadeIn(audio) {
        if (!audio) return;

        // 清除之前的淡入效果
        if (this.fadeIntervals.has(audio)) {
            clearInterval(this.fadeIntervals.get(audio));
        }

        audio.volume = 0;
        audio.play().catch(e => console.warn('播放失败', e));

        let vol = 0;
        const interval = setInterval(() => {
            if (vol >= 0.2) {
                clearInterval(interval);
                this.fadeIntervals.delete(audio);
                return;
            }
            vol += 0.01;
            audio.volume = Math.min(vol, 0.2);
        }, 50);

        this.fadeIntervals.set(audio, interval);
    }

    fadeOut(audio) {
        if (!audio) return;

        // 清除之前的淡出效果
        if (this.fadeIntervals.has(audio)) {
            clearInterval(this.fadeIntervals.get(audio));
        }

        const interval = setInterval(() => {
            if (audio.volume <= 0.01) {
                audio.pause();
                audio.currentTime = 0;
                clearInterval(interval);
                this.fadeIntervals.delete(audio);
                return;
            }
            audio.volume = Math.max(audio.volume - 0.01, 0);
        }, 50);

        this.fadeIntervals.set(audio, interval);
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound && !sound.paused) {
                this.fadeOut(sound);
            }
        });
        this.currentSound = null;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopAll();
        }
        return this.isMuted;
    }

    async preloadAll() {
        try {
            await this.init();

            // 使用本地音频文件
            const sounds = [
                { name: 'water', url: `${process.env.PUBLIC_URL}/audio/water.mp3` },
                { name: 'wind', url: `${process.env.PUBLIC_URL}/audio/wind.mp3` },
                { name: 'guqin', url: `${process.env.PUBLIC_URL}/audio/guqin.mp3` }
            ];

            // 并行加载所有音频
            await Promise.all(
                sounds.map(sound => this.loadSound(sound.name, sound.url))
            );

            console.log('音效预加载完成');
        } catch (error) {
            console.warn('音效预加载失败', error);
        }
    }

    // 清理资源
    destroy() {
        this.stopAll();
        this.fadeIntervals.forEach(interval => clearInterval(interval));
        this.fadeIntervals.clear();
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.pause();
                sound.src = '';
            }
        });
        this.sounds = {};
    }
}

// 创建单例
const audioManager = new AudioManager();

export default audioManager;
