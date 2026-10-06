import {
  AirVent,
  Bath,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  Castle,
  ConciergeBell,
  CookingPot,
  DoorOpen,
  Flag,
  Flame,
  Flower2,
  Landmark,
  Lock,
  MapPin,
  Music,
  Palette,
  Projector,
  ShoppingBag,
  ShowerHead,
  Sofa,
  Sparkles,
  Speaker,
  Star,
  Swords,
  Tag,
  Trees,
  Tv,
  Users,
  WashingMachine,
  Waves,
  Wifi,
  Wind,
  Zap,
} from 'lucide-react'

export const contact = {
  name: 'AN Hotel & Residence',
  tagline: 'AN — Peace, Inside Out',
  address: 'Số 8, Ngõ 89 Nhật Chiêu, Tây Hồ, Hà Nội',
  phone: '034 827 8000',
  phoneHref: 'tel:0348278000',
  email: 'anhotelresidence@gmail.com',
  messenger: 'https://m.me/ANHotelnResidenceHanoi',
  zalo: 'https://zalo.me/0348278000',
  facebook: 'https://www.facebook.com/ANHotelnResidenceHanoi',
  directions:
    'https://www.google.com/maps/place/AN+Hotel+%26+Residence+West+Lake/@21.0714402,105.8140843,17z',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.394!2d105.8118956!3d21.0714402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab59ac3c32d1%3A0x193238cfa83eee5b!2sAN%20Hotel%20%26%20Residence%20West%20Lake!5e0!3m2!1svi!2svn!4v1687000000000!5m2!1svi!2svn',
}

export const otas = [
  {
    name: 'Booking.com',
    href: 'https://www.booking.com/hotel/vn/an-amp-residence-west-lake.html',
  },
  {
    name: 'Agoda',
    href: 'https://www.agoda.com/an-hotel-residence-west-lake/hotel/hanoi-vn.html',
  },
  {
    name: 'Trip.com',
    href: 'https://vn.trip.com/hotels/hanoi-hotel-detail-134676035/an-hotel-residence-west-lake/',
  },
]

