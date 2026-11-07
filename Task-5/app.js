// ============================================================================
// NEXUS GEAR — ENTERPRISE E-COMMERCE PLATFORM (CONSOLIDATED CORE APPLICATION)
// Full-Stack Architecture, Client-Side SPA Routing, Reactive State & Telemetry
// ============================================================================

// ----------------------------------------------------------------------------
// 1. DATASET & CONFIGURATION
// ----------------------------------------------------------------------------
const CURRENCY_RATES = {
  INR: { symbol: "₹", rate: 86.50 },
  USD: { symbol: "$", rate: 1.0 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 }
};

const PROMO_CODES = {
  "NEXUS20": { discountPercent: 20, minSpend: 0, description: "20% off storewide capstone special" },
  "SAVE10": { discountPercent: 10, minSpend: 4000, description: "10% off on orders over ₹4,000" },
  "VIP50": { discountFixed: 50, minSpend: 20000, description: "₹4,300 off premier orders" },
  "FREESHIP": { freeShipping: true, description: "Free expedited shipping" }
};

const CATEGORIES = [
  "All Products",
  "Audio & Acoustics",
  "Computing & Productivity",
  "Wearables & Health",
  "Smart Living & IoT",
  "Photography & Gear"
];

const INITIAL_PRODUCTS = [
  {
    id: "nx-101",
    title: "Apex ANC Studio Wireless Headphones",
    category: "Audio & Acoustics",
    brand: "AeroSonics",
    price: 349.99,
    originalPrice: 429.99,
    rating: 4.9,
    reviewsCount: 142,
    stock: 18,
    badge: "BESTSELLER",
    description: "Industry-leading hybrid active noise cancellation with 40mm beryllium drivers, spatial audio tracking, and 50-hour ultra-endurance battery life.",
    features: [
      "Custom 40mm Beryllium acoustic drivers",
      "Adaptive Hybrid ANC with transparent ambient mode",
      "Lossless Bluetooth 5.4 with LDAC & aptX HD support",
      "50-hour battery life with 15-minute quick charge (5 hrs playback)",
      "Aircraft-grade aluminum headband with memory foam ear cushions"
    ],
    specs: {
      "Frequency Response": "10 Hz – 45,000 Hz",
      "Impedance": "32 Ohms",
      "Connectivity": "Bluetooth 5.4, 3.5mm AUX, USB-C Lossless Audio",
      "Weight": "260g",
      "Warranty": "2-Year Worldwide Manufacturer Warranty"
    },
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r1", name: "David Sterling", rating: 5, date: "2026-10-14", comment: "The noise cancellation isolates open-office chatter completely. Crisp highs and deep, articulate sub-bass." },
      { id: "r2", name: "Elena Rostova", rating: 5, date: "2026-10-02", comment: "Exceptional build quality. Comfortably worn for 8 hours on a flight without any ear fatigue." }
    ]
  },
  {
    id: "nx-102",
    title: "Vanguard Titan Mechanical Keyboard (75% Wireless)",
    category: "Computing & Productivity",
    brand: "KeebCraft",
    price: 189.99,
    originalPrice: 229.99,
    rating: 4.8,
    reviewsCount: 98,
    stock: 24,
    badge: "STAFF PICK",
    description: "CNC milled anodized aluminum chassis, gasket-mounted hot-swappable tactile switches, and per-key RGB backlighting with multi-device 2.4GHz tri-mode wireless.",
    features: [
      "Gasket-mounted sound dampening with multi-layer PORON foam",
      "Hot-swappable sockets compatible with 3-pin and 5-pin MX switches",
      "Tri-mode connectivity: 2.4GHz Dongle, Bluetooth 5.2, USB-C Detachable",
      "CNC 6063 Aluminum chassis with magnetic storage slot",
      "Custom programmable rotary control knob for media and scrub"
    ],
    specs: {
      "Form Factor": "75% Compact (84 keys)",
      "Switch Type": "Gateron Oil King Lubricated Tactile",
      "Battery": "4000 mAh rechargeable Li-ion",
      "Keycaps": "Double-shot PBT Cherry Profile",
      "Polling Rate": "1000 Hz in 2.4GHz / Wired mode"
    },
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r3", name: "Marcus Chen", rating: 5, date: "2026-09-28", comment: "The acoustic typing profile is sublime. The gasket flex makes long coding sessions effortless." }
    ]
  },
  {
    id: "nx-103",
    title: "ChronoPulse Ultra Titanium Smartwatch",
    category: "Wearables & Health",
    brand: "ChronoLab",
    price: 499.00,
    originalPrice: 599.00,
    rating: 4.9,
    reviewsCount: 215,
    stock: 12,
    badge: "20% OFF",
    description: "Grade-5 aerospace titanium construction with sapphire crystal glass, continuous ECG & SpO2 biometric sensors, and dual-frequency offline GPS navigation.",
    features: [
      "1.43-inch LTPO AMOLED display with 2000 nits peak outdoor brightness",
      "Medical-grade optical HR, ECG, SpO2, and skin temperature monitoring",
      "100m Water Resistance (10 ATM) and MIL-STD-810H durability",
      "Up to 14 days standard usage or 48 hours continuous multi-band GPS",
      "Offline topographic maps with route breadcrumbs and emergency SOS"
    ],
    specs: {
      "Case Size": "47mm Grade-5 Titanium",
      "Glass": "Scratch-resistant Sapphire Crystal",
      "Sensors": "Optical HR, Bioimpedance, Compass, Barometer, Gyro",
      "Water Rating": "10 ATM (100 meters)",
      "Compatibility": "iOS & Android companion apps"
    },
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r4", name: "Sarah Jenkins", rating: 5, date: "2026-10-18", comment: "Replaced my dedicated dive watch. The screen legibility in direct sunlight is unreal." }
    ]
  },
  {
    id: "nx-104",
    title: "Lumina Edge Pro Mirrorless 4K Cinema Camera",
    category: "Photography & Gear",
    brand: "LuminaOptics",
    price: 1899.00,
    originalPrice: 2199.00,
    rating: 4.9,
    reviewsCount: 64,
    stock: 6,
    badge: "FLAGSHIP",
    description: "Compact full-frame 33MP sensor capable of 4K 120p 10-bit 4:2:2 internal recording, active sensor-shift IBIS, and real-time AI subject tracking autofocus.",
    features: [
      "33 Megapixel Full-Frame Back-Illuminated Exmor Sensor",
      "4K 60p oversampled from 7K and 4K 120p slow-motion capture",
      "5-axis in-body image stabilization (8 stops compensation)",
      "Dual UHS-II SD / CFexpress Type-A card slots",
      "Clean HDMI out, USB-C 10Gbps streaming, dedicated mic & headphone jacks"
    ],
    specs: {
      "Sensor": "35.9 x 23.9 mm Full-Frame BSI CMOS",
      "Video Codecs": "XAVC S-I, All-Intra 10-bit 4:2:2",
      "ISO Range": "100 - 51,200 (exp. 50 - 204,800)",
      "Viewfinder": "3.68M-dot OLED Electronic Viewfinder",
      "Weight": "658g (body with battery & memory card)"
    },
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r5", name: "Aaron Novak", rating: 5, date: "2026-10-09", comment: "Phenomenal color science and low-light dynamic range. A videographer dream rig." }
    ]
  },
  {
    id: "nx-105",
    title: "Aura Glow Smart Ambient Mood Lamp",
    category: "Smart Living & IoT",
    brand: "AuraHome",
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.7,
    reviewsCount: 88,
    stock: 35,
    badge: "TRENDING",
    description: "Architectural frosted glass sculpture with 16 million colors, dynamic circadian rhythm daylight simulation, and Matter over Thread ecosystem support.",
    features: [
      "Matter, Apple HomeKit, Google Home, and Alexa certified",
      "Circadian lighting auto-tunes color temperature to natural sun angle",
      "Sound-reactive ambient mode synchronizes to room music",
      "Ultra-low 1W night light mode with zero blue light emission",
      "Capacitive touch surface with smooth slide-to-dim control"
    ],
    specs: {
      "Luminous Flux": "1200 Lumens max",
      "Color Temperature": "1800K – 6500K Tunable White + RGB",
      "Connectivity": "Wi-Fi 6 (2.4GHz), Thread, Bluetooth LE",
      "Power": "18W USB-C PD Adapter included",
      "Lifespan": "50,000 hours continuous LED life"
    },
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r6", name: "Chloe Dupont", rating: 5, date: "2026-10-21", comment: "The sunrise alarm gently wakes me up without harsh alarm buzzers. Gorgeous design." }
    ]
  },
  {
    id: "nx-106",
    title: "Zenith Precision Ergonomic Wireless Mouse",
    category: "Computing & Productivity",
    brand: "KeebCraft",
    price: 99.00,
    originalPrice: 129.00,
    rating: 4.8,
    reviewsCount: 160,
    stock: 40,
    badge: "SALE",
    description: "Natural 57-degree vertical handshake angle for strain-free ergonomic productivity, MagSpeed electromagnetic scrolling, and 8K DPI darkfield sensor.",
    features: [
      "Natural 57° vertical posture reduces wrist muscle strain by 10%",
      "MagSpeed scroll wheel shifts from ratchet to hyper-fast free spin",
      "Darkfield 8000 DPI sensor tracks on virtually any surface, even glass",
      "Cross-computer control with flow clipboard sharing across 3 PCs",
      "70-day battery life on a single charge with 1-min quick charge"
    ],
    specs: {
      "Sensor": "Darkfield High Precision Optical (200 - 8000 DPI)",
      "Buttons": "6 programmable buttons + gesture button",
      "Weight": "135g balanced",
      "Battery": "Rechargeable Li-Po (500 mAh)",
      "Connectivity": "Logi Bolt USB Receiver & Bluetooth Low Energy"
    },
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r7", name: "Brian Kelly", rating: 5, date: "2026-10-25", comment: "Eliminated my carpal tunnel pain completely. The magnetic scroll wheel feels magic." }
    ]
  },
  {
    id: "nx-107",
    title: "Quantum Soundbar Pro with Wireless Subwoofer",
    category: "Audio & Acoustics",
    brand: "AeroSonics",
    price: 649.99,
    originalPrice: 799.99,
    rating: 4.9,
    reviewsCount: 75,
    stock: 9,
    badge: "LIMITED",
    description: "Immersive 7.1.4 Dolby Atmos & DTS:X home theater system with true up-firing transducers, room calibration microphone, and AirPlay 2 / Spotify Connect.",
    features: [
      "True 11-channel audio configuration with dedicated up-firing drivers",
      "Wireless 8-inch high-excursion subwoofer with room-filling bass",
      "SpaceFit Sound Pro automatically tunes acoustics to your room geometry",
      "4K HDMI eARC pass-through with Dolby Vision and HDR10+ support",
      "Integrated voice assistant with smart home audio synchronization"
    ],
    specs: {
      "Total Power": "580 Watts RMS",
      "Channels": "7.1.4 Surround",
      "Inputs": "1x HDMI eARC, 1x HDMI In, 1x Optical, Bluetooth 5.3, Wi-Fi",
      "Sound Formats": "Dolby Atmos, Dolby TrueHD, DTS:X, Hi-Res Audio 24-bit/192kHz",
      "Dimensions": "1110 x 60 x 120 mm (Bar)"
    },
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r8", name: "Rachel Adams", rating: 5, date: "2026-09-15", comment: "Watching movies in Dolby Atmos is completely theater-grade. Dialogue clarity is unreal." }
    ]
  },
  {
    id: "nx-108",
    title: "Oasis Nomad Weatherproof Tech Backpack (28L)",
    category: "Smart Living & IoT",
    brand: "NomadX",
    price: 159.00,
    originalPrice: 199.00,
    rating: 4.8,
    reviewsCount: 112,
    stock: 22,
    badge: "NEW",
    description: "Cordura 840D ballistic nylon weatherproof pack with dedicated drop-proof suspended laptop chamber, integrated USB-C pass-through, and luggage strap.",
    features: [
      "Cordura 840D recycled ballistic nylon with YKK AquaGuard stormproof zippers",
      "Suspended false-bottom compartment fits up to 16-inch laptops securely",
      "RFID-shielded hidden passport & wallet pocket for worry-free travel",
      "Ergonomic breathable EVA back panel and magnetic sternum strap",
      "Expandable side water bottle pockets and quick-access top tech organizer"
    ],
    specs: {
      "Capacity": "28 Liters (expandable to 32L)",
      "Dimensions": "50 x 32 x 20 cm",
      "Weight": "1.25 kg",
      "Materials": "Cordura 840D Ballistic Nylon + Hypalon Reinforcements",
      "Compatibility": "Laptops up to 16.5-inch and tablets up to 13-inch"
    },
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r9", name: "Leo Martinez", rating: 5, date: "2026-10-12", comment: "Survived a monsoon downpour in Tokyo without a single drop reaching my laptop." }
    ]
  },
  {
    id: "nx-109",
    title: "AeroDrone Phantom 4K Foldable Quadcopter",
    category: "Photography & Gear",
    brand: "LuminaOptics",
    price: 899.00,
    originalPrice: 1049.00,
    rating: 4.8,
    reviewsCount: 53,
    stock: 8,
    badge: "HOT",
    description: "Ultralight sub-249g foldable drone with 1/1.3-inch CMOS sensor, 4K 60fps HDR video, omnidirectional obstacle sensing, and 38-minute flight time.",
    features: [
      "Sub-249g regulation-friendly design requiring no FAA registration in most regions",
      "4K 60fps HDR video with true vertical shooting for social media creators",
      "Omnidirectional visual obstacle avoidance with APAS 5.0 navigation",
      "Up to 20 km FHD low-latency video transmission via O4 digital link",
      "Smart MasterShots automated cinematic flight trajectories"
    ],
    specs: {
      "Takeoff Weight": "249 grams",
      "Max Flight Time": "38 minutes per battery",
      "Max Speed": "16 m/s (Sport mode)",
      "Sensor": "1/1.3-inch CMOS, f/1.7 Dual Native ISO",
      "Wind Resistance": "10.7 m/s (Scale 5)"
    },
    images: [
      "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r10", name: "Samantha Wright", rating: 5, date: "2026-10-19", comment: "The gimbal stability in breezy coastal winds blew my expectations away. 10/10." }
    ]
  },
  {
    id: "nx-110",
    title: "PulseFlow Smart Hydration & Biomarker Flask",
    category: "Wearables & Health",
    brand: "ChronoLab",
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.6,
    reviewsCount: 42,
    stock: 28,
    badge: "ECO TECH",
    description: "Double-wall insulated stainless steel smart bottle that tracks daily water intake, UV-C self-cleaning sterilization, and syncs with Apple Health.",
    features: [
      "Built-in UV-C LED in cap destroys 99.99% of bacteria and odor in 60 seconds",
      "Liquid volume sensor automatically logs milliliter hydration into health apps",
      "OLED temperature touch display on top cap indicates sip warmth",
      "Keeps cold drinks chilled for 24 hours or piping hot for 12 hours",
      "Magnetic wireless charging dock with 30-day battery life"
    ],
    specs: {
      "Capacity": "710 ml (24 oz)",
      "Material": "Medical-grade 18/8 Pro stainless steel",
      "Battery": "Rechargeable Li-ion (magnetic puck included)",
      "App Support": "Apple Health, Google Fit, Strava",
      "BPA Free": "100% Non-toxic certified"
    },
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r11", name: "Justin Lee", rating: 4, date: "2026-10-05", comment: "The UV-C self-clean function is a game changer for keeping water smelling fresh all week." }
    ]
  },
  {
    id: "nx-111",
    title: "OmniStation Thunderbolt 4 Dual-4K Docking Station",
    category: "Computing & Productivity",
    brand: "KeebCraft",
    price: 279.99,
    originalPrice: 329.99,
    rating: 4.9,
    reviewsCount: 91,
    stock: 15,
    badge: "PRO PICK",
    description: "Enterprise Thunderbolt 4 hub delivering 96W Power Delivery, dual 4K @ 60Hz display outputs, 2.5Gbps Ethernet, and 40Gbps ultra-high bandwidth data transfers.",
    features: [
      "Single-cable connection with 96W host charging for Mac and Windows",
      "Supports Dual 4K @ 60Hz or single 8K @ 30Hz external monitor displays",
      "14-in-1 port layout including SD 4.0 UHS-II card reader and 2.5G LAN",
      "Passive thermal conduction aluminum enclosure with zero fan noise",
      "Daisy-chain up to 5 additional Thunderbolt accessories simultaneously"
    ],
    specs: {
      "Upstream": "1x Thunderbolt 4 (96W PD)",
      "Downstream": "3x Thunderbolt 4 (40Gbps, 15W)",
      "USB Ports": "4x USB-A 3.2 Gen 2 (10Gbps), 1x USB-C 3.2 Gen 2",
      "Ethernet": "1x RJ45 2.5 Gigabit Ethernet",
      "Audio": "3.5mm combo headphone/microphone jack"
    },
    images: [
      "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r12", name: "Patrick Stewart", rating: 5, date: "2026-09-22", comment: "Drives dual Studio Displays and all my audio gear with zero dropouts. Absolute workhorse." }
    ]
  },
  {
    id: "nx-112",
    title: "Nova Horizon OLED Smart Home Control Hub",
    category: "Smart Living & IoT",
    brand: "AuraHome",
    price: 229.00,
    originalPrice: 269.00,
    rating: 4.7,
    reviewsCount: 47,
    stock: 19,
    badge: "NEW",
    description: "Wall-mounted or desk-standing 8-inch glass touch controller for home automation, security cameras, smart thermostats, and multi-room audio zones.",
    features: [
      "8-inch edge-to-edge vibrant OLED touch panel with proximity wake sensor",
      "Controls lights, scenes, climate, blinds, and security with instant latency",
      "Intercom camera with privacy mechanical shutter and dual beamforming mics",
      "Built-in Zigbee 3.0, Z-Wave Plus, Matter, and Thread border router",
      "Customizable widgets for weather radar, calendar, and stock tickers"
    ],
    specs: {
      "Display": "8.0-inch AMOLED (1920 x 1200), 500 nits",
      "Protocols": "Matter, Thread, Zigbee 3.0, Wi-Fi 6, BLE 5.3",
      "Audio": "Stereo speakers with far-field voice recognition",
      "Mounting": "Universal magnetic wall plate or brushed aluminum desk stand",
      "Power": "PoE (Power over Ethernet) or 12V DC Adapter"
    },
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"
    ],
    reviews: [
      { id: "r13", name: "Diana Prince", rating: 5, date: "2026-10-15", comment: "Unified our entire smart home into one intuitive wall display that even guests can use easily." }
    ]
  }
];

