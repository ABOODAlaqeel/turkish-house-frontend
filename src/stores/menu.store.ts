import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MenuItemType {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isDisabled?: boolean;
}

export interface CategoryType {
  id: string;
  name: string;
  isDisabled?: boolean;
}

interface MenuState {
  categories: CategoryType[];
  items: MenuItemType[];
  
  // Category Actions
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryDisabled: (id: string) => void;

  // Item Actions
  addItem: (item: Omit<MenuItemType, 'id'>) => void;
  updateItem: (id: string, updatedFields: Partial<Omit<MenuItemType, 'id'>>) => void;
  deleteItem: (id: string) => void;
  toggleItemDisabled: (id: string) => void;
}

// Initial default categories
const DEFAULT_CATEGORIES: CategoryType[] = [
  { id: "c1", name: "مقبلات", isDisabled: false },
  { id: "c2", name: "معجنات", isDisabled: false },
  { id: "c3", name: "مشويات", isDisabled: false },
  { id: "c4", name: "بيتزا", isDisabled: false },
];

// Initial default items matching our Turkish House menu
const DEFAULT_ITEMS: MenuItemType[] = [
  // --- مقبلات ---
  { id: "i1", categoryId: "c1", name: "حمص", description: "حمص بالطحينة وزيت الزيتون على الطريقة التركية الأصيلة.", price: 700, image: "https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i2", categoryId: "c1", name: "متبل", description: "باذنجان مشوي ومهروس مع الطحينة والثوم والليمون.", price: 700, image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i3", categoryId: "c1", name: "بابا غنوج", description: "باذنجان مشوي مع الفلفل الحلو، البقدونس، زيت الزيتون ودبس الرمان.", price: 700, image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i4", categoryId: "c1", name: "تبولة", description: "بقدونس مفروم مع النعناع، البرغل، الطماطم، الليمون وزيت الزيتون.", price: 700, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i5", categoryId: "c1", name: "سلطة زيتون", description: "قطع الزيتون الأخضر والأسود مع الجزر والفلفل وزيت الزيتون.", price: 700, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i6", categoryId: "c1", name: "محمرة", description: "جوز مطحون مع الفلفل الأحمر الحار، فتات الخبز ودبس الرمان.", price: 700, image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i7", categoryId: "c1", name: "لبن خيار", description: "خيار طازج مع الزبادي البارد، الثوم والنعناع الجاف.", price: 700, image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i8", categoryId: "c1", name: "ورق عنب", description: "ورق عنب محشي بالأرز المتبل، الخضار وزيت الزيتون.", price: 900, image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i9", categoryId: "c1", name: "سلطة طحينية", description: "سلطة شرقية مميزة بصلصة الطحينة والليمون والخل.", price: 700, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i10", categoryId: "c1", name: "باترش", description: "باذنجان مشوي بصلصة الطماطم والسمن، طبق تركي دافئ ولذيذ.", price: 700, image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i11", categoryId: "c1", name: "مخلل", description: "تشكيلة من المخللات البيتية المقرمشة واللذيذة.", price: 700, image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i12", categoryId: "c1", name: "ثوم", description: "صلصة الثومية الكريمية الشهيرة المحضرة محلياً.", price: 800, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i13", categoryId: "c1", name: "سلطة خضراء", description: "خضار طازجة متنوعة مع الخيار والطماطم وصوص الليمون.", price: 600, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i14", categoryId: "c1", name: "مشكل مقبلات صغير", description: "مجموعة مختارة من مقبلاتنا التركية الشهيرة بحجم صغير.", price: 700, image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i15", categoryId: "c1", name: "مشكل مقبلات كبير", description: "تشكيلة كاملة وفيرة من المقبلات الباردة والساخنة بحجم كبير.", price: 1400, image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i16", categoryId: "c1", name: "سبيشل مشكل مقبلات", description: "تشكيلة فاخرة وخاصة جداً من ألذ أنواع المقبلات والصلصات التركية.", price: 2000, image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i17", categoryId: "c1", name: "سوبر سبيشل مقبلات", description: "طبق مقبلات عملاق من جميع الأصناف بالإضافة لأصناف حصرية بالبيت التركي.", price: 2500, image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=400", isDisabled: false },

  // --- معجنات ---
  { id: "i18", categoryId: "c2", name: "لحم بالعجين", description: "عجينة رقيقة مقرمشة مغطاة باللحم المفروم المتبل والخضار.", price: 700, image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i19", categoryId: "c2", name: "جبن", description: "فطيرة مخبوزة محشية بالجبن الفاخر المذاب.", price: 800, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i20", categoryId: "c2", name: "لبنة", description: "فطيرة مغطاة باللبنة التركية الطازجة وزيت الزيتون.", price: 800, image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i21", categoryId: "c2", name: "لبنة عسل", description: "مزيج رائع من اللبنة الحامضة والعسل الطبيعي اللذيذ.", price: 1000, image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i22", categoryId: "c2", name: "زعتر", description: "فطيرة الزعتر البلدي وزيت الزيتون البكر.", price: 500, image: "https://images.unsplash.com/photo-1542528180-a1208c5169a5?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i23", categoryId: "c2", name: "زعتر مع الجبن", description: "فطيرة دافئة تجمع بين نكهة الزعتر والجبن البلدي الذائب.", price: 900, image: "https://images.unsplash.com/photo-1542528180-a1208c5169a5?auto=format&fit=crop&q=80&w=400", isDisabled: false },

  // --- مشويات ---
  { id: "i24", categoryId: "c3", name: "كباب لحم", description: "أسياخ كباب اللحم البلدي المفروم والمتبل بالبهارات التركية.", price: 2200, image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i25", categoryId: "c3", name: "كباب دجاج", description: "أسياخ كباب الدجاج المفروم والمشوي على الفحم الحجري.", price: 2200, image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i26", categoryId: "c3", name: "أوصال لحم", description: "قطع اللحم الطازجة المشوية بعناية على الفحم.", price: 2400, image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i27", categoryId: "c3", name: "أوصال دجاج بدون عظم", description: "شيش طاووق شهي مخلي من العظم ومتبل بخلطة البيت التركي.", price: 2200, image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i28", categoryId: "c3", name: "شيش طاووق بالعظم", description: "قطع الدجاج الطازجة بالعظم متبلة ومشوية ببطء على الفحم.", price: 2200, image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i29", categoryId: "c3", name: "أجنحة دجاج", description: "أجنحة الدجاج المتبلة بصلصة الباربكيو والبهارات التركية المشوية.", price: 2200, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i30", categoryId: "c3", name: "كبدة طازجة", description: "كبدة غنم طازجة ومتبلة مشوية على الفحم الساخن.", price: 2400, image: "https://images.unsplash.com/photo-1626880829871-3df79853a479?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i31", categoryId: "c3", name: "كباب باذنجان", description: "كباب اللحم اللذيذ المشوي بالتناوب مع قطع الباذنجان المكرملة.", price: 2200, image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i32", categoryId: "c3", name: "مشكل مشاوي صغير", description: "تشكيلة من كباب لحم، كباب دجاج، شيش طاووق، وأوصال بحجم عائلي صغير.", price: 5500, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i33", categoryId: "c3", name: "مشكل مشاوي كبير", description: "صينية مشاوي مشكلة غنية ومتنوعة تكفي لعدة أشخاص.", price: 9500, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i34", categoryId: "c3", name: "مشكل مشاوي لحوم صغير", description: "تشكيلة من كباب اللحم، الأوصال، وكباب الباذنجان بدون دجاج بحجم صغير.", price: 6000, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i35", categoryId: "c3", name: "مشكل مشاوي لحوم كبير", description: "طبق فاخر ووفير جداً من اللحوم والأوصال والكباب المشكل على الفحم.", price: 10500, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i36", categoryId: "c3", name: "سبيشل البيت التركي", description: "صينية المشاوي الخاصة بالبيت التركي المزدحمة بألذ الأوصال والكباب والريش والجمبري والخبز المحشي.", price: 14000, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i37", categoryId: "c3", name: "جمبري مشوي", description: "قطع الجمبري الكبيرة المتبلة والمشوية على الفحم مع خضار مشوية.", price: 3500, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=400", isDisabled: false },

  // --- بيتزا ---
  { id: "i38", categoryId: "c4", name: "بيتزا جبن", description: "عجينة البيتزا الغنية بصلصة الطماطم ومغطاة بطبقة كثيفة من جبن الموتزاريلا.", price: 2000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i39", categoryId: "c4", name: "بيتزا خضار (وسط)", description: "بيتزا الخضار المشكلة مع الزيتون، الفلفل، الطماطم وجبنة الموتزاريلا - حجم وسط.", price: 2000, image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i40", categoryId: "c4", name: "بيتزا خضار (كبير)", description: "بيتزا الخضار المشكلة الطازجة بحجم عائلي كبير.", price: 2500, image: "https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i41", categoryId: "c4", name: "بيتزا لحم (وسط)", description: "بيتزا بقطع اللحم المفروم المتبل والجبن والخضار - حجم وسط.", price: 2000, image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i42", categoryId: "c4", name: "بيتزا لحم (كبير)", description: "بيتزا بقطع اللحم المفروم المتبل والجبن والخضار - حجم كبير.", price: 2500, image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i43", categoryId: "c4", name: "بيتزا دجاج (وسط)", description: "بيتزا بقطع الدجاج المشوية، الزيتون والجبن وصلصتنا الخاصة - حجم وسط.", price: 2000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i44", categoryId: "c4", name: "بيتزا دجاج (كبير)", description: "بيتزا بقطع الدجاج المشوية والزيتون والجبن بحجم كبير.", price: 2500, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i45", categoryId: "c4", name: "بيتزا سلامي (وسط)", description: "بيتزا مغطاة بشرائح السلامي البقري وجبن الموتزاريلا الذائب - حجم وسط.", price: 2000, image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i46", categoryId: "c4", name: "بيتزا سلامي (كبير)", description: "بيتزا مغطاة بشرائح السلامي البقري وجبن الموتزاريلا بحجم كبير.", price: 2500, image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i47", categoryId: "c4", name: "بيتزا سبيشل محشي الأطراف (وسط)", description: "البيتزا الخاصة بالبيت التركي مع أطراف محشية بالجبن الفاخر - حجم وسط.", price: 2500, image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i48", categoryId: "c4", name: "بيتزا سبيشل محشي الأطراف (كبير)", description: "البيتزا الخاصة بالبيت التركي مع أطراف محشية بالجبن الفاخر - حجم كبير.", price: 3500, image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i49", categoryId: "c4", name: "عش البلبل", description: "فطيرة عش البلبل الشهيرة بالعسل والجبن الفاخر.", price: 2000, image: "https://images.unsplash.com/photo-1618406471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i50", categoryId: "c4", name: "بيتزا تونا (وسط)", description: "بيتزا التونة اللذيذة مع شرائح البصل والزيتون والموتزاريلا - حجم وسط.", price: 2000, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=400", isDisabled: false },
  { id: "i51", categoryId: "c4", name: "بيتزا تونا (كبير)", description: "بيتزا التونة اللذيذة مع شرائح البصل والزيتون والموتزاريلا - حجم كبير.", price: 2500, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=400", isDisabled: false },
];

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      items: DEFAULT_ITEMS,

      // Category Actions
      addCategory: (name) => {
        set((state) => {
          const newId = `c${state.categories.length + 1}-${Date.now()}`;
          const newCategory: CategoryType = { id: newId, name, isDisabled: false };
          return { categories: [...state.categories, newCategory] };
        });
      },

      updateCategory: (id, name) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, name } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          // Also remove items belonging to this category
          items: state.items.filter((item) => item.categoryId !== id),
        }));
      },

      toggleCategoryDisabled: (id) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, isDisabled: !c.isDisabled } : c
          ),
        }));
      },

      // Item Actions
      addItem: (item) => {
        set((state) => {
          const newId = `i${state.items.length + 1}-${Date.now()}`;
          const newItem: MenuItemType = {
            ...item,
            id: newId,
            isDisabled: false,
          };
          return { items: [...state.items, newItem] };
        });
      },

      updateItem: (id, updatedFields) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...updatedFields } : item
          ),
        }));
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      toggleItemDisabled: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isDisabled: !item.isDisabled } : item
          ),
        }));
      },
    }),
    {
      name: 'smartmenu-restaurant-menu',
    }
  )
);
