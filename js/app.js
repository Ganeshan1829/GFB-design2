(() => {
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
 const getCart=()=>JSON.parse(localStorage.getItem("gfb_cart")||"[]");
 const saveCart=c=>{localStorage.setItem("gfb_cart",JSON.stringify(c));updateCount()};
 const getProduct=id=>GFB_PRODUCTS.find(p=>p.id===id)||GFB_PRODUCTS[0];
 const productImage=p=>p.image;
 function updateCount(){const count=getCart().reduce((n,x)=>n+x.qty,0);$$("[data-cart-count]").forEach(e=>e.textContent=count)}
 function toast(msg){let t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";t.className="toast";document.body.append(t)}t.textContent=msg;t.classList.add("show");clearTimeout(window.gfbToastTimer);window.gfbToastTimer=setTimeout(()=>t.classList.remove("show"),2300)}
 function addToCart(id,qty=1){const cart=getCart(),found=cart.find(x=>x.id===id);if(found)found.qty+=qty;else cart.push({id,qty});saveCart(cart);toast("Added to your demo cart")}
 function productCard(p){return `<article class="product-card"><div class="product-art"><img src="${productImage(p)}" alt="GFB product image"></div><div class="product-info"><span class="product-meta">${p.audience} · ${p.model}</span><h3>${p.name}</h3><p>${p.short}</p><div class="price-line"><strong>${money(p.price)}</strong><del>${money(p.oldPrice)}</del></div><div class="price-note">Prototype reference price · confirm current price</div><div class="card-actions"><a class="btn btn-outline btn-small" href="product.html?id=${p.id}">View details</a><button class="btn btn-dark btn-small" data-add="${p.id}">Add to cart</button></div></div></article>`}
 function renderProducts(){const target=$("#productGrid");if(target)target.innerHTML=GFB_PRODUCTS.map(productCard).join("")}
 function renderHeader(){
  const active=document.body.dataset.page;
  const isHome=active==="home";
  const prefix=isHome?"":"index.html";
  const links=[
   ["Home",isHome?"#hero":"index.html#hero","home"],
   ["Products",`${prefix}#products`,"products"],
   ["How It Works",`${prefix}#how-it-works`,"how"],
   ["Installation",`${prefix}#installation`,"installation"],
   ["About Us","about.html","about"],
   ["Contact","contact.html","contact"],
   ["Track Order","track-order.html","track"],
   ["My Account","account.html","account"]
  ];
  $("#siteHeader").innerHTML=`<div class="container nav-wrap"><a class="brand" href="${isHome ? '#hero' : 'index.html'}">✦GFB<small>GARBO FREE BHARAT</small></a><button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav class="nav-links" aria-label="Main navigation">${links.map(([n,u,k])=>`<a class="${(isHome && k==='home')||(!isHome && active===k)?"active":""}" data-nav="${k}" href="${u}">${n}</a>`).join("")}</nav><div class="nav-actions"><a class="cart-link" href="cart.html">Cart <span class="cart-count" data-cart-count>0</span></a><a class="btn btn-dark btn-small" href="contact.html">Book a demo ↗</a></div></div>`;
  const toggle=$(".menu-toggle"),nav=$(".nav-links");
  toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"×":"☰"});

  // Handle smooth scroll & menu close on click for hash links
  $$(".nav-links a").forEach(a=>{
   a.addEventListener("click",e=>{
    const href=a.getAttribute("href");
    if(href && href.startsWith("#")){
     const target=$(href);
     if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth"});
      history.pushState(null,"",href);
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
      toggle.textContent="☰";
     }
    }
   });
  });

  const brand=$(".brand");
  if(brand && isHome){
   brand.addEventListener("click",e=>{
    e.preventDefault();
    const hero=$("#hero");
    if(hero){
     hero.scrollIntoView({behavior:"smooth"});
     history.pushState(null,"","#hero");
     nav.classList.remove("open");
     toggle.setAttribute("aria-expanded","false");
     toggle.textContent="☰";
    }
   });
  }

  // Scrollspy on home page
  if(isHome){
   const sections=[
    {id:"hero",nav:"home"},
    {id:"products",nav:"products"},
    {id:"how-it-works",nav:"how"},
    {id:"installation",nav:"installation"}
   ];
   const onScroll=()=>{
    const scrollPos=window.scrollY + 130;
    let current="home";
    for(const s of sections){
     const el=document.getElementById(s.id);
     if(el && el.offsetTop <= scrollPos){
      current=s.nav;
     }
    }
    $$(".nav-links a[data-nav]").forEach(link=>{
     link.classList.toggle("active", link.dataset.nav===current);
    });
   };
   window.addEventListener("scroll",onScroll,{passive:true});
  }

  updateCount();
 }
 function renderFooter(){
  const isHome=document.body.dataset.page==="home";
  const prefix=isHome?"":"index.html";
  $("#siteFooter").innerHTML=`<div class="container"><div class="footer-grid"><div><a class="brand" href="${isHome ? '#hero' : 'index.html'}">✦GFB<small>GARBO FREE BHARAT</small></a><p style="max-width:250px;margin-top:18px">Smart food-waste management concepts for kitchens. Start with the site, the right model and verified product information.</p></div><div><h4>Explore</h4><a href="${prefix}#products">Products</a><a href="${prefix}#how-it-works">How it works</a><a href="${prefix}#installation">Installation</a></div><div><h4>Company</h4><a href="about.html">About GFB</a><a href="contact.html">Contact</a><a href="cart.html">Shopping cart</a><a href="track-order.html">Track an order</a></div><div><h4>Important</h4><a href="checkout.html">Demo checkout</a><a href="${prefix}#faq">FAQs</a><p>Business contact details and policy documents to be supplied.</p></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Garbo Free Bharat. Prototype website.</span><span>Demo only · No payment or real order processing</span></div></div>`;
 }
 function renderFaq(){ $$(".faq-q").forEach(b=>b.addEventListener("click",()=>{const item=b.closest(".faq-item");item.classList.toggle("open");b.setAttribute("aria-expanded",String(item.classList.contains("open")))}))}
 function bindAdd(){document.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(b.dataset.add,1)})}
 function renderProductDetail(){
  const p=getProduct(new URLSearchParams(location.search).get("id"));const target=$("#productDetail");if(!target)return;
  target.innerHTML=`<div class="detail-grid"><div><div class="gallery-main"><img id="mainProductImage" src="${productImage(p)}" alt="${p.name}"></div><div class="thumb-row"><button class="thumb" aria-label="Show product image"><img src="${productImage(p)}" alt=""></button></div></div><div class="detail-summary"><span class="eyebrow">${p.audience} · ${p.model}</span><h1>${p.name}</h1><p class="lead">${p.description}</p><div class="price-line"><strong>${money(p.price)}</strong><del>${money(p.oldPrice)}</del></div><div class="price-note">${p.priceLabel}. This is a prototype reference, not a confirmed offer.</div><div class="notice">Confirm the exact model, dimensions, capacity, electrical requirements, installation scope, current price and written warranty terms with GFB before purchase.</div><div class="quantity"><button data-qty="-1" aria-label="Decrease quantity">−</button><input id="detailQty" value="1" inputmode="numeric" aria-label="Quantity"><button data-qty="1" aria-label="Increase quantity">+</button></div><div class="card-actions"><button class="btn btn-dark" id="detailAdd">Add to cart</button><button class="btn btn-bronze" id="detailBuy">Buy now</button></div><p class="copy" style="margin-top:18px">Availability and delivery estimate: confirmation required.</p></div></div>`;
  $("#detailAdd").onclick=()=>addToCart(p.id,Math.max(1,Number($("#detailQty").value)||1));
  $("#detailBuy").onclick=()=>{addToCart(p.id,Math.max(1,Number($("#detailQty").value)||1));location.href="checkout.html"};
  $$("[data-qty]").forEach(b=>b.onclick=()=>{$("#detailQty").value=Math.max(1,(Number($("#detailQty").value)||1)+Number(b.dataset.qty))});
  $(".thumb").onclick=()=>$("#mainProductImage").src=productImage(p);
  const specs=$("#specRows");if(specs)specs.innerHTML=[["Model",p.model],["Intended setting",p.audience],["Dimensions","Confirmation required"],["Capacity","Verified data required"],["Power consumption","Verified data required"],["Warranty","Written terms required"]].map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`).join("");
 }
 function renderCart(){
  const host=$("#cartContent");if(!host)return;const cart=getCart();
  if(!cart.length){host.innerHTML=`<div class="empty-state"><div class="success-mark">＋</div><h2>Your cart is empty</h2><p class="copy">Explore the GFB models and add a product to begin a demo purchase journey.</p><a class="btn btn-dark" href="index.html#products">Explore products</a></div>`;return}
  let subtotal=0;
  host.innerHTML=`<div class="form-layout"><div>${cart.map(item=>{const p=getProduct(item.id);subtotal+=p.price*item.qty;return `<div class="cart-row"><img src="${productImage(p)}" alt=""><div><h3>${p.name}</h3><p>${p.model} · ${money(p.price)} each</p><div class="cart-controls"><button data-cart-change="${p.id}" data-delta="-1">−</button><span>${item.qty}</span><button data-cart-change="${p.id}" data-delta="1">+</button><button data-remove="${p.id}">Remove</button></div></div><strong>${money(p.price*item.qty)}</strong></div>`}).join("")}</div><aside class="summary-card"><h3>Order summary</h3><div class="summary-row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div><div class="summary-row"><span>Delivery</span><span>To be confirmed</span></div><div class="summary-row summary-total"><span>Demo total</span><strong>${money(subtotal)}</strong></div><p class="price-note">Delivery and final charges are not calculated in this prototype.</p><a class="btn btn-dark" style="width:100%" href="checkout.html">Proceed to checkout →</a><a class="btn btn-outline" style="width:100%;margin-top:9px" href="index.html#products">Continue shopping</a></aside></div>`;
 }
 function cartActions(){
  document.addEventListener("click",e=>{
   const c=e.target.closest("[data-cart-change]");if(c){let cart=getCart(),it=cart.find(x=>x.id===c.dataset.cartChange);if(it){it.qty=Math.max(1,it.qty+Number(c.dataset.delta));saveCart(cart);renderCart()}}
   const r=e.target.closest("[data-remove]");if(r){saveCart(getCart().filter(x=>x.id!==r.dataset.remove));renderCart();toast("Product removed")}
  })
 }
 function renderCheckout(){
  const host=$("#checkoutSummary");if(!host)return;const cart=getCart();if(!cart.length){host.innerHTML=`<div class="notice">Your cart is empty. <a href="index.html#products">Browse products</a>.</div>`;$("#placeOrder")?.setAttribute("disabled","disabled");return}
  let sum=0;host.innerHTML=cart.map(it=>{const p=getProduct(it.id);sum+=p.price*it.qty;return `<div class="summary-row"><span>${p.name} × ${it.qty}</span><strong>${money(p.price*it.qty)}</strong></div>`}).join("")+`<div class="summary-row"><span>Delivery</span><span>To be confirmed</span></div><div class="summary-row summary-total"><span>Demo total</span><strong>${money(sum)}</strong></div><p class="price-note">No payment will be collected. Final delivery charges are not included.</p>`;
  const form=$("#checkoutForm");if(!form)return;
  form.addEventListener("submit",e=>{e.preventDefault();let valid=true;$$("[required]",form).forEach(el=>{const err=$(`[data-error="${el.name}"]`);let ok=el.checkValidity();if(el.name==="phone")ok=/^[6-9]\d{9}$/.test(el.value.trim());if(el.name==="pincode")ok=/^\d{6}$/.test(el.value.trim());if(err)err.textContent=ok?"":(el.name==="phone"?"Enter a valid 10-digit Indian mobile number.":el.name==="pincode"?"Enter a valid 6-digit PIN code.":"Please complete this field.");if(!ok)valid=false});if(!valid)return;
   const order={id:"GFB-DEMO-"+Date.now().toString().slice(-7),date:new Date().toLocaleString("en-IN"),customer:Object.fromEntries(new FormData(form).entries()),items:getCart(),total:sum};
   localStorage.setItem("gfb_last_order",JSON.stringify(order));
   const orders=JSON.parse(localStorage.getItem("gfb_orders")||"[]");
   orders.unshift(order);
   localStorage.setItem("gfb_orders",JSON.stringify(orders));
   saveCart([]);location.href="order-confirmation.html";
  });
 }
 function renderConfirmation(){
  const host=$("#confirmation");if(!host)return;const o=JSON.parse(localStorage.getItem("gfb_last_order")||"null");if(!o){host.innerHTML=`<div class="empty-state"><h2>No demo order found</h2><a class="btn btn-dark" href="index.html#products">Explore products</a></div>`;return}
  host.innerHTML=`<div class="success-mark">✓</div><span class="eyebrow">Demo journey completed</span><h1>Your demo order has been recorded</h1><p class="lead" style="margin:0 auto 25px">This is a local prototype confirmation. No real order or payment has been placed.</p><div class="summary-card" style="text-align:left;max-width:650px;margin:30px auto"><div class="summary-row"><span>Demo order ID</span><strong>${o.id}</strong></div><div class="summary-row"><span>Date</span><strong>${o.date}</strong></div><div class="summary-row"><span>Customer</span><strong>${o.customer.fullname}</strong></div>${o.items.map(it=>{const p=getProduct(it.id);return `<div class="summary-row"><span>${p.name} × ${it.qty}</span><strong>${money(p.price*it.qty)}</strong></div>`}).join("")}<div class="summary-row summary-total"><span>Demo total</span><strong>${money(o.total)}</strong></div><p class="copy" style="margin-top:18px">Delivery address: ${[o.customer.door,o.customer.street,o.customer.area,o.customer.city,o.customer.state,o.customer.pincode].filter(Boolean).join(", ")}</p></div><a class="btn btn-dark" href="track-order.html?id=${o.id}">Track this order</a> <a class="btn btn-outline" href="index.html#products">Continue shopping</a> <a class="btn btn-outline" href="index.html#hero">Back to home</a>`;
 }
 function contactForm(){const f=$("#contactForm");if(!f)return;f.addEventListener("submit",e=>{e.preventDefault();if(!f.reportValidity())return;$("#contactStatus").textContent="Your demo form is valid. Nothing has been sent or stored. Connect a secure form service before launch.";f.reset()})}
 document.addEventListener("DOMContentLoaded",()=>{
  renderHeader();renderFooter();renderProducts();renderProductDetail();renderCart();renderCheckout();renderConfirmation();renderFaq();bindAdd();cartActions();contactForm();
 });
})();
