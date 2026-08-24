import React, { useState, useEffect } from 'react';

const netIcons = {
  'فودافون': (
    <svg viewBox="0 0 100 100" className="w-8 h-8 mb-1">
      <circle cx="50" cy="50" r="45" fill="#e60000" />
      <path d="M50 20 C35 20 25 32 25 48 C25 65 38 78 55 78 C68 78 75 68 75 58 C75 48 65 42 55 42 C48 42 42 46 42 52 C42 58 48 62 55 62 C60 62 65 58 65 54 C65 50 60 48 55 48 C50 48 45 52 45 56" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
    </svg>
  ),
  'أورنج': (
    <svg viewBox="0 0 100 100" className="w-8 h-8 mb-1">
      <rect x="5" y="5" width="90" height="90" rx="15" fill="#ff7900" />
      <rect x="25" y="65" width="50" height="12" fill="#ffffff" />
    </svg>
  ),
  'اتصالات': (
    <svg viewBox="0 0 100 100" className="w-8 h-8 mb-1">
      <circle cx="50" cy="50" r="45" fill="#719e19" />
      <text x="50%" y="62%" fontSize="45" fontWeight="bold" fill="#ffffff" textAnchor="middle">e&</text>
    </svg>
  ),
  'وي': (
    <svg viewBox="0 0 100 100" className="w-8 h-8 mb-1">
      <circle cx="50" cy="50" r="45" fill="#5e2750" />
      <text x="50%" y="65%" fontSize="40" fontWeight="bold" fill="#ffffff" textAnchor="middle">we</text>
    </svg>
  )
};

