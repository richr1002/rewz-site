function toggleNav(){
  const el=document.getElementById('nav-links');
  el.style.display = el.style.display==='block' ? 'none' : 'block';
}
function submitDemo(e){
  e.preventDefault();
  alert('Thanks! Our enterprise team will reach out shortly.');
}