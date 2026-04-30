import React, { useEffect, useState } from 'react';
import { Package, TrendingUp, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-inner ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    products: 0,
    sales: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Quick fetch for basic stats
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const [productsRes, salesRes] = await Promise.all([
          axios.get('http://localhost:4000/api/products', config),
          axios.get('http://localhost:4000/api/sales', config)
        ]);

        const totalRevenue = salesRes.data.reduce((acc: number, sale: any) => acc + sale.totalAmount, 0);

        setStats({
          products: productsRes.data.length,
          sales: salesRes.data.length,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    };
    
    if (user?.role === 'ADMIN') {
        fetchStats();
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">မင်္ဂလာပါ {user?.name}</h1>
          <p className="text-slate-500 mt-1">ယနေ့ အရောင်းစာရင်းများကို ဤနေရာတွင် ကြည့်ရှုနိုင်ပါသည်။</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="ယနေ့ ဝင်ငွေ (MMK)" 
          value={stats.revenue.toLocaleString()} 
          icon={<TrendingUp size={28} />} 
          color="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="စုစုပေါင်း အရောင်း" 
          value={stats.sales} 
          icon={<ShoppingCart size={28} />} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="ပစ္စည်း အမျိုးအစား" 
          value={stats.products} 
          icon={<Package size={28} />} 
          color="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mt-8 text-center min-h-[300px] flex flex-col justify-center items-center">
         <div className="w-20 h-20 bg-slate-50 rounded-full flex justify-center items-center mb-4">
             <ShoppingCart className="text-slate-400" size={32} />
         </div>
         <h2 className="text-xl font-bold text-slate-700">အရောင်းစတင်ရန်</h2>
         <p className="text-slate-500 mt-2 mb-6 max-w-sm">
             ဘယ်ဘက်ရှိ "အရောင်းမှတ်တမ်း" (POS) သို့ သွားရောက်ပြီး အရောင်းအဝယ် စတင်နိုင်ပါသည်။
         </p>
      </div>
    </div>
  );
};

export default Dashboard;
