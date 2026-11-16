/* Pacman-only ROM gallery with swipeable full-screen screenshot viewer */
(() => {
  const REPO = "cdn-pacman/port-pacman.github.io";
  const CATALOG = "data/roms.json";
  const dialog = document.getElementById("rom-dialog");
  const list = document.getElementById("rom-list");
  const title = document.getElementById("rom-dialog-title");
  const subtitle = document.getElementById("rom-dialog-device");
  if (!dialog || !list || !title || !subtitle) return;

  const make = (tag, cls, text) => { const el=document.createElement(tag); if(cls)el.className=cls; if(text!==undefined)el.textContent=text; return el; };
  const safeUrl = (value) => { try { const u=new URL(value,document.baseURI); return ["https:","http:"].includes(u.protocol)?u.href:""; } catch { return ""; } };
  const showMessage = (text, cls="catalog-empty") => list.replaceChildren(make("p",cls,text));

  const viewer=document.createElement("dialog");
  viewer.className="screenshot-viewer";
  viewer.setAttribute("aria-label","ROM screenshot viewer");
  viewer.innerHTML='<button class="viewer-close" type="button" aria-label="Close screenshot">×</button><button class="viewer-prev" type="button" aria-label="Previous screenshot">‹</button><img class="viewer-image" alt="ROM screenshot"><button class="viewer-next" type="button" aria-label="Next screenshot">›</button><div class="viewer-count" aria-live="polite"></div><div class="viewer-swipe-hint">Swipe or use arrows to browse</div>';
  document.body.append(viewer);
  const viewerImage=viewer.querySelector(".viewer-image"), viewerCount=viewer.querySelector(".viewer-count");
  let galleryUrls=[],galleryIndex=0,galleryName="ROM";
  function showImage(index){if(!galleryUrls.length)return;galleryIndex=(index+galleryUrls.length)%galleryUrls.length;viewerImage.src=galleryUrls[galleryIndex];viewerImage.alt=`${galleryName} screenshot ${galleryIndex+1}`;viewerCount.textContent=`${galleryName} · ${galleryIndex+1} / ${galleryUrls.length}`;}
  function openViewer(urls,index,name){galleryUrls=urls;galleryName=name||"ROM";showImage(index);if(!viewer.open)viewer.showModal();}
  viewer.querySelector(".viewer-close").addEventListener("click",()=>viewer.close());
  viewer.querySelector(".viewer-prev").addEventListener("click",()=>showImage(galleryIndex-1));
  viewer.querySelector(".viewer-next").addEventListener("click",()=>showImage(galleryIndex+1));
  viewer.addEventListener("click",event=>{if(event.target===viewer)viewer.close();});
  let touchStartX=0,touchStartY=0;
  viewer.addEventListener("touchstart",event=>{if(event.changedTouches.length){touchStartX=event.changedTouches[0].clientX;touchStartY=event.changedTouches[0].clientY;}},{passive:true});
  viewer.addEventListener("touchend",event=>{if(!event.changedTouches.length)return;const dx=event.changedTouches[0].clientX-touchStartX,dy=event.changedTouches[0].clientY-touchStartY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)showImage(galleryIndex+(dx<0?1:-1));},{passive:true});
  document.addEventListener("keydown",event=>{if(!viewer.open)return;if(event.key==="ArrowLeft")showImage(galleryIndex-1);if(event.key==="ArrowRight")showImage(galleryIndex+1);});

  async function screenshotsFor(rom){
    const folder=String(rom.screenshotFolder||"").replace(/^\/+|\/+$/g,"");
    if(!folder)return Array.isArray(rom.screenshots)?rom.screenshots.map(safeUrl).filter(Boolean):[];
    try{const path=folder.split("/").map(encodeURIComponent).join("/");const response=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=main`,{headers:{Accept:"application/vnd.github+json"},cache:"no-store"});if(!response.ok)throw new Error("Folder listing unavailable");const files=await response.json();const found=Array.isArray(files)?files.filter(file=>file.type==="file"&&/\.(png|jpe?g|webp|gif|avif)$/i.test(file.name)).sort((a,b)=>a.name.localeCompare(b.name)).map(file=>safeUrl(file.download_url)).filter(Boolean):[];if(found.length)return found;}catch{/* use explicitly listed screenshot paths */}
    return Array.isArray(rom.screenshots)?rom.screenshots.map(path=>safeUrl(/^https?:\/\//i.test(path)?path:`${folder}/${path}`)).filter(Boolean):[];
  }

  async function renderRom(rom){
    const card=make("article","catalog-rom-card"),details=make("div","catalog-rom-details");
    details.append(make("h3","",rom.name||"Custom ROM"));
    const tags=make("div","catalog-tags");[rom.version,rom.android].filter(Boolean).forEach(value=>tags.append(make("span","catalog-tag",value)));if(tags.childElementCount)details.append(tags);
    const specs=make("dl","catalog-specs");[["OS",rom.os],["Device",rom.device],["Build",rom.build],["Security patch",rom.securityPatch]].filter(([,v])=>v).forEach(([k,v])=>specs.append(make("dt","",k),make("dd","",v)));if(specs.childElementCount)details.append(specs);
    if(rom.details)details.append(make("p","",rom.details));card.append(details);
    const images=await screenshotsFor(rom);
    if(images.length){
      const gallery=make("div","catalog-screenshot-gallery");
      const viewButton=make("button","view-screenshots-button",`View screenshots · ${images.length}`);viewButton.type="button";viewButton.addEventListener("click",()=>openViewer(images,0,rom.name||"ROM"));gallery.append(viewButton);
      const thumbs=make("div","catalog-screenshot-grid");
      images.forEach((url,i)=>{const button=make("button","screenshot-thumb");button.type="button";button.setAttribute("aria-label",`View screenshot ${i+1} of ${rom.name||"ROM"}`);const img=make("img","catalog-screenshot");img.src=url;img.alt=`${rom.name||"ROM"} screenshot ${i+1}`;img.loading="lazy";img.onerror=()=>button.remove();button.append(img);button.addEventListener("click",()=>openViewer(images,i,rom.name||"ROM"));thumbs.append(button);});gallery.append(thumbs);card.append(gallery);
    }else card.append(make("p","screenshot-hint",`No screenshots yet. Upload PNG/JPG/WebP images to ${rom.screenshotFolder||"this ROM's screenshot folder"}.`));
    const downloads=make("div","catalog-downloads");(Array.isArray(rom.downloads)?rom.downloads:[]).forEach(asset=>{const href=safeUrl(asset.url);if(!href)return;const link=make("a","catalog-download-button",`Download ${asset.label||asset.part||"ROM"}${asset.size?` · ${asset.size}`:""}`);link.href=href;link.target="_blank";link.rel="noopener noreferrer";downloads.append(link);});if(downloads.childElementCount)card.append(downloads);return card;
  }

  document.addEventListener("click",async event=>{const button=event.target.closest(".device-rom-button[data-device='pacman']");if(!button)return;event.preventDefault();event.stopPropagation();title.textContent="Nothing Phone (2a) ROMs";subtitle.textContent="Codename: PACMAN · MediaTek Dimensity 7200 Pro";showMessage("Loading Pacman ROMs…","loading-state");if(!dialog.open)dialog.showModal();button.disabled=true;try{const response=await fetch(`${CATALOG}?v=${Date.now()}`,{cache:"no-store"});if(!response.ok)throw new Error("Catalog unavailable");const catalog=await response.json();const roms=catalog?.devices?.pacman?.roms;if(!Array.isArray(roms)||!roms.length){showMessage("No ROMs have been added to the Pacman catalog yet.");return;}list.replaceChildren(...await Promise.all(roms.map(renderRom)));}catch{showMessage("ROM catalog load nahi hua. Internet check karke dobara try karein.");}finally{button.disabled=false;}},true);
  dialog.querySelector("[data-close-dialog='rom-dialog']")?.addEventListener("click",()=>dialog.close());dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
})();