export default function WalletManager() {
  const [transactions, setTransactions] = useState(() => {
    return JSON.parse(localStorage.getItem('vf_cash_txs')) || [];
  });
  
  const [walletBalance, setWalletBalance] = useState(() => {
    return parseFloat(localStorage.getItem('vf_wallet_balance')) || 0;
  });

  const [selectedNet, setSelectedNet] = useState('فودافون');
  
  const [type, setType] = useState('إيداع');
  const [datetime, setDatetime] = useState('');
  const [amount, setAmount] = useState(0);
  const [profit, setProfit] = useState(0);
  const [notes, setNotes] = useState('');

  const [monthFilter, setMonthFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [netFilter, setNetFilter] = useState('');

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDatetime(now.toISOString().slice(0, 16));
    setMonthFilter(new Date().toISOString().slice(0, 7));
  }, []);

  useEffect(() => {
    localStorage.setItem('vf_cash_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('vf_wallet_balance', walletBalance);
  }, [walletBalance]);

  const updateWalletBalance = () => {
    const input = prompt("أدخل رصيد محفظتك الحالي الحقيقي (بالجنيه):", walletBalance);
    if (input !== null && !isNaN(input) && input.trim() !== "") {
      setWalletBalance(parseFloat(input));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount) || 0;
    const parsedProfit = parseFloat(profit) || 0;

    const newTx = {
      id: Date.now(),
      network: selectedNet,
      type,
      datetime,
      amount: parsedAmount,
      profit: parsedProfit,
      notes
    };

    let updatedBalance = walletBalance;
    if (type === 'إيداع') {
      updatedBalance -= parsedAmount;
    } else if (type === 'سحب') {
      updatedBalance += parsedAmount;
    }

    setWalletBalance(updatedBalance);
    setTransactions([newTx, ...transactions]);

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDatetime(now.toISOString().slice(0, 16));
    setAmount(0);
    setProfit(0);
    setNotes('');
  };

  const deleteTx = (id) => {
    if (window.confirm('هل أنت تأكد من حذف هذه المعاملة؟')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const resetFilters = () => {
    setDateFilter('');
    setNetFilter('');
  };

  const formatDate = (dtString) => {
    const dt = new Date(dtString);
    return dt.toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' });
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  let monthlyProfit = 0;
  let dailyProfit = 0;
  let dailyCount = 0;
  let dailyDeposit = 0;
  let dailyWithdraw = 0;

  transactions.forEach(t => {
    const txDate = t.datetime.slice(0, 10);
    const txMonth = t.datetime.slice(0, 7);

    if (monthFilter && txMonth === monthFilter) {
      monthlyProfit += t.profit;
    }

    if (txDate === todayStr) {
      dailyProfit += t.profit;
      dailyCount++;
      if (t.type === 'إيداع') dailyDeposit += t.amount;
      if (t.type === 'سحب') dailyWithdraw += t.amount;
    }
  });

  const filteredTransactions = transactions.filter(t => {
    let match = true;
    if (dateFilter && !t.datetime.startsWith(dateFilter)) match = false;
    if (netFilter && t.network !== netFilter) match = false;
    return match;
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-5 font-sans" dir="rtl">
      <div className="max-w-[950px] mx-auto">
        
        {/* Header */}
        <header className="bg-gray-900 text-white p-5 rounded-xl text-center mb-5 shadow-md">
          <h1 className="text-xl font-bold">نظام إدارة المحافظ الإلكترونية والأرباح</h1>
        </header>

        {/* Wallet Banner */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-5 rounded-xl mb-5 flex justify-between items-center flex-wrap gap-4 shadow-lg">
          <div>
            <h3 className="text-sm text-gray-300 mb-1">رصيد المحفظة الحالي:</h3>
            <div className="text-3xl font-bold text-green-400">{walletBalance.toFixed(2)} جنيه</div>
          </div>
          <button 
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold transition duration-200"
            onClick={updateWalletBalance}
          >
            تعديل رصيد المحفظة
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* New Transaction Form */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="mb-4 text-red-600 font-bold text-lg border-b border-gray-100 pb-2">تسجيل معاملة جديدة</h2>
            <form onSubmit={handleFormSubmit}>
              
              <div className="mb-3">
                <label className="block mb-1 font-bold text-sm">اختر الشبكة:</label>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Object.keys(netIcons).map((net) => (
                    <div
                      key={net}
                      className={`border-2 rounded-lg p-2 text-center cursor-pointer flex flex-col items-center justify-center transition-all ${
                        selectedNet === net 
                          ? 'border-red-600 bg-red-50 shadow-sm' 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedNet(net)}
                    >
                      {netIcons[net]}
                      <span className="text-xs font-bold">{net}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-bold text-sm">نوع المعاملة</label>
                <select 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-red-600 text-sm bg-white"
                  value={type} 
                  onChange={(e) => setType(e.target.value)} 
                  required
                >
                  <option value="إيداع">إيداع (خصم من المحفظة)</option>
                  <option value="سحب">سحب (إضافة للمحفظة)</option>
                  <option value="استعلام">استعلام</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-bold text-sm">التاريخ والوقت</label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-red-600 text-sm"
                  value={datetime} 
                  onChange={(e) => setDatetime(e.target.value)} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-bold text-sm">المبلغ (جنيه)</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-red-600 text-sm"
                  min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required 
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-bold text-sm">الربح / العمولة (جنيه)</label>
                <input 
                  type="number" 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-red-600 text-sm"
                  min="0" step="0.01" value={profit} onChange={(e) => setProfit(e.target.value)} required 
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-bold text-sm">ملاحظات (اختياري)</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:border-red-600 text-sm"
                  value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="رقم العميل أو اسم الشخص" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition duration-200"
              >
                حفظ المعاملة
              </button>
            </form>
          </div>

          {/* Stats Card */}
          <div className="bg-red-50/50 p-5 rounded-xl shadow-sm border border-gray-200 border-r-4 border-r-red-600">
            <h2 className="mb-4 text-red-600 font-bold text-lg border-b border-gray-200 pb-2">تقرير الأرباح والعمليات</h2>
            
            <div className="mb-3">
              <label className="block mb-1 font-bold text-sm">عرض تقرير شهر معين:</label>
              <input 
                type="month" 
                className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-white text-sm"
                value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} 
              />
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-dashed border-gray-200">
              <span className="text-sm">أرباح الشهر المحدد:</span>
              <span className="font-bold text-green-700 text-base">{monthlyProfit.toFixed(2)} جنيه</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-dashed border-gray-200">
              <span className="text-sm">إجمالي أرباح اليوم:</span>
              <span className="font-bold text-green-700 text-base">{dailyProfit.toFixed(2)} جنيه</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-dashed border-gray-200">
              <span className="text-sm">عدد عمليات اليوم:</span>
              <span className="font-bold text-base">{dailyCount}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 border-b border-dashed border-gray-200">
              <span className="text-sm">إجمالي إيداعات اليوم:</span>
              <span className="font-bold text-base">{dailyDeposit.toFixed(2)} جنيه</span>
            </div>
            <div className="flex justify-between items-center py-2.5">
              <span className="text-sm">إجمالي سحوبات اليوم:</span>
              <span className="font-bold text-base">{dailyWithdraw.toFixed(2)} جنيه</span>
            </div>
          </div>

          {/* Transactions Table & Filters */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 md:col-span-2">
            <h2 className="mb-4 text-red-600 font-bold text-lg border-b border-gray-100 pb-2">سجل المعاملات والبحث</h2>
            
            <div className="flex gap-3 mb-4 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <label className="block mb-1 font-bold text-sm">تصفية حسب اليوم:</label>
                <input 
                  type="date" 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none text-sm"
                  value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} 
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block mb-1 font-bold text-sm">تصفية حسب الشبكة:</label>
                <select 
                  className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-white text-sm"
                  value={netFilter} onChange={(e) => setNetFilter(e.target.value)}
                >
                  <option value="">جميع الشبكات</option>
                  {Object.keys(netIcons).map(net => (
                    <option key={net} value={net}>{net}</option>
                  ))}
                </select>
              </div>
              <div className="self-end">
                <button 
                  type="button" 
                  onClick={resetFilters} 
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition duration-200"
                >
                  إعادة ضبط
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-right text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="p-2.5 border-b border-gray-200">التاريخ والوقت</th>
                    <th className="p-2.5 border-b border-gray-200">الشبكة</th>
                    <th className="p-2.5 border-b border-gray-200">النوع</th>
                    <th className="p-2.5 border-b border-gray-200">المبلغ</th>
                    <th className="p-2.5 border-b border-gray-200">الربح</th>
                    <th className="p-2.5 border-b border-gray-200">ملاحظات</th>
                    <th className="p-2.5 border-b border-gray-200">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4 text-gray-500">لا توجد معاملات مسجلة</td>
                    </tr>
                  ) : (
                    filteredTransactions.map(tx => {
                      let badgeColor = 'bg-sky-500';
                      if (tx.type === 'إيداع') badgeColor = 'bg-emerald-600';
                      if (tx.type === 'سحب') badgeColor = 'bg-red-600';

                      return (
                        <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-2.5">{formatDate(tx.datetime)}</td>
                          <td className="p-2.5">
                            <span className="inline-flex items-center gap-1.5 font-bold">
                              {netIcons[tx.network]}
                              {tx.network}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-white text-xs ${badgeColor}`}>{tx.type}</span>
                          </td>
                          <td className="p-2.5">{tx.amount.toFixed(2)} ج.م</td>
                          <td className="p-2.5 text-emerald-700 font-bold">{tx.profit.toFixed(2)} ج.م</td>
                          <td className="p-2.5">{tx.notes || '-'}</td>
                          <td className="p-2.5">
                            <button 
                              className="bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded text-xs transition duration-200"
                              onClick={() => deleteTx(tx.id)}
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}