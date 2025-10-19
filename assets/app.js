
const CONFIG = { API_URL: "" };

async function fetchLocalData(){ const res = await fetch('data/addresses.json', {cache:'no-store'}); return res.json(); }

async function remoteSearch(address){
  const url = CONFIG.API_URL + '/search?address=' + encodeURIComponent(address);
  try{
    const res = await fetch(url);
    if(!res.ok) throw new Error('API error ' + res.status);
    return await res.json();
  }catch(err){ return { error: String(err) }; }
}

function showStatus(msg, isError=false){
  const s = document.getElementById('status');
  s.textContent = msg;
  s.style.color = isError ? '#b02a37' : '#3a5b66';
}

function renderProperty(prop){
  const container = document.getElementById('resultCard');
  container.innerHTML = '';
  if(!prop){ container.innerHTML = '<p class="small">No property details available.</p>'; return; }
  container.innerHTML = `
    <div class="card">
      <div><span class="key">${prop.address}</span> <span class="small">• ${prop.city}, ${prop.state}</span></div>
      <div style="margin-top:8px;">
        <span class="badge">${prop.zoning || 'Unknown'}</span>
        <span class="small">Buildable Units: <strong>${prop.buildable_units ?? '—'}</strong></span>
      </div>
      <table class="table">
        <tr><td class="key">Owner</td><td class="value">${prop.owner || 'Private'}</td></tr>
        <tr><td class="key">Zoning</td><td class="value">${prop.zoning || '—'}</td></tr>
        <tr><td class="key">Max Height</td><td class="value">${prop.max_height || '—'}</td></tr>
        <tr><td class="key">Setbacks</td><td class="value">${prop.setbacks || '—'}</td></tr>
        <tr><td class="key">Lot Area (sqft)</td><td class="value">${prop.lot_area || '—'}</td></tr>
        <tr><td class="key">Comps (closest)</td><td class="value">${(prop.comps || []).slice(0,3).map(c=>c.address+' ($'+c.price.toLocaleString()+')').join('; ') || '—'}</td></tr>
        <tr><td class="key">Estimated Taxes / yr</td><td class="value">${prop.taxes || '—'}</td></tr>
        <tr><td class="key">Notes</td><td class="value">${prop.notes || ''}</td></tr>
      </table>
    </div>`;
}

async function searchAddress(address){
  document.getElementById('results').classList.add('hidden');
  showStatus('Searching...');
  if(CONFIG.API_URL){
    const r = await remoteSearch(address);
    if(r?.error){ showStatus('API error: ' + r.error + ' — showing demo fallback.', true); }
    if(r && r.found){ showStatus('Found via API.'); renderProperty(r.property); document.getElementById('results').classList.remove('hidden'); return; }
  }
  const local = await fetchLocalData();
  const a = address.toLowerCase();
  let found = local.find(p => p.address.toLowerCase() === a);
  if(!found) found = local.find(p => p.address.toLowerCase().includes(a));
  if(found){ showStatus('Found in local demo dataset.'); renderProperty(found); document.getElementById('results').classList.remove('hidden'); }
  else { showStatus('No results. Set CONFIG.API_URL in assets/app.js for live data.', true); }
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('addressInput');
  const btn = document.getElementById('searchBtn');
  btn.addEventListener('click', () => {
    const q = input.value.trim();
    if(!q){ showStatus('Please enter an address', true); return; }
    searchAddress(q);
  });
  input.addEventListener('keydown', (e) => { if(e.key === 'Enter'){ btn.click(); }});
  showStatus('Demo ready. Try one of the sample addresses above.');
});