// ----------------------------------------------------------------------------
// 2. REUSABLE TOAST MANAGER
// ----------------------------------------------------------------------------
class ToastManager {
  constructor() {
    this.container = document.querySelector('#toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    toast.innerHTML = `
      <span style="font-weight: 800; font-size: 1.1rem;">${icons[type] || 'ℹ'}</span>
      <span style="flex: 1;">${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  success(msg) { this.show(msg, 'success'); }
  error(msg) { this.show(msg, 'error'); }
  warning(msg) { this.show(msg, 'warning'); }
  info(msg) { this.show(msg, 'info'); }
}

const toast = new ToastManager();

// ----------------------------------------------------------------------------
// 3. ASYNCHRONOUS API & NETWORK SERVICE
// ----------------------------------------------------------------------------
const STORAGE_KEY_PRODUCTS = 'nexus_products_cache_v1';
const STORAGE_KEY_ORDERS = 'nexus_orders_v1';

class ApiService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      if (!localStorage.getItem(STORAGE_KEY_PRODUCTS)) {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for API cache:', e);
    }
  }

  getStoredProducts() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed reading products cache:', e);
    }
    return INITIAL_PRODUCTS;
  }

  saveProducts(products) {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed saving products cache:', e);
    }
  }

  delay(ms = 120) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getProducts(params = {}) {
    await this.delay(params.simulateDelay ? 400 : 100);
    let list = [...this.getStoredProducts()];

    if (params.category && params.category !== 'All' && params.category !== 'All Products') {
      list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }

    if (params.search && params.search.trim() !== '') {
      const query = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (params.maxPrice && params.maxPrice > 0) {
      list = list.filter((p) => p.price <= params.maxPrice);
    }

    if (params.minRating && params.minRating > 0) {
      list = list.filter((p) => p.rating >= params.minRating);
    }

    if (params.inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc': list.sort((a, b) => a.price - b.price); break;
        case 'price-desc': list.sort((a, b) => b.price - a.price); break;
        case 'rating-desc': list.sort((a, b) => b.rating - a.rating); break;
        case 'reviews-desc': list.sort((a, b) => b.reviewsCount - a.reviewsCount); break;
        case 'title-asc': list.sort((a, b) => a.title.localeCompare(b.title)); break;
        case 'featured':
        default: break;
      }
    }

    return { success: true, total: list.length, data: list };
  }

  async getProductById(id) {
    await this.delay(100);
    const products = this.getStoredProducts();
    const product = products.find((p) => p.id === id);

    if (!product) throw new Error(`Product with ID "${id}" was not found.`);

    const related = products
      .filter((p) => p.id !== id && p.category === product.category)
      .slice(0, 3);

    return { success: true, data: product, related };
  }

  async addReview(productId, reviewData) {
    await this.delay(200);
    const products = this.getStoredProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) throw new Error('Product not found');

    const newReview = {
      id: `rev-${Date.now()}`,
      name: reviewData.name || 'Anonymous Customer',
      rating: Number(reviewData.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment: reviewData.comment || 'Great product!',
      verified: true
    };

    product.reviews.unshift(newReview);
    product.reviewsCount = product.reviews.length;
    const totalScore = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((totalScore / product.reviewsCount).toFixed(1));

    this.saveProducts(products);
    return { success: true, review: newReview, updatedProduct: product };
  }

  async submitOrder(orderPayload) {
    await this.delay(500);
    const products = this.getStoredProducts();

    orderPayload.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.id);
      if (prod) prod.stock = Math.max(0, prod.stock - item.quantity);
    });
    this.saveProducts(products);

    const orderRecord = {
      ...orderPayload,
      orderId: `NX-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed'
    };

    try {
      const storedOrders = JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]');
      storedOrders.unshift(orderRecord);
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(storedOrders));
    } catch (e) {
      console.error('Failed saving order:', e);
    }

    return { success: true, order: orderRecord };
  }

  async getOrders() {
    await this.delay(80);
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS) || '[]');
    } catch (e) {
      return [];
    }
  }
}

const api = new ApiService();

// ----------------------------------------------------------------------------
// 4. REACTIVE STATE STORE
// ----------------------------------------------------------------------------
const STORAGE_KEYS = {
  CART: 'nexus_cart_v1',
  WISHLIST: 'nexus_wishlist_v1',
  THEME: 'nexus_theme_v1',
  CURRENCY: 'nexus_currency_v1',
  PROMO: 'nexus_promo_v1'
};

class Store {
  constructor() {
    this.listeners = new Set();
    this.state = {
      cart: this.loadStorage(STORAGE_KEYS.CART, []),
      wishlist: this.loadStorage(STORAGE_KEYS.WISHLIST, []),
      theme: this.loadStorage(STORAGE_KEYS.THEME, 'dark'),
      currency: this.loadStorage(STORAGE_KEYS.CURRENCY, 'INR'),
      promoCode: this.loadStorage(STORAGE_KEYS.PROMO, null),
      isCartDrawerOpen: false,
      quickViewProduct: null,
      lastOrder: null
    };

    this.applyTheme(this.state.theme);
  }

  loadStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  saveStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed persisting ${key}:`, e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state);
      } catch (err) {
        console.error('Error in store listener:', err);
      }
    });
  }

  toggleTheme() {
    const nextTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.state.theme = nextTheme;
    this.applyTheme(nextTheme);
    this.saveStorage(STORAGE_KEYS.THEME, nextTheme);
    this.notify();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  setCurrency(currencyCode) {
    if (CURRENCY_RATES[currencyCode]) {
      this.state.currency = currencyCode;
      this.saveStorage(STORAGE_KEYS.CURRENCY, currencyCode);
      this.notify();
    }
  }

  formatPrice(usdAmount) {
    const rateInfo = CURRENCY_RATES[this.state.currency] || CURRENCY_RATES.INR;
    const converted = usdAmount * rateInfo.rate;

    if (this.state.currency === 'INR') {
      return `${rateInfo.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${rateInfo.symbol}${converted.toFixed(2)}`;
  }

  addToCart(product, quantity = 1) {
    const existingIndex = this.state.cart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      const currentQty = this.state.cart[existingIndex].quantity;
      const maxAllowed = product.stock || 99;
      this.state.cart[existingIndex].quantity = Math.min(currentQty + quantity, maxAllowed);
    } else {
      this.state.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images ? product.images[0] : product.image,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock || 99)
      });
    }

    this.saveStorage(STORAGE_KEYS.CART, this.state.cart);
    this.notify();
  }

  updateCartQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    const item = this.state.cart.find((i) => i.id === productId);
    if (item) {
      item.quantity = Math.min(quantity, item.stock || 99);
      this.saveStorage(STORAGE_KEYS.CART, this.state.cart);
      this.notify();
    }
  }

  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter((item) => item.id !== productId);
    this.saveStorage(STORAGE_KEYS.CART, this.state.cart);
    this.notify();
  }

  clearCart() {
    this.state.cart = [];
    this.saveStorage(STORAGE_KEYS.CART, []);
    this.notify();
  }

  getCartCount() {
    return this.state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotals() {
    const subtotal = this.state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let freeShippingPromo = false;

    if (this.state.promoCode && PROMO_CODES[this.state.promoCode]) {
      const promo = PROMO_CODES[this.state.promoCode];
      if (!promo.minSpend || subtotal >= (promo.minSpend / 86.50)) {
        if (promo.discountPercent) {
          discount = (subtotal * promo.discountPercent) / 100;
        } else if (promo.discountFixed) {
          discount = Math.min(promo.discountFixed, subtotal);
        }
        if (promo.freeShipping) freeShippingPromo = true;
      }
    }

    const shipping = subtotal === 0 || subtotal >= 100 || freeShippingPromo ? 0 : 15.0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount > 0 ? taxableAmount * 0.08 : 0;
    const total = taxableAmount + shipping + tax;

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      freeShippingThreshold: 100,
      awayFromFreeShipping: Math.max(0, 100 - subtotal)
    };
  }

  applyPromoCode(code) {
    const normalized = (code || '').trim().toUpperCase();
    if (PROMO_CODES[normalized]) {
      this.state.promoCode = normalized;
      this.saveStorage(STORAGE_KEYS.PROMO, normalized);
      this.notify();
      return { success: true, promo: PROMO_CODES[normalized] };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  }

  removePromoCode() {
    this.state.promoCode = null;
    this.saveStorage(STORAGE_KEYS.PROMO, null);
    this.notify();
  }

  toggleWishlist(product) {
    const exists = this.state.wishlist.some((item) => item.id === product.id);
    if (exists) {
      this.state.wishlist = this.state.wishlist.filter((item) => item.id !== product.id);
    } else {
      this.state.wishlist.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images ? product.images[0] : product.image,
        category: product.category,
        brand: product.brand,
        stock: product.stock,
        rating: product.rating
      });
    }
    this.saveStorage(STORAGE_KEYS.WISHLIST, this.state.wishlist);
    this.notify();
    return !exists;
  }

  isInWishlist(productId) {
    return this.state.wishlist.some((item) => item.id === productId);
  }

  clearWishlist() {
    this.state.wishlist = [];
    this.saveStorage(STORAGE_KEYS.WISHLIST, []);
    this.notify();
  }

  openCartDrawer() { this.state.isCartDrawerOpen = true; this.notify(); }
  closeCartDrawer() { this.state.isCartDrawerOpen = false; this.notify(); }
  openQuickView(product) { this.state.quickViewProduct = product; this.notify(); }
  closeQuickView() { this.state.quickViewProduct = null; this.notify(); }
  setLastOrder(order) { this.state.lastOrder = order; this.notify(); }
}