export const nav = [
  { to: '/', label: 'Trang chủ' },
  { to: '/rooms', label: 'Phòng & Giá' },
  { to: '/services', label: 'Dịch vụ' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Đánh giá' },
  { to: '/attractions', label: 'Khám phá' },
  { to: '/contact', label: 'Liên hệ' },
]

const A = {
  ac: { icon: AirVent, label: 'Điều hòa nhiệt độ' },
  tv: { icon: Tv, label: 'TV thông minh' },
  tvProjector: { icon: Projector, label: 'TV thông minh + Màn chiếu phim' },
  speaker: { icon: Speaker, label: 'Loa bluetooth' },
  fireplace: { icon: Flame, label: 'Lò sưởi điện' },
  kitchenette: { icon: CookingPot, label: 'Bếp nhỏ (lò vi sóng, tủ lạnh, bếp từ)' },
  kitchen: { icon: CookingPot, label: 'Bếp đầy đủ (lò vi sóng, tủ lạnh, bếp từ)' },
  bathroom: { icon: ShowerHead, label: 'Phòng tắm riêng' },
  shower: { icon: ShowerHead, label: 'Phòng tắm đứng riêng' },
  bathtub: { icon: Bath, label: 'Bồn tắm nằm' },
  living: { icon: Sofa, label: 'Phòng khách riêng biệt' },
  dryer: { icon: Wind, label: 'Máy sấy tóc' },
  wifi: { icon: Wifi, label: 'WiFi tốc độ cao' },
  safe: { icon: Lock, label: 'Két an toàn' },
  toiletries: { icon: Sparkles, label: 'Đồ vệ sinh cao cấp' },
  washer: { icon: WashingMachine, label: 'Máy giặt riêng' },
}

const standardAmenities = [
  A.ac, A.tv, A.speaker, A.fireplace, A.kitchenette, A.bathroom, A.dryer, A.wifi, A.safe, A.toiletries,
]

const k = (f) => `/images/rooms/standard-king/${f}.jpg`
const q = (f) => `/images/rooms/standard-queen/${f}.jpg`
const s = (f) => `/images/rooms/suite/${f}.jpg`

// rates: [trong tuần (T2–T5), cuối tuần (T6–CN)]
export const rooms = [
  {
    id: 'standard-king',
    name: 'Phòng Standard King',
    short: 'Standard King',
    area: 35,
    bed: 'Giường King-size (2m × 2,2m)',
    guests: 2,
    description:
      'Phòng Standard King của AN Hotel mang đến không gian nghỉ ngơi sang trọng với thiết kế cổ điển tinh tế. Được trang bị đầy đủ tiện nghi hiện đại, lò sưởi điện và khu bếp nhỏ riêng, nổi bật với giường King-size rộng rãi 2m × 2,2m — lựa chọn hoàn hảo cho những ai muốn tận hưởng tối đa sự thoải mái.',
    amenities: standardAmenities,
    highlights: ['Giường King-size 2m × 2,2m', 'Lò sưởi điện', 'Bếp nhỏ riêng'],
    rates: { day: [1050000, 1200000], overnight: [800000, 900000], hourly: [400000, 500000], extraHour: 100000 },
    cover: k('dsc01251-hdr'),
    images: ['dsc01221', 'dsc01251-hdr', 'dsc01261-hdr', 'dsc01271-hdr', 'dsc01281-hdr', 'dsc01296-hdr', 'dsc01306-hdr', 'dsc01326-hdr', 'dsc01371-hdr'].map(k),
  },
  {
    id: 'standard-queen',
    name: 'Phòng Standard Queen',
    short: 'Standard Queen',
    area: 35,
    bed: 'Giường Queen-size (1,8m × 2m)',
    guests: 2,
    description:
      'Phòng Standard Queen của AN Hotel mang đến không gian nghỉ ngơi sang trọng với thiết kế cổ điển tinh tế. Được trang bị đầy đủ tiện nghi hiện đại, lò sưởi điện và khu bếp nhỏ riêng, cùng giường Queen-size 1,8m × 2m êm ái cho một kỳ nghỉ thư thái bên Hồ Tây.',
    amenities: standardAmenities,
    highlights: ['Giường Queen-size 1,8m × 2m', 'Lò sưởi điện', 'Bếp nhỏ riêng'],
    rates: { day: [1050000, 1200000], overnight: [800000, 900000], hourly: [400000, 500000], extraHour: 100000 },
    cover: q('dsc01065-hdr'),
    images: ['dsc01065-hdr', 'dsc01075-hdr', 'dsc01085-hdr', 'dsc01095-hdr', 'dsc01105-hdr', 'dsc01115-hdr', 'dsc01125-hdr', 'dsc01140-hdr', 'dsc01155-hdr'].map(q),
  },
  {
    id: 'suite',
    name: 'Phòng Suite',
    short: 'Suite',
    area: 55,
    bed: 'Giường đôi King-size',
    guests: 2,
    description:
      'Phòng Suite là đỉnh cao của sự xa hoa tại AN Hotel. Không gian rộng rãi với phòng khách riêng biệt, bồn tắm nằm sang trọng, lò sưởi điện và khu bếp đầy đủ tiện nghi. Màn chiếu phim lớn và rạp hát mini tạo nên trải nghiệm khác biệt hoàn toàn.',
    amenities: [
      A.ac, A.tvProjector, A.speaker, A.fireplace, A.living, A.kitchen, A.bathtub, A.shower, A.dryer, A.wifi, A.safe, A.toiletries, A.washer,
    ],
    highlights: ['View thành phố / Hồ Tây', 'Rạp hát mini', 'Phòng khách sang trọng', 'Bồn tắm cao cấp'],
    rates: { day: [1850000, 2000000], overnight: [1600000, 1700000], hourly: [450000, 550000], extraHour: 100000 },
    cover: s('dsc00397-hdr-1'),
    images: ['dsc00397-hdr-1', 'dsc00392-hdr-2', 'dsc00412-hdr-1', 'dsc00417-hdr', 'dsc00462-hdr', 'dsc00492-hdr', 'dsc00497-hdr', 'dsc00532-hdr', 'dsc00542-hdr', 'dsc00698-hdr', 'dsc00708-hdr', 'dsc00713-hdr', 'dsc00883', 'dsc00904', 'dsc00939-hdr', 'dsc02006-hdr'].map(s),
  },
]

export const getRoom = (id) => rooms.find((r) => r.id === id)

export const rateTypes = [
  { id: 'day', label: 'Cả ngày', hint: '15:00 – 11:00 hôm sau' },
  { id: 'overnight', label: 'Qua đêm', hint: '22:00 – 11:00 hôm sau' },
  { id: 'hourly', label: 'Theo giờ', hint: '2 tiếng đầu, thêm giờ tùy chọn' },
]

export const decoration = {
  name: 'Romantic Basic',
  price: 690000,
  intro:
    'Biến căn phòng của bạn thành không gian lãng mạn đặc biệt với dịch vụ trang trí chuyên nghiệp của AN Hotel. Từ hoa tươi, nến, bóng bay đến set rượu vang — chúng tôi sẽ tạo nên khoảnh khắc không thể quên cho bạn và người thân.',
  groups: [
    { title: 'Khu vực Welcome', items: ['"Happy Anniversary" Standee & Hoa', 'Bóng bay thả sàn'] },
    { title: 'Bàn trà', items: ['2 ly vang', 'Nến điện', 'Nến trà'] },
    { title: 'Giường ngủ', items: ['Box hoa hồng', 'Cánh hoa hồng rải', 'Thư tay'] },
  ],
  note: 'Trang trí có thể thay đổi theo yêu cầu riêng (phụ phí thêm).',
  images: [1, 2, 3, 4, 5, 6, 7].map((n) => `/images/services/romantic-0${n}.jpg`),
}

export const features = [
  { icon: MapPin, tag: 'Vị trí', title: 'Vị trí yên tĩnh', text: 'Nằm trong ngõ nhỏ ở Nhật Chiêu, ngay cạnh Hồ Tây — gần trung tâm mà vẫn riêng tư.', points: ['Ngõ 89 Nhật Chiêu, Tây Hồ', 'Cách Đôi Rồng Hồ Tây 0,3 km'] },
  { icon: DoorOpen, tag: 'Thời gian', title: 'Linh hoạt thời gian', text: 'Thuê phòng theo giờ, qua đêm và dài hạn — chọn hình thức hợp với lịch trình của bạn.', points: ['2 tiếng từ 400.000 ₫', 'Qua đêm từ 800.000 ₫'] },
  { icon: Zap, tag: 'Nhận phòng', title: 'Check-in nhanh', text: 'Nhận phòng linh hoạt, thủ tục gọn gàng, không phải chờ đợi.', points: ['Cả ngày: nhận từ 15:00', 'Qua đêm: nhận từ 22:00'] },
  { icon: Sparkles, tag: 'Phòng nghỉ', title: 'Sạch sẽ, tiện nghi', text: 'Phòng được chăm chút sạch sẽ, đầy đủ tiện nghi như ở nhà.', points: ['Bếp riêng trong phòng', 'Đồ vệ sinh cao cấp'] },
  { icon: Wifi, tag: 'Trang bị', title: 'Trang bị hiện đại', text: 'Wi-Fi tốc độ cao, Smart TV, điều hòa và nước nóng có sẵn trong mọi phòng.', points: ['Loa bluetooth', 'Lò sưởi điện'] },
  { icon: Users, tag: 'Khách lưu trú', title: 'Cho mọi chuyến đi', text: 'Phù hợp cho cặp đôi, du khách và người đi công tác.', points: ['Trang trí phòng lãng mạn', 'Suite có máy giặt riêng'] },
  { icon: Tag, tag: 'Chi phí', title: 'Giá hợp lý', text: 'Nhiều hạng phòng để lựa chọn, giá niêm yết rõ ràng theo từng hình thức thuê.', points: ['3 hạng phòng', 'Giá riêng trong tuần & cuối tuần'] },
  { icon: ConciergeBell, tag: 'Hỗ trợ', title: 'Lễ tân 24/7', text: 'Đội ngũ lễ tân luôn sẵn sàng hỗ trợ bạn bất kể ngày đêm.', points: ['Hotline 034 827 8000', 'Zalo & Messenger'] },
]

export const stats = [
  { value: '24/7', label: 'Hỗ trợ tận tâm' },
  { value: '3', label: 'Hạng phòng cao cấp' },
  { value: '9.2', label: 'Điểm đánh giá' },
  { value: '55 m²', label: 'Suite rộng nhất' },
]

export const reviews = [
  { name: 'Nguyễn Minh T.', country: 'Việt Nam', score: 9.2, title: 'Absolutely stunning suite, exceeded all expectations', text: 'Phòng Suite tuyệt đẹp, rộng rãi và sang trọng hơn tưởng tượng. Lò sưởi điện và màn chiếu phim là điểm cộng đặc biệt. Nhân viên rất nhiệt tình và chu đáo. Chắc chắn sẽ quay lại!', source: 'Booking.com', date: 'Tháng 3, 2025' },
  { name: 'Trần Thị L.', country: 'Việt Nam', score: 9, title: 'Perfect romantic getaway', text: 'Đặt phòng cho dịp kỷ niệm và chúng tôi rất hài lòng với dịch vụ trang trí phòng. Hoa và nến rất đẹp, nhân viên setup rất chuyên nghiệp. Phòng sạch sẽ và tiện nghi đầy đủ.', source: 'Booking.com', date: 'Tháng 4, 2025' },
  { name: 'David K.', country: 'Hàn Quốc', score: 8.8, title: 'Great location, excellent value', text: 'Loved the location near West Lake. The suite was well-decorated with a European classic style. The kitchenette was very convenient for cooking simple meals. Good WiFi speed throughout the stay.', source: 'Booking.com', date: 'Tháng 5, 2025' },
  { name: 'Phạm Văn H.', country: 'Việt Nam', score: 9.4, title: "Valentine's Day perfection", text: 'Valentine năm nay thực sự đặc biệt nhờ dịch vụ trang trí phòng của AN Hotel. Bồn tắm nằm với cánh hoa hồng rải xung quanh, bộ rượu vang, nến lung linh — tất cả tạo nên khoảnh khắc không thể quên. Cảm ơn đội ngũ nhân viên!', source: 'Agoda', date: 'Tháng 2, 2025' },
  { name: 'Sarah M.', country: 'Úc', score: 8.6, title: 'Charming boutique hotel near West Lake', text: 'A charming boutique hotel in a quiet alley near West Lake. The standard room was nicely decorated with classic European touches. Walking distance to Trinh Cong Son pedestrian street — perfect for evening strolls. Will recommend to friends visiting Hanoi.', source: 'Agoda', date: 'Tháng 6, 2025' },
  { name: 'Lê Hoàng A.', country: 'Việt Nam', score: 9.6, title: 'Best hotel experience in Hanoi', text: 'Đây là lần đầu tiên ở khách sạn mà tôi cảm thấy thực sự được chào đón. Phòng Suite vượt xa kỳ vọng — rộng rãi, sang trọng với rạp chiếu phim mini và bồn tắm nằm. Vị trí lý tưởng gần Hồ Tây và Lotte Mall. Nhân viên luôn sẵn sàng hỗ trợ 24/7.', source: 'Agoda', date: 'Tháng 1, 2025' },
  { name: 'Tanaka Y.', country: 'Nhật Bản', score: 9, title: 'Quiet and comfortable stay', text: 'Very quiet location despite being close to the center. The standard room was clean, well-maintained with a cozy fireplace. Breakfast options nearby are excellent. The staff helped arrange transportation — very helpful service.', source: 'Booking.com', date: 'Tháng 3, 2025' },
  { name: 'Ngô Thị B.', country: 'Việt Nam', score: 8.8, title: 'Great value for a weekend escape', text: 'Giá phòng cuối tuần rất hợp lý cho chất lượng nhận được. Phòng Standard đủ rộng cho 2 người, trang thiết bị đầy đủ. Gần Lotte Mall và phố đi bộ Trịnh Công Sơn nên rất tiện cho shopping và ăn tối. Sẽ quay lại lần sau!', source: 'Agoda', date: 'Tháng 5, 2025' },
  { name: 'Tài khoản khách', country: 'Trung Quốc', score: 10, title: 'Nổi bật', text: 'Môi trường: Rất đẹp — Vệ sinh: Rất sạch — Tiện nghi: Đầy đủ.', source: 'Agoda', date: 'Tháng 6, 2026' },
]

export const averageScore = 9.2

export const attractions = [
  {
    title: 'Lân cận',
    range: 'Dưới 2 km',
    items: [
      { icon: Camera, name: 'Đôi Rồng Hồ Tây', text: 'Cầu đi bộ hình đôi rồng mang tính biểu tượng của Hồ Tây, điểm check-in nổi tiếng của giới trẻ Hà Nội.', km: 0.3 },
      { icon: Waves, name: 'Công Viên Nước Hồ Tây', text: 'Công viên nước lớn nhất Hà Nội nằm ngay bên bờ Hồ Tây, lý tưởng cho gia đình và trẻ em.', km: 0.5 },
      { icon: Landmark, name: 'Chùa Vạn Niên', text: 'Ngôi chùa cổ hơn 1000 năm tuổi nằm yên tĩnh bên bờ Hồ Tây, nơi bình yên giữa lòng thành phố.', km: 0.6 },
      { icon: Flower2, name: 'Thung Lũng Hoa Hồ Tây', text: 'Vườn hoa lớn với nhiều loài hoa đa dạng, điểm tham quan được yêu thích để chụp ảnh và thư giãn.', km: 0.9 },
      { icon: Music, name: 'Phố Đi Bộ Trịnh Công Sơn', text: 'Phố đi bộ sôi động ven Hồ Tây với nhiều nhà hàng, quán cà phê và hoạt động giải trí cuối tuần.', km: 0.9 },
      { icon: ShoppingBag, name: 'Lotte Mall West Lake', text: 'Trung tâm thương mại cao cấp với hơn 300 thương hiệu quốc tế, khu ẩm thực, rạp chiếu phim và view Hồ Tây.', km: 1 },
    ],
  },
  {
    title: 'Trong khu vực',
    range: '4 – 7 km',
    items: [
      { icon: BriefcaseBusiness, name: 'Bảo Tàng Dân Tộc Học Việt Nam', text: 'Bảo tàng hàng đầu về văn hóa 54 dân tộc Việt Nam với trưng bày phong phú trong nhà và ngoài trời.', km: 4.6 },
      { icon: Trees, name: 'Công Viên Thủ Lệ', text: 'Công viên và vườn thú rộng lớn với nhiều loài động vật, không gian xanh lý tưởng cho gia đình.', km: 5 },
      { icon: Landmark, name: 'Quảng Trường Ba Đình', text: 'Quảng trường lịch sử — nơi Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập ngày 2/9/1945.', km: 6 },
      { icon: Star, name: 'Lăng Chủ Tịch Hồ Chí Minh', text: 'Công trình kiến trúc trang nghiêm là nơi lưu giữ thi hài Chủ tịch Hồ Chí Minh — lãnh tụ vĩ đại của dân tộc Việt Nam.', km: 6 },
      { icon: Swords, name: 'Bảo Tàng Lịch Sử Quân Sự Việt Nam', text: 'Bảo tàng trưng bày lịch sử quân sự Việt Nam qua các thời kỳ với hiện vật và vũ khí ấn tượng.', km: 6 },
      { icon: DoorOpen, name: 'Ô Quan Chưởng', text: 'Cổng thành cổ duy nhất còn lại của Hà Nội xưa, biểu tượng văn hóa của phố cổ Hà Nội.', km: 6 },
      { icon: Castle, name: 'Hoàng Thành Thăng Long', text: 'Di sản thế giới UNESCO — công trình kiến trúc hoàng gia từ thế kỷ 11, minh chứng lịch sử của kinh đô Thăng Long.', km: 6 },
      { icon: Flag, name: 'Cột Cờ Hà Nội', text: 'Cột cờ lịch sử xây dựng từ thời nhà Nguyễn, biểu tượng độc đáo của thành phố Hà Nội.', km: 6 },
      { icon: Palette, name: 'Bảo Tàng Mỹ Thuật Việt Nam', text: 'Bảo tàng nghệ thuật hàng đầu với bộ sưu tập tác phẩm mỹ thuật Việt Nam từ thời tiền sử đến hiện đại.', km: 7 },
      { icon: BookOpen, name: 'Văn Miếu – Quốc Tử Giám', text: 'Trường đại học đầu tiên của Việt Nam được xây dựng năm 1070, biểu tượng của tri thức và văn hóa Việt Nam.', km: 7 },
    ],
  },
]

export const heroImages = {
  home: '/images/rooms/suite/dsc00397-hdr-1.jpg',
  rooms: '/images/rooms/standard-queen/dsc01065-hdr.jpg',
  services: '/images/services/romantic-01.jpg',
  gallery: '/images/lobby/dsc01856-hdr.jpg',
  reviews: '/images/rooms/suite/dsc00392-hdr-2.jpg',
  attractions: '/images/exterior/exterior-01.jpg',
  contact: '/images/lobby/dsc01861-hdr.jpg',
  booking: '/images/rooms/suite/dsc00412-hdr-1.jpg',
}
