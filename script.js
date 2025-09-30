const CONFIG = {
  TWITCH_CHANNEL: "ahriri_zz",
  CLIPS: [
    { title: "Ativaria o sininho?", url: "https://clips.twitch.tv/MistyGentleTroutCoolCat-XiaaDa_T5Frk6nN8" },
    { title: "quem canta?", url: "https://clips.twitch.tv/ResoluteHumbleHummingbirdYouWHY-DAbQHkgyA32ik0_G" },
    { title: "noobinho", url: "https://clips.twitch.tv/ElatedPoorPuppyPicoMause-7-4pOoUkrEGBa2lC" }
  ],
  SCHEDULE: { utcHour: 22, utcMinute: 30, days: ["Seg", "Ter", "Qua", "Qui", "Sex"] }
};

(function initTheme(){
  const saved = localStorage.getItem("ahriri-theme");
  if(saved === "light") document.documentElement.classList.add("light");
  document.getElementById("themeToggle")?.addEventListener("click", toggleTheme);
  document.getElementById("themeToggleFooter")?.addEventListener("click", toggleTheme);
  function toggleTheme(){
    document.documentElement.classList.toggle("light");
    const mode = document.documentElement.classList.contains("light") ? "light":"dark";
    localStorage.setItem("ahriri-theme", mode);
  }
})();

(function mountTwitch(){
  const parent = location.hostname || "localhost";
  const channel = encodeURIComponent(CONFIG.TWITCH_CHANNEL);
  const player = document.getElementById("twitchPlayer");
  const chat = document.getElementById("twitchChat");
  if(player) player.src = `https://player.twitch.tv/?channel=${channel}&parent=${parent}&muted=false`;
  if(chat) chat.src = `https://www.twitch.tv/embed/${channel}/chat?parent=${parent}&darkpopout`;
})();

(function renderClips(){
  const grid = document.getElementById("clipsGrid");
  if(!grid) return;
  CONFIG.CLIPS.forEach(clip => {
    const card = document.createElement("article");
    card.className = "clip-card";
    const frame = document.createElement("iframe");
    frame.className = "frame";
    frame.loading = "lazy";
    frame.allowFullscreen = true;
    frame.src = toEmbedURL(clip.url);
    const meta = document.createElement("div");
    meta.className = "meta";
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = clip.title || "Clip";
    const source = document.createElement("span");
    meta.appendChild(title);
    meta.appendChild(source);
    card.appendChild(frame);
    card.appendChild(meta);
    grid.appendChild(card);
  });
})();

(function renderSchedule(){
  const { utcHour, utcMinute, days } = CONFIG.SCHEDULE;
  const utcTimeEl = document.getElementById("utcTime");
  const localTimeEl = document.getElementById("localTime");
  const daysEl = document.getElementById("scheduleDays");
  if(daysEl) daysEl.textContent = days.join(" • ");
  const now = new Date();
  const utcDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), utcHour, utcMinute, 0));
  const utcFmt = new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",hour12:true,timeZone:"UTC"});
  const localFmt = new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",hour12:false});
  if(utcTimeEl) utcTimeEl.textContent = utcFmt.format(utcDate) + " UTC";
  if(localTimeEl) localTimeEl.textContent = localFmt.format(utcDate) + " (seu horário)";
})();

document.getElementById("year").textContent = new Date().getFullYear();

function toEmbedURL(url){
  try{
    const u = new URL(url);
    const host = u.hostname.replace("www.","");
    if(host.includes("youtube.com")){
      const vid = u.searchParams.get("v");
      if(vid) return `https://www.youtube.com/embed/${vid}`;
      if(u.pathname.startsWith("/embed/")) return url;
    }
    if(host === "youtu.be"){
      const vid = u.pathname.slice(1);
      if(vid) return `https://www.youtube.com/embed/${vid}`;
    }
    if(host.includes("clips.twitch.tv")){
      const clipId = u.pathname.split("/").filter(Boolean)[0];
      if(clipId) return `https://clips.twitch.tv/embed?clip=${clipId}&parent=${location.hostname||'localhost'}&autoplay=false`;
    }
    return url;
  }catch{
    return url;
  }
}

function getHostLabel(url){
  try{ const u = new URL(url); return u.hostname.replace("www.",""); }catch{return "external";}
}

// Contagem regressiva
function startCountdown() {
  const countdown = document.getElementById('countdown');
  const targetDate = new Date(countdown.dataset.date).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if(diff <= 0) {
      countdown.innerHTML = 'Evento ao vivo!';
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((diff % (1000*60)) / 1000);
    countdown.innerHTML = days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
  }
  updateTimer();
  setInterval(updateTimer, 1000);
}
document.addEventListener('DOMContentLoaded', startCountdown);

/*git commit rerun*/
