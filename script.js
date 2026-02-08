const WA_NUMBER = "6281225980437";

// 1. BOOT SEQUENCE
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('boot-bar').style.width = "100%", 100);
    setTimeout(() => {
        document.getElementById('start-btn').classList.remove('hidden');
        getVisitorLocation();
    }, 2000);

    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('bootSound').play().catch(e=>{});
        const screen = document.getElementById('boot-screen');
        screen.style.transition = "opacity 0.8s";
        screen.style.opacity = "0";
        setTimeout(() => {
            screen.remove();
            initWarp();
            initMatrixRain();
            initAudio();
            initSalesTicker();
            initWAWidget();
        }, 800);
    });
});

// 2. CANVAS VISUALS (WARP + MATRIX)
function initWarp() {
    const canvas = document.getElementById('warp-canvas'); const ctx = canvas.getContext('2d');
    let w,h; function resize(){w=canvas.width=window.innerWidth;h=canvas.height=window.innerHeight;} window.addEventListener('resize', resize); resize();
    const stars = []; const count = 500; const speed = 20;
    for(let i=0; i<count; i++) stars.push({x:Math.random()*w-w/2, y:Math.random()*h-h/2, z:Math.random()*w});
    function animate() {
        ctx.fillStyle = "rgba(2, 2, 2, 0.5)"; ctx.fillRect(0, 0, w, h); ctx.fillStyle = "#06b6d4";
        const cx=w/2; const cy=h/2;
        stars.forEach(s => {
            s.z -= speed; if(s.z<=0) { s.z=w; s.x=Math.random()*w-w/2; s.y=Math.random()*h-h/2; }
            const k = 128.0/s.z; const px = s.x*k+cx; const py = s.y*k+cy;
            if(px>=0 && px<=w && py>=0 && py<=h) { const size=(1-s.z/w)*2; ctx.beginPath(); ctx.arc(px,py,size,0,Math.PI*2); ctx.fill(); }
        });
        requestAnimationFrame(animate);
    }
    animate();
}
function initMatrixRain() {
    const c=document.getElementById('matrix-canvas'); const ctx=c.getContext('2d');
    c.width=window.innerWidth; c.height=window.innerHeight;
    const chars='01'; const font=12; const cols=c.width/font; const drops=[]; for(let x=0; x<cols; x++) drops[x]=1;
    setInterval(()=>{
        ctx.fillStyle='rgba(0,0,0,0.05)'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle='#00ff41'; ctx.font=font+'px monospace';
        for(let i=0; i<drops.length; i++) {
            const txt=chars[Math.floor(Math.random()*chars.length)]; ctx.fillText(txt, i*font, drops[i]*font);
            if(drops[i]*font>c.height && Math.random()>0.975) drops[i]=0; drops[i]++;
        }
    }, 50);
}

// 3. CURSOR HUD
const cursor = document.getElementById('cursor-hud');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover-active'); document.getElementById('hoverSound').play().catch(e=>{}); });
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover-active'));
});

// 4. SALES PSYCHOLOGY (TOAST, VIEWER, XP, GEO)
async function getVisitorLocation() {
    try { const r = await fetch('https://ipapi.co/json/'); const d = await r.json(); document.getElementById('geo-banner').classList.remove('hidden'); document.getElementById('user-city').innerText = d.city || "SECURE_NET"; } catch(e){}
}
let xp=0; let level=1; window.addEventListener('scroll', ()=>{ if(xp<100) { xp+=0.5; document.getElementById('xp-bar').style.width=xp+"%"; document.getElementById('user-xp').innerText=Math.floor(xp)+"%"; if(xp>=99){ xp=0; level++; document.getElementById('user-level').innerText=level; document.getElementById('chaChing').play().catch(e=>{}); } } });
function initSalesTicker() {
    const names=["Alex","Budi","Dimas","Sarah"]; const prods=["Bot Telegram","Web Store","Python Script"];
    setInterval(()=>{
        const n=names[Math.floor(Math.random()*names.length)]; const p=prods[Math.floor(Math.random()*prods.length)];
        const t=document.getElementById('social-toast');
        document.getElementById('toast-name').innerText=`User: ${n}`; document.getElementById('toast-product').innerText=p;
        t.classList.remove('-translate-x-[200%]'); setTimeout(()=>t.classList.add('-translate-x-[200%]'),4000);
    }, 12000);
    setInterval(()=>{ document.getElementById('viewer-count').innerText=Math.floor(Math.random()*15)+15; }, 5000);
}
function initWAWidget() {
    setTimeout(()=>{
        const b=document.getElementById('wa-bubble');
        b.classList.remove('opacity-0', 'translate-y-4');
        document.getElementById('notifSound').play().catch(e=>{});
        setTimeout(()=>b.classList.add('opacity-0'), 10000); // Hide after 10s
    }, 5000);
}

