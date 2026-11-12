/* Pharoah · Maison mockup data. SAMPLE catalog: names describe only what is visible in his photos; prices follow
   his stated ready-to-wear jacket range ($1,490 to $1,690) and are marked as samples on every page. His real
   catalog loads from his product sheet + Google Drive. Player photos: his NFL page, cleared by him (11/11). */
window.PH = window.PH || {};

PH.menu = {
  rtw: { label: 'Ready-to-Wear', href: 'collection.html?c=rtw', items: [
    ['leather-jackets', 'Leather Jackets'], ['suits-tuxedos', 'Suits & Tuxedos'], ['jackets', 'Jackets'], ['shirts', 'Shirts'],
    ['denim', 'Denim'], ['pants-shorts', 'Pants & Shorts'], ['outerwear', 'Outerwear'], ['evening', 'Evening'],
  ] },
  shoes: { label: 'Shoes', href: 'collection.html?c=shoes', items: [
    ['sneakers', 'Sneakers'], ['loafers', 'Loafers'], ['boots', 'Boots'], ['lace-ups', 'Lace-Ups'], ['monk-straps', 'Monk Straps'], ['evening-shoes', 'Evening'],
  ] },
  highlights: { label: 'Highlights', href: 'highlights.html', items: [
    ['highlights.html', 'Fall-Winter 2026'], ['highlights.html#lookbook', 'The Lookbook'], ['highlights.html#runway', 'The Runway Show'],
    ['highlights.html#campaign', 'The Campaign'], ['players.html', 'Who Wears Pharoah'],
  ] },
  mtm: { label: 'Made to Measure', href: 'made-to-measure.html', items: [
    ['made-to-measure.html#request', 'Request a Private Appointment'], ['made-to-measure.html#events', 'Upcoming Events'], ['made-to-measure.html#process', 'The Process'],
  ] },
};

const JACKET = ['36', '38', '40', '42', '44', '46', '48'];
const I = (f) => `assets/img/${f}`;
const N = (f) => `assets/nfl/${f}.webp`;
const NS = (f) => `assets/nfl/${f}-sm.webp`;

