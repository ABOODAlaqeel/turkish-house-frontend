"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit, Trash2, Search, Eye, EyeOff, 
  FolderPlus, Save, X, Utensils, Image as ImageIcon 
} from "lucide-react";
import { useMenuStore, MenuItemType, CategoryType } from "@/stores/menu.store";

export default function CashierMenuManagement() {
  const categories = useMenuStore((state) => state.categories);
  const items = useMenuStore((state) => state.items);
  
  // Category Actions
  const addCategory = useMenuStore((state) => state.addCategory);
  const updateCategory = useMenuStore((state) => state.updateCategory);
  const deleteCategory = useMenuStore((state) => state.deleteCategory);
  const toggleCategoryDisabled = useMenuStore((state) => state.toggleCategoryDisabled);

  // Item Actions
  const addItem = useMenuStore((state) => state.addItem);
  const updateItem = useMenuStore((state) => state.updateItem);
  const deleteItem = useMenuStore((state) => state.deleteItem);
  const toggleItemDisabled = useMenuStore((state) => state.toggleItemDisabled);

  const [isMounted, setIsMounted] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  
  // Editing states
  const [editingItem, setEditingItem] = useState<MenuItemType | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);

  // Form States - Item
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemImage, setItemImage] = useState("");

  // Form States - Category
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set default category in form when category list is loaded
  useEffect(() => {
    if (categories.length > 0 && !itemCategoryId) {
      setItemCategoryId(categories[0].id);
    }
  }, [categories, itemCategoryId]);

  if (!isMounted) {
    return <div className="text-center py-12 text-text-secondary text-sm">جاري تحميل لوحة التحكم...</div>;
  }

  // Filter categories
  const filteredCategories = categories;

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategoryId === "all" || item.categoryId === selectedCategoryId;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Open item modal for add/edit
  const openItemModal = (item: MenuItemType | null = null) => {
    if (item) {
      setEditingItem(item);
      setItemName(item.name);
      setItemDescription(item.description);
      setItemPrice(item.price);
      setItemCategoryId(item.categoryId);
      setItemImage(item.image || "");
    } else {
      setEditingItem(null);
      setItemName("");
      setItemDescription("");
      setItemPrice(0);
      setItemCategoryId(categories[0]?.id || "");
      setItemImage("");
    }
    setIsItemModalOpen(true);
  };

  // Open category modal for add/edit
  const openCategoryModal = (category: CategoryType | null = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setCategoryName("");
    }
    setIsCategoryModalOpen(true);
  };

  // Handle Item Submit
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || itemPrice <= 0 || !itemCategoryId) return;

    const imageUrl = itemImage.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";

    const itemData = {
      name: itemName,
      description: itemDescription,
      price: Number(itemPrice),
      categoryId: itemCategoryId,
      image: imageUrl,
    };

    if (editingItem) {
      updateItem(editingItem.id, itemData);
    } else {
      addItem(itemData);
    }

    setIsItemModalOpen(false);
  };

  // Handle Category Submit
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryName);
    } else {
      addCategory(categoryName);
    }

    setIsCategoryModalOpen(false);
  };

  // Handle Item Delete
  const handleItemDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطبق نهائياً؟")) {
      deleteItem(id);
    }
  };

  // Handle Category Delete
  const handleCategoryDelete = (id: string) => {
    if (confirm("تحذير: حذف هذا الصنف سيؤدي إلى حذف جميع الأطباق التابعة له. هل أنت متأكد من الحذف؟")) {
      deleteCategory(id);
      if (selectedCategoryId === id) {
        setSelectedCategoryId("all");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">إدارة قائمة الطعام (المنيو)</h1>
          <p className="text-text-secondary text-sm">إضافة، تعديل، حذف، أو تعطيل أطباق وأصناف مطعم البيت التركي.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => openCategoryModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-bg-tertiary bg-bg-secondary text-text-primary hover:text-accent hover:border-accent transition-all duration-300 text-sm font-semibold"
          >
            <FolderPlus size={18} />
            <span>إضافة صنف جديد</span>
          </button>
          
          <button 
            onClick={() => openItemModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-text-primary hover:bg-brand-light transition-all duration-300 text-sm font-semibold shadow-lg shadow-brand/20"
          >
            <Plus size={18} />
            <span>إضافة طبق جديد</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Categories Management Side & Items List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar: Categories Manager */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-5">
            <h2 className="text-sm font-bold text-text-primary mb-4 pb-2 border-b border-bg-tertiary">
              الأصناف المتوفرة ({categories.length})
            </h2>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategoryId("all")}
                className={`w-full text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategoryId === "all"
                    ? "bg-bg-tertiary text-accent font-semibold"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30"
                }`}
              >
                الكل (جميع الأطباق)
              </button>
              
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 ${
                    selectedCategoryId === category.id
                      ? "bg-bg-tertiary text-accent font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30"
                  }`}
                >
                  <button
                    onClick={() => setSelectedCategoryId(category.id)}
                    className="flex-1 text-right text-sm truncate"
                  >
                    <span>{category.name}</span>
                    {category.isDisabled && (
                      <span className="mr-2 text-[10px] bg-danger/10 text-danger px-1.5 py-0.5 rounded">معطل</span>
                    )}
                  </button>
                  
                  {/* Category Action buttons show on hover */}
                  <div className="hidden group-hover:flex items-center gap-1 bg-bg-tertiary/90 px-1 py-0.5 rounded border border-bg-tertiary">
                    <button 
                      onClick={() => toggleCategoryDisabled(category.id)}
                      className={`p-1 rounded transition-colors ${category.isDisabled ? "text-success hover:bg-success/10" : "text-text-secondary hover:bg-bg-primary"}`}
                      title={category.isDisabled ? "تفعيل الصنف" : "تعطيل الصنف"}
                    >
                      {category.isDisabled ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button 
                      onClick={() => openCategoryModal(category)}
                      className="p-1 text-text-secondary hover:text-accent hover:bg-bg-primary rounded transition-colors"
                      title="تعديل الاسم"
                    >
                      <Edit size={12} />
                    </button>
                    <button 
                      onClick={() => handleCategoryDelete(category.id)}
                      className="p-1 text-text-secondary hover:text-danger hover:bg-bg-primary rounded transition-colors"
                      title="حذف الصنف"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area: Items Manager */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Search bar & Filter summary */}
          <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="ابحث عن طبق بالاسم أو الوصف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-lg py-2 pr-10 pl-4 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            
            <div className="text-text-secondary text-xs font-medium whitespace-nowrap">
              يظهر حالياً: <span className="text-text-primary font-bold">{filteredItems.length}</span> طبق
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const itemCategory = categories.find(c => c.id === item.categoryId);
                const isItemParentCategoryDisabled = itemCategory?.isDisabled;
                const showDisabledStyle = item.isDisabled || isItemParentCategoryDisabled;

                return (
                  <motion.div
                    layout
                    key={item.id}
                    className={`bg-bg-secondary border rounded-xl overflow-hidden flex flex-col transition-all duration-300 relative group ${
                      showDisabledStyle 
                        ? "border-bg-tertiary opacity-60" 
                        : "border-bg-tertiary hover:border-gold/30"
                    }`}
                  >
                    {/* Item Image */}
                    <div className="relative aspect-[4/3] w-full bg-bg-tertiary overflow-hidden">
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"} 
                        alt={item.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/90 via-transparent to-transparent z-10" />
                      
                      {/* Status Badges */}
                      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
                        {isItemParentCategoryDisabled && (
                          <span className="bg-danger/90 text-text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-danger/30">
                            صنف معطل
                          </span>
                        )}
                        {item.isDisabled && !isItemParentCategoryDisabled && (
                          <span className="bg-bg-tertiary text-text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full border border-bg-tertiary">
                            معطل (غير متوفر)
                          </span>
                        )}
                        {!showDisabledStyle && (
                          <span className="bg-success/90 text-text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-success/30">
                            نشط
                          </span>
                        )}
                      </div>
                      
                      {/* Category label */}
                      <div className="absolute bottom-3 right-3 z-20 bg-bg-primary/80 backdrop-blur-sm border border-gold/20 text-gold text-xs px-2 py-0.5 rounded-md">
                        {itemCategory?.name || "بدون صنف"}
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-bold text-text-primary text-base group-hover:text-gold transition-colors truncate">
                            {item.name}
                          </h3>
                          <span className="text-gold font-bold text-sm whitespace-nowrap">
                            {item.price} <span className="text-xs font-normal text-text-secondary">ر.ي</span>
                          </span>
                        </div>
                        <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
                          {item.description || "لا يوجد وصف لهذا الطبق."}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between border-t border-bg-tertiary pt-3 mt-4">
                        {/* Toggle Status switch */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleItemDisabled(item.id)}
                            className={`w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none ${
                              item.isDisabled ? "bg-bg-tertiary" : "bg-success"
                            }`}
                            aria-label={item.isDisabled ? "تفعيل الصنف" : "تعطيل الصنف"}
                          >
                            <span 
                              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                                item.isDisabled ? "right-1" : "right-5"
                              }`}
                            />
                          </button>
                          <span className="text-text-secondary text-xs font-medium">
                            {item.isDisabled ? "غير متوفر" : "متوفر"}
                          </span>
                        </div>

                        {/* Edit & Delete buttons */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openItemModal(item)}
                            className="w-8 h-8 rounded-lg bg-bg-tertiary hover:bg-gold/20 hover:text-gold flex items-center justify-center text-text-secondary transition-colors"
                            title="تعديل الطبق"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleItemDelete(item.id)}
                            className="w-8 h-8 rounded-lg bg-bg-tertiary hover:bg-danger/20 hover:text-danger flex items-center justify-center text-text-secondary transition-colors"
                            title="حذف الطبق"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary mb-4">
                <Utensils size={28} />
              </div>
              <h3 className="text-text-primary font-bold mb-1">لا توجد أطباق</h3>
              <p className="text-text-secondary text-sm">جرب تغيير الفلتر أو إضافة طبق جديد للبدء.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL 1: ADD / EDIT ITEM --- */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsItemModalOpen(false)}
              className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-secondary border border-bg-tertiary rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-6 border-b border-bg-tertiary flex items-center justify-between">
                <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
                  <Utensils size={20} className="text-gold" />
                  <span>{editingItem ? "تعديل بيانات الطبق" : "إضافة طبق جديد للمنيو"}</span>
                </h3>
                <button onClick={() => setIsItemModalOpen(false)} className="text-text-secondary hover:text-gold transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleItemSubmit} className="p-6 space-y-5">
                {/* Item Name */}
                <div className="space-y-1.5">
                  <label htmlFor="itemName" className="block text-xs font-semibold text-text-secondary">اسم الطبق *</label>
                  <input
                    type="text"
                    id="itemName"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    placeholder="مثال: كباب لحم، بيتزا خضار..."
                    className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {/* Item Category & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="itemCategoryId" className="block text-xs font-semibold text-text-secondary">الصنف التابع له *</label>
                    <select
                      id="itemCategoryId"
                      value={itemCategoryId}
                      onChange={(e) => setItemCategoryId(e.target.value)}
                      required
                      className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors appearance-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="itemPrice" className="block text-xs font-semibold text-text-secondary">السعر (ر.ي) *</label>
                    <input
                      type="number"
                      id="itemPrice"
                      value={itemPrice || ""}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      required
                      min={1}
                      placeholder="السعر بالريال اليمني"
                      className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors text-right"
                    />
                  </div>
                </div>

                {/* Item Description */}
                <div className="space-y-1.5">
                  <label htmlFor="itemDescription" className="block text-xs font-semibold text-text-secondary">وصف الطبق</label>
                  <textarea
                    id="itemDescription"
                    rows={3}
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="مكونات الطبق وطريقة تقديمه..."
                    className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold resize-none transition-colors"
                  />
                </div>

                {/* Item Image URL */}
                <div className="space-y-1.5">
                  <label htmlFor="itemImage" className="block text-xs font-semibold text-text-secondary flex items-center gap-1">
                    <ImageIcon size={12} />
                    <span>رابط صورة الطبق</span>
                  </label>
                  <input
                    type="url"
                    id="itemImage"
                    value={itemImage}
                    onChange={(e) => setItemImage(e.target.value)}
                    placeholder="ضع رابط صورة (Unsplash أو غيرها) أو اتركه فارغاً للصورة التلقائية"
                    className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-bg-tertiary">
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg border border-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30 text-sm font-semibold transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand text-text-primary hover:bg-brand-light text-sm font-semibold transition-all shadow-lg shadow-brand/10"
                  >
                    <Save size={16} />
                    <span>{editingItem ? "حفظ التعديلات" : "إضافة الطبق"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2: ADD / EDIT CATEGORY --- */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-secondary border border-bg-tertiary rounded-xl w-full max-w-sm overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-6 border-b border-bg-tertiary flex items-center justify-between">
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                  <FolderPlus size={18} className="text-gold" />
                  <span>{editingCategory ? "تعديل اسم الصنف" : "إضافة صنف مأكولات جديد"}</span>
                </h3>
                <button onClick={() => setIsCategoryModalOpen(false)} className="text-text-secondary hover:text-gold transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="p-6 space-y-5">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <label htmlFor="categoryName" className="block text-xs font-semibold text-text-secondary">اسم الصنف *</label>
                  <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    placeholder="مثال: مقبلات، مشاوي، بيتزا، طواجن..."
                    className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-bg-tertiary">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/30 text-sm font-semibold transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-text-primary hover:bg-brand-light text-sm font-semibold transition-all"
                  >
                    <Save size={16} />
                    <span>{editingCategory ? "تعديل" : "إضافة صنف"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
