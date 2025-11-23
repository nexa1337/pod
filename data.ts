
import { Product, BlogPost } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Cyberpunk Streetwear Hoodie',
    tagline: 'Future-ready aesthetics for the modern rebel.',
    price: 45.00,
    rating: 4.8,
    reviewCount: 124,
    salesCount: 650,
    shippingType: 'International',
    category: "Men's clothing",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#000000', '#4f46e5', '#1f2937'],
    images: [
      'https://picsum.photos/600/600?random=1',
      'https://picsum.photos/600/600?random=2',
      'https://picsum.photos/600/600?random=3'
    ],
    description: `
      <p>Experience the ultimate comfort with our premium heavyweight cotton blend.</p>
      <ul>
        <li>80% Cotton, 20% Polyester</li>
        <li>Oversized fit for streetwear look</li>
        <li>High-quality DTG printing</li>
      </ul>
    `
  },
  {
    id: '2',
    title: 'Atlas Mountains Graphic Tee',
    tagline: 'Inspired by the peaks of North Africa.',
    price: 25.00,
    rating: 4.9,
    reviewCount: 89,
    salesCount: 1200,
    shippingType: 'Morocco',
    category: "Men's clothing",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#ffffff', '#fcd34d', '#78350f'],
    images: [
      'https://picsum.photos/600/600?random=4',
      'https://picsum.photos/600/600?random=5'
    ],
    description: `
      <p>Authentic Moroccan design printed on locally sourced cotton.</p>
      <ul>
        <li>100% Organic Cotton</li>
        <li>Breathable fabric</li>
        <li>Available in Earth tones</li>
      </ul>
    `
  },
  {
    id: '3',
    title: 'Minimalist Canvas Tote',
    tagline: 'Carry your world in style.',
    price: 15.00,
    rating: 4.5,
    reviewCount: 45,
    salesCount: 320,
    shippingType: 'International',
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['#e5e7eb', '#1f2937', '#d97706'],
    images: [
      'https://picsum.photos/600/600?random=6',
      'https://picsum.photos/600/600?random=7'
    ],
    description: `
      <p>Durable, eco-friendly, and stylish.</p>
      <ul>
        <li>Reinforced handles</li>
        <li>Heavy-duty canvas</li>
        <li>Inner pocket for valuables</li>
      </ul>
    `
  },
  {
    id: '4',
    title: 'Vintage Casablanca Cap',
    tagline: 'Retro vibes from the white city.',
    price: 18.00,
    rating: 4.7,
    reviewCount: 210,
    salesCount: 890,
    shippingType: 'Morocco',
    category: 'Hats',
    sizes: ['Adjustable'],
    colors: ['#ffffff', '#1e3a8a', '#000000'],
    images: [
      'https://picsum.photos/600/600?random=8',
      'https://picsum.photos/600/600?random=9'
    ],
    description: `
      <p>A classic dad hat fit with embroidered detailing.</p>
      <ul>
        <li>Adjustable strap</li>
        <li>Washed cotton finish</li>
      </ul>
    `
  },
  {
    id: '5',
    title: 'Neon Nights Bomber Jacket',
    tagline: 'Stand out in the city lights.',
    price: 65.00,
    rating: 4.6,
    reviewCount: 56,
    salesCount: 210,
    shippingType: 'International',
    category: "Women's clothing",
    sizes: ['M', 'L', 'XL'],
    colors: ['#000000', '#7c3aed'],
    images: [
      'https://picsum.photos/600/600?random=13',
      'https://picsum.photos/600/600?random=14'
    ],
    description: `
      <p>Lightweight yet warm, perfect for evening rides.</p>
      <ul>
        <li>Water-resistant shell</li>
        <li>Ribbed cuffs and hem</li>
        <li>Internal pocket</li>
      </ul>
    `
  },
  {
    id: '6',
    title: 'Majorelle Blue Scarf',
    tagline: 'A touch of Marrakech elegance.',
    price: 22.00,
    rating: 5.0,
    reviewCount: 34,
    salesCount: 450,
    shippingType: 'Morocco',
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['#1d4ed8', '#f43f5e'],
    images: [
      'https://picsum.photos/600/600?random=15',
      'https://picsum.photos/600/600?random=16'
    ],
    description: `
      <p>Soft, vibrant, and versatile.</p>
      <ul>
        <li>Premium viscose blend</li>
        <li>Hand-dyed colors</li>
      </ul>
    `
  },
  {
    id: '7',
    title: 'Urban Explorer Cargo Pants',
    tagline: 'Functionality meets street fashion.',
    price: 55.00,
    rating: 4.4,
    reviewCount: 78,
    salesCount: 300,
    shippingType: 'International',
    category: "Men's clothing", 
    sizes: ['30', '32', '34', '36'],
    colors: ['#3f3f46', '#57534e', '#000000'],
    images: [
      'https://picsum.photos/600/600?random=17',
      'https://picsum.photos/600/600?random=18'
    ],
    description: `
      <p>Designed for movement and durability.</p>
      <ul>
        <li>Multiple utility pockets</li>
        <li>Relaxed fit</li>
        <li>Durable cotton twill</li>
      </ul>
    `
  },
  {
    id: '8',
    title: 'Desert Horizon Tee',
    tagline: 'Minimalist landscape art.',
    price: 28.00,
    rating: 4.8,
    reviewCount: 112,
    salesCount: 900,
    shippingType: 'Morocco',
    category: "Women's clothing",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['#fde68a', '#fcd34d', '#ffffff'],
    images: [
      'https://picsum.photos/600/600?random=19',
      'https://picsum.photos/600/600?random=20'
    ],
    description: `
      <p>Soft cotton tee with a serene desert print.</p>
      <ul>
        <li>100% Cotton</li>
        <li>Pre-shrunk</li>
      </ul>
    `
  },
  {
    id: '9',
    title: 'Nomad Leather Backpack',
    tagline: 'Rugged elegance for the journey.',
    price: 120.00,
    rating: 4.9,
    reviewCount: 42,
    salesCount: 150,
    shippingType: 'Morocco',
    category: 'Accessories',
    sizes: ['20L', '30L'],
    colors: ['#78350f', '#451a03'],
    images: [
      'https://picsum.photos/600/600?random=21',
      'https://picsum.photos/600/600?random=22'
    ],
    description: `
      <p>Handcrafted Moroccan leather backpack.</p>
      <ul>
        <li>Genuine leather</li>
        <li>Laptop compartment</li>
        <li>Hand-stitched details</li>
      </ul>
    `
  },
  {
    id: '10',
    title: 'Glitch Art Oversized Tee',
    tagline: 'Digital chaos on fabric.',
    price: 32.00,
    rating: 4.7,
    reviewCount: 67,
    salesCount: 400,
    shippingType: 'International',
    category: "Kids' & youth clothing",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#ffffff'],
    images: [
      'https://picsum.photos/600/600?random=23',
      'https://picsum.photos/600/600?random=24'
    ],
    description: `
      <p>High-impact visual design.</p>
      <ul>
        <li>Heavyweight cotton</li>
        <li>Drop shoulder fit</li>
      </ul>
    `
  },
  {
    id: '11',
    title: 'Sahara Sunset Hoodie',
    tagline: 'Warm tones for cool nights.',
    price: 48.00,
    rating: 4.8,
    reviewCount: 95,
    salesCount: 550,
    shippingType: 'Morocco',
    category: "Women's clothing",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#f97316', '#ea580c', '#9a3412'],
    images: [
      'https://picsum.photos/600/600?random=25',
      'https://picsum.photos/600/600?random=26'
    ],
    description: `
      <p>Inspired by the colors of the dunes at dusk.</p>
      <ul>
        <li>Fleece lined</li>
        <li>Kangaroo pocket</li>
      </ul>
    `
  },
  {
    id: '12',
    title: 'Techwear Utility Vest',
    tagline: 'Practicality for the urban jungle.',
    price: 75.00,
    rating: 4.5,
    reviewCount: 30,
    salesCount: 120,
    shippingType: 'International',
    category: "Men's clothing",
    sizes: ['M', 'L', 'XL'],
    colors: ['#000000', '#374151'],
    images: [
      'https://picsum.photos/600/600?random=27',
      'https://picsum.photos/600/600?random=28'
    ],
    description: `
      <p>Layer up with functionality.</p>
      <ul>
        <li>Water-repellent</li>
        <li>Adjustable straps</li>
        <li>Multiple cargo pockets</li>
      </ul>
    `
  },
  {
    id: '13',
    title: 'Ceramic Art Vase',
    tagline: 'Modern decor for your space.',
    price: 35.00,
    rating: 4.9,
    reviewCount: 15,
    salesCount: 80,
    shippingType: 'International',
    category: "Home & living",
    sizes: ['Standard'],
    colors: ['#ffffff', '#d4d4d8'],
    images: [
      'https://picsum.photos/600/600?random=30',
      'https://picsum.photos/600/600?random=31'
    ],
    description: `
      <p>Hand-finished ceramic vase.</p>
    `
  },
  {
    id: '14',
    title: 'Custom Fabric Roll',
    tagline: 'Print your own patterns.',
    price: 20.00,
    rating: 4.6,
    reviewCount: 10,
    salesCount: 50,
    shippingType: 'Morocco',
    category: "Fabric Printing",
    sizes: ['1 Meter', '5 Meters'],
    colors: ['#ffffff'],
    images: [
      'https://picsum.photos/600/600?random=32',
      'https://picsum.photos/600/600?random=33'
    ],
    description: `
      <p>High quality polyester blend for custom printing.</p>
    `
  },
  {
    id: '15',
    title: 'Surprise Gift Box',
    tagline: 'The perfect mystery gift.',
    price: 50.00,
    rating: 5.0,
    reviewCount: 120,
    salesCount: 400,
    shippingType: 'International',
    category: "Gifts",
    sizes: ['Standard'],
    colors: ['#000000'],
    images: [
      'https://picsum.photos/600/600?random=34',
      'https://picsum.photos/600/600?random=35'
    ],
    description: `
      <p>Curated selection of our best items.</p>
    `
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Top 5 Streetwear Trends for 2024',
    thumbnail: 'https://picsum.photos/400/250?random=10',
    date: 'Oct 12, 2023',
    excerpt: 'Discover what is taking over the streets this season...'
  },
  {
    id: '2',
    title: 'Why We Chose Organic Cotton',
    thumbnail: 'https://picsum.photos/400/250?random=11',
    date: 'Nov 05, 2023',
    excerpt: 'Sustainability is not just a buzzword, it is our mission...'
  },
  {
    id: '3',
    title: 'Behind the Design: The Atlas Collection',
    thumbnail: 'https://picsum.photos/400/250?random=12',
    date: 'Dec 20, 2023',
    excerpt: 'A deep dive into the inspiration behind our best-sellers...'
  }
];

