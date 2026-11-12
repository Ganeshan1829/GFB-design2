(() => {
 const $ = (s, r=document) => r.querySelector(s);
 const money = n => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
 const getOrders = () => {
   const orders = JSON.parse(localStorage.getItem("gfb_orders") || "[]");
   const last = JSON.parse(localStorage.getItem("gfb_last_order") || "null");
   if (last && !orders.some(o => o.id === last.id)) orders.unshift(last);
   return orders;
 };
 const form = $("#trackForm");
 if (!form) return;
 form.addEventListener("submit", e => {
   e.preventDefault();
   const id = $("#trackOrderId").value.trim().toUpperCase();
   const phone = $("#trackPhone").value.replace(/\D/g,"");
   $("#orderIdError").textContent = id ? "" : "Enter your order ID.";
   $("#phoneError").textContent = /^[6-9]\d{9}$/.test(phone) ? "" : "Enter the 10-digit mobile number used at checkout.";
   $("#trackStatus").textContent = "";
   $("#trackResult").innerHTML = "";
   if (!id || !/^[6-9]\d{9}$/.test(phone)) return;
   const order = getOrders().find(o => o.id.toUpperCase() === id && (o.customer?.phone || "").replace(/\D/g,"") === phone);
   if (!order) {
     $("#trackStatus").textContent = "No matching order was found in this browser. Check the order ID and mobile number, or use the same browser where checkout was completed.";
     return;
   }
   const products = order.items.map(item => {
     const product = GFB_PRODUCTS.find(p => p.id === item.id);
     return `<div class="summary-row"><span>${product ? product.name : "GFB product"} × ${item.qty}</span><strong>${product ? money(product.price*item.qty) : "—"}</strong></div>`;
   }).join("");
   $("#trackResult").innerHTML = `<div class="summary-card" style="max-width:850px;margin:0 auto">
     <span class="eyebrow">Order found · Demo status</span><h2 style="font-size:27px;margin:8px 0 18px">Order details</h2>
     <div class="summary-row"><span>Order ID</span><strong>${order.id}</strong></div>
     <div class="summary-row"><span>Placed on</span><strong>${order.date}</strong></div>
     <div class="summary-row"><span>Customer</span><strong>${order.customer.fullname}</strong></div>
     ${products}
     <div class="summary-row summary-total"><span>Demo total</span><strong>${money(order.total)}</strong></div>
     <div class="notice" style="margin-top:20px"><strong>Current prototype status: Order received</strong><p style="margin:7px 0 0">This is a simulated status for the website demo. Dispatch, shipment tracking and delivery updates are not connected.</p></div>
     <p class="copy" style="margin-top:16px">Delivery address: ${[order.customer.door,order.customer.street,order.customer.area,order.customer.city,order.customer.state,order.customer.pincode].filter(Boolean).join(", ")}</p>
   </div>`;
   $("#trackStatus").textContent = "Your demo order was found.";
 });
 const params = new URLSearchParams(location.search);
 if (params.get("id")) $("#trackOrderId").value = params.get("id");
})();