const store = new Store();

// ----------------------------------------------------------------------------
// 5. CLIENT-SIDE SPA ROUTER
// ----------------------------------------------------------------------------
class Router {
  constructor(routes = [], options = {}) {
    this.routes = routes;
    this.viewport = document.querySelector(options.viewport || '#router-view');
    this.beforeHooks = [];
    this.afterHooks = [];
    this.currentRoute = null;

    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRouteChange());
    window.addEventListener('DOMContentLoaded', () => this.handleRouteChange());
  }

  beforeEach(hook) { this.beforeHooks.push(hook); }
  afterEach(hook) { this.afterHooks.push(hook); }

  parseHash() {
    const rawHash = window.location.hash.slice(1) || '/';
    const [pathPart, queryPart] = rawHash.split('?');
    const path = pathPart.startsWith('/') ? pathPart : '/' + pathPart;

    const query = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      for (const [key, val] of searchParams.entries()) {
        query[key] = val;
      }
    }
    return { path, query };
  }

  matchRoute(currentPath) {
    for (const route of this.routes) {
      if (route.path === currentPath) return { route, params: {} };

      const paramNames = [];
      const regexPath = route.path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
        paramNames.push(key);
        return '([^/]+)';
      });

      const regex = new RegExp(`^${regexPath}$`);
      const match = currentPath.match(regex);

      if (match) {
        const params = {};
        paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });
        return { route, params };
      }
    }

    const notFoundRoute = this.routes.find((r) => r.path === '*');
    return { route: notFoundRoute, params: {} };
  }

  async handleRouteChange() {
    const { path, query } = this.parseHash();
    const { route, params } = this.matchRoute(path);

    if (!route) return;

    const to = { path, params, query, route };
    const from = this.currentRoute;

    for (const hook of this.beforeHooks) {
      const proceed = await hook(to, from);
      if (proceed === false) return;
    }

    this.currentRoute = to;
    this.updateActiveNavLinks(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (this.viewport && route.component) {
      this.viewport.innerHTML = '';
      this.viewport.classList.remove('fade-in');
      void this.viewport.offsetWidth;
      this.viewport.classList.add('fade-in');

      try {
        await route.component.render(this.viewport, { params, query, router: this });
      } catch (err) {
        console.error('Error rendering route:', err);
        this.viewport.innerHTML = `
          <div class="container" style="padding: 4rem 1rem; text-align: center;">
            <h2>Render Error</h2>
            <p>${err.message}</p>
            <a href="#/" class="btn btn-primary" style="margin-top: 1rem;">Back to Store</a>
          </div>
        `;
      }
    }

    if (this.viewport) this.viewport.focus();
    for (const hook of this.afterHooks) hook(to, from);
  }

  updateActiveNavLinks(currentPath) {
    document.querySelectorAll('a[href^="#/"]').forEach((link) => {
      const href = link.getAttribute('href').replace('#', '').split('?')[0];
      if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// ----------------------------------------------------------------------------
// 6. UI COMPONENTS (ProductCard, Navbar, Footer, CartDrawer, QuickViewModal)
// ----------------------------------------------------------------------------
class ProductCard {
  static create(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    const isWishlisted = store.isInWishlist(product.id);
    const savePercent = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;

    card.innerHTML = `
      <div class="product-image-wrapper">
        <div class="product-badges">
          ${product.badge ? `<span class="badge badge-sale">${product.badge}</span>` : ''}
          ${savePercent > 0 ? `<span class="badge badge-new">-${savePercent}%</span>` : ''}
        </div>

        <div class="product-card-actions">
          <button class="card-action-btn wishlist-btn ${isWishlisted ? 'wishlisted' : ''}" 
                  title="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}" 
                  aria-label="Wishlist toggle">
            ♥
          </button>
        </div>

        <a href="#/product/${product.id}" aria-label="${product.title}">
          <img src="${product.images[0]}" 
               alt="${product.title}" 
               class="product-image" 
               loading="lazy" 
               width="400" 
               height="300" />
        </a>

        <button class="btn btn-secondary btn-sm quick-view-overlay-btn quickview-trigger-btn">
          Quick View
        </button>
      </div>

      <div class="product-card-body">
        <div class="product-category-row">
          <span>${product.category}</span>
          <span style="color: ${product.stock < 10 ? 'var(--color-brand-warning)' : 'var(--color-brand-success)'}; font-weight: 700;">
            ${product.stock < 10 ? `Only ${product.stock} left` : 'In Stock'}
          </span>
        </div>

        <h3 class="product-title">
          <a href="#/product/${product.id}">${product.title}</a>
        </h3>

        <div class="rating-row">
          <span>★ ${product.rating.toFixed(1)}</span>
          <span class="rating-count">(${product.reviewsCount})</span>
        </div>

        <div class="product-pricing-row">
          <span class="current-price">${store.formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price">${store.formatPrice(product.originalPrice)}</span>` : ''}
          ${savePercent > 0 ? `<span class="save-percent">Save ${savePercent}%</span>` : ''}
        </div>

        <div class="product-card-footer">
          <button class="btn btn-primary btn-add-cart add-cart-btn" ${product.stock === 0 ? 'disabled' : ''}>
            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    `;

    const wishlistBtn = card.querySelector('.wishlist-btn');
    wishlistBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const added = store.toggleWishlist(product);
      wishlistBtn.classList.toggle('wishlisted', added);
      if (added) toast.success(`Saved "${product.title}" to Wishlist!`);
      else toast.info(`Removed "${product.title}" from Wishlist.`);
    });

    const qvBtn = card.querySelector('.quickview-trigger-btn');
    qvBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      store.openQuickView(product);
    });

    const addCartBtn = card.querySelector('.add-cart-btn');
    addCartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (product.stock > 0) {
        store.addToCart(product, 1);
        toast.success(`Added "${product.title}" to your cart!`);
        store.openCartDrawer();
      }
    });

    return card;
  }
}

class Navbar {
  constructor(mountElement) {
    this.mount = mountElement;
    this.isMobileMenuOpen = false;
    store.subscribe(() => this.updateCounters());
  }

  render() {
    const state = store.state;

    this.mount.innerHTML = `
      <nav class="navbar" aria-label="Main Navigation">
        <div class="container navbar-container">
          <a href="#/" class="navbar-brand">
            <svg class="brand-icon" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#0f172a"/>
              <path d="M7 23L16 6L25 23L16 18L7 23Z" fill="url(#navBrandGrad)"/>
              <circle cx="16" cy="18" r="3" fill="#38bdf8"/>
              <defs>
                <linearGradient id="navBrandGrad" x1="7" y1="6" x2="25" y2="23" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#38bdf8"/>
                  <stop offset="0.5" stop-color="#6366f1"/>
                  <stop offset="1" stop-color="#ec4899"/>
                </linearGradient>
              </defs>
            </svg>
            <span>NEXUS<span class="brand-gradient">GEAR</span></span>
          </a>

          <ul class="nav-links" id="desktop-nav-links">
            <li><a href="#/" class="nav-link">Store Catalog</a></li>
            <li><a href="#/wishlist" class="nav-link">Wishlist</a></li>
            <li><a href="#/orders" class="nav-link">Order History</a></li>
            <li><a href="#/analytics" class="nav-link">Store Analytics</a></li>
          </ul>

          <div class="nav-actions">
            <select id="currency-select" class="sort-select" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; font-weight: 700;" aria-label="Select Currency">
              <option value="INR" ${state.currency === 'INR' ? 'selected' : ''}>INR (₹)</option>
              <option value="USD" ${state.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
              <option value="EUR" ${state.currency === 'EUR' ? 'selected' : ''}>EUR (€)</option>
              <option value="GBP" ${state.currency === 'GBP' ? 'selected' : ''}>GBP (£)</option>
            </select>

            <button id="theme-toggle-btn" class="action-btn" title="Toggle Theme" aria-label="Toggle Dark and Light theme">
              <span id="theme-icon">${state.theme === 'dark' ? '☀️' : '🌙'}</span>
            </button>

            <a href="#/wishlist" class="action-btn" title="View Wishlist" aria-label="View Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span class="badge-counter" id="nav-wishlist-count" style="${state.wishlist.length ? '' : 'display:none;'}">
                ${state.wishlist.length}
              </span>
            </a>

            <button id="cart-drawer-toggle-btn" class="action-btn" title="Open Shopping Cart" aria-label="Open Shopping Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span class="badge-counter" id="nav-cart-count" style="${store.getCartCount() ? '' : 'display:none;'}">
                ${store.getCartCount()}
              </span>
            </button>

            <button id="mobile-toggle-btn" class="action-btn mobile-nav-toggle" aria-label="Toggle Navigation Menu">
              ☰
            </button>
          </div>
        </div>

        <div id="mobile-nav-drawer" style="display: none; background: var(--color-bg-surface); border-bottom: 1px solid var(--color-border); padding: 1rem 1.5rem;">
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px;">
            <li><a href="#/" class="nav-link mobile-link">Store Catalog</a></li>
            <li><a href="#/wishlist" class="nav-link mobile-link">Wishlist (${state.wishlist.length})</a></li>
            <li><a href="#/orders" class="nav-link mobile-link">Order History</a></li>
            <li><a href="#/analytics" class="nav-link mobile-link">Store Analytics</a></li>
          </ul>
        </div>
      </nav>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const themeBtn = this.mount.querySelector('#theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        store.toggleTheme();
        const icon = this.mount.querySelector('#theme-icon');
        if (icon) icon.textContent = store.state.theme === 'dark' ? '☀️' : '🌙';
      });
    }

    const currencySelect = this.mount.querySelector('#currency-select');
    if (currencySelect) {
      currencySelect.addEventListener('change', (e) => {
        store.setCurrency(e.target.value);
      });
    }

    const cartBtn = this.mount.querySelector('#cart-drawer-toggle-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => store.openCartDrawer());
    }

    const mobileBtn = this.mount.querySelector('#mobile-toggle-btn');
    const mobileDrawer = this.mount.querySelector('#mobile-nav-drawer');
    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        mobileDrawer.style.display = this.isMobileMenuOpen ? 'block' : 'none';
      });

      this.mount.querySelectorAll('.mobile-link').forEach((link) => {
        link.addEventListener('click', () => {
          this.isMobileMenuOpen = false;
          mobileDrawer.style.display = 'none';
        });
      });
    }
  }

  updateCounters() {
    const cartCountEl = this.mount.querySelector('#nav-cart-count');
    const wishlistCountEl = this.mount.querySelector('#nav-wishlist-count');
    const totalCartCount = store.getCartCount();
    const totalWishlistCount = store.state.wishlist.length;

    if (cartCountEl) {
      cartCountEl.textContent = totalCartCount;
      cartCountEl.style.display = totalCartCount > 0 ? 'flex' : 'none';
    }
    if (wishlistCountEl) {
      wishlistCountEl.textContent = totalWishlistCount;
      wishlistCountEl.style.display = totalWishlistCount > 0 ? 'flex' : 'none';
    }
  }
}