// id, name, color, hex, category, price, images, worn by (player slug), extra colors
PH.products = [
  { id: 'teal-db-suit', name: 'Double-Breasted Suit', color: 'Teal', hex: '#1E5C66', cat: 'suits-tuxedos', price: 1690,
    images: [I('look-teal-studio.jpg'), I('look-02.jpg'), I('look-teal-mirror.jpg'), I('detail-brooch.jpg')] },
  { id: 'black-db-suit', name: 'Double-Breasted Suit, Ivory Buttons', color: 'Black', hex: '#141213', cat: 'evening', price: 1690,
    images: [I('look-blackdb-studio.jpg'), I('look-03.jpg'), I('look-blackdb-seated.jpg'), I('detail-buttons.jpg')] },
  { id: 'zip-jacket', name: 'Zip Jacket', color: 'Black', hex: '#141213', cat: 'jackets', price: 1490,
    images: [I('look-zip-studio.jpg'), I('look-01.jpg'), I('look-zip-sofa.jpg'), I('detail-zip.jpg')] },
  { id: 'pinstripe-db-suit', name: 'Pinstripe Double-Breasted Suit', color: 'Navy', hex: '#1D2540', cat: 'suits-tuxedos', price: 1690,
    images: [I('look-navy-stripe.jpg')],
    colors: [{ color: 'Navy', hex: '#1D2540', id: 'pinstripe-db-suit' }, { color: 'Gray', hex: '#8B8D90', id: 'pinstripe-db-suit-gray' }] },
  { id: 'brown-db-suit', name: 'Double-Breasted Suit', color: 'Brown', hex: '#4A3326', cat: 'suits-tuxedos', price: 1690,
    images: [I('look-brown-db.jpg')] },
  { id: 'evening-jacket', name: 'Evening Jacket', color: 'Black', hex: '#141213', cat: 'evening', price: 1690,
    images: [I('kirk-velvet.jpg'), I('kirk-street.jpg')] },
  { id: 'marigold-suit', name: 'Wide-Leg Suit', color: 'Marigold', hex: '#E99223', cat: 'suits-tuxedos', price: 1690,
    images: [N('dj-turner-ii-1')], worn: 'dj-turner-ii' },
  { id: 'royal-db-suit', name: 'Double-Breasted Suit', color: 'Royal', hex: '#2A36B0', cat: 'suits-tuxedos', price: 1690,
    images: [N('kendrick-bourne-10')], worn: 'kendrick-bourne' },
  { id: 'orchid-overcoat', name: 'Double-Breasted Overcoat', color: 'Orchid', hex: '#C27BB5', cat: 'outerwear', price: 1690,
    images: [N('joseph-ossai-5')], worn: 'joseph-ossai' },
  { id: 'camel-overcoat', name: 'Double-Breasted Overcoat', color: 'Camel', hex: '#C39058', cat: 'outerwear', price: 1690,
    images: [N('kendrick-bourne-4')], worn: 'kendrick-bourne' },
  { id: 'crimson-stripe-suit', name: 'Stripe Suit', color: 'Crimson', hex: '#B3202A', cat: 'suits-tuxedos', price: 1690,
    images: [N('kendrick-bourne-1')], worn: 'kendrick-bourne' },
  { id: 'mint-db-suit', name: 'Double-Breasted Suit', color: 'Mint', hex: '#5FD69B', cat: 'suits-tuxedos', price: 1690,
    images: [N('joseph-ossai-6')], worn: 'joseph-ossai' },
  { id: 'sage-db-suit', name: 'Double-Breasted Suit', color: 'Sage', hex: '#94B072', cat: 'suits-tuxedos', price: 1690,
    images: [N('kendrick-bourne-11')], worn: 'kendrick-bourne' },
  { id: 'sky-suit', name: 'Suit', color: 'Sky', hex: '#93D3DD', cat: 'suits-tuxedos', price: 1490,
    images: [N('dj-turner-ii-7')], worn: 'dj-turner-ii' },
  { id: 'violet-suit', name: 'Suit', color: 'Violet', hex: '#A88AE6', cat: 'suits-tuxedos', price: 1490,
    images: [N('joseph-ossai-8')], worn: 'joseph-ossai' },
  { id: 'rust-suit', name: 'Suit', color: 'Rust', hex: '#C8723F', cat: 'suits-tuxedos', price: 1490,
    images: [N('joseph-ossai-10')], worn: 'joseph-ossai' },
  { id: 'red-jacket-set', name: 'Jacket and Trouser', color: 'Red', hex: '#B5262B', cat: 'jackets', price: 1490,
    images: [N('joseph-ossai-9')], worn: 'joseph-ossai' },
  { id: 'tan-jacket', name: 'Jacket', color: 'Tan', hex: '#A8743F', cat: 'jackets', price: 1490,
    images: [N('geno-stone-2')], worn: 'geno-stone' },
].map((p) => ({ colors: [{ color: p.color, hex: p.hex }], sizes: JACKET, ...p }));

