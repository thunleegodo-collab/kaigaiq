(function(){
  if(window.__twemojiInit)return;window.__twemojiInit=true;
  var st=document.createElement('style');
  st.textContent='img.twemoji{height:1em;width:1em;margin:0 .05em 0 .1em;vertical-align:-0.1em;display:inline-block}';
  document.head.appendChild(st);
  function run(){if(window.twemoji)twemoji.parse(document.body,{folder:'svg',ext:'.svg',className:'twemoji'})}
  var s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js';
  s.crossOrigin='anonymous';
  s.onload=function(){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run)}else{run()}};
  document.head.appendChild(s);
})();