class Footer {
  constructor(mountElement) {
    this.mount = mountElement;
  }

  render() {
    this.mount.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem;">NEXUS<span class="brand-gradient">GEAR</span></h3>
            <p>Architecting the future of human capability through precision hardware, intelligent audio, and high-performance computing instruments.</p>
            <div style="margin-top: 1rem; display: flex; gap: 8px;">
              <span class="badge badge-sale">Next-Gen Architecture</span>
              <span class="badge badge-new">Single Bundle Ready</span>
            </div>
          </div>

          <div class="footer-col">
            <h4>Catalog Categories</h4>
            <ul class="footer-links">
              <li><a href="#/?category=Audio%20%26%20Acoustics">Audio & Acoustics</a></li>
              <li><a href="#/?category=Computing%20%26%20Productivity">Computing & Tech</a></li>
              <li><a href="#/?category=Wearables%20%26%20Health">Wearables & Health</a></li>
              <li><a href="#/?category=Smart%20Living%20%26%20IoT">Smart Living & IoT</a></li>
              <li><a href="#/?category=Photography%20%26%20Gear">Photography & Gear</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Customer Experience</h4>
            <ul class="footer-links">
              <li><a href="#/orders">Track Shipment</a></li>
              <li><a href="#/wishlist">Saved Wishlist</a></li>
              <li><a href="#/cart">Shopping Cart</a></li>
              <li><a href="#/analytics">Store Analytics</a></li>
              <li><a href="#/">30-Day Money-Back</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Architecture</h4>
            <ul class="footer-links">
              <li><a href="#/">Modular Frontend Architecture</a></li>
              <li><a href="#/">Client-Side SPA Router</a></li>
              <li><a href="#/">Reactive State Store (Pub/Sub)</a></li>
              <li><a href="#/">Optimized Web Assets</a></li>
              <li><a href="#/">Zero Dependencies</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div>&copy; ${new Date().getFullYear()} NEXUS GEAR Platform. Built as a Web Development Capstone Project.</div>
          <div>Fast, Accessible, Production-Ready SPA.</div>
        </div>
      </div>
    `;
  }
}

class CartDrawer {
  constructor(mountElement) {
    this.mount = mountElement;
    store.subscribe(() => this.render());
  }

  render() {
    const { isCartDrawerOpen, cart, promoCode } = store.state;
    if (!isCartDrawerOpen) {
      this.mount.innerHTML = '';
      return;
    }

    const totals = store.getCartTotals();
    const progressPercent = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));

    this.mount.innerHTML = `
      <div class="drawer-backdrop" id="cart-drawer-backdrop" role="dialog" aria-modal="true" aria-label="Shopping Cart Drawer">
        <aside class="drawer-panel">
          <div class="drawer-header">
            <h3 style="font-size: 1.25rem;">Your Cart (${store.getCartCount()})</h3>
            <button class="modal-close-btn" id="close-drawer-btn" aria-label="Close cart drawer">&times;</button>
          </div>

          <div style="padding: 0.75rem 1.5rem; background: var(--color-bg-elevated); border-bottom: 1px solid var(--color-border);">
            <div style="font-size: 0.85rem; font-weight: 600; display: flex; justify-content: space-between;">
              <span>${totals.awayFromFreeShipping === 0 ? '🎉 You unlocked Free Express Shipping!' : `Add ${store.formatPrice(totals.awayFromFreeShipping)} more for FREE Shipping`}</span>
              <span>${progressPercent}%</span>
            </div>
            <div class="shipping-bar-track">
              <div class="shipping-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
          </div>

          <div class="drawer-body">
            ${
              cart.length === 0
                ? `
              <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🛍️</div>
                <h4 style="margin-bottom: 0.5rem; color: var(--color-text-primary);">Your Cart is Empty</h4>
                <p style="font-size: 0.9rem; margin-bottom: 1.5rem;">Discover our high-performance gear collection.</p>
                <button class="btn btn-primary" id="drawer-explore-btn">Explore Catalog</button>
              </div>
            `
                : cart
                    .map(
                      (item) => `
                <div class="cart-item-row" data-id="${item.id}">
                  <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
                  <div class="cart-item-info">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">${store.formatPrice(item.price)}</span>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
                      <div class="cart-qty-control">
                        <button class="cart-qty-btn qty-minus" data-id="${item.id}">−</button>
                        <span class="cart-qty-val">${item.quantity}</span>
                        <button class="cart-qty-btn qty-plus" data-id="${item.id}">+</button>
                      </div>
                      <button class="btn-ghost btn-sm remove-item-btn" data-id="${item.id}" style="color: var(--color-brand-danger); font-size: 0.8rem;">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              `
                    )
                    .join('')
            }
          </div>

          ${
            cart.length > 0
              ? `
            <div class="drawer-footer">
              <div class="promo-input-group">
                <input type="text" id="drawer-promo-input" class="form-control" placeholder="Promo code (NEXUS20)" value="${promoCode || ''}" style="text-transform: uppercase;" />
                <button class="btn btn-secondary btn-sm" id="drawer-apply-promo-btn">${promoCode ? 'Applied' : 'Apply'}</button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem;">
                <div style="display: flex; justify-content: space-between; color: var(--color-text-secondary);">
                  <span>Subtotal</span>
                  <span>${store.formatPrice(totals.subtotal)}</span>
                </div>
                ${
                  totals.discount > 0
                    ? `
                  <div style="display: flex; justify-content: space-between; color: var(--color-brand-accent); font-weight: 600;">
                    <span>Discount (${promoCode})</span>
                    <span>-${store.formatPrice(totals.discount)}</span>
                  </div>
                `
                    : ''
                }
                <div style="display: flex; justify-content: space-between; color: var(--color-text-secondary);">
                  <span>Shipping</span>
                  <span>${totals.shipping === 0 ? '<strong style="color: var(--color-brand-success);">FREE</strong>' : store.formatPrice(totals.shipping)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.15rem; color: var(--color-text-primary); border-top: 1px solid var(--color-border); padding-top: 6px;">
                  <span>Estimated Total</span>
                  <span style="color: var(--color-brand-primary);">${store.formatPrice(totals.total)}</span>
                </div>
              </div>

              <a href="#/checkout" class="btn btn-primary" id="drawer-checkout-btn" style="width: 100%;">
                Proceed to Checkout →
              </a>
              <a href="#/cart" class="btn btn-secondary btn-sm" id="drawer-view-cart-btn" style="width: 100%; text-align: center;">
                View Full Cart
              </a>
            </div>
          `
              : ''
          }
        </aside>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const backdrop = this.mount.querySelector('#cart-drawer-backdrop');
    const closeBtn = this.mount.querySelector('#close-drawer-btn');
    const exploreBtn = this.mount.querySelector('#drawer-explore-btn');
    const close = () => store.closeCartDrawer();

    if (backdrop) backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (exploreBtn) exploreBtn.addEventListener('click', () => { close(); window.location.hash = '#/'; });

    const checkoutBtn = this.mount.querySelector('#drawer-checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', close);

    const viewCartBtn = this.mount.querySelector('#drawer-view-cart-btn');
    if (viewCartBtn) viewCartBtn.addEventListener('click', close);

    this.mount.querySelectorAll('.qty-plus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = store.state.cart.find((i) => i.id === id);
        if (item) store.updateCartQuantity(id, item.quantity + 1);
      });
    });

    this.mount.querySelectorAll('.qty-minus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = store.state.cart.find((i) => i.id === id);
        if (item) store.updateCartQuantity(id, item.quantity - 1);
      });
    });

    this.mount.querySelectorAll('.remove-item-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.removeFromCart(id);
        toast.info('Item removed from cart.');
      });
    });

    const promoInput = this.mount.querySelector('#drawer-promo-input');
    const promoBtn = this.mount.querySelector('#drawer-apply-promo-btn');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const res = store.applyPromoCode(promoInput.value);
        if (res.success) toast.success(`Coupon applied! ${res.promo.description}`);
        else toast.error(res.message);
      });
    }
  }
}

