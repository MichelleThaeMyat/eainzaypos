import React, { useEffect, useState } from 'react';
import { ReceiptText, Printer, X, Eye } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

const Invoices: React.FC = () => {
  const { user } = useAuthStore();
  const [sales, setSales] = useState<any[]>([]);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const { data } = await axios.get('http://localhost:4000/api/sales', config);
        setSales(data);
      } catch (e) {
        console.error('Failed to load sales', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [user]);

  const fetchSaleDetails = async (id: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get(`http://localhost:4000/api/sales/${id}`, config);
      setSelectedSale(data);
    } catch (e) {
      alert('ဘောက်ချာအချက်အလက်ကို ယူ၍မရပါ။');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="mb-6 print:hidden">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ဘောက်ချာများ</h1>
        <p className="text-slate-500">အရောင်းအဝယ် ပြုလုပ်ပြီးသော ငွေရှင်းပြေစာ မှတ်တမ်းများ။</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">ရှာဖွေနေပါသည်...</div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <ReceiptText className="text-slate-300 mb-4" size={48} />
            <p>မှတ်တမ်းမရှိသေးပါ။</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm">
                  <th className="p-4 font-semibold w-16 text-center">No</th>
                  <th className="p-4 font-semibold">ဘောက်ချာနံပါတ်</th>
                  <th className="p-4 font-semibold">ရက်စွဲ</th>
                  <th className="p-4 font-semibold">အရောင်းစာရေး</th>
                  <th className="p-4 font-semibold text-right">စုစုပေါင်းငွေ</th>
                  <th className="p-4 font-semibold text-center">အသေးစိတ်</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {sales.map((sale, i) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center text-slate-500 text-sm">{i + 1}</td>
                    <td className="p-4 font-mono text-sm">{sale.id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-4 text-sm">{format(new Date(sale.createdAt), 'dd MMM yyyy, h:mm a')}</td>
                    <td className="p-4">
                       <span className="bg-slate-100 px-2 py-1 rounded-md text-sm">{sale.cashier?.name || 'Unknown'}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-700">{sale.totalAmount.toLocaleString()} Ks</td>
                    <td className="p-4 text-center">
                      <button 
                         onClick={() => fetchSaleDetails(sale.id)}
                         className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer inline-flex"
                      >
                         <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Modal (Printable) */}
      {selectedSale && (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:bg-white print:p-0">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col print:shadow-none print:w-full print:max-w-none print:h-screen">
               {/* Modal Header (Hidden on print) */}
               <div className="flex items-center justify-between p-4 border-b border-slate-100 print:hidden">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <ReceiptText size={18} className="text-blue-600" />
                     ဘောက်ချာအသေးစိတ်
                  </h3>
                  <button onClick={() => setSelectedSale(null)} className="p-1 text-slate-400 hover:text-red-500 rounded bg-slate-50 hover:bg-red-50 transition-colors cursor-pointer">
                     <X size={20} />
                  </button>
               </div>

               {/* Receipt Content */}
               <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-700 print:p-0">
                  <div className="text-center mb-6">
                     <h2 className="text-2xl font-bold tracking-tight text-slate-900">အိမ်ဈေး POS</h2>
                     <p className="text-slate-500 text-xs mt-1">အဆင်ပြေချောမွေ့စွာ ဝယ်ယူအားပေးနိုင်ပါသည်။</p>
                  </div>
                  
                  <div className="space-y-1 mb-6 text-xs text-slate-500 pb-4 border-b border-dashed border-slate-300">
                     <div className="flex justify-between">
                        <span>ရက်စွဲ:</span>
                        <span className="text-slate-800">{format(new Date(selectedSale.createdAt), 'dd/MM/yyyy h:mm a')}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>ဘောက်ချာနံပါတ်:</span>
                        <span className="text-slate-800 font-mono">{selectedSale.id.slice(0, 8).toUpperCase()}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>အရောင်းစာရေး:</span>
                        <span className="text-slate-800">{selectedSale.cashier?.name}</span>
                     </div>
                  </div>

                  <table className="w-full mb-6">
                     <thead>
                        <tr className="border-b border-slate-800 text-slate-900 border-dashed">
                           <th className="text-left py-2 font-semibold">အမည်</th>
                           <th className="text-center py-2 font-semibold">ခု</th>
                           <th className="text-right py-2 font-semibold">ကျပ်</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 divide-dashed">
                        {selectedSale.items?.map((item: any) => (
                           <tr key={item.id}>
                              <td className="py-2.5">{item.product?.name || 'Deleted Product'}</td>
                              <td className="text-center py-2.5">{item.quantity}</td>
                              <td className="text-right py-2.5">{(item.price * item.quantity).toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-3 border-t-2 border-slate-800 mb-8 font-bold text-base text-slate-900 border-dashed">
                     <span>စုစုပေါင်း</span>
                     <span>{selectedSale.totalAmount.toLocaleString()} Ks</span>
                  </div>

                  <div className="text-center text-xs text-slate-400 mt-auto">
                     ဝယ်ယူအားပေးမှုကို ကျေးဇူးတင်ပါသည်။ <br/> <span className="text-slate-300">Generated by Eain Zay</span>
                  </div>
               </div>

               {/* Modal Footer (Hidden on print) */}
               <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl print:hidden flex justify-end">
                  <button onClick={handlePrint} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm cursor-pointer">
                     <Printer size={18} /> Print Receipt
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Invoices;
