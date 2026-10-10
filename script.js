document.addEventListener('DOMContentLoaded', function(){
    // 轮播逻辑
    const items = document.querySelectorAll('.slider-item');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let idx = 0;

    function renderSlide(){
        items.forEach(el => el.classList.remove('active'));
        items[idx].classList.add('active');
    }
    renderSlide();

    prevBtn.onclick = function(){
        idx = (idx - 1 + items.length) % items.length;
        renderSlide();
    }
    nextBtn.onclick = function(){
        idx = (idx + 1) % items.length;
        renderSlide();
    }

    //自动轮播4秒一张
    setInterval(()=>{
        idx = (idx + 1) % items.length;
        renderSlide();
    },4000)

    // BGM逻辑
    const audio = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    musicBtn.onclick = function(){
        if(audio.paused){
            audio.play();
            musicBtn.innerText = "🔇 暂停BGM";
        }else{
            audio.pause();
            musicBtn.innerText = "🎵 播放专属BGM";
        }
    }

    // ===== 烟花部分：只在文字旁边（页面下半区域）生成，不干扰照片 =====
    const canvas = document.getElementById('fireCanvas');
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    window.addEventListener('resize',()=>{
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    })

    class Particle{
        constructor(x,y,color){
            this.x = x;
            this.y = y;
            this.sx = (Math.random()-0.5)*2;
            this.sy = (Math.random()-0.5)*2;
            this.alpha = 1;
            this.color = color;
        }
        update(){
            this.x += this.sx;
            this.y += this.sy;
            this.alpha -= 0.015;
        }
        draw(){
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x,this.y,2,0,Math.PI*2);
            ctx.fill();
            ctx.restore();
        }
    }
    let particles = [];
    const colors = ['#ffeaa7','#fff','#ffd3a0','#bde6ff','#ffc8dd'];

    function createFire(x,y){
        for(let i=0;i<40;i++){
            particles.push(new Particle(x,y,colors[Math.floor(Math.random()*colors.length)]))
        }
    }

    // 自动烟花：集中在文字卡片附近（下半区域）
    setInterval(()=>{
        const x = w * 0.3 + Math.random() * w * 0.45;
        const y = h * 0.55 + Math.random() * h * 0.35;
        createFire(x, y);
    },1500)

    // 点击触发烟花：只有点击下半文字区域才会生成，点击照片区域不会触发烟花
    document.addEventListener('click', function(e){
        if(e.clientY > h * 0.45){
            createFire(e.clientX, e.clientY);
        }
    })

    function animate(){
        ctx.clearRect(0,0,w,h);
        for(let i = particles.length-1;i>=0;i--){
            const p = particles[i];
            p.update();
            p.draw();
            if(p.alpha <=0) particles.splice(i,1);
        }
        requestAnimationFrame(animate);
    }
    animate();
})
