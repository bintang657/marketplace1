const WA_NUMBER = "6281225980437";

// 1. BOOT & MATRIX RAIN
window.addEventListener('load', () => {
    // Boot Animation
    const bar = document.getElementById('boot-bar');
    setTimeout(() => bar.style.width = "100%", 100);
    setTimeout(() => {
        document.getElementById('boot-screen').style.opacity = '0';
        setTimeout(() => document.getElementById('boot-screen').remove(), 500);
        initMatrixRain(); // START MATRIX
    }, 2000);
});

// 2. MATRIX RAIN ENGINE (The Real Deal)
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポvn0123456789';
    const alphabet = katakana.split('');
    const fontSize = 14;
    const columns = canvas.width/fontSize;
    const drops = [];

    for(let x=0; x<columns; x++) drops[x] = 1;

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41'; // Green Matrix
        ctx.font = fontSize + 'px monospace';
        
        for(let i=0; i<drops.length; i++) {
            const text = alphabet[Math.floor(Math.random()*alphabet.length)];
            ctx.fillText(text, i*fontSize, drops[i]*fontSize);
            
            if(drops[i]*fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(draw, 30);
    
    // Resize Handle
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 3. AUDIO SYSTEM
const bgMusic = document.getElementById('bgMusic');
const clickSfx = document.getElementById('clickSound');
const hoverSfx = document.getElementById('hoverSound');
const processSfx = document.getElementById('processSound');
let isMusicPlaying = false;
bgMusic.volume = 0.4; clickSfx.volume = 0.2; hoverSfx.volume = 0.1;

function toggleMusic() {
    const p = document.getElementById('play-icon'); const pa = document.getElementById('pause-icon');
    const bars = document.querySelectorAll('.viz-bar');
    if(isMusicPlaying) { 
        bgMusic.pause(); p.classList.remove('hidden'); pa.classList.add('hidden');
        bars.forEach(b => b.style.animation = 'none'); // Stop Visualizer
    } else { 
        bgMusic.play(); p.classList.add('hidden'); pa.classList.remove('hidden');
        bars.forEach(b => b.style.animation = 'bounce 0.5s infinite ease-in-out'); // Start Visualizer
    }
    isMusicPlaying = !isMusicPlaying;
}
document.querySelectorAll('.sfx-click').forEach(el => el.addEventListener('click', () => clickSfx.play().catch(e=>{})));
document.querySelectorAll('.sfx-hover').forEach(el => el.addEventListener('mouseenter', () => hoverSfx.play().catch(e=>{})));

// 4. CHECKOUT SYSTEM
function openCheckout(prod, price) {
    const modal = document.getElementById('checkout-modal');
    document.getElementById('checkout-content').innerHTML = `
        <div class="flex justify-between items-center mb-6"><h3 class="text-white font-orbitron">SECURE CHECKOUT</h3><button onclick="document.getElementById('checkout-modal').style.display='none'" class="text-gray-500 hover:text-white">×</button></div>
        <div class="space-y-4 mb-6"><div class="p-3 bg-gray-900 border border-neon text-neon font-mono">${prod}</div><input type="text" id="buyer-name" placeholder="ID Telegram / Nama" class="w-full bg-black border border-gray-700 text-white p-3 font-mono outline-none focus:border-neon"><select id="pay-method" class="w-full bg-black border border-gray-700 text-white p-3 font-mono outline-none"><option value="DANA">DANA</option><option value="GOPAY">GOPAY</option></select></div>
        <div class="flex justify-between items-center"><div class="text-white font-mono font-bold text-xl">${price}</div><button onclick="processFinalOrder('${prod}', '${price}')" class="bg-neon text-black font-bold px-6 py-2 hover:bg-white transition sfx-click clip-button">CONFIRM</button></div>`;
    modal.style.display = 'flex';
}

function calcPrice() {
    const b = parseInt(document.getElementById('projectType').value); const a = parseInt(document.getElementById('addonType').value);
    document.getElementById('totalPrice').innerText = (b+a) > 0 ? "Rp " + (b+a).toLocaleString('id-ID') : "Rp 0";
}
function triggerOrder() {
    const p = document.getElementById('projectType'); const prod = p.options[p.selectedIndex].text;
    const total = document.getElementById('totalPrice').innerText;
    if(total === "Rp 0") { alert("Select Protocol First"); return; }
    openCheckout(prod, total);
}

async function processFinalOrder(prod, price) {
    const name = document.getElementById('buyer-name').value;
    if(!name) { alert("ID Required"); return; }
    document.getElementById('checkout-content').innerHTML = `<div class="text-center py-8"><div class="text-neon font-mono text-xs mb-4 animate-pulse">ENCRYPTING TRANSACTION...</div><div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2"><div id="load-bar" class="loader-bar"></div></div></div>`;
    processSfx.play().catch(e=>{});
    setTimeout(() => { window.location.href = `https://wa.me/${WA_NUMBER}?text=ORDER%0A👤 ${name}%0A📦 ${prod}%0A💰 ${price}`; }, 2000);
}

// 5. CLI TERMINAL
const cliModal = document.getElementById('cli-modal');
const cliOutput = document.getElementById('cli-output');
function toggleCLI() { if(cliModal.classList.contains('hidden')) { cliModal.classList.remove('hidden'); cliModal.style.display='flex'; document.getElementById('cli-input').focus(); } else { cliModal.classList.add('hidden'); cliModal.style.display='none'; } }
document.getElementById('cli-input').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') {
        const val = this.value.toLowerCase().trim(); this.value = '';
        cliOutput.innerHTML += `<div>root@sys:~$ ${val}</div>`;
        if(val==='help') cliOutput.innerHTML+=`<div class="text-white">help, price, hack, exit</div>`;
        else if(val==='price') cliOutput.innerHTML+=`<div class="text-neon">WEB: 350k | BOT: 150k</div>`;
        else if(val==='hack') simulateHack();
        else if(val==='exit') toggleCLI();
        else cliOutput.innerHTML+=`<div class="text-red-500">Error: Unknown command</div>`;
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }
});
function simulateHack() { let i=0; const c=["Accessing...","Bypassing...","Done"]; const t=setInterval(()=>{ if(i<c.length){cliOutput.innerHTML+=`<div class="text-green-500">${c[i]}</div>`;i++;}else clearInterval(t); },500); }

// 6. EASTER EGG
let s=['k','i','m','j','o','n','g'], inp=[];
window.addEventListener('keydown', e=>{ inp.push(e.key.toLowerCase()); if(inp.length>s.length) inp.shift(); if(JSON.stringify(inp)===JSON.stringify(s)) document.getElementById('secret-modal').style.display='flex'; });

// 7. COUNTDOWN
let time = 14400; setInterval(() => {
    let h=Math.floor(time/3600), m=Math.floor((time%3600)/60), s=Math.floor(time%60);
    document.getElementById("countdown").innerText = `${h<10?'0'+h:h}:${m<10?'0'+m:m}:${s<10?'0'+s:s}`;
    if(--time < 0) time = 14400;
}, 1000);
