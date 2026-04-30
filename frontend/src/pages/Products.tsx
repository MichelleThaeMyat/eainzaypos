import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, List, X } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const Products = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', categoryId: '' });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const [prodRes, catRes] = await Promise.all([
        axios.get('http://localhost:4000/api/products', config),
        axios.get('http://localhost:4000/api/products/categories', config)
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      if (catRes.data.length > 0 && !formData.categoryId) {
         setFormData(f => ({ ...f, categoryId: catRes.data[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      if (editingId) {
        await axios.put(`http://localhost:4000/api/products/${editingId}`, formData, config);
      } else {
        await axios.post('http://localhost:4000/api/products', formData, config);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (e) {
      console.error(e);
      alert('လုပ်ဆောင်မှု မအောင်မြင်ပါ');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('ဒီပစ္စည်းကို ဖျက်မှာ သေချာပါသလား?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        await axios.delete(`http://localhost:4000/api/products/${id}`, config);
        fetchProducts();
      } catch (e) {
        alert('ပစ္စည်းဖျက်ရန် မအောင်မြင်ပါ');
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      await axios.post('http://localhost:4000/api/products/categories', { name: newCategoryName }, config);
      setNewCategoryName('');
      fetchProducts();
    } catch (e) {
      alert('အမျိုးအစားအသစ် ထည့်သွင်းခြင်း မအောင်မြင်ပါ');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('ဒီအမျိုးအစားကို ဖျက်မှာ သေချာပါသလား? (အမျိုးအစားတွင် ပစ္စည်းများ မရှိမှသာ ဖျက်၍ရမည်)')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        await axios.delete(`http://localhost:4000/api/products/categories/${id}`, config);
        fetchProducts();
      } catch (e: any) {
        if (e.response && e.response.status === 400) {
           alert('ဒီအမျိုးအစားထဲမှာ ပစ္စည်းများ ရှိနေသည့်အတွက် ဖျက်၍မရပါ။');
        } else {
           alert('အမျိုးအစားဖျက်ရန် မအောင်မြင်ပါ');
        }
      }
    }
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({ 
      name: product.name, 
      price: product.price.toString(), 
      stock: product.stock.toString(), 
      categoryId: product.categoryId 
    });
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', stock: '', categoryId: categories[0]?.id || '' });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ကုန်ပစ္စည်းများ</h1>
          <p className="text-slate-500 text-sm mt-1">ဆိုင်ရှိ ကုန်ပစ္စည်းစာရင်းများကို ဤနေရာတွင် စီမံနိုင်ပါသည်။</p>
        </div>
        {user?.role === 'ADMIN' && (
          <div className="flex flex-wrap gap-3">
             <button onClick={() => setIsCategoryModalOpen(true)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-2.5 px-4 flex items-center gap-2 rounded-xl transition-colors cursor-pointer shadow-sm">
               <List size={18} />
               <span>အမျိုးအစားများ</span>
             </button>
             <button onClick={openNew} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 flex items-center gap-2 rounded-xl transition-colors cursor-pointer shadow-sm">
               <Plus size={18} />
               <span>ပစ္စည်းသစ်ထည့်မည်</span>
             </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-slate-500">ရှာဖွေနေပါသည်...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
                  <th className="p-4 font-semibold text-center w-16">SN</th>
                  <th className="p-4 font-semibold">အမည်</th>
                  <th className="p-4 font-semibold">အမျိုးအစား</th>
                  <th className="p-4 font-semibold text-right">စျေးနှုန်း</th>
                  <th className="p-4 font-semibold text-center">လက်ကျန်</th>
                  {user?.role === 'ADMIN' && <th className="p-4 font-semibold text-center">လုပ်ဆောင်ချက်</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {products.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center text-slate-500 text-sm">{i + 1}</td>
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4 text-sm text-slate-600">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-md">{p.category?.name || 'မရှိ'}</span>
                    </td>
                    <td className="p-4 text-right font-medium">{p.price.toLocaleString()} ကျပ်</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-sm font-medium ${p.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {p.stock}
                      </span>
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(p)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {products.length === 0 && (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-slate-500">
                        ပစ္စည်းစာရင်း မရှိသေးပါ။
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">{editingId ? 'ပစ္စည်း ပြင်ဆင်ရန်' : 'ပစ္စည်းသစ် ထည့်ရန်'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">အမည်</label>
                <input required type="text" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">စျေးနှုန်း</label>
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData(f => ({...f, price: e.target.value}))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">လက်ကျန်</label>
                  <input required type="number" min="0" value={formData.stock} onChange={e => setFormData(f => ({...f, stock: e.target.value}))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">အမျိုးအစား</label>
                <select required value={formData.categoryId} onChange={e => setFormData(f => ({...f, categoryId: e.target.value}))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 mt-6 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer">
                  မလုပ်တော့ပါ
                </button>
                <button type="submit" className="px-5 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors cursor-pointer">
                  သိမ်းမည်
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><List size={22} className="text-blue-600"/> အမျိုးအစားများ</h2>
               <button onClick={() => setIsCategoryModalOpen(false)} className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleCreateCategory} className="flex gap-2 mb-6">
               <input 
                 type="text" 
                 value={newCategoryName} 
                 onChange={e => setNewCategoryName(e.target.value)} 
                 placeholder="အမျိုးအစားအသစ်" 
                 className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                 required
               />
               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer">
                 ထည့်မည်
               </button>
            </form>

            <div className="flex-1 overflow-y-auto">
               <ul className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                  {categories.map(category => (
                     <li key={category.id} className="flex justify-between items-center p-3 hover:bg-slate-50 transition">
                        <span className="font-medium text-slate-700">{category.name}</span>
                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                           <Trash2 size={18} />
                        </button>
                     </li>
                  ))}
                  {categories.length === 0 && (
                     <li className="p-4 text-center text-slate-500">အမျိုးအစားမရှိသေးပါ။</li>
                  )}
               </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
