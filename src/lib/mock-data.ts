export const salesData = [
  { month: "Jan", sales: 42000, forecast: 44000 },
  { month: "Feb", sales: 48000, forecast: 47500 },
  { month: "Mar", sales: 55000, forecast: 54000 },
  { month: "Apr", sales: 51000, forecast: 52500 },
  { month: "May", sales: 62000, forecast: 61000 },
  { month: "Jun", sales: 71000, forecast: 69500 },
  { month: "Jul", sales: 78000, forecast: 77000 },
  { month: "Aug", sales: 84000, forecast: 83500 },
  { month: "Sep", sales: 79000, forecast: 81000 },
  { month: "Oct", sales: 92000, forecast: 90000 },
  { month: "Nov", sales: 105000, forecast: 103500 },
  { month: "Dec", sales: 128000, forecast: 125000 },
];

export const categoryPerformance = [
  { name: "Electronics", value: 34 },
  { name: "Apparel", value: 24 },
  { name: "Home", value: 18 },
  { name: "Beauty", value: 14 },
  { name: "Sports", value: 10 },
];

export const topProducts = [
  { name: "Wireless Earbuds Pro", sku: "WEP-201", sold: 1284, trend: "+18%" },
  { name: "Smart Watch Series 7", sku: "SW7-114", sold: 984, trend: "+12%" },
  { name: "Ergonomic Chair", sku: "EC-540", sold: 742, trend: "+9%" },
  { name: "4K Action Camera", sku: "ACM-88", sold: 631, trend: "+7%" },
  { name: "Ceramic Cookware Set", sku: "CCS-19", sold: 512, trend: "+4%" },
];

export const lowStock = [
  { name: "Wireless Earbuds Pro", stock: 12, reorder: 200 },
  { name: "USB-C Hub 8-in-1", stock: 8, reorder: 150 },
  { name: "Ergonomic Chair", stock: 4, reorder: 80 },
];

export const overStock = [
  { name: "Vintage Denim Jacket", stock: 720, sales30d: 22 },
  { name: "Bluetooth Speaker V2", stock: 410, sales30d: 34 },
];

export const recentPredictions = [
  { product: "Wireless Earbuds Pro", predicted: 1420, confidence: 94 },
  { product: "Smart Watch Series 7", predicted: 1080, confidence: 91 },
  { product: "Ergonomic Chair", predicted: 812, confidence: 88 },
  { product: "4K Action Camera", predicted: 690, confidence: 86 },
];

export const recentActivity = [
  { text: "Sales CSV uploaded (12,481 rows)", time: "2m ago" },
  { text: "AI prediction completed for Q1", time: "18m ago" },
  { text: "Low-stock alert: Wireless Earbuds Pro", time: "1h ago" },
  { text: "Monthly report emailed to team", time: "3h ago" },
];