// Concept renders for the categories he has not photographed yet. Every card and
// product page marks them "Concept image"; his own photography replaces them.
const K = (f) => `assets/img/concept/${f}.webp`;
const SHIRT = ['S', 'M', 'L', 'XL', 'XXL'];
const WAIST = ['28', '30', '32', '34', '36', '38', '40'];
const SHOE = ['7', '8', '9', '10', '11', '12', '13'];
[
  { id: 'leather-biker', name: 'Leather Biker Jacket', color: 'Black', hex: '#141213', cat: 'leather-jackets', price: 1690, images: [K('01-leather-biker-black')] },
  { id: 'suede-bomber', name: 'Suede Bomber Jacket', color: 'Chocolate', hex: '#4B3020', cat: 'leather-jackets', price: 1490, images: [K('02-suede-bomber-chocolate')] },
  { id: 'peak-tuxedo', name: 'Peak-Lapel Tuxedo', color: 'Black', hex: '#141213', cat: 'suits-tuxedos', price: 1690, images: [K('03-tuxedo-black')] },
  { id: 'pinstripe-db-suit-gray', name: 'Pinstripe Double-Breasted Suit', color: 'Gray', hex: '#8B8D90', cat: 'suits-tuxedos', price: 1690, images: [K('04-pinstripe-db-gray')],
    colors: [{ color: 'Navy', hex: '#1D2540', id: 'pinstripe-db-suit' }, { color: 'Gray', hex: '#8B8D90', id: 'pinstripe-db-suit-gray' }] },
  { id: 'ivory-db-blazer', name: 'Double-Breasted Blazer', color: 'Ivory', hex: '#EDE6D6', cat: 'jackets', price: 1490, images: [K('05-db-blazer-ivory')] },
  { id: 'tuxedo-shirt', name: 'Tuxedo Shirt', color: 'White', hex: '#F7F5F0', cat: 'shirts', price: 390, sizes: SHIRT, images: [K('06-tuxedo-shirt-white')] },
  { id: 'silk-shirt', name: 'Silk Shirt', color: 'Black', hex: '#141213', cat: 'shirts', price: 490, sizes: SHIRT, images: [K('07-silk-shirt-black')] },
  { id: 'straight-jeans', name: 'Straight-Leg Jeans', color: 'Indigo', hex: '#22304F', cat: 'denim', price: 450, sizes: WAIST, images: [K('08-jeans-indigo')] },
  { id: 'denim-trucker', name: 'Denim Trucker Jacket', color: 'Black', hex: '#1E1E20', cat: 'denim', price: 690, images: [K('09-denim-jacket-black')] },
  { id: 'pleated-trousers', name: 'Pleated Trousers', color: 'Charcoal', hex: '#3A3B3E', cat: 'pants-shorts', price: 590, sizes: WAIST, images: [K('10-pleated-trousers-charcoal')] },
  { id: 'tailored-shorts', name: 'Tailored Shorts', color: 'Camel', hex: '#B58A5A', cat: 'pants-shorts', price: 450, sizes: WAIST, images: [K('11-tailored-shorts-camel')] },
  { id: 'trench-coat', name: 'Double-Breasted Trench Coat', color: 'Black', hex: '#141213', cat: 'outerwear', price: 1690, images: [K('12-trench-black')],
    colors: [{ color: 'Black', hex: '#141213', id: 'trench-coat' }, { color: 'Brown', hex: '#4A3022', id: 'trench-coat-brown' }] },
  { id: 'trench-coat-brown', name: 'Double-Breasted Trench Coat', color: 'Brown', hex: '#4A3022', cat: 'outerwear', price: 1690, images: [K('13-trench-brown')],
    colors: [{ color: 'Black', hex: '#141213', id: 'trench-coat' }, { color: 'Brown', hex: '#4A3022', id: 'trench-coat-brown' }] },
  { id: 'velvet-dinner-jacket', name: 'Velvet Dinner Jacket', color: 'Oxblood', hex: '#7C2529', cat: 'evening', price: 1690, images: [K('15-velvet-dinner-jacket-oxblood')] },
  { id: 'leather-sneakers', name: 'Leather Sneakers', color: 'White', hex: '#F4F2EE', cat: 'sneakers', price: 590, sizes: SHOE, images: [K('16-sneakers-white')] },
  { id: 'penny-loafers', name: 'Penny Loafers', color: 'Black', hex: '#141213', cat: 'loafers', price: 790, sizes: SHOE, images: [K('17-loafers-black')] },
  { id: 'chelsea-boots', name: 'Chelsea Boots', color: 'Black', hex: '#141213', cat: 'boots', price: 890, sizes: SHOE, images: [K('18-chelsea-boots-black')] },
  { id: 'cap-toe-oxfords', name: 'Cap-Toe Oxfords', color: 'Black', hex: '#141213', cat: 'lace-ups', price: 790, sizes: SHOE, images: [K('19-oxfords-black')] },
  { id: 'double-monks', name: 'Double Monk Straps', color: 'Chocolate', hex: '#4B3020', cat: 'monk-straps', price: 850, sizes: SHOE, images: [K('20-double-monks-brown')] },
  { id: 'evening-slippers', name: 'Velvet Evening Slippers', color: 'Black', hex: '#141213', cat: 'evening-shoes', price: 690, sizes: SHOE, images: [K('21-evening-slippers-black')] },
].forEach((p) => PH.products.push({ colors: [{ color: p.color, hex: p.hex }], sizes: JACKET, concept: true, ...p }));

