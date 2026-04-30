import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const Sales: React.FC = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const { data } = await axios.get('http://localhost:4000/api/products', config);
        setProducts(data.filter((p: Product) => p.stock > 0)); // Only show in-stock items
      } catch (err) {
        console.error('Failed to fetch products', err);
      }
    };
    fetchProducts();
  }, [user]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) return prevCart; // Prevent exceeding stock
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity < 1) return item;
          if (newQuantity > item.product.stock) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const saleItems = cart.map(item => ({ productId: item.product.id, quantity: item.quantity }));
      await axios.post('http://localhost:4000/api/sales', { saleItems, paymentMethod: 'CASH' }, config);
      alert('အရောင်းမှတ်တမ်း အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ။');
      setCart([]);
      
      // Refresh products to show updated stock
      const { data } = await axios.get('http://localhost:4000/api/products', config);
      setProducts(data.filter((p: Product) => p.stock > 0));
    } catch (err) {
      alert('ငွေရှင်းရန် အခက်အခဲ ဖြစ်နေပါသည်။');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">အရောင်းမှတ်တမ်း (POS)</h1>
        <p className="text-slate-500">ကုန်ပစ္စည်းများကို ရွေးချယ်၍ အရောင်းအဝယ်ပြုလုပ်ပါ။</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Product Selection */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 overflow-y-auto flex flex-col">
          <h2 className="font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2 sticky top-0 bg-white z-10">
            <ShoppingCart size={18} /> ရောင်းရန်ပစ္စည်းများ
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-slate-50 rounded-xl p-4 cursor-pointer hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all flex flex-col h-full active:scale-95"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 leading-tight mb-2">{product.name}</h3>
                </div>
                <div className="mt-auto">
                   <p className="text-blue-600 font-bold mb-1">{product.price.toLocaleString()} Ks</p>
                   <p className="text-xs text-slate-500">ကျန်ရှိ: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
          {products.length === 0 && (
            <div className="text-center py-12 text-slate-500 m-auto">
               ရောင်းရန် ပစ္စည်းမရှိသေးပါ။ (သို့) Stock ကုန်နေပါသည်။
            </div>
          )}
        </div>

        {/* Cart Review */}
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-sm">
           <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
             <h2 className="font-bold text-slate-700 flex justify-between">
                <span>ဝယ်ယူမည့်စာရင်း</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-sm">{cart.length} မျိုး</span>
             </h2>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm h-full flex items-center justify-center">
                   ဇယားလွတ်နေပါသည်<br/>ဘယ်ဘက်မှ ပစ္စည်းများကို ရွေးချယ်ပါ
                </div>
             ) : (
                cart.map((item) => (
                   <div key={item.product.id} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex justify-between items-start">
                         <h4 className="font-medium text-slate-800 text-sm">{item.product.name}</h4>
                         <button onClick={() => removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600 cursor-pointer">
                            <Trash2 size={16} />
                         </button>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                         <div className="flex items-center gap-2 bg-white rounded-md border border-slate-200 p-1">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"><Minus size={14} /></button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"><Plus size={14} /></button>
                         </div>
                         <div className="font-bold text-slate-700">
                             {(item.product.price * item.quantity).toLocaleString()}
                         </div>
                      </div>
                   </div>
                ))
             )}
           </div>

           <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
             <div className="flex justify-between font-bold text-lg mb-4">
                <span>စုစုပေါင်း</span>
                <span className="text-blue-600">{totalAmount.toLocaleString()} ကျပ်</span>
             </div>
             <button 
                onClick={handleCheckout}
                disabled={cart.length === 0 || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 rounded-lg flex justify-center items-center transition-colors cursor-pointer shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
             >
               {loading ? 'ဆောင်ရွက်နေပါသည်...' : 'ငွေရှင်းမည်'}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
