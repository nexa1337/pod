# NEXA Print - Print-on-Demand Storefront

A production-ready, multi-language, multi-currency print-on-demand e-commerce storefront built with vanilla HTML, CSS, and JavaScript.

## Features

### Core Features
- **Multi-Language Support**: English, Spanish, and Arabic (with RTL support)
- **Multi-Currency Support**: MAD, USD, EUR with automatic conversion
- **Dark/Light Mode**: Toggle with localStorage persistence
- **Live Date/Time Display**: Real-time updates in header
- **Product Search**: Client-side fuzzy search functionality
- **Product Modal**: Image carousel, size selector, quantity picker
- **Shopping Cart**: Add/remove items, persistent storage
- **Checkout Options**: 
  - Card payment (placeholder for integration)
  - WhatsApp ordering
- **Custom Logo Upload**: Drag-and-drop with preview
- **Responsive Design**: Mobile-first, works on all devices
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **SEO Ready**: Meta tags, structured data, robots.txt

### Technical Features
- Modular JavaScript architecture
- LocalStorage for cart and preferences
- IP-based currency detection
- Drag-and-drop file upload
- Image carousel with keyboard support
- Fuzzy search algorithm

## Project Structure

\`\`\`
nexa-print/
├── index.html              # Main storefront page
├── privacy.html            # Privacy policy page
├── terms.html              # Terms of service page
├── css/
│   └── styles.css          # All styling (light/dark mode, responsive)
├── js/
│   ├── app.js              # Main application logic
│   ├── i18n.js             # Internationalization module
│   ├── currency.js         # Currency conversion module
│   └── utils.js            # Utility functions
├── data/
│   ├── products.json       # Product catalog
│   ├── translations.json   # Language translations
│   └── currencies.json     # Currency rates and symbols
├── README.md               # This file
├── robots.txt              # SEO robots configuration
└── sitemap.xml             # XML sitemap for SEO
\`\`\`

## Getting Started

### Installation

1. **Clone or download the project**
   \`\`\`bash
   git clone <repository-url>
   cd nexa-print
   \`\`\`

2. **Serve locally** (requires a local server)
   \`\`\`bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   \`\`\`

3. **Open in browser**
   \`\`\`
   http://localhost:8000
   \`\`\`

## Integration Hooks

### 1. Payment Integration (Card Checkout)

**Location**: `js/app.js` - `handleCheckout()` function

Replace the placeholder with your payment provider:

\`\`\`javascript
// Example: Stripe integration
const handleCardCheckout = async () => {
  const stripe = Stripe('YOUR_STRIPE_PUBLIC_KEY');
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cart, total })
  });
  const { clientSecret } = await response.json();
  await stripe.confirmCardPayment(clientSecret);
};
\`\`\`

### 2. Print Provider Integration

**Supported Providers**: Printful, Printify, Mayzing, Todify

**Location**: Create `js/providers.js`

\`\`\`javascript
// Example: Printful integration
const PrintfulProvider = {
  async createOrder(cartItems) {
    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          variant_id: item.size
        }))
      })
    });
    return response.json();
  }
};
\`\`\`

### 3. Email Notifications

**Location**: Create `js/email.js`

\`\`\`javascript
// Example: SendGrid integration
const sendOrderConfirmation = async (email, order) => {
  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      template: 'order-confirmation',
      data: order
    })
  });
};
\`\`\`

### 4. Inventory Management

**Location**: `data/products.json` - Add inventory field

\`\`\`json
{
  "id": 1,
  "name": "Classic T-Shirt",
  "inventory": 100,
  "lowStockThreshold": 10
}
\`\`\`

### 5. Analytics Integration

**Location**: `js/app.js` - Add tracking calls

\`\`\`javascript
// Example: Google Analytics
const trackEvent = (eventName, eventData) => {
  gtag('event', eventName, eventData);
};

// Track product view
trackEvent('view_item', {
  items: [{ item_id: product.id, item_name: product.name }]
});
\`\`\`

## Customization

### Adding Products

Edit `data/products.json`:

\`\`\`json
{
  "id": 9,
  "name": "Your Product",
  "description": "Product description",
  "price": 299,
  "originalPrice": 399,
  "images": ["/path/to/image1.jpg", "/path/to/image2.jpg"],
  "sizes": ["S", "M", "L"],
  "category": "apparel"
}
\`\`\`

### Adding Languages

1. Add translations to `data/translations.json`
2. Add language option to `index.html` language select
3. Translations auto-load on language change

### Changing Colors

Edit CSS variables in `css/styles.css`:

\`\`\`css
:root {
  --primary-color: #1a1a1a;
  --secondary-color: #0066cc;
  --accent-color: #ff6b35;
  /* ... more colors ... */
}
\`\`\`

### Adding New Currencies

1. Add to `data/currencies.json`
2. Add option to currency select in `index.html`
3. Update conversion rates as needed

## API Endpoints (Backend Required)

These endpoints should be implemented on your backend:

### POST `/api/create-payment-intent`
Create a payment intent for card checkout
\`\`\`json
Request: { cart: [], total: 0 }
Response: { clientSecret: "string" }
\`\`\`

### POST `/api/create-order`
Create an order with print provider
\`\`\`json
Request: { items: [], shippingAddress: {} }
Response: { orderId: "string", status: "pending" }
\`\`\`

### POST `/api/send-email`
Send order confirmation email
\`\`\`json
Request: { to: "email", template: "order-confirmation", data: {} }
Response: { success: true }
\`\`\`

### GET `/api/products`
Get product catalog (optional, for dynamic loading)
\`\`\`json
Response: [{ id, name, price, ... }]
\`\`\`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Lazy load images: Add `loading="lazy"` to product images
- Minify CSS/JS for production
- Use CDN for static assets
- Enable gzip compression on server
- Cache products.json with service worker

## Security Considerations

- Never expose API keys in frontend code
- Use HTTPS for all transactions
- Validate cart items on backend before payment
- Implement CSRF protection
- Sanitize user inputs (logo upload)
- Use Content Security Policy headers

## Troubleshooting

### Products not loading
- Check browser console for errors
- Verify `data/products.json` path
- Ensure JSON is valid

### Currency not converting
- Check `data/currencies.json` rates
- Verify IP geolocation service is accessible
- Check browser console for fetch errors

### Dark mode not persisting
- Check localStorage is enabled
- Verify browser privacy settings

## License

MIT License - Feel free to use for commercial projects

## Support

For integration help or issues:
- Email: support@nexaprint.com
- Documentation: See integration hooks above
- GitHub Issues: [Your repo URL]

## Roadmap

- [ ] Admin dashboard for product management
- [ ] User accounts and order history
- [ ] Advanced analytics
- [ ] Subscription products
- [ ] Bulk ordering
- [ ] API for third-party integrations
- [ ] Mobile app
