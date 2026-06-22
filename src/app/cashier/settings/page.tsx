"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Store, Bell, Printer, Clock, Wallet, Truck, 
  Save, ToggleLeft, ToggleRight, ChevronLeft 
} from "lucide-react";

interface SettingToggle {
  id: string;
  label: string;
  description: string;
  value: boolean;
  icon: typeof Bell;
}

export default function SettingsPage() {
  const [restaurantName, setRestaurantName] = useState("البيت التركي للمشويات");
  const [taxRate, setTaxRate] = useState("15");
  const [deliveryFee, setDeliveryFee] = useState("15");
  const [currency, setCurrency] = useState("SAR");
  const [orderTimeout, setOrderTimeout] = useState("30");
  const [saved, setSaved] = useState(false);

  const [toggles, setToggles] = useState<SettingToggle[]>([
    { id: "notifications", label: "إشعارات الطلبات", description: "تشغيل صوت تنبيه عند ورود طلب جديد.", value: true, icon: Bell },
    { id: "autoPrint", label: "طباعة تلقائية", description: "طباعة الفاتورة تلقائياً عند تأكيد الطلب.", value: false, icon: Printer },
    { id: "delivery", label: "قبول طلبات التوصيل", description: "السماح بتلقي طلبات التوصيل من الموقع.", value: true, icon: Truck },
    { id: "walletPayment", label: "الدفع بالمحفظة الإلكترونية", description: "تفعيل خيار الدفع عبر المحفظة الإلكترونية للزبائن.", value: true, icon: Wallet },
    { id: "autoConfirm", label: "تأكيد تلقائي للطلبات", description: "تأكيد الطلبات تلقائياً بدون مراجعة الكاشير.", value: false, icon: Clock },
  ]);

  const handleToggle = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, value: !t.value } : t));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-1">الإعدادات</h1>
        <p className="text-text-secondary text-sm">إدارة إعدادات النظام والمطعم.</p>
      </div>

      <div className="space-y-6">

        {/* Restaurant Info */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold"><Store size={22} /></div>
            <div>
              <h2 className="text-text-primary font-bold">معلومات المطعم</h2>
              <p className="text-text-secondary text-xs">البيانات الأساسية للنظام.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">اسم المطعم</label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">العملة</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors appearance-none"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="YER">ريال يمني (YER)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">نسبة الضريبة (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">رسوم التوصيل (ر.ي)</label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">مهلة تأكيد الطلب (دقائق)</label>
              <input
                type="number"
                value={orderTimeout}
                onChange={(e) => setOrderTimeout(e.target.value)}
                className="w-full bg-bg-primary border border-bg-tertiary rounded-lg px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-bg-secondary border border-bg-tertiary rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold"><Bell size={22} /></div>
            <div>
              <h2 className="text-text-primary font-bold">خيارات النظام</h2>
              <p className="text-text-secondary text-xs">تشغيل أو إيقاف ميزات النظام.</p>
            </div>
          </div>

          <div className="space-y-1">
            {toggles.map((toggle) => {
              const Icon = toggle.icon;
              return (
                <div
                  key={toggle.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-bg-tertiary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${toggle.value ? "bg-gold/10 text-gold" : "bg-bg-tertiary text-text-secondary"}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-text-primary font-bold text-sm">{toggle.label}</p>
                      <p className="text-text-secondary text-xs">{toggle.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleToggle(toggle.id)} className="flex-shrink-0">
                    {toggle.value ? (
                      <ToggleRight size={36} className="text-gold" />
                    ) : (
                      <ToggleLeft size={36} className="text-text-secondary" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-bg-primary transition-all duration-300 ${
              saved ? "bg-success" : "bg-gold hover:bg-gold-light"
            }`}
          >
            <Save size={18} />
            <span>{saved ? "تم الحفظ بنجاح!" : "حفظ الإعدادات"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
