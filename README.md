# GFB Website Prototype

A responsive multi-page front-end prototype for Garbo Free Bharat, based on the supplied GFB HTML source and project brief.

## Run locally
1. Extract the ZIP.
2. Open the `GFB-Website` folder in VS Code.
3. Start a local static server (recommended: VS Code Live Server).
4. Open `index.html` through the local server.

You can also open `index.html` directly in a modern browser, but a local server is recommended.

## Pages
- `index.html` — Home
- `products.html` — Product listing
- `product.html?id=home` — Reusable product detail page (`home`, `heavy`, `bio-ring`)
- `how-it-works.html`
- `installation.html`
- `about.html`
- `contact.html`
- `cart.html`
- `checkout.html`
- `order-confirmation.html`

## Design system
- Font: Manrope (Google Fonts; falls back to Arial if offline)
- Ivory: #FFFAF3
- Cream: #F8EDDF
- Peach: #F0DDCA
- Navy: #102333
- Bronze: #91530D
- Gold: #B58240
- Muted: #67717A
- Border: #E6DCD0

## Interactions
- Responsive navigation
- Product cards and model-specific detail page
- Product quantity selection
- Add to cart / buy now
- Persistent cart using localStorage
- Cart quantity changes and removal
- Checkout validation for email, Indian mobile number and PIN code
- Demo order confirmation with a generated demo ID
- FAQ accordion
- Local demo enquiry form validation

## Important launch notes
This is a front-end prototype, not a production ecommerce system. It does not connect to a backend, payment gateway, CRM, delivery provider or real order system.

The model names/categories and reference prices are transcribed from the supplied current GFB concept website. That same source indicates that prices and business terms need confirmation. Reference prices are therefore labelled as unverified prototype values.

The supplied source does not provide verified model-specific dimensions, capacity, detailed power consumption, approved-food list, warranty coverage, installation scope, real customer reviews, official contact details or policy documents. These fields are intentionally marked for confirmation rather than invented.

The product image is reused from the embedded PNG in the supplied HTML. The installation diagram is a conceptual illustration only; it is not an engineering drawing or installation instruction. It shows the sink above the machine, the sink inlet connection, and a separate outlet leaving the machine's right side toward drainage.

Before production launch:
- Replace the poster-derived product cutout with approved high-resolution product photographs for each model.
- Confirm each model's technical data, price, warranty, box contents and service terms.
- Add real company contact details, privacy policy, terms and refund policy.
- Connect secure backend services for enquiries, accounts, orders and inventory.
- Add an appropriate payment provider only after production requirements and compliance review.
- Test installation illustrations with the product/engineering team.


## Track order page
Open `track-order.html` and enter the demo order ID plus the same 10-digit mobile number used at checkout. Demo orders are saved in this browser's local storage. Tracking currently displays a simulated “Order received” status only; connect a backend, database and shipping provider for live order updates.