class QuickViewModal {
  constructor(mountElement) {
    this.mount = mountElement;
    this.selectedQty = 1;
    store.subscribe(() => this.render());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && store.state.quickViewProduct) store.closeQuickView();
    });
  }

  render() {
    const product = store.state.quickViewProduct;
    if (!product) {
      this.mount.innerHTML = '';
      return;
    }

    this.selectedQty = 1;
    const savePercent = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;

    this.mount.innerHTML = `
      <div class="modal-backdrop" id="qv-backdrop" role="dialog" aria-modal="true" aria-label="${product.title} Quick View">
        <div class="modal-dialog">
          <button class="modal-close-btn" id="close-qv-btn" aria-label="Close modal">&times;</button>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem;">
            <div style="aspect-ratio: 4/3; border-radius: var(--radius-lg); overflow: hidden; background: var(--color-bg-elevated);">
              <img src="${product.images[0]}" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-brand-primary); font-weight: 700;">
                ${product.category} &bull; ${product.brand}
              </span>

              <h2 style="font-size: 1.5rem; line-height: 1.25;">${product.title}</h2>

              <div class="rating-row">
                <span>★ ${product.rating.toFixed(1)}</span>
                <span class="rating-count">(${product.reviewsCount} customer reviews)</span>
              </div>

              <div style="display: flex; align-items: baseline; gap: 8px; margin: 0.5rem 0;">
                <span class="detail-current-price" style="font-size: 1.75rem;">${store.formatPrice(product.price)}</span>
                ${product.originalPrice ? `<span class="detail-original-price">${store.formatPrice(product.originalPrice)}</span>` : ''}
                ${savePercent > 0 ? `<span class="badge badge-sale">-${savePercent}%</span>` : ''}
              </div>

              <p style="font-size: 0.9rem; line-height: 1.5;">${product.description}</p>

              <ul style="font-size: 0.85rem; color: var(--color-text-secondary); padding-left: 1.25rem; display: flex; flex-direction: column; gap: 4px;">
                ${product.features.slice(0, 3).map((f) => `<li>${f}</li>`).join('')}
              </ul>

              <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem;">
                <div class="qty-stepper">
                  <button class="qty-stepper-btn" id="qv-minus-btn">−</button>
                  <span class="qty-stepper-val" id="qv-qty-val">1</span>
                  <button class="qty-stepper-btn" id="qv-plus-btn">+</button>
                </div>
                <button class="btn btn-primary" id="qv-add-cart-btn" style="flex: 1;" ${product.stock === 0 ? 'disabled' : ''}>
                  ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              <div style="margin-top: 0.5rem; text-align: center;">
                <a href="#/product/${product.id}" id="qv-view-full-page" style="font-size: 0.88rem; color: var(--color-brand-primary); font-weight: 600; text-decoration: underline;">
                  View Full Specifications & Reviews &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(product);
  }

  bindEvents(product) {
    const backdrop = this.mount.querySelector('#qv-backdrop');
    const closeBtn = this.mount.querySelector('#close-qv-btn');
    const fullPageLink = this.mount.querySelector('#qv-view-full-page');
    const plusBtn = this.mount.querySelector('#qv-plus-btn');
    const minusBtn = this.mount.querySelector('#qv-minus-btn');
    const qtyVal = this.mount.querySelector('#qv-qty-val');
    const addCartBtn = this.mount.querySelector('#qv-add-cart-btn');

    const close = () => store.closeQuickView();
    if (backdrop) backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (fullPageLink) fullPageLink.addEventListener('click', close);

    if (plusBtn && minusBtn && qtyVal) {
      plusBtn.addEventListener('click', () => {
        if (this.selectedQty < (product.stock || 99)) {
          this.selectedQty++;
          qtyVal.textContent = this.selectedQty;
        }
      });
      minusBtn.addEventListener('click', () => {
        if (this.selectedQty > 1) {
          this.selectedQty--;
          qtyVal.textContent = this.selectedQty;
        }
      });
    }

    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        store.addToCart(product, this.selectedQty);
        toast.success(`Added ${this.selectedQty}x "${product.title}" to cart!`);
        close();
        store.openCartDrawer();
      });
    }
  }
}

// ----------------------------------------------------------------------------
// 7. VIEWS (Catalog, Detail, Cart, Checkout, Success, Wishlist, Orders, Analytics, 404)
// ----------------------------------------------------------------------------
class CatalogView {
  constructor() {
    this.filterState = {
      category: 'All Products',
      search: '',
      maxPrice: 2000,
      minRating: 0,
      inStockOnly: false,
      sortBy: 'featured'
    };
    this.products = [];
    this.searchDebounceTimer = null;
  }

  async render(container, { query }) {
    if (query && query.category) this.filterState.category = decodeURIComponent(query.category);
    if (query && query.search) this.filterState.search = decodeURIComponent(query.search);

    container.innerHTML = `
      <section class="hero-section">
        <div class="container hero-grid">
          <div>
            <div class="hero-badge-tag">
              <span>🚀</span> Web Development Capstone Project &bull; Full-Stack Deployment
            </div>
            <h1 class="hero-title">
              Engineered for <span class="brand-gradient">Peak Human Potential</span>
            </h1>
            <p class="hero-description">
              Explore our precision-crafted hardware catalog. From studio-grade acoustics to enterprise computing and aerospace wearables.
            </p>
            <div class="hero-actions">
              <a href="#catalog-browse-target" class="btn btn-primary btn-lg">Browse Catalog ↓</a>
              <a href="#/analytics" class="btn btn-secondary btn-lg">View Store Analytics</a>
            </div>
            <div class="hero-stats">
              <div class="stat-item">
                <h4>99.9%</h4>
                <p>Uptime & Reliability</p>
              </div>
              <div class="stat-item">
                <h4>12+</h4>
                <p>Flagship Items</p>
              </div>
              <div class="stat-item">
                <h4>4.9 ★</h4>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          <div class="hero-visual-card">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" 
                 alt="Next-Gen Hardware Rig" 
                 class="hero-visual-img" />
            <div class="hero-floating-pill">
              <div>
                <strong style="display:block; font-size: 0.9rem;">Nexus Apex Studio 2.0</strong>
                <span style="font-size: 0.8rem; color: var(--color-brand-primary);">Available in Stock</span>
              </div>
              <a href="#/product/nx-101" class="btn btn-primary btn-sm">Explore Specs</a>
            </div>
          </div>
        </div>
      </section>

      <section class="catalog-section" id="catalog-browse-target">
        <div class="container catalog-layout">
          <aside class="catalog-sidebar" aria-label="Product Filters">
            <div class="sidebar-header">
              <h3 style="font-size: 1.1rem;">Filters</h3>
              <button id="btn-reset-filters" class="btn-ghost btn-sm" style="font-size: 0.8rem; color: var(--color-brand-primary);">Reset All</button>
            </div>

            <div class="filter-group">
              <span class="filter-title">Category</span>
              <ul class="category-filter-list">
                ${CATEGORIES.map(
                  (cat) => `
                  <li>
                    <button class="category-filter-btn ${this.filterState.category === cat ? 'active' : ''}" data-category="${cat}">
                      <span>${cat}</span>
                    </button>
                  </li>
                `
                ).join('')}
              </ul>
            </div>

            <div class="filter-group">
              <span class="filter-title">Price Range</span>
              <div class="price-slider-wrapper">
                <input type="range" id="price-slider" class="price-range-inputs" min="50" max="2000" step="25" value="${this.filterState.maxPrice}" />
                <div class="price-display-tags">
                  <span>${store.formatPrice(50)}</span>
                  <span id="price-slider-readout">Max: ${store.formatPrice(this.filterState.maxPrice)}</span>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <span class="filter-title">Customer Rating</span>
              <select id="rating-filter" class="form-control" style="font-size: 0.85rem;">
                <option value="0" ${this.filterState.minRating === 0 ? 'selected' : ''}>All Ratings</option>
                <option value="4.8" ${this.filterState.minRating === 4.8 ? 'selected' : ''}>★ 4.8 & Above</option>
                <option value="4.7" ${this.filterState.minRating === 4.7 ? 'selected' : ''}>★ 4.7 & Above</option>
                <option value="4.5" ${this.filterState.minRating === 4.5 ? 'selected' : ''}>★ 4.5 & Above</option>
              </select>
            </div>

            <div class="filter-group">
              <label class="stock-toggle-label">
                <input type="checkbox" id="stock-only-checkbox" ${this.filterState.inStockOnly ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--color-brand-primary);" />
                <span>In-Stock Items Only</span>
              </label>
            </div>
          </aside>

          <div class="catalog-content">
            <div class="catalog-toolbar">
              <div class="search-bar-container">
                <div class="input-icon-wrapper">
                  <span class="input-icon">🔍</span>
                  <input type="text" id="catalog-search-input" class="form-control" placeholder="Search headphones, keyboards, cameras, specs..." value="${this.filterState.search}" />
                </div>
              </div>

              <div class="toolbar-controls">
                <span class="search-results-stats" id="catalog-count-badge">Loading...</span>
                <select id="sort-select" class="sort-select" aria-label="Sort Catalog">
                  <option value="featured" ${this.filterState.sortBy === 'featured' ? 'selected' : ''}>Featured First</option>
                  <option value="price-asc" ${this.filterState.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                  <option value="price-desc" ${this.filterState.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                  <option value="rating-desc" ${this.filterState.sortBy === 'rating-desc' ? 'selected' : ''}>Customer Rating</option>
                  <option value="reviews-desc" ${this.filterState.sortBy === 'reviews-desc' ? 'selected' : ''}>Most Popular</option>
                  <option value="title-asc" ${this.filterState.sortBy === 'title-asc' ? 'selected' : ''}>Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            <div class="active-filters-bar" id="active-filters-container"></div>
            <div class="product-grid" id="product-grid-container">
              ${Array(6).fill(0).map(() => `<div class="product-card skeleton" style="height: 380px;"></div>`).join('')}
            </div>
          </div>
        </div>
      </section>
    `;

    this.bindEvents(container);
    await this.fetchAndDisplayProducts(container);
  }

  async fetchAndDisplayProducts(container) {
    const grid = container.querySelector('#product-grid-container');
    const countBadge = container.querySelector('#catalog-count-badge');
    const filtersBar = container.querySelector('#active-filters-container');

    try {
      const response = await api.getProducts({
        category: this.filterState.category,
        search: this.filterState.search,
        maxPrice: this.filterState.maxPrice,
        minRating: this.filterState.minRating,
        inStockOnly: this.filterState.inStockOnly,
        sortBy: this.filterState.sortBy
      });

      this.products = response.data;
      if (countBadge) countBadge.textContent = `${this.products.length} product${this.products.length === 1 ? '' : 's'} found`;
      this.renderActiveFilterPills(filtersBar, container);

      if (grid) {
        grid.innerHTML = '';
        if (this.products.length === 0) {
          grid.innerHTML = `
            <div class="catalog-empty-state" style="grid-column: 1 / -1;">
              <div class="empty-icon">🔍</div>
              <h3>No matching gear found</h3>
              <p style="margin: 0.5rem 0 1.5rem;">Try relaxing your filters, searching for another keyword, or resetting your parameters.</p>
              <button class="btn btn-primary" id="btn-empty-reset">Reset All Filters</button>
            </div>
          `;
          const emptyResetBtn = grid.querySelector('#btn-empty-reset');
          if (emptyResetBtn) emptyResetBtn.addEventListener('click', () => this.resetFilters(container));
        } else {
          this.products.forEach((prod) => grid.appendChild(ProductCard.create(prod)));
        }
      }
    } catch (err) {
      if (grid) grid.innerHTML = `<div class="catalog-empty-state" style="grid-column: 1 / -1;"><p>Error: ${err.message}</p></div>`;
    }
  }

  renderActiveFilterPills(container, root) {
    if (!container) return;
    container.innerHTML = '';
    const pills = [];

    if (this.filterState.category !== 'All Products') pills.push({ label: `Category: ${this.filterState.category}`, key: 'category' });
    if (this.filterState.search) pills.push({ label: `Search: "${this.filterState.search}"`, key: 'search' });
    if (this.filterState.maxPrice < 2000) pills.push({ label: `Max Price: ${store.formatPrice(this.filterState.maxPrice)}`, key: 'maxPrice' });
    if (this.filterState.minRating > 0) pills.push({ label: `Rating: ★ ${this.filterState.minRating}+`, key: 'minRating' });
    if (this.filterState.inStockOnly) pills.push({ label: 'In-Stock Only', key: 'inStockOnly' });

    pills.forEach((p) => {
      const pill = document.createElement('span');
      pill.className = 'active-filter-pill';
      pill.innerHTML = `<span>${p.label}</span><span class="filter-remove-x" data-key="${p.key}">&times;</span>`;
      pill.querySelector('.filter-remove-x').addEventListener('click', () => {
        if (p.key === 'category') this.filterState.category = 'All Products';
        if (p.key === 'search') {
          this.filterState.search = '';
          const s = root.querySelector('#catalog-search-input');
          if (s) s.value = '';
        }
        if (p.key === 'maxPrice') {
          this.filterState.maxPrice = 2000;
          const sl = root.querySelector('#price-slider');
          if (sl) sl.value = 2000;
        }
        if (p.key === 'minRating') {
          this.filterState.minRating = 0;
          const r = root.querySelector('#rating-filter');
          if (r) r.value = 0;
        }
        if (p.key === 'inStockOnly') {
          this.filterState.inStockOnly = false;
          const st = root.querySelector('#stock-only-checkbox');
          if (st) st.checked = false;
        }
        this.fetchAndDisplayProducts(root);
      });
      container.appendChild(pill);
    });
  }

  resetFilters(container) {
    this.filterState = { category: 'All Products', search: '', maxPrice: 2000, minRating: 0, inStockOnly: false, sortBy: 'featured' };
    const searchInput = container.querySelector('#catalog-search-input');
    if (searchInput) searchInput.value = '';
    const priceSlider = container.querySelector('#price-slider');
    if (priceSlider) priceSlider.value = 2000;
    const priceReadout = container.querySelector('#price-slider-readout');
    if (priceReadout) priceReadout.textContent = `Max: ${store.formatPrice(2000)}`;
    const ratingFilter = container.querySelector('#rating-filter');
    if (ratingFilter) ratingFilter.value = 0;
    const stockCheck = container.querySelector('#stock-only-checkbox');
    if (stockCheck) stockCheck.checked = false;
    const sortSelect = container.querySelector('#sort-select');
    if (sortSelect) sortSelect.value = 'featured';

    container.querySelectorAll('.category-filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === 'All Products');
    });

    this.fetchAndDisplayProducts(container);
  }

  bindEvents(container) {
    container.querySelectorAll('.category-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.category-filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterState.category = btn.getAttribute('data-category');
        this.fetchAndDisplayProducts(container);
      });
    });

    const searchInput = container.querySelector('#catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = setTimeout(() => {
          this.filterState.search = e.target.value;
          this.fetchAndDisplayProducts(container);
        }, 250);
      });
    }

    const priceSlider = container.querySelector('#price-slider');
    const priceReadout = container.querySelector('#price-slider-readout');
    if (priceSlider && priceReadout) {
      priceSlider.addEventListener('input', (e) => {
        this.filterState.maxPrice = Number(e.target.value);
        priceReadout.textContent = `Max: ${store.formatPrice(this.filterState.maxPrice)}`;
      });
      priceSlider.addEventListener('change', () => this.fetchAndDisplayProducts(container));
    }

    const ratingFilter = container.querySelector('#rating-filter');
    if (ratingFilter) {
      ratingFilter.addEventListener('change', (e) => {
        this.filterState.minRating = Number(e.target.value);
        this.fetchAndDisplayProducts(container);
      });
    }

    const stockCheck = container.querySelector('#stock-only-checkbox');
    if (stockCheck) {
      stockCheck.addEventListener('change', (e) => {
        this.filterState.inStockOnly = e.target.checked;
        this.fetchAndDisplayProducts(container);
      });
    }

    const sortSelect = container.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.filterState.sortBy = e.target.value;
        this.fetchAndDisplayProducts(container);
      });
    }

    const resetBtn = container.querySelector('#btn-reset-filters');
    if (resetBtn) resetBtn.addEventListener('click', () => this.resetFilters(container));
  }
}

class ProductDetailView {
  constructor() {
    this.selectedQuantity = 1;
  }

  async render(container, { params }) {
    this.selectedQuantity = 1;
    container.innerHTML = `<div class="container detail-view"><div class="skeleton" style="height: 500px; border-radius: var(--radius-xl);"></div></div>`;

    try {
      const response = await api.getProductById(params.id);
      const product = response.data;
      const related = response.related;
      const isWishlisted = store.isInWishlist(product.id);
      const savePercent = product.originalPrice 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
        : 0;

      container.innerHTML = `
        <div class="container detail-view">
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            <a href="#/">Store</a>
            <span>/</span>
            <a href="#/?category=${encodeURIComponent(product.category)}">${product.category}</a>
            <span>/</span>
            <span style="color: var(--color-text-primary); font-weight: 600;">${product.title}</span>
          </nav>

          <div class="detail-grid">
            <div class="detail-gallery">
              <div class="main-image-display">
                <img id="detail-main-img" src="${product.images[0]}" alt="${product.title}" />
              </div>
              <div class="thumbnails-row">
                ${product.images.map((imgUrl, index) => `
                  <button class="thumb-btn ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="View photo ${index + 1}">
                    <img src="${imgUrl}" alt="Angle ${index + 1}" />
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="detail-info">
              <div>
                <span class="badge badge-featured" style="margin-bottom: 0.5rem;">${product.brand}</span>
                <h1 style="font-size: 2.25rem; margin-bottom: 0.5rem;">${product.title}</h1>
                <div class="rating-row" style="font-size: 0.95rem;">
                  <span>★ ${product.rating.toFixed(1)}</span>
                  <span class="rating-count">(${product.reviewsCount} verified customer reviews)</span>
                  <span style="color: var(--color-border);">&bull;</span>
                  <span style="color: ${product.stock > 0 ? 'var(--color-brand-success)' : 'var(--color-brand-danger)'}; font-weight: 700;">
                    ${product.stock > 0 ? `In Stock (${product.stock} units)` : 'Sold Out'}
                  </span>
                </div>
              </div>

              <div class="detail-price-box">
                <span class="detail-current-price">${store.formatPrice(product.price)}</span>
                ${product.originalPrice ? `<span class="detail-original-price">${store.formatPrice(product.originalPrice)}</span>` : ''}
                ${savePercent > 0 ? `<span class="badge badge-sale">Save ${savePercent}%</span>` : ''}
              </div>

              <p style="font-size: 1.05rem; line-height: 1.6;">${product.description}</p>

              <div style="background: var(--color-bg-surface); padding: 1rem 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
                <strong style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-primary);">
                  Key Engineering Highlights
                </strong>
                <ul style="padding-left: 1.25rem; display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem; color: var(--color-text-secondary);">
                  ${product.features.map((f) => `<li>${f}</li>`).join('')}
                </ul>
              </div>

              <div class="qty-cta-row">
                <div class="qty-stepper">
                  <button class="qty-stepper-btn" id="detail-qty-minus">−</button>
                  <span class="qty-stepper-val" id="detail-qty-val">1</span>
                  <button class="qty-stepper-btn" id="detail-qty-plus">+</button>
                </div>

                <button class="btn btn-primary btn-lg" id="detail-add-cart-btn" style="flex: 1;" ${product.stock === 0 ? 'disabled' : ''}>
                  ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                </button>

                <button class="btn-icon btn-lg" id="detail-wishlist-toggle-btn" title="Save to wishlist" style="${isWishlisted ? 'color: var(--color-brand-accent);' : ''}">
                  ♥
                </button>
              </div>

              <div class="detail-perks">
                <div class="perk-item"><span class="perk-icon">⚡</span><strong>Fast Delivery</strong><span>Express Dispatch</span></div>
                <div class="perk-item"><span class="perk-icon">🛡️</span><strong>2-Year Warranty</strong><span>Global Coverage</span></div>
                <div class="perk-item"><span class="perk-icon">🔄</span><strong>30-Day Guarantee</strong><span>Hassle-Free Returns</span></div>
              </div>
            </div>
          </div>

          <div class="detail-tabs-section">
            <h2>Technical Specifications</h2>
            <table class="specs-table">
              <tbody>
                ${Object.entries(product.specs).map(([key, val]) => `<tr><td>${key}</td><td>${val}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>

          <div class="detail-tabs-section">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h2>Customer Experience & Reviews</h2>
                <p>Real verified feedback from global owners.</p>
              </div>
              <button class="btn btn-outline" id="btn-toggle-review-form">Write a Customer Review ✍️</button>
            </div>

            <form id="new-review-form" style="display: none; background: var(--color-bg-surface); padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border); margin-bottom: 2rem;">
              <h3 style="margin-bottom: 1rem; font-size: 1.2rem;">Share Your Experience</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div class="form-group">
                  <label class="form-label" for="review-author">Your Name / Title</label>
                  <input type="text" id="review-author" class="form-control" placeholder="e.g. Alex Morgan" required />
                </div>
                <div class="form-group">
                  <label class="form-label" for="review-rating">Rating (1 to 5 Stars)</label>
                  <select id="review-rating" class="form-control">
                    <option value="5">★★★★★ (5 - Outstanding)</option>
                    <option value="4">★★★★☆ (4 - Very Good)</option>
                    <option value="3">★★★☆☆ (3 - Average)</option>
                    <option value="2">★★☆☆☆ (2 - Below Expectations)</option>
                    <option value="1">★☆☆☆☆ (1 - Poor)</option>
                  </select>
                </div>
              </div>
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label" for="review-comment">Review Details</label>
                <textarea id="review-comment" class="form-control" rows="3" placeholder="Describe the performance, ergonomics, and build quality..." required></textarea>
              </div>
              <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button type="button" class="btn btn-ghost" id="btn-cancel-review">Cancel</button>
                <button type="submit" class="btn btn-primary">Submit Verified Review</button>
              </div>
            </form>

            <div id="reviews-list-container" style="display: flex; flex-direction: column; gap: 1rem;">
              ${product.reviews.map((r) => `
                <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <div>
                      <strong style="color: var(--color-text-primary);">${r.name}</strong>
                      <span class="badge badge-stock" style="margin-left: 8px;">Verified Buyer</span>
                    </div>
                    <span style="font-size: 0.85rem; color: var(--color-text-muted);">${r.date}</span>
                  </div>
                  <div style="color: #f59e0b; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
                  </div>
                  <p style="font-size: 0.95rem;">${r.comment}</p>
                </div>
              `).join('')}
            </div>
          </div>

          ${
            related && related.length > 0
              ? `
            <div class="detail-tabs-section">
              <h2 style="margin-bottom: 1.5rem;">You May Also Like</h2>
              <div class="product-grid">
                ${related.map((rp) => `<div class="related-card-slot" data-id="${rp.id}"></div>`).join('')}
              </div>
            </div>
          `
              : ''
          }
        </div>
      `;

      if (related && related.length > 0) {
        related.forEach((rp) => {
          const slot = container.querySelector(`.related-card-slot[data-id="${rp.id}"]`);
          if (slot) slot.replaceWith(ProductCard.create(rp));
        });
      }

      this.bindEvents(container, product);
    } catch (err) {
      container.innerHTML = `
        <div class="container" style="padding: 5rem 1rem; text-align: center;">
          <h2>Product Not Found</h2>
          <p style="margin: 1rem 0 2rem;">The requested equipment item does not exist or has been discontinued.</p>
          <a href="#/" class="btn btn-primary">Return to Catalog</a>
        </div>
      `;
    }
  }

  bindEvents(container, product) {
    const mainImg = container.querySelector('#detail-main-img');
    const thumbBtns = container.querySelectorAll('.thumb-btn');

    thumbBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        thumbBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const idx = Number(btn.getAttribute('data-index'));
        if (mainImg && product.images[idx]) mainImg.src = product.images[idx];
      });
    });

    const qtyVal = container.querySelector('#detail-qty-val');
    const qtyPlus = container.querySelector('#detail-qty-plus');
    const qtyMinus = container.querySelector('#detail-qty-minus');

    if (qtyPlus && qtyMinus && qtyVal) {
      qtyPlus.addEventListener('click', () => {
        if (this.selectedQuantity < (product.stock || 99)) {
          this.selectedQuantity++;
          qtyVal.textContent = this.selectedQuantity;
        }
      });
      qtyMinus.addEventListener('click', () => {
        if (this.selectedQuantity > 1) {
          this.selectedQuantity--;
          qtyVal.textContent = this.selectedQuantity;
        }
      });
    }

    const addCartBtn = container.querySelector('#detail-add-cart-btn');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        store.addToCart(product, this.selectedQuantity);
        toast.success(`Added ${this.selectedQuantity}x "${product.title}" to cart!`);
        store.openCartDrawer();
      });
    }

    const wishlistBtn = container.querySelector('#detail-wishlist-toggle-btn');
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        const added = store.toggleWishlist(product);
        wishlistBtn.style.color = added ? 'var(--color-brand-accent)' : '';
        if (added) toast.success(`Saved "${product.title}" to wishlist!`);
        else toast.info(`Removed "${product.title}" from wishlist.`);
      });
    }

    const toggleReviewBtn = container.querySelector('#btn-toggle-review-form');
    const reviewForm = container.querySelector('#new-review-form');
    const cancelReviewBtn = container.querySelector('#btn-cancel-review');

    if (toggleReviewBtn && reviewForm) {
      toggleReviewBtn.addEventListener('click', () => {
        reviewForm.style.display = reviewForm.style.display === 'none' ? 'block' : 'none';
      });

      if (cancelReviewBtn) {
        cancelReviewBtn.addEventListener('click', () => { reviewForm.style.display = 'none'; });
      }

      reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const author = container.querySelector('#review-author').value;
        const rating = Number(container.querySelector('#review-rating').value);
        const comment = container.querySelector('#review-comment').value;

        try {
          const res = await api.addReview(product.id, { name: author, rating, comment });
          toast.success('Your verified review was published!');
          reviewForm.reset();
          reviewForm.style.display = 'none';

          const listContainer = container.querySelector('#reviews-list-container');
          if (listContainer) {
            const newCard = document.createElement('div');
            newCard.style.cssText = 'background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.25rem;';
            newCard.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div>
                  <strong style="color: var(--color-text-primary);">${res.review.name}</strong>
                  <span class="badge badge-stock" style="margin-left: 8px;">Verified Buyer</span>
                </div>
                <span style="font-size: 0.85rem; color: var(--color-text-muted);">${res.review.date}</span>
              </div>
              <div style="color: #f59e0b; font-size: 0.9rem; margin-bottom: 0.5rem;">
                ${'★'.repeat(res.review.rating)}${'☆'.repeat(5 - res.review.rating)}
              </div>
              <p style="font-size: 0.95rem;">${res.review.comment}</p>
            `;
            listContainer.prepend(newCard);
          }
        } catch (err) {
          toast.error(err.message);
        }
      });
    }
  }
}