// 5. CHECKOUT & UPSELL
let currProd="", currPrice=0, bump=false;
function openCheckout(p, pr) { currProd=p; currPrice=pr; bump=false; renderCheckout(); document.getElementById('checkout-modal').style.display='flex'; }
function renderCheckout() {
    let tot=currPrice; if(bump) tot+=50000;
    document.getElementById('checkout-content').innerHTML = `
        <div class="text-center mb-6"><h3 class="text-cyan-500 font-black text-xl tracking-widest">ORDER FORM</h3></div>
        <div class="space-y-4 mb-6"><div class="p-3 bg-gray-900 border border-cyan-500/30 text-white font-mono text-center text-xs">ITEM: ${currProd}</div><input type="text" id="buyer-name" placeholder="Nama Lengkap" class="w-full bg-black border border-gray-700 text-white p-3 outline-none focus:border-cyan-500 text-center text-sm"><select id="pay-method" class="w-full bg-black border border-gray-700 text-white p-3 outline-none text-center text-sm"><option value="DANA">DANA</option><option value="GOPAY">GOPAY</option><option value="BCA">BCA</option></select></div>
        <div class="bg-yellow-900/20 border border-dashed border-yellow-600 p-3 rounded mb-6 text-left cursor-pointer hover:bg-yellow-900/40 transition" onclick="toggleBump()"><div class="flex items-center gap-3"><div class="w-5 h-5 border border-gold rounded flex items-center justify-center bg-black">${bump?'<div class="w-3 h-3 bg-gold rounded-sm"></div>':''}</div><div><div class="text-white text-xs font-bold">🔥 TAMBAH SOURCE CODE?</div><div class="text-[9px] text-gray-400">File mentahan (Editable). <span class="text-green-400">Rp 50.000</span></div></div></div></div>
        <div class="flex justify-between items-center border-t border-gray-800 pt-4"><div class="text-white font-bold text-xl">Rp ${tot.toLocaleString('id-ID')}</div><button onclick="processFinalOrder()" class="bg-cyan-500 text-black font-black px-6 py-2 hover:bg-white transition uppercase text-xs sfx-click shadow-lg">KIRIM WA</button></div>`;
}
function toggleBump() { bump=!bump; renderCheckout(); }
function processFinalOrder() {
    const name=document.getElementById('buyer-name').value; if(!name) { alert("Isi Nama!"); return; }
    let tot=currPrice; let item=currProd; if(bump) { tot+=50000; item+=" + SOURCE CODE"; }
    document.getElementById('checkout-content').innerHTML = `<div class="text-center py-8"><div class="text-cyan-500 font-bold text-sm mb-4 animate-pulse">GENERATING INVOICE...</div><div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2"><div class="loader-bar"></div></div></div>`;
    setTimeout(()=>{ window.location.href=`https://wa.me/${WA_NUMBER}?text=ORDER%0A👤 ${name}%0A📦 ${item}%0A💰 Rp ${tot.toLocaleString('id-ID')}`; }, 1500);
}
function calcPrice() { 
    const t = parseInt(document.getElementById('projectType').value) + parseInt(document.getElementById('addonType').value); 
    document.getElementById('totalPrice').innerText = t>0 ? "Rp "+t.toLocaleString('id-ID') : "Rp 0"; 
}
function triggerOrder() { 
    const p = document.getElementById('projectType'); 
    if(p.value==0) { alert("Pilih paket!"); return; } 
    openCheckout(p.options[p.selectedIndex].text, parseInt(p.value) + parseInt(document.getElementById('addonType').value)); 
}

// 6. UTILS
const bgMusic=document.getElementById('bgMusic'); bgMusic.volume=0.3; let isPlaying=false;
function initAudio() { } // Wait for user toggle
function toggleMusic() { if(isPlaying){bgMusic.pause();}else{bgMusic.play();} isPlaying=!isPlaying; }
const cliModal=document.getElementById('cli-modal'); const cliOut=document.getElementById('cli-output');
function toggleCLI(){ if(cliModal.classList.contains('hidden')){cliModal.classList.remove('hidden');cliModal.style.display='flex';document.getElementById('cli-input').focus();}else{cliModal.classList.add('hidden');cliModal.style.display='none';} }
document.getElementById('cli-input').addEventListener('keypress', function(e){if(e.key==='Enter'){const v=this.value.trim(); this.value=''; cliOut.innerHTML+=`<div>> ${v}</div>`; if(v==='hack'){cliOut.innerHTML+=`<div class="text-green-500">Access Granted...</div>`;} cliOut.scrollTop=cliOut.scrollHeight;}});
function initSelfDestruct(){ if(confirm("⚠️ SYSTEM PURGE?")){ document.body.classList.add('shake-hard'); document.getElementById('destruct-screen').classList.remove('hidden'); document.getElementById('destruct-screen').style.display='flex'; let c=5; setInterval(()=>{c--;document.getElementById('destruct-timer').innerText=c;if(c<=0)location.reload();},1000); } }
function toggleFaq(el) { const c=el.querySelector('div.max-h-0'); const s=el.querySelector('span'); if(c.style.maxHeight){c.style.maxHeight=null;s.style.transform="rotate(0deg)";}else{c.style.maxHeight=c.scrollHeight+"px";s.style.transform="rotate(180deg)";} }