// The men on his NFL page (all photos cleared by him, 11/11)
PH.players = [
  ['dj-turner-ii', 'DJ Turner II', 'Cornerback', 8, 1],
  ['joseph-ossai', 'Joseph Ossai', 'Edge Rusher', 10, 5],
  ['kendrick-bourne', 'Kendrick Bourne', 'Wide Receiver', 11, 10],
  ['anthony-richardson', 'Anthony Richardson', 'Quarterback', 1, 1],
  ['dj-ivey', 'DJ Ivey', 'Cornerback', 3, 1],
  ['geno-stone', 'Geno Stone', 'Safety', 2, 2],
  ['zack-moss', 'Zack Moss', 'Running Back', 2, 2],
  ['thomas-harper', 'Thomas Harper', 'Safety', 1, 1],
  ['amari-gainer', 'Amari Gainer', 'Linebacker', 1, 1],
  ['cameron-wolfe', 'Cameron Wolfe', 'NFL Network', 5, 5],
  ['dj-lagway', 'DJ Lagway', 'College Quarterback', 1, 1],
  ['jaden-rashada', 'Jaden Rashada', 'College Quarterback', 1, 1],
  ['champ-kelly', 'Champ Kelly', 'Front Office', 2, 2],
].map(([slug, name, role, count, best]) => ({
  slug, name, role, count, best,
  photos: Array.from({ length: count }, (_, k) => N(`${slug}-${k + 1}`)),
  thumbs: Array.from({ length: count }, (_, k) => NS(`${slug}-${k + 1}`)),
}));

// Fall-Winter 2026 looks (editorial photos, each a different photograph), each with the pieces visible in it
PH.looks = [
  { img: I('look-teal-mirror.jpg'), items: ['teal-db-suit'] },
  { img: I('look-brown-db.jpg'), items: ['brown-db-suit'] },
  { img: I('look-navy-stripe.jpg'), items: ['pinstripe-db-suit'] },
  { img: I('look-blackdb-seated.jpg'), items: ['black-db-suit'] },
  { img: I('look-zip-sofa.jpg'), items: ['zip-jacket'] },
];

PH.money = (n) => `$${n.toLocaleString('en-US')}`;
PH.product = (id) => PH.products.find((p) => p.id === id);
PH.player = (slug) => PH.players.find((p) => p.slug === slug);
PH.catName = (c) => [...PH.menu.rtw.items, ...PH.menu.shoes.items].find(([k]) => k === c)?.[1];
PH.cardHTML = (p, opts = {}) => `
  <article class="card${opts.cls ? ` ${opts.cls}` : ''}">
    <a class="card__media" href="product.html?id=${p.id}">
      ${p.worn ? '<span class="tag">Worn on game day</span>' : ''}${p.concept ? '<span class="tag">Concept image</span>' : ''}
      <img src="${p.images[0]}" alt="${p.name}, ${p.color.toLowerCase()}" loading="lazy" width="600" height="800">
      ${p.images[1] ? `<img src="${p.images[1]}" alt="" loading="lazy" width="600" height="800">` : ''}
    </a>
    <div class="card__body">
      <a class="card__name" href="product.html?id=${p.id}">${p.name}</a>
      <p class="card__price">${PH.money(p.price)}</p>
      <div class="swatches" aria-label="Colors">${p.colors.map((c) => `<span class="swatch${c.color === p.color ? ' is-on' : ''}" style="--sw:${c.hex}" title="${c.color}${c.soon ? ' (photos coming)' : ''}"></span>`).join('')}</div>
    </div>
  </article>`;