class CartView {
  render(container) {
    const { cart, promoCode } = store.state;
    const totals = store.getCartTotals();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="container cart-view" style="text-align: center; padding: 5rem 1rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
          <h2>Your Cart is Currently Empty</h2>
          <p style="margin: 0.5rem 0 2rem;">Explore our high-performance hardware and audio instruments.</p>
          <a href="#/" class="btn btn-primary btn-lg">Browse Store Catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="container cart-view">
        <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.5rem;">
          <h1>Shopping Cart <span style="font-size: 1.2rem; color: var(--color-text-muted);">(${store.getCartCount()} items)</span></h1>
          <button class="btn-ghost btn-sm" id="btn-clear-cart" style="color: var(--color-brand-danger);">Clear Entire Cart</button>
        </div>

        <div class="cart-grid">
          <div class="cart-items-panel">
            ${cart.map((item) => `
              <div class="cart-item-row" data-id="${item.id}" style="padding: 1rem 0;">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img" style="width: 90px; height: 90px;" />
                <div class="cart-item-info" style="gap: 6px;">
                  <a href="#/product/${item.id}" style="font-weight: 700; font-size: 1.05rem;">${item.title}</a>
                  <span style="font-size: 0.85rem; color: var(--color-text-muted);">${item.category} &bull; ${item.brand}</span>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                      <div class="cart-qty-control">
                        <button class="cart-qty-btn cart-page-qty-minus" data-id="${item.id}">−</button>
                        <span class="cart-qty-val">${item.quantity}</span>
                        <button class="cart-qty-btn cart-page-qty-plus" data-id="${item.id}">+</button>
                      </div>
                      <button class="btn-ghost btn-sm cart-page-remove-btn" data-id="${item.id}" style="color: var(--color-brand-danger);">
                        Remove
                      </button>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-weight: 800; font-size: 1.15rem; color: var(--color-brand-primary);">
                        ${store.formatPrice(item.price * item.quantity)}
                      </div>
                      <div style="font-size: 0.8rem; color: var(--color-text-muted);">
                        ${store.formatPrice(item.price)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}

            <div style="margin-top: 1.5rem;">
              <a href="#/" class="btn btn-outline btn-sm">&larr; Continue Browsing</a>
            </div>
          </div>

          <div class="order-summary-card">
            <h3 style="font-size: 1.25rem;">Order Summary</h3>
            <div class="promo-input-group">
              <input type="text" id="cart-promo-input" class="form-control" placeholder="Promo code (NEXUS20)" value="${promoCode || ''}" style="text-transform: uppercase;" />
              <button class="btn btn-secondary btn-sm" id="cart-apply-promo-btn">${promoCode ? 'Applied' : 'Apply'}</button>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div class="summary-row"><span>Items Subtotal</span><span>${store.formatPrice(totals.subtotal)}</span></div>
              ${totals.discount > 0 ? `<div class="summary-row" style="color: var(--color-brand-accent); font-weight: 600;"><span>Promo Discount (${promoCode})</span><span>-${store.formatPrice(totals.discount)}</span></div>` : ''}
              <div class="summary-row"><span>Estimated Shipping</span><span>${totals.shipping === 0 ? '<strong style="color: var(--color-brand-success);">FREE</strong>' : store.formatPrice(totals.shipping)}</span></div>
              <div class="summary-row"><span>Estimated Sales Tax (8%)</span><span>${store.formatPrice(totals.tax)}</span></div>
              <div class="summary-row total-row"><span>Total Amount</span><span style="color: var(--color-brand-primary);">${store.formatPrice(totals.total)}</span></div>
            </div>

            <a href="#/checkout" class="btn btn-primary btn-lg" style="width: 100%; text-align: center;">
              Proceed to Secure Checkout &rarr;
            </a>
            <div style="text-align: center; font-size: 0.8rem; color: var(--color-text-muted);">
              🔒 256-Bit SSL Encrypted Enterprise Checkout
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    container.querySelectorAll('.cart-page-qty-plus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = store.state.cart.find((i) => i.id === id);
        if (item) {
          store.updateCartQuantity(id, item.quantity + 1);
          this.render(container);
        }
      });
    });

    container.querySelectorAll('.cart-page-qty-minus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = store.state.cart.find((i) => i.id === id);
        if (item) {
          store.updateCartQuantity(id, item.quantity - 1);
          this.render(container);
        }
      });
    });

    container.querySelectorAll('.cart-page-remove-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        store.removeFromCart(id);
        toast.info('Item removed from cart.');
        this.render(container);
      });
    });

    const clearBtn = container.querySelector('#btn-clear-cart');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire cart?')) {
          store.clearCart();
          toast.info('Cart cleared.');
          this.render(container);
        }
      });
    }

    const promoInput = container.querySelector('#cart-promo-input');
    const promoBtn = container.querySelector('#cart-apply-promo-btn');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const res = store.applyPromoCode(promoInput.value);
        if (res.success) {
          toast.success(`Coupon applied! ${res.promo.description}`);
          this.render(container);
        } else {
          toast.error(res.message);
        }
      });
    }
  }
}

class CheckoutView {
  render(container) {
    const { cart, promoCode } = store.state;
    const totals = store.getCartTotals();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="container checkout-view" style="text-align: center; padding: 5rem 1rem;">
          <h2>Your Cart is Empty</h2>
          <p style="margin: 1rem 0 2rem;">Add items to your cart before proceeding to checkout.</p>
          <a href="#/" class="btn btn-primary">Return to Catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="container checkout-view">
        <h1 style="margin-bottom: 2rem;">Secure Checkout</h1>

        <form id="checkout-form" class="checkout-grid" novalidate>
          <div class="checkout-steps-panel">
            <div style="margin-bottom: 2rem;">
              <h3 style="font-size: 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
                <span style="background: var(--color-brand-primary); color: #090d16; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800;">1</span>
                Contact & Shipping Address
              </h3>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label" for="ship-first-name">First Name *</label>
                  <input type="text" id="ship-first-name" class="form-control" required placeholder="Alex" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="ship-last-name">Last Name *</label>
                  <input type="text" id="ship-last-name" class="form-control" required placeholder="Vance" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="ship-email">Email Address *</label>
                <input type="email" id="ship-email" class="form-control" required placeholder="alex.vance@enterprise.com" />
              </div>

              <div class="form-group">
                <label class="form-label" for="ship-address">Street Address *</label>
                <input type="text" id="ship-address" class="form-control" required placeholder="742 Evergreen Terrace, Suite 400" />
              </div>

              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                  <label class="form-label" for="ship-city">City *</label>
                  <input type="text" id="ship-city" class="form-control" required placeholder="Bengaluru" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="ship-state">State / Province *</label>
                  <input type="text" id="ship-state" class="form-control" required placeholder="Karnataka" />
                </div>
                <div class="form-group">
                  <label class="form-label" for="ship-zip">Zip / Postal *</label>
                  <input type="text" id="ship-zip" class="form-control" required placeholder="560001" />
                </div>
              </div>
            </div>

            <div style="margin-bottom: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
              <h3 style="font-size: 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
                <span style="background: var(--color-brand-primary); color: #090d16; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800;">2</span>
                Shipping Method
              </h3>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <label style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border: 1px solid var(--color-brand-primary); border-radius: var(--radius-md); background: rgba(56, 189, 248, 0.05); cursor: pointer;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="radio" name="shipping-method" value="standard" checked style="accent-color: var(--color-brand-primary);" />
                    <div>
                      <strong style="display: block; font-size: 0.95rem;">Expedited Global Courier</strong>
                      <span style="font-size: 0.8rem; color: var(--color-text-secondary);">Delivered within 2 - 4 business days</span>
                    </div>
                  </div>
                  <span style="font-weight: 700; color: var(--color-brand-primary);">${totals.shipping === 0 ? 'FREE' : store.formatPrice(totals.shipping)}</span>
                </label>
              </div>
            </div>

            <div style="border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
              <h3 style="font-size: 1.15rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;">
                <span style="background: var(--color-brand-primary); color: #090d16; width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 800;">3</span>
                Payment Method (Sandboxed)
              </h3>

              <div style="display: flex; gap: 10px; margin-bottom: 1.25rem;">
                <button type="button" class="btn btn-secondary btn-sm payment-tab active" data-type="card">💳 Credit/Debit Card</button>
                <button type="button" class="btn btn-secondary btn-sm payment-tab" data-type="upi">📱 UPI / QR</button>
                <button type="button" class="btn btn-secondary btn-sm payment-tab" data-type="paypal">🅿 PayPal</button>
              </div>

              <div id="card-payment-fields">
                <div class="form-group">
                  <label class="form-label" for="card-number">Card Number</label>
                  <input type="text" id="card-number" class="form-control" placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242" value="4242 4242 4242 4242" required />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label class="form-label" for="card-expiry">Expiry Date</label>
                    <input type="text" id="card-expiry" class="form-control" placeholder="MM/YY" value="12/28" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="card-cvc">CVC / CVV</label>
                    <input type="text" id="card-cvc" class="form-control" placeholder="123" value="888" required />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="order-summary-card">
            <h3 style="font-size: 1.25rem;">Order Review</h3>
            <div style="display: flex; flex-direction: column; gap: 8px; max-height: 240px; overflow-y: auto; padding-right: 4px;">
              ${cart.map((i) => `
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${i.image}" alt="${i.title}" style="width: 40px; height: 40px; border-radius: var(--radius-sm); object-fit: cover;" />
                    <div>
                      <span style="font-weight: 600; display: block; max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${i.title}</span>
                      <span style="color: var(--color-text-muted);">Qty: ${i.quantity}</span>
                    </div>
                  </div>
                  <span style="font-weight: 700;">${store.formatPrice(i.price * i.quantity)}</span>
                </div>
              `).join('')}
            </div>

            <div style="border-top: 1px solid var(--color-border); padding-top: 1rem; display: flex; flex-direction: column; gap: 6px;">
              <div class="summary-row"><span>Subtotal</span><span>${store.formatPrice(totals.subtotal)}</span></div>
              ${totals.discount > 0 ? `<div class="summary-row" style="color: var(--color-brand-accent); font-weight: 600;"><span>Discount (${promoCode})</span><span>-${store.formatPrice(totals.discount)}</span></div>` : ''}
              <div class="summary-row"><span>Shipping</span><span>${totals.shipping === 0 ? '<strong style="color: var(--color-brand-success);">FREE</strong>' : store.formatPrice(totals.shipping)}</span></div>
              <div class="summary-row"><span>Sales Tax (8%)</span><span>${store.formatPrice(totals.tax)}</span></div>
              <div class="summary-row total-row"><span>Total Due</span><span style="color: var(--color-brand-primary);">${store.formatPrice(totals.total)}</span></div>
            </div>

            <button type="submit" id="btn-place-order" class="btn btn-gradient btn-lg" style="width: 100%; margin-top: 0.5rem;">
              Place Order & Pay ${store.formatPrice(totals.total)}
            </button>
            <p style="font-size: 0.78rem; color: var(--color-text-muted); text-align: center;">
              By completing order, you accept the Capstone Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    const form = container.querySelector('#checkout-form');
    const submitBtn = container.querySelector('#btn-place-order');
    if (!form || !submitBtn) return;

    container.querySelectorAll('.payment-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.payment-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const pType = tab.getAttribute('data-type');
        const cardFields = container.querySelector('#card-payment-fields');
        if (cardFields) cardFields.style.display = pType === 'card' ? 'block' : 'none';
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const firstName = container.querySelector('#ship-first-name').value.trim();
      const lastName = container.querySelector('#ship-last-name').value.trim();
      const email = container.querySelector('#ship-email').value.trim();
      const address = container.querySelector('#ship-address').value.trim();
      const city = container.querySelector('#ship-city').value.trim();
      const zip = container.querySelector('#ship-zip').value.trim();

      if (!firstName || !lastName || !email || !address || !city || !zip) {
        toast.error('Please fill in all mandatory shipping fields.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Processing Order... ⏳';

      const payload = {
        customer: { name: `${firstName} ${lastName}`, email, address: `${address}, ${city}, ${zip}` },
        items: [...store.state.cart],
        totals: store.getCartTotals(),
        promoCode: store.state.promoCode,
        currency: store.state.currency
      };

      try {
        const result = await api.submitOrder(payload);
        store.setLastOrder(result.order);
        store.clearCart();
        store.removePromoCode();
        toast.success(`Order placed successfully! Order #${result.order.orderId}`);
        window.location.hash = '#/order-success';
      } catch (err) {
        toast.error(`Order failed: ${err.message}`);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Place Order & Pay';
      }
    });
  }
}