export const RATES = {
  USD: 1,
  EUR: 0.92,
  MAD: 10.1
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  MAD: 'DHs'
};

export const GUIDELINES_CONTENT = {
  mistakes: `<div class="text-gray-900 dark:text-gray-100 font-sans"><main class="max-w-6xl m-auto md:px-10 grid place-content-between"><div class="page-article-section"><article class="my-5">
  <div style="margin: 0px auto; padding: 20px; max-width: 1200px; line-height: 1.8;">
  <p style="font-size: 1rem; margin-bottom: 20px;">Direct-to-Film (DTF) printing is a fantastic way to achieve vibrant, durable prints. However, certain design mistakes can impact print quality and result in disappointing outcomes. Follow these guidelines to ensure your designs are print-ready and deliver the best possible results.</p>
  <hr class="my-4 border-gray-300 dark:border-gray-700">
  <h3 style="font-size: 1.5rem; margin-bottom: 10px;" class="text-blue-600 dark:text-blue-400 font-bold">1. <strong>Avoid Shadows on Text or Objects</strong></h3>
  <ul style="margin-bottom: 20px; list-style-type: disc; padding-left: 20px;">
  <li><strong>Problem:</strong> Adding shadows can create unintended blurry or hazy effects, leading to low-quality prints.</li>
  <li><strong>Solution:</strong> Remove shadows from your design elements to ensure crisp lines and colors. Shadows often interfere with DTF transfer.</li>
  <li><strong>Example:</strong> The image below shows the effects of including shadows.</li>
  </ul>
  <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 20px;"><img src="https://cdn.todify.ma/media/pages/AHaMJt1692gapRnYfZM4Te5204FPw64IjK4iQC0f.jpg" alt="Example with shadow" style="width: 48%; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"> <img src="https://cdn.todify.ma/media/pages/dMFgrQ17twQ7sO9h7E9QBZx0BcwLDUFQkTSLLAyU.jpg" alt="Example without shadow" style="width: 48%; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"></div>
  <hr class="my-4 border-gray-300 dark:border-gray-700">
  <h3 style="font-size: 1.5rem; margin-bottom: 10px;" class="text-blue-600 dark:text-blue-400 font-bold">2. <strong>No Opacity or Transparency in Design Elements</strong></h3>
  <ul style="margin-bottom: 20px; list-style-type: disc; padding-left: 20px;">
  <li><strong>Problem:</strong> Transparent or semi-transparent parts may print as unexpected solid areas or look patchy.</li>
  <li><strong>Solution:</strong> Ensure all design elements have full opacity (100%). Double-check each layer for unintended transparency.</li>
  <li><strong>Example:</strong> See the image below for a distortion caused by transparency.</li>
  </ul>
  <div style="text-align: center; margin-bottom: 20px;"><img src="https://cdn.todify.ma/media/pages/kiavHCWGcNeE2ryEAF4JUZNuWUEPG3LEz7sImCBz.jpg" alt="Transparency issue example" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"></div>
  <hr class="my-4 border-gray-300 dark:border-gray-700">
  <h3 style="font-size: 1.5rem; margin-bottom: 10px;" class="text-blue-600 dark:text-blue-400 font-bold">3. <strong>Ensure High-Resolution and Quality of the Design</strong></h3>
  <ul style="margin-bottom: 20px; list-style-type: disc; padding-left: 20px;">
  <li><strong>Problem:</strong> Low-resolution designs can result in pixelation and blurry edges.</li>
  <li><strong>Solution:</strong> Use high-resolution files at 300 DPI (dots per inch) to ensure sharp, detailed prints.</li>
  <li><strong>Example:</strong> Compare low and high-resolution images below.</li>
  </ul>
  <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 20px;"><img src="https://cdn.todify.ma/media/pages/DdCWKJCVK32yfqeBmNlJA2CkpYIJnL5SMycS8w5q.jpg" alt="Low resolution example" style="width: 48%; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"> <img src="https://cdn.todify.ma/media/pages/hTW68wEBAWEdQvEm5E1D6sjYUCvKbg4GLvaVhHcG.png" alt="High resolution example" style="width: 48%; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"></div>
  <hr class="my-4 border-gray-300 dark:border-gray-700">
  <h3 style="font-size: 1.5rem; margin-bottom: 10px;" class="text-blue-600 dark:text-blue-400 font-bold">4. <strong>Use Proper Color Profiles</strong></h3>
  <ul style="margin-bottom: 20px; list-style-type: disc; padding-left: 20px;">
  <li><strong>Problem:</strong> Screen colors (RGB) appear different when printed, as DTF uses CMYK profiles.</li>
  <li><strong>Solution:</strong> Design in CMYK mode for accurate color matching. Always perform test prints when possible.</li>
  </ul>
  <div style="text-align: center; margin-bottom: 20px;"><img src="https://cdn.todify.ma/media/pages/u1QQHp2X3Mt4wZdZpShIt1pMJ96NBKpKOeiM9dnn.jpg" alt="Color profile example" style="max-width: 100%; height: auto; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"></div>
  <hr class="my-4 border-gray-300 dark:border-gray-700">
  <h3 style="font-size: 1.5rem; margin-bottom: 10px;" class="text-blue-600 dark:text-blue-400 font-bold">5. <strong>Avoid Thin Lines and Small Details</strong></h3>
  <ul style="margin-bottom: 20px; list-style-type: disc; padding-left: 20px;">
  <li><strong>Problem:</strong> Thin lines and intricate details can get lost in the transfer process.</li>
  <li><strong>Solution:</strong> Use lines that are at least 1 millimeter thick and avoid excessive detail.</li>
  </ul>
  <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 20px;"><img src="https://cdn.todify.ma/media/pages/48RAMnk4MuV7ye7A9Rfny5LcxksI5vlU4WqDMTj7.jpg" alt="Thin lines example" style="width: 48%; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"> <img src="https://cdn.todify.ma/media/pages/7aDC8eGjI7Yx7mcIvhpWuAvfY7L3B9qyScLxlcCc.jpg" alt="Thicker lines example" style="width: 48%; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"></div>
  <hr class="my-4 border-gray-300 dark:border-gray-700">
  <h3 style="font-size: 1.5rem; margin-bottom: 10px;" class="text-blue-600 dark:text-blue-400 font-bold">6. <strong>Avoid Low-Contrast Colors</strong></h3>
  <ul style="margin-bottom: 20px; list-style-type: disc; padding-left: 20px;">
  <li><strong>Problem:</strong> Low-contrast colors (e.g., light gray on white) may appear faint or invisible.</li>
  <li><strong>Solution:</strong> Use high-contrast colors to ensure clarity and visibility in your designs.</li>
  </ul>
  <hr class="my-4 border-gray-300 dark:border-gray-700">
  <h3 style="font-size: 1.5rem; margin-bottom: 10px;" class="text-blue-600 dark:text-blue-400 font-bold">7. <strong>Use Only Original Designs</strong></h3>
  <ul style="margin-bottom: 20px; list-style-type: disc; padding-left: 20px;">
  <li><strong>Problem:</strong> Downloaded images from Google or Pinterest are often low resolution and unsuitable for printing.</li>
  <li><strong>Solution:</strong> Create original artwork or purchase licensed, high-resolution files.</li>
  </ul>
  <hr class="my-4 border-gray-300 dark:border-gray-700">
  <h3 style="font-size: 1.5rem; margin-bottom: 10px;" class="text-blue-600 dark:text-blue-400 font-bold">8. <strong>Perform a Test Print</strong></h3>
  <ul style="margin-bottom: 20px; list-style-type: disc; padding-left: 20px;">
  <li><strong>Problem:</strong> Minor issues may only become visible after printing.</li>
  <li><strong>Solution:</strong> Always do a test print before committing to larger production runs.</li>
  </ul>
  <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 20px;"><img src="https://cdn.todify.ma/media/pages/uyCrzmdlaVvcI1fkOdLOiKGefC8dWAbuxEoW0QkA.jpg" alt="Test print example 1" style="width: 48%; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"> <img src="https://cdn.todify.ma/media/pages/2EY8Z8aUOnUHhulgnPfqLzyUdr8qYOo8htk9ljj5.jpg" alt="Test print example 2" style="width: 48%; border-radius: 10px; box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 10px;"></div>
  <p style="text-align: center; font-size: 1.2rem; margin-top: 20px;"><strong>Happy Designing 😊!</strong></p></div></article></div><small class="small text-muted align-text-bottom block text-center mt-4 text-gray-500 dark:text-gray-400">Last updated on 20/11/2024</small></main></div>`,
  guidelines: `<div class="text-gray-900 dark:text-gray-100 font-sans"><main class="max-w-6xl m-auto md:px-10 grid place-content-between"><div class="page-article-section"><article class="my-5"><h3 class="text-xl font-bold mb-4"><strong>The artwork you upload should meet the following guidelines:</strong></h3><ol class="list-decimal pl-5 mb-4 space-y-2"><li>The size of each image should not exceed 10 MB.</li></ol><table border="0" style="border-collapse: collapse; width: 43.8352%; height: 199px; border-style: hidden; margin-left: auto; margin-right: auto;"><tbody><tr style="height: 60px;"><td style="width: 100%; height: 60px;"><img src="https://cdn.todify.ma/media/pages/7UBPJwIgS90A8B3t1ssArevJvk5jymXlA3aEGORd.png" width="527" height="249" style="display: block; margin-left: auto; margin-right: auto;"></td></tr></tbody></table><ol start="2" class="list-decimal pl-5 mb-4 space-y-2"><li>The file formats supported are PNG and JPG; if an image has transparent pixels, PNG format is highly recommended.</li><li>The image DPI (dots per inch) should be at least 150, preferably over that.</li></ol><p><img src="https://cdn.todify.ma/media/pages/ad13eLFLlxulQMcmyZV7doEE66u4Kd6peYMkcNu8.png" width="1241" height="848" style="display: block; margin-left: auto; margin-right: auto;"></p><p class="mb-4">If the DPI is not high enough, the design may turn out to be pixelated. Higher DPI ensures that details can be printed out perfectly.</p><p class="mb-4">Although 150 DPI is sufficient in most cases, it won't hurt to make it even higher if the image contains intricate details. For the best print quality, you can start with 300 DPI.</p><p><img src="https://cdn.todify.ma/media/pages/bvbrT4V9nwAgpjl6afxdLRuK1IizEup5iPDu4KRO.jpg" alt="" width="658" height="421" style="display: block; margin-left: auto; margin-right: auto;"><br><br></p><p class="mb-4">When designing your artwork, create the files at 100% of the print dimensions at 300 DPI. This will ensure a sharp image that isn't blurry or pixelated. Your image should remain sharp even when your artwork elements are sized down for printing. Remember to not scale artwork up (unless it is a vector file) as this will also cause pixelation.<br><br></p><h3 class="text-lg font-bold mb-2">1. Choosing Colors:</h3><p style="text-align: left;" class="mb-4">Keep in mind, very subtle color differences between colors in your artwork and the base color of the product (for example, A dark gray design on a black shirt) may not print as expected. Typically, RGB screen colors appear more vibrant onscreen than CMYK colors printed on products.</p><table border="0" style="border-collapse: collapse; width: 100%; max-width: 800px; margin: 20px auto;"><tbody><tr><td style="width: 50%; text-align: center; font-weight: bold;">Onscreen view</td><td style="width: 50%; text-align: center; font-weight: bold;">Printed outcome</td></tr><tr style="height: 171px;"><td style="text-align: center;"><img src="https://m.media-amazon.com/images/G/01/gear/portal/EX-SubtleColors-HeatherlOnscreen-SM._CB1565223685_.jpg" alt="color saturation image example" class="mx-auto"></td><td style="text-align: center;"><img src="https://m.media-amazon.com/images/G/01/gear/portal/EX-SubtleColors-HeatherBPrinted-SM._CB1565223514_.jpg" alt="color saturation image example" class="mx-auto"></td></tr><tr style="height: 185px;"><td style="text-align: center;"><img src="https://m.media-amazon.com/images/G/01/gear/portal/EX-SubtleColors-YellowOnscreen-SM._CB1565223610_.jpg" alt="color saturation image example" class="mx-auto"></td><td style="text-align: center;"><img src="https://m.media-amazon.com/images/G/01/gear/portal/EX-SubtleColors-YellowPrinted-SM._CB1565223610_.jpg" alt="color saturation image example" class="mx-auto"></td></tr><tr style="height: 229px;"><td style="text-align: center;"><img src="https://m.media-amazon.com/images/G/01/gear/portal/EX-SubtleColors-DkHeatherOnscreen-SM._CB1565223514_.jpg" alt="color saturation image example" class="mx-auto"></td><td style="text-align: center;"><img src="https://m.media-amazon.com/images/G/01/gear/portal/EX-SubtleColors-DkHeatherPrinted-SM._CB1565223514_.jpg" alt="color saturation image example" class="mx-auto"></td></tr></tbody></table><h3 class="text-lg font-bold mb-2 mt-6">2. Set a modest print size:</h3><p class="mb-4">The size of a design should be based on the purpose of the shirt, the properties of the garment, and the characteristics of the design itself.</p><p class="mb-4">Keep in mind that certain shapes, like circles and squares, look better when sized smaller than standard. Consider the total surface area of the print, not just the width and height.</p><p><img src="https://cdn.todify.ma/media/pages/4nYRbYsn7Edtmi2J66J2EhNZD6LvEryXh8OJWckS.jpg" alt="" width="1200" height="1069" class="mx-auto mb-4"><span class="text-red-500 dark:text-red-400 font-bold">Pro tip</span>: Sizing Print out your design with a home printer on regular paper (you may need to split between two or more sheets and then tape them together) and cut off the excess. Then hold it up to your own shirt in the mirror to get an idea of exactly how it will look.<br><br></p><h3 class="text-lg font-bold mb-2">3. Get the placement right:</h3><p class="mb-4">Print placement differs from print location. It’s the exact measurement of where to print the design within the location.</p><p class="mb-4">If you’re choosing unique print placement, make sure you have a good reason. Many people new to T-shirt design don’t know that a standard full front placement isn’t halfway between the shirt’s top and bottom. It’s actually around 7-10 cm from the collar. So a common mistake is the belly print, and it’s never flattering.</p><p><img src="https://cdn.todify.ma/media/pages/u3M04Z2Lb8WSo44K4FqjDVIx6r1HpbmNpygISQCa.jpg" alt="" width="1200" height="1036" class="mx-auto mb-6"></p><h3 class="text-lg font-bold mb-2">4. Focus on fonts and typography:</h3><p class="mb-4">Typography, in its most basic form, is the visual arrangement of words. Anytime text gets printed or displayed, good or bad, there is typography involved.</p><p class="mb-4">In graphic design, typography is the art of typesetting: arranging type in a way that makes sense, along with choosing appropriate typefaces (fonts), making sure the letter spacing and line spacing is correct.</p><p><img src="https://cdn.todify.ma/media/pages/c8FuXlVjmjrxOmEC2ujnYQPcREAxQIVCufUci1If.jpg" alt="" width="1200" height="1099" class="mx-auto mb-4"></p><p class="mb-6"><span class="text-red-500 dark:text-red-400 font-bold">Pro tip</span>: Fonts If you remember only one rule of typography, make it this one: "Never use more than three different fonts in a design." It creates a busy and chaotic look.</p><h3 class="text-lg font-bold mb-2">5. Ensure image quality:</h3><p class="mb-4">One of the most common problems with customer-submitted art files is that images are “low resolution”.</p><p class="mb-4"><strong>Ideally, images should be 200 dpi or higher at full size. Up to 300 dpi is best.</strong>&nbsp;<span class="text-red-500 dark:text-red-400 font-bold">Images from the web are typically 72 dpi</span>, and not at the size to be printed.</p><p class="mb-4">Another issue with low-res images is <a href="https://en.wikipedia.org/wiki/Compression_artifact" rel="noopener noreferrer" class="text-blue-500 hover:underline">visible artifacts</a>&nbsp;from compression. Keep in mind, the print will only be as clear as the image we’re starting with.</p><p><img src="https://cdn.todify.ma/media/pages/zPxrhR2JwIgwhtlRhgcTpqXpW04FcNIwWtmYQ8Qf.jpg" alt="" width="1200" height="1049" class="mx-auto mb-6"></p><h3 class="text-lg font-bold mb-2">6. Be careful with colors:</h3><p class="mb-4">Color choice is one of the most important decisions. Not only for design reasons but if you want screen printing, to make sure the job fits your budget.</p><p><img src="https://cdn.todify.ma/media/pages/KjcosYWLDbinQIyWJ7lc6cEWpLAcpIwmNx9u6XIc.jpg" class="mx-auto mb-4"></p><p class="mb-6"><span class="text-red-500 dark:text-red-400 font-bold">Pro tip</span>: ColorsYou should think about colors from the moment you start design. Colors can actually have specific effects on people. Advertisers are well aware of this, and you should be too.</p><h3 class="text-lg font-bold mb-2">7. Consider the contrast:</h3><p class="mb-4">Contrast is a part of color choice, but it’s a specific and important part to consider. What exactly is contrast? Its the degree of visual difference between the darker and lighter parts of an image.</p><p class="mb-4">High-contrast designs are easier to read and more in-your-face, while low-contrast designs are more subtle.</p><p><img src="https://cdn.todify.ma/media/pages/ryDLnHPleffnnCLcHMBxacHrDl22rKCRndC5yOEU.jpg" alt="" width="1200" height="1049" class="mx-auto mb-4"></p><p><strong><span class="text-red-500 dark:text-red-400 font-bold">Pro tip</span></strong>: Contrast On dark backgrounds, the lightest colors visually come forward in space, while darker colors recede. On light backgrounds, the effect is the opposite.</p></article></div><small class="small text-muted align-text-bottom block text-center mt-4 text-gray-500 dark:text-gray-400">Last updated on 20/08/2024</small></main></div>`
};
