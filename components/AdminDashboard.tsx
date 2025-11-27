import React, { useState, useEffect } from 'react';
import { Order, MenuItem, DiscountCode } from '../types';
import { 
    LayoutDashboard, CheckCircle, Clock, DollarSign, LogOut, RefreshCw, 
    Coffee, Tag, Plus, Edit2, Trash2, Save, X 
} from 'lucide-react';
import * as db from '../services/backend';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'overview' | 'menu' | 'discounts';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  
  // Edit State
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Partial<DiscountCode> | null>(null);

  // Load Data
  const loadData = async () => {
    const [loadedOrders, loadedMenu, loadedDiscounts] = await Promise.all([
      db.getOrders(),
      db.getMenu(),
      db.getDiscounts()
    ]);
    setOrders(loadedOrders);
    setMenuItems(loadedMenu);
    setDiscounts(loadedDiscounts);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  // --- ORDER ACTIONS ---
  const handleStatusUpdate = async (orderId: string, newStatus: 'completed') => {
    await db.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  // --- MENU ACTIONS ---
  const handleSaveMenuItem = async () => {
    if (!editingItem || !editingItem.name || !editingItem.price) return;
    
    const itemToSave: MenuItem = {
      id: editingItem.id || Date.now().toString(),
      name: editingItem.name,
      description: editingItem.description || '',
      price: Number(editingItem.price),
      category: editingItem.category || 'Other',
      image: editingItem.image || 'https://picsum.photos/400/400',
      calories: Number(editingItem.calories) || 0,
      available: editingItem.available !== false
    };

    await db.saveMenuItem(itemToSave);
    setEditingItem(null);
    loadData();
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Delete this item?')) {
      await db.deleteMenuItem(id);
      loadData();
    }
  };

  // --- DISCOUNT ACTIONS ---
  const handleSaveDiscount = async () => {
    if (!editingDiscount || !editingDiscount.code || !editingDiscount.value) return;
    
    const codeToSave: DiscountCode = {
      id: editingDiscount.id || Date.now().toString(),
      code: editingDiscount.code.toUpperCase(),
      type: editingDiscount.type || 'percent',
      value: Number(editingDiscount.value),
      active: editingDiscount.active !== false
    };

    await db.saveDiscount(codeToSave);
    setEditingDiscount(null);
    loadData();
  };

  const handleDeleteDiscount = async (id: string) => {
      if (window.confirm('Delete this code?')) {
          await db.deleteDiscount(id);
          loadData();
      }
  };

  const metrics = {
    totalRevenue: orders.reduce((acc, o) => acc + o.total, 0),
    taxCollected: orders.reduce((acc, o) => acc + o.tax, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'completed').length,
  };

  // Common input styles
  const inputClass = "w-full border border-gray-300 p-2 rounded bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent outline-none";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-serif font-bold text-coffee-900 mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full px-4 py-3 border border-coffee-200 rounded-lg mb-4 bg-white text-gray-900 focus:ring-2 focus:ring-accent outline-none"
            />
            <button
              type="submit"
              className="w-full bg-coffee-900 text-white py-3 rounded-lg font-bold hover:bg-coffee-800 transition-colors"
            >
              Login
            </button>
          </form>
          <button onClick={onLogout} className="w-full mt-4 text-sm text-coffee-500 hover:text-coffee-800">
            Back to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-coffee-900 text-white px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <LayoutDashboard className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold font-serif">Admin Dashboard</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-6">
            <div className="hidden md:flex space-x-1">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-coffee-800 text-white' : 'text-coffee-200 hover:text-white'}`}>Overview</button>
                <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'menu' ? 'bg-coffee-800 text-white' : 'text-coffee-200 hover:text-white'}`}>Menu</button>
                <button onClick={() => setActiveTab('discounts')} className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'discounts' ? 'bg-coffee-800 text-white' : 'text-coffee-200 hover:text-white'}`}>Discounts</button>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={loadData} className="p-2 hover:bg-coffee-800 rounded-full transition-colors" title="Refresh">
                <RefreshCw className="h-5 w-5" />
                </button>
                <button onClick={onLogout} className="flex items-center space-x-2 px-4 py-2 bg-coffee-800 rounded-lg hover:bg-coffee-700 transition-colors">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Exit</span>
                </button>
            </div>
          </div>
        </div>
        {/* Mobile Tabs */}
        <div className="md:hidden flex justify-around mt-4 border-t border-coffee-800 pt-2">
             <button onClick={() => setActiveTab('overview')} className={`p-2 ${activeTab === 'overview' ? 'text-accent' : 'text-gray-400'}`}><LayoutDashboard className="h-5 w-5"/></button>
             <button onClick={() => setActiveTab('menu')} className={`p-2 ${activeTab === 'menu' ? 'text-accent' : 'text-gray-400'}`}><Coffee className="h-5 w-5"/></button>
             <button onClick={() => setActiveTab('discounts')} className={`p-2 ${activeTab === 'discounts' ? 'text-accent' : 'text-gray-400'}`}><Tag className="h-5 w-5"/></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
            <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
                <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900">${metrics.totalRevenue.toFixed(2)}</h3>
                </div>
                <DollarSign className="h-8 w-8 text-coffee-200" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">Tax Collected</p>
                    <h3 className="text-2xl font-bold text-gray-900">${metrics.taxCollected.toFixed(2)}</h3>
                </div>
                <DollarSign className="h-8 w-8 text-coffee-200" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                    <h3 className="text-2xl font-bold text-gray-900">{metrics.pendingOrders}</h3>
                </div>
                <Clock className="h-8 w-8 text-coffee-200" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <h3 className="text-2xl font-bold text-gray-900">{metrics.completedOrders}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-coffee-200" />
                </div>
            </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
            {/* Pending Orders Column */}
            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-lg font-bold text-gray-700 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                Live Order Feed
                </h2>
                
                {orders.filter(o => o.status === 'pending').length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-gray-400 border border-dashed border-gray-300">
                    No pending orders
                </div>
                ) : (
                orders.filter(o => o.status === 'pending').map(order => (
                    <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-yellow-50 px-6 py-3 flex justify-between items-center border-b border-yellow-100">
                        <div>
                        <span className="font-bold text-coffee-900">Table {order.tableNumber}</span>
                        <span className="text-coffee-500 mx-2">•</span>
                        <span className="text-coffee-700">{order.customerName}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-500">{new Date(order.date).toLocaleTimeString()}</span>
                    </div>
                    <div className="p-6">
                        <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm text-gray-800">
                            <span className="flex items-center">
                                <span className="font-bold w-6">{item.quantity}x</span>
                                {item.name}
                            </span>
                            <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="text-sm">
                            {order.discountAmount > 0 && (
                                <div className="text-green-600 text-xs">Discount: -${order.discountAmount.toFixed(2)}</div>
                            )}
                            <span className="text-gray-500">Total: </span>
                            <span className="font-bold text-lg text-gray-900">${order.total.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            className="bg-coffee-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                        >
                            Mark Completed
                        </button>
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>

            {/* Recent Completed Column */}
            <div>
                <h2 className="text-lg font-bold text-gray-700 flex items-center mb-6">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Recently Completed
                </h2>
                <div className="space-y-4">
                {orders.filter(o => o.status === 'completed').slice(0, 10).map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-75">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="font-bold text-sm block text-gray-900">Table {order.tableNumber}</span>
                            <span className="text-xs text-gray-500">{order.customerName}</span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(order.date).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-right text-sm font-medium text-coffee-700">
                        ${order.total.toFixed(2)}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
            </>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-coffee-900">Menu Management</h2>
                    <button 
                        onClick={() => setEditingItem({})} 
                        className="bg-accent text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-amber-600"
                    >
                        <Plus className="h-4 w-4"/>
                        <span>Add Item</span>
                    </button>
                </div>

                {editingItem && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-accent animate-fade-in">
                         <h3 className="font-bold mb-4 text-gray-900">{editingItem.id ? 'Edit Item' : 'New Item'}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                             <input 
                                placeholder="Item Name" 
                                className={inputClass}
                                value={editingItem.name || ''} 
                                onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                            />
                             <input 
                                placeholder="Price" 
                                type="number" 
                                className={inputClass}
                                value={editingItem.price || ''} 
                                onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})}
                            />
                             <input 
                                placeholder="Category (e.g. Hot Coffee)" 
                                className={inputClass}
                                value={editingItem.category || ''} 
                                onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                            />
                             <input 
                                placeholder="Calories" 
                                type="number" 
                                className={inputClass}
                                value={editingItem.calories || ''} 
                                onChange={e => setEditingItem({...editingItem, calories: Number(e.target.value)})}
                            />
                             <textarea 
                                placeholder="Description" 
                                className={`${inputClass} md:col-span-2`}
                                value={editingItem.description || ''} 
                                onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                            />
                             <input 
                                placeholder="Image URL" 
                                className={`${inputClass} md:col-span-2`}
                                value={editingItem.image || ''} 
                                onChange={e => setEditingItem({...editingItem, image: e.target.value})}
                            />
                         </div>
                         <div className="flex justify-end space-x-2">
                             <button onClick={() => setEditingItem(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                             <button onClick={handleSaveMenuItem} className="px-4 py-2 bg-coffee-900 text-white rounded hover:bg-accent">Save Item</button>
                         </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow p-4 flex space-x-4">
                             <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded"/>
                             <div className="flex-1">
                                 <div className="flex justify-between items-start">
                                     <h3 className="font-bold text-coffee-900">{item.name}</h3>
                                     <span className="text-accent font-bold">${item.price.toFixed(2)}</span>
                                 </div>
                                 <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                                 <div className="flex space-x-2 mt-2">
                                     <button onClick={() => setEditingItem(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="h-4 w-4"/></button>
                                     <button onClick={() => handleDeleteItem(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4"/></button>
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* DISCOUNTS TAB */}
        {activeTab === 'discounts' && (
             <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-serif font-bold text-coffee-900">Discount Codes</h2>
                    <button 
                        onClick={() => setEditingDiscount({})} 
                        className="bg-accent text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-amber-600"
                    >
                        <Plus className="h-4 w-4"/>
                        <span>Create Code</span>
                    </button>
                </div>

                {editingDiscount && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-accent animate-fade-in">
                         <h3 className="font-bold mb-4 text-gray-900">{editingDiscount.id ? 'Edit Code' : 'New Discount Code'}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                             <input 
                                placeholder="Code (e.g. SAVE10)" 
                                className={`${inputClass} uppercase`}
                                value={editingDiscount.code || ''} 
                                onChange={e => setEditingDiscount({...editingDiscount, code: e.target.value})}
                            />
                             <select 
                                className={inputClass}
                                value={editingDiscount.type || 'percent'}
                                onChange={e => setEditingDiscount({...editingDiscount, type: e.target.value as any})}
                             >
                                 <option value="percent">Percentage (%)</option>
                                 <option value="fixed">Fixed Amount ($)</option>
                             </select>
                             <input 
                                placeholder="Value" 
                                type="number" 
                                className={inputClass}
                                value={editingDiscount.value || ''} 
                                onChange={e => setEditingDiscount({...editingDiscount, value: Number(e.target.value)})}
                            />
                         </div>
                         <div className="flex justify-end space-x-2">
                             <button onClick={() => setEditingDiscount(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                             <button onClick={handleSaveDiscount} className="px-4 py-2 bg-coffee-900 text-white rounded hover:bg-accent">Save Code</button>
                         </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-coffee-50 text-coffee-700">
                            <tr>
                                <th className="p-4">Code</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Value</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {discounts.map(d => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono font-bold text-coffee-900">{d.code}</td>
                                    <td className="p-4 capitalize text-gray-800">{d.type}</td>
                                    <td className="p-4 text-gray-800">{d.type === 'percent' ? `${d.value}%` : `$${d.value}`}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${d.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {d.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex space-x-2">
                                        <button onClick={() => setEditingDiscount(d)} className="text-blue-600 hover:underline text-sm">Edit</button>
                                        <button onClick={() => handleDeleteDiscount(d.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;