class OrderSuccessView {
  render(container) {
    const order = store.state.lastOrder;
    if (!order) {
      container.innerHTML = `
        <div class="container order-success-view">
          <div class="success-card">
            <h2>No Recent Order</h2>
            <p style="margin: 1rem 0 2rem;">You do not have a recently placed order in this session.</p>
            <a href="#/" class="btn btn-primary">Return to Catalog</a>
          </div>
        </div>
      `;
      return;
    }

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
    const deliveryString = estimatedDelivery.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    container.innerHTML = `
      <div class="container order-success-view">
        <div class="success-card">
          <div class="success-badge-icon">✓</div>
          <span class="badge badge-stock" style="margin-bottom: 0.5rem;">PAYMENT CONFIRMED</span>
          <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">Thank You for Your Order!</h1>
          <p style="margin-bottom: 1.5rem;">We have received your request and dispatched it to our automated fulfillment center.</p>

          <div style="background: var(--color-bg-base); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.5rem; text-align: left; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
              <div>
                <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block;">ORDER NUMBER</span>
                <strong style="color: var(--color-brand-primary); font-size: 1.1rem;">#${order.orderId}</strong>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block;">ESTIMATED DELIVERY</span>
                <strong style="color: var(--color-brand-success); font-size: 0.95rem;">${deliveryString}</strong>
              </div>
            </div>

            <div style="margin-bottom: 1rem;">
              <span style="font-size: 0.8rem; color: var(--color-text-muted); display: block;">SHIPPING TO</span>
              <strong style="font-size: 0.95rem; color: var(--color-text-primary);">${order.customer.name}</strong>
              <div style="font-size: 0.85rem; color: var(--color-text-secondary);">${order.customer.address}</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--color-border); padding-top: 0.75rem;">
              ${order.items.map((item) => `
                <div style="display: flex; justify-content: space-between; font-size: 0.88rem;">
                  <span>${item.quantity}x ${item.title}</span>
                  <span style="font-weight: 700;">${store.formatPrice(item.price * item.quantity)}</span>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; border-top: 1px solid var(--color-border); margin-top: 0.75rem; padding-top: 0.75rem; color: var(--color-brand-primary);">
              <span>Total Paid</span>
              <span>${store.formatPrice(order.totals.total)}</span>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-outline" onclick="window.print()">Print Order Receipt 🖨️</button>
            <a href="#/orders" class="btn btn-secondary">View Order History</a>
            <a href="#/" class="btn btn-primary">Continue Shopping &rarr;</a>
          </div>
        </div>
      </div>
    `;
  }
}

class WishlistView {
  render(container) {
    const { wishlist } = store.state;

    if (wishlist.length === 0) {
      container.innerHTML = `
        <div class="container" style="text-align: center; padding: 5rem 1rem;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">♥</div>
          <h2>Your Wishlist is Empty</h2>
          <p style="margin: 0.5rem 0 2rem;">Save your favorite hardware and audio instruments for later.</p>
          <a href="#/" class="btn btn-primary btn-lg">Explore Catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding: 2.5rem 1rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1>Saved Gear <span style="font-size: 1.2rem; color: var(--color-text-muted);">(${wishlist.length})</span></h1>
            <p>Your curated collection of precision hardware.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" id="btn-move-all-cart">Move All to Cart 🛒</button>
            <button class="btn btn-ghost" id="btn-clear-wishlist" style="color: var(--color-brand-danger);">Clear List</button>
          </div>
        </div>

        <div class="product-grid" id="wishlist-grid">
          ${wishlist.map((item) => `
            <div class="product-card" data-id="${item.id}">
              <div class="product-image-wrapper">
                <a href="#/product/${item.id}">
                  <img src="${item.image}" alt="${item.title}" class="product-image" loading="lazy" />
                </a>
                <button class="card-action-btn wishlisted" data-id="${item.id}" style="position: absolute; top: 10px; right: 10px; z-index: 2;" title="Remove from wishlist">
                  ♥
                </button>
              </div>
              <div class="product-card-body">
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;">${item.category}</span>
                <h3 class="product-title"><a href="#/product/${item.id}">${item.title}</a></h3>
                <div class="product-pricing-row">
                  <span class="current-price">${store.formatPrice(item.price)}</span>
                </div>
                <div class="product-card-footer" style="display: flex; gap: 8px;">
                  <button class="btn btn-primary btn-sm btn-wishlist-add" data-id="${item.id}" style="flex: 1;">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  bindEvents(container) {
    container.querySelectorAll('.card-action-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = store.state.wishlist.find((i) => i.id === id);
        if (item) {
          store.toggleWishlist(item);
          toast.info(`Removed "${item.title}" from wishlist.`);
          this.render(container);
        }
      });
    });

    container.querySelectorAll('.btn-wishlist-add').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = store.state.wishlist.find((i) => i.id === id);
        if (item) {
          store.addToCart({ ...item, images: [item.image] }, 1);
          toast.success(`Moved "${item.title}" to cart!`);
          store.openCartDrawer();
        }
      });
    });

    const moveAllBtn = container.querySelector('#btn-move-all-cart');
    if (moveAllBtn) {
      moveAllBtn.addEventListener('click', () => {
        store.state.wishlist.forEach((item) => {
          store.addToCart({ ...item, images: [item.image] }, 1);
        });
        toast.success('Moved all wishlist items to your shopping cart!');
        store.openCartDrawer();
      });
    }

    const clearBtn = container.querySelector('#btn-clear-wishlist');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all items from your wishlist?')) {
          store.clearWishlist();
          toast.info('Wishlist cleared.');
          this.render(container);
        }
      });
    }
  }
}

class OrdersView {
  async render(container) {
    container.innerHTML = `<div class="container" style="padding: 2.5rem 1rem;"><div class="skeleton" style="height: 350px;"></div></div>`;
    const orders = await api.getOrders();

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="container" style="text-align: center; padding: 5rem 1rem;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">📦</div>
          <h2>No Past Orders Found</h2>
          <p style="margin: 0.5rem 0 2rem;">When you complete purchases, your order receipts and delivery tracking will appear here.</p>
          <a href="#/" class="btn btn-primary btn-lg">Browse Catalog</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="container" style="padding: 2.5rem 1rem;">
        <h1 style="margin-bottom: 0.5rem;">Order History & Tracking</h1>
        <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">Manage past enterprise orders, review invoices, and monitor carrier dispatch.</p>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${orders.map((o) => `
            <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
                <div>
                  <span style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase;">Order Placed</span>
                  <div style="font-weight: 700;">${new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <span style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase;">Order Number</span>
                  <div style="font-weight: 800; color: var(--color-brand-primary);">#${o.orderId}</div>
                </div>
                <div>
                  <span style="font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase;">Total Billed</span>
                  <div style="font-weight: 700;">${store.formatPrice(o.totals.total)}</div>
                </div>
                <div><span class="badge badge-stock">${o.status}</span></div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${o.items.map((item) => `
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover;" />
                      <div>
                        <strong style="font-size: 0.95rem;">${item.title}</strong>
                        <span style="font-size: 0.85rem; color: var(--color-text-muted); display: block;">Qty: ${item.quantity}</span>
                      </div>
                    </div>
                    <span style="font-weight: 700; color: var(--color-brand-primary);">${store.formatPrice(item.price * item.quantity)}</span>
                  </div>
                `).join('')}
              </div>

              <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: var(--color-text-muted);">
                <span>Ship to: ${o.customer.name} &bull; ${o.customer.address}</span>
                <button class="btn btn-secondary btn-sm" onclick="window.print()">Print Invoice</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

class AnalyticsView {
  async render(container) {
    const productsRes = await api.getProducts();
    const products = productsRes.data;
    const orders = await api.getOrders();

    const totalRevenue = orders.reduce((sum, o) => sum + o.totals.total, 0);
    const totalTransactions = orders.length;
    const aov = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const totalCatalogUnits = products.reduce((sum, p) => sum + p.stock, 0);

    const categoryCounts = {};
    products.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const lowStockItems = products.filter((p) => p.stock < 10);

    container.innerHTML = `
      <div class="container analytics-view">
        <div style="margin-bottom: 2rem;">
          <span class="badge badge-featured" style="margin-bottom: 0.5rem;">TELEMETRY & CAPSTONE INSIGHTS</span>
          <h1>Enterprise Architecture & Store Telemetry</h1>
          <p style="color: var(--color-text-secondary);">Real-time performance analytics, transaction metrics, and inventory distribution.</p>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card">
            <span class="kpi-label">Gross Revenue</span>
            <span class="kpi-value">${store.formatPrice(totalRevenue)}</span>
            <span class="kpi-trend">↑ ${totalTransactions} verified transaction${totalTransactions === 1 ? '' : 's'}</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Avg. Order Value (AOV)</span>
            <span class="kpi-value">${store.formatPrice(aov)}</span>
            <span class="kpi-trend">Optimized checkout funnel</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Active Catalog Items</span>
            <span class="kpi-value">${products.length}</span>
            <span class="kpi-trend">${totalCatalogUnits} total units in stock</span>
          </div>

          <div class="kpi-card">
            <span class="kpi-label">Client SPA Performance</span>
            <span class="kpi-value" style="color: var(--color-brand-success);">0.08s</span>
            <span class="kpi-trend">Zero page-reload route latency</span>
          </div>
        </div>

        <div class="analytics-charts-grid">
          <div class="chart-card">
            <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Catalog Category Allocation</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${Object.entries(categoryCounts).map(([category, count]) => {
                const percent = Math.round((count / products.length) * 100);
                return `
                  <div class="bar-progress-row">
                    <div class="bar-progress-header"><span>${category}</span><span>${count} items (${percent}%)</span></div>
                    <div class="bar-progress-track"><div class="bar-progress-fill" style="width: ${percent}%;"></div></div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="chart-card">
            <h3 style="margin-bottom: 1rem; font-size: 1.15rem;">Supply Chain & Stock Alerts</h3>
            ${
              lowStockItems.length === 0
                ? `<p style="color: var(--color-brand-success);">All warehouse inventory levels are healthy.</p>`
                : `
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${lowStockItems.map((p) => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: var(--color-bg-elevated); border-radius: var(--radius-md); border-left: 3px solid var(--color-brand-warning);">
                    <div>
                      <strong style="font-size: 0.9rem;">${p.title}</strong>
                      <span style="display: block; font-size: 0.75rem; color: var(--color-text-muted);">${p.brand} &bull; ${p.category}</span>
                    </div>
                    <span class="badge badge-low-stock">${p.stock} units left</span>
                  </div>
                `).join('')}
              </div>
            `
            }
          </div>
        </div>

        <div style="margin-top: 2.5rem; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: 1.75rem;">
          <h3 style="margin-bottom: 1rem; font-size: 1.2rem;">Full-Stack Capstone Architecture Highlights</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; font-size: 0.9rem;">
            <div>
              <strong style="color: var(--color-brand-primary); display: block; margin-bottom: 4px;">Modular Component Hierarchy</strong>
              <p style="color: var(--color-text-secondary);">Decoupled UI components (Cards, Drawers, Modals, Navbar, Toast) consuming a central state store without circular dependencies.</p>
            </div>
            <div>
              <strong style="color: var(--color-brand-primary); display: block; margin-bottom: 4px;">Client-Side Hash SPA Router</strong>
              <p style="color: var(--color-text-secondary);">Parameter parsing (<code>#/product/:id</code>), query string reflection, route guard hooks, and smooth viewport transitions without server hops.</p>
            </div>
            <div>
              <strong style="color: var(--color-brand-primary); display: block; margin-bottom: 4px;">Zero Build-Dependency Architecture</strong>
              <p style="color: var(--color-text-secondary);">Pure vanilla browser-native code that runs instantly with zero npm build step required.</p>
            </div>
            <div>
              <strong style="color: var(--color-brand-primary); display: block; margin-bottom: 4px;">Zero-Downtime Cloud Deployment</strong>
              <p style="color: var(--color-text-secondary);">Production-ready configuration via Netlify / Vercel edge networks or GitHub Pages.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

class NotFoundView {
  render(container) {
    container.innerHTML = `
      <div class="container" style="text-align: center; padding: 6rem 1rem;">
        <span style="font-size: 5rem; display: block; font-weight: 900; font-family: var(--font-heading); color: var(--color-brand-primary);">404</span>
        <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Coordinates Not Found</h2>
        <p style="margin-bottom: 2rem; max-width: 480px; margin-left: auto; margin-right: auto;">
          The route you navigated to does not exist in our catalog manifest. Please verify the URL or return to our homepage.
        </p>
        <a href="#/" class="btn btn-primary btn-lg">Return to Store Catalog</a>
      </div>
    `;
  }
}

// ----------------------------------------------------------------------------
// 8. APPLICATION BOOTSTRAPPER & ROUTE ORCHESTRATION
// ----------------------------------------------------------------------------
const routes = [
  { path: '/', component: new CatalogView() },
  { path: '/product/:id', component: new ProductDetailView() },
  { path: '/cart', component: new CartView() },
  { path: '/checkout', component: new CheckoutView() },
  { path: '/order-success', component: new OrderSuccessView() },
  { path: '/wishlist', component: new WishlistView() },
  { path: '/orders', component: new OrdersView() },
  { path: '/analytics', component: new AnalyticsView() },
  { path: '*', component: new NotFoundView() }
];

function bootstrap() {
  const headerMount = document.querySelector('#site-header');
  const footerMount = document.querySelector('#site-footer');
  const cartDrawerMount = document.querySelector('#cart-drawer-container');
  const qvMount = document.querySelector('#quickview-modal-container');

  if (headerMount) new Navbar(headerMount).render();
  if (footerMount) new Footer(footerMount).render();
  if (cartDrawerMount) new CartDrawer(cartDrawerMount);
  if (qvMount) new QuickViewModal(qvMount);

  const promoBanner = document.querySelector('#promo-banner');
  const promoClose = document.querySelector('#promo-close-btn');
  if (promoBanner && promoClose) {
    promoClose.addEventListener('click', () => { promoBanner.style.display = 'none'; });
  }

  const router = new Router(routes, { viewport: '#router-view' });

  router.afterEach((to) => {
    const titleMap = {
      '/': 'NEXUS GEAR | Next-Gen E-Commerce Catalog',
      '/cart': 'Shopping Cart | NEXUS GEAR',
      '/checkout': 'Secure Checkout | NEXUS GEAR',
      '/order-success': 'Order Confirmed | NEXUS GEAR',
      '/wishlist': 'Your Wishlist | NEXUS GEAR',
      '/orders': 'Order History | NEXUS GEAR',
      '/analytics': 'Store Analytics & Performance | NEXUS GEAR'
    };

    if (to.path.startsWith('/product/')) {
      document.title = 'Product Specifications | NEXUS GEAR';
    } else {
      document.title = titleMap[to.path] || 'NEXUS GEAR';
    }
  });

  let previousCurrency = store.state.currency;
  store.subscribe((state) => {
    if (state.currency !== previousCurrency) {
      previousCurrency = state.currency;
      router.handleRouteChange();
    }
  });

  console.log('%c🚀 NEXUS GEAR Architecture Initialized (Consolidated)', 'color: #38bdf8; font-weight: bold; font-size: 14px;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
