import type { Language } from "@/providers/PreferencesProvider";

export const translations = {
  uz: {
    // Auth
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    logout: "Chiqish",
    phone: "Telefon raqam",
    password: "Parol",
    fullName: "Ism familiya",
    confirmPassword: "Parolni tasdiqlang",
    role: "Rol",
    selectRole: "Rolni tanlang",
    welcome: "Xush kelibsiz",
    loginSubtitle: "Restoran paneliga kirish uchun telefon raqam va parolingizni kiriting.",
    registerSubtitle: "Restoraningizni ulang — QR-menyu, KDS va direktor paneli bir joyda.",
    noAccount: "Hisobingiz yo'qmi?",
    haveAccount: "Allaqachon hisobingiz bormi?",
    createAccount: "Hisob yaratish",
    loggingIn: "Kirilmoqda...",
    creatingAccount: "Yaratilmoqda...",
    
    // Roles
    director: "Direktor",
    kitchen: "Oshxona",
    waiter: "Ofitsiant",
    customer: "Mijoz",
    
    // Dashboard
    directorPanel: "Direktor paneli",
    kdsPanel: "Oshxona ekrani",
    waiterPanel: "Ofitsiant paneli",
    realTime: "Jonli",
    offline: "Oflayn",
    todayRevenue: "Bugungi tushum",
    activeOrders: "Faol buyurtmalar",
    occupiedTables: "Band stollar",
    tableTurnover: "Stol aylanmasi",
    hourlyRevenue: "Soatlik tushum",
    topItems: "Top taomlar",
    tables: "Stollar",
    table: "Stol",
    status: "Status",
    time: "Vaqt",
    amount: "Summa",
    noActiveOrders: "Faol buyurtma yo'q",
    occupied: "Band",
    vacant: "Bo'sh",
    
    // KDS
    newOrders: "Yangi buyurtmalar",
    preparing: "Tayyorlanmoqda",
    ready: "Tayyor",
    delivered: "Yetkazildi",
    cancelled: "Bekor qilindi",
    update: "Yangilash",
    noNewOrders: "Yangi buyurtma yo'q",
    noPreparingOrders: "Tayyorlanayotgan buyurtma yo'q",
    
    // Menu
    menu: "Menyu",
    addToCart: "Savatga qo'shish",
    cart: "Savat",
    total: "Jami",
    checkout: "Buyurtma berish",
    emptyCart: "Savat bo'sh",
    categories: "Kategoriyalar",
    all: "Hammasi",
    search: "Qidirish",
    pagination: {
      prev: "Oldingi",
      next: "Keyingi"
    },
    
    // Settings
    language: "Til",
    theme: "Mavzu",
    light: "Yorug'",
    dark: "To'q",
    
    // KDS Menu Management
    addDish: "Taom qo'shish",
    editDish: "Taomni tahrirlash",
    deleteDish: "Taomni o'chirish",
    dishName: "Taom nomi",
    dishDescription: "Tavsifi",
    dishPrice: "Narxi",
    dishImage: "Rasm URL",
    save: "Saqlash",
    cancel: "Bekor qilish",
    deleteConfirm: "Haqiqatan ham ushbu taomni o'chirmoqchimisiz?"
  },
  ru: {
    // Auth
    login: "Вход",
    register: "Регистрация",
    logout: "Выход",
    phone: "Номер телефона",
    password: "Пароль",
    fullName: "Имя и фамилия",
    confirmPassword: "Подтвердите пароль",
    role: "Роль",
    selectRole: "Выберите роль",
    welcome: "Добро пожаловать",
    loginSubtitle: "Введите номер телефона и пароль для входа в панель ресторана.",
    registerSubtitle: "Подключите свой ресторан — QR-меню, KDS и панель директора в одном месте.",
    noAccount: "Нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    createAccount: "Создать аккаунт",
    loggingIn: "Вход...",
    creatingAccount: "Создание...",
    
    // Roles
    director: "Директор",
    kitchen: "Кухня",
    waiter: "Официант",
    customer: "Клиент",
    
    // Dashboard
    directorPanel: "Панель директора",
    kdsPanel: "Экран кухни",
    waiterPanel: "Панель официанта",
    realTime: "В реальном времени",
    offline: "Офлайн",
    todayRevenue: "Выручка за сегодня",
    activeOrders: "Активные заказы",
    occupiedTables: "Занятые столы",
    tableTurnover: "Оборот столов",
    hourlyRevenue: "Почасовая выручка",
    topItems: "Популярные блюда",
    tables: "Столы",
    table: "Стол",
    status: "Статус",
    time: "Время",
    amount: "Сумма",
    noActiveOrders: "Нет активных заказов",
    occupied: "Занят",
    vacant: "Свободен",
    
    // KDS
    newOrders: "Новые заказы",
    preparing: "Готовится",
    ready: "Готово",
    delivered: "Доставлено",
    cancelled: "Отменено",
    update: "Обновить",
    noNewOrders: "Нет новых заказов",
    noPreparingOrders: "Нет готовящихся заказов",
    
    // Menu
    menu: "Меню",
    addToCart: "В корзину",
    cart: "Корзина",
    total: "Итого",
    checkout: "Заказать",
    emptyCart: "Корзина пуста",
    categories: "Категории",
    all: "Все",
    search: "Поиск",
    pagination: {
      prev: "Назад",
      next: "Вперед"
    },
    
    // Settings
    language: "Язык",
    theme: "Тема",
    light: "Светлая",
    dark: "Темная",
    
    // KDS Menu Management
    addDish: "Добавить блюдо",
    editDish: "Редактировать блюдо",
    deleteDish: "Удалить блюдо",
    dishName: "Название блюда",
    dishDescription: "Описание",
    dishPrice: "Цена",
    dishImage: "URL изображения",
    save: "Сохранить",
    cancel: "Отмена",
    deleteConfirm: "Вы действительно хотите удалить это блюдо?"
  },
  en: {
    // Auth
    login: "Login",
    register: "Register",
    logout: "Logout",
    phone: "Phone number",
    password: "Password",
    fullName: "Full name",
    confirmPassword: "Confirm password",
    role: "Role",
    selectRole: "Select role",
    welcome: "Welcome",
    loginSubtitle: "Enter your phone number and password to access the restaurant panel.",
    registerSubtitle: "Connect your restaurant — QR-menu, KDS, and director panel in one place.",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createAccount: "Create account",
    loggingIn: "Logging in...",
    creatingAccount: "Creating...",
    
    // Roles
    director: "Director",
    kitchen: "Kitchen",
    waiter: "Waiter",
    customer: "Customer",
    
    // Dashboard
    directorPanel: "Director Panel",
    kdsPanel: "Kitchen Display",
    waiterPanel: "Waiter Panel",
    realTime: "Real-time",
    offline: "Offline",
    todayRevenue: "Today's Revenue",
    activeOrders: "Active Orders",
    occupiedTables: "Occupied Tables",
    tableTurnover: "Table Turnover",
    hourlyRevenue: "Hourly Revenue",
    topItems: "Top Items",
    tables: "Tables",
    table: "Table",
    status: "Status",
    time: "Time",
    amount: "Amount",
    noActiveOrders: "No active orders",
    occupied: "Occupied",
    vacant: "Vacant",
    
    // KDS
    newOrders: "New Orders",
    preparing: "Preparing",
    ready: "Ready",
    delivered: "Delivered",
    cancelled: "Cancelled",
    update: "Update",
    noNewOrders: "No new orders",
    noPreparingOrders: "No orders being prepared",
    
    // Menu
    menu: "Menu",
    addToCart: "Add to cart",
    cart: "Cart",
    total: "Total",
    checkout: "Checkout",
    emptyCart: "Cart is empty",
    categories: "Categories",
    all: "All",
    search: "Search",
    pagination: {
      prev: "Previous",
      next: "Next"
    },
    
    // Settings
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    
    // KDS Menu Management
    addDish: "Add dish",
    editDish: "Edit dish",
    deleteDish: "Delete dish",
    dishName: "Dish name",
    dishDescription: "Description",
    dishPrice: "Price",
    dishImage: "Image URL",
    save: "Save",
    cancel: "Cancel",
    deleteConfirm: "Are you sure you want to delete this dish?"
  }
};

export type TranslationKey = keyof typeof translations.uz;

export function useTranslation() {
  // This is a placeholder. Real implementation should use the language from context.
  // But since we can't use hooks here, we'll just export the helper.
  return (lang: Language) => translations[lang];
}
