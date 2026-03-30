import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { PrimaryButton } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/helpers';

type StatusFilter = 'all' | 'delivered' | 'preparing' | 'placed' | 'cancelled';

const STATUS_CONFIG = {
  delivered:        { label: 'Delivered',        color: 'text-success',        bg: 'bg-success/20 border-success/30',        icon: '✅' },
  preparing:        { label: 'Preparing',         color: 'text-warning',        bg: 'bg-warning/20 border-warning/30',        icon: '👨‍🍳' },
  out_for_delivery: { label: 'Out for Delivery',  color: 'text-primary',        bg: 'bg-primary/20 border-primary/30',        icon: '🛵' },
  placed:           { label: 'Placed',            color: 'text-secondary',      bg: 'bg-secondary/20 border-secondary/30',    icon: '📋' },
  cancelled:        { label: 'Cancelled',         color: 'text-red-400',        bg: 'bg-red-400/20 border-red-400/30',        icon: '❌' },
};

const MOCK_ORDERS = [
  {
    id: 'BB1A2B3C', status: 'delivered', date: '2024-03-28',
    orderType: 'delivery',
    items: [
      { name: 'Japanese Matcha Bobba', qty: 2, size: '500ml', price: 498 },
      { name: 'Afghan Momos',          qty: 1, size: null,    price: 179 },
    ],
    subtotal: 677, gst: 34, deliveryFee: 40, total: 751,
  },
  {
    id: 'BB3C4D5E', status: 'delivered', date: '2024-03-25',
    orderType: 'pickup',
    items: [
      { name: 'Bingsu Mango Magic',    qty: 1, size: null,  price: 299 },
      { name: 'Mini Churros',          qty: 1, size: null,  price: 99  },
    ],
    subtotal: 398, gst: 20, deliveryFee: 0, total: 418,
  },
  {
    id: 'BB5E6F7G', status: 'delivered', date: '2024-03-20',
    orderType: 'delivery',
    items: [
      { name: 'Korean Ramen (Carbonara)', qty: 2, size: null, price: 558 },
      { name: 'Holland Fries (Peri Peri)', qty: 1, size: null, price: 149 },
    ],
    subtotal: 707, gst: 35, deliveryFee: 40, total: 782,
  },
  {
    id: 'BB7G8H9I', status: 'cancelled', date: '2024-03-15',
    orderType: 'delivery',
    items: [
      { name: 'Tiger Milk Bobba', qty: 1, size: '500ml', price: 249 },
    ],
    subtotal: 249, gst: 12, deliveryFee: 40, total: 301,
  },
];

const OrderHistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [filter, setFilter]     = useState<StatusFilter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all'
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter(o => o.status === filter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-28 px-4 text-center">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl mb-6 select-none"
        >
          📦
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-white mb-2">Sign in to see orders</h2>
        <p className="text-text-secondary mb-8">Your order history will appear here after you log in.</p>
        <PrimaryButton size="lg" onClick={() => navigate('/')}>
          Go to Home
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-28 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-white">My Orders</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          {MOCK_ORDERS.length} orders placed
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {(['all', 'delivered', 'preparing', 'placed', 'cancelled'] as StatusFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-all shrink-0
              ${filter === f
                ? 'bg-primary text-white border-primary shadow-brand'
                : 'bg-card text-text-secondary border-white/10 hover:border-primary/40 hover:text-white'
              }`}
          >
            {f === 'all' ? '📋 All' : `${STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.icon} ${STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.label}`}
            <span className="ml-1 opacity-60 text-xs">
              {f === 'all' ? MOCK_ORDERS.length : MOCK_ORDERS.filter(o => o.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-card rounded-2xl border border-white/10"
            >
              <div className="text-5xl mb-3">🔍</div>
              <p className="text-white font-bold mb-1">No {filter} orders</p>
              <p className="text-text-secondary text-sm">Try a different filter</p>
            </motion.div>
          ) : (
            filtered.map((order, i) => {
              const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
              const isOpen = expanded === order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card rounded-2xl border border-white/10 overflow-hidden
                    hover:border-primary/20 transition-colors"
                >
                  {/* Order summary row */}
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left"
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                  >
                    {/* Status icon */}
                    <div className="text-2xl shrink-0">{cfg?.icon ?? '📦'}</div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-bold text-sm font-mono">#{order.id}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg?.bg}`}>
                          {cfg?.label}
                        </span>
                        <span className="text-text-secondary text-xs">
                          {order.orderType === 'delivery' ? '🛵' : order.orderType === 'pickup' ? '🏃' : '🪑'}
                        </span>
                      </div>
                      <p className="text-text-secondary text-xs mt-1 truncate">
                        {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                      </p>
                      <p className="text-text-secondary text-xs mt-0.5">
                        {formatDate(order.date)}
                      </p>
                    </div>

                    {/* Total + chevron */}
                    <div className="text-right shrink-0">
                      <p className="text-white font-bold">{formatCurrency(order.total)}</p>
                      <p className="text-text-secondary text-xs mt-0.5">{order.items.length} items</p>
                    </div>
                    <span className="text-text-secondary ml-2 shrink-0">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/10"
                      >
                        <div className="p-5 space-y-4">
                          {/* Items breakdown */}
                          <div className="space-y-2">
                            {order.items.map((item, j) => (
                              <div key={j} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-text-secondary">{item.qty}×</span>
                                  <span className="text-white">{item.name}</span>
                                  {item.size && (
                                    <span className="text-text-secondary text-xs">({item.size})</span>
                                  )}
                                </div>
                                <span className="text-white font-semibold">{formatCurrency(item.price)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Price breakdown */}
                          <div className="border-t border-white/10 pt-3 space-y-1.5 text-sm">
                            {[
                              ['Subtotal', order.subtotal],
                              ['GST (5%)', order.gst],
                              ['Delivery',  order.deliveryFee],
                            ].map(([label, val]) => (
                              <div key={String(label)} className="flex justify-between text-text-secondary">
                                <span>{label}</span>
                                <span>{val === 0 ? 'Free' : formatCurrency(Number(val))}</span>
                              </div>
                            ))}
                            <div className="flex justify-between font-bold text-base border-t border-white/10 pt-1.5">
                              <span className="text-white">Total</span>
                              <span className="bg-bubble-gradient bg-clip-text text-transparent">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-1">
                            {order.status === 'delivered' && (
                              <button
                                onClick={() => navigate('/menu')}
                                className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-bold
                                  hover:bg-primary/90 transition-colors"
                              >
                                🔄 Reorder
                              </button>
                            )}
                            {['placed', 'preparing', 'out_for_delivery'].includes(order.status) && (
                              <button
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-bold
                                  hover:bg-primary/90 transition-colors"
                              >
                                📍 Track Order
                              </button>
                            )}
                            <button
                              onClick={() => navigate('/menu')}
                              className="flex-1 py-2.5 rounded-full border border-white/20 text-text-secondary
                                text-sm font-bold hover:border-white/40 hover:text-white transition-colors"
                            >
                              Browse Menu
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Empty overall state */}
      {MOCK_ORDERS.length === 0 && (
        <div className="text-center py-20">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6 select-none"
          >
            🧋
          </motion.div>
          <h2 className="font-display text-3xl font-bold text-white mb-2">No orders yet!</h2>
          <p className="text-text-secondary mb-8">Your first bubble tea is waiting for you.</p>
          <PrimaryButton size="lg" onClick={() => navigate('/menu')}>
            Order Now 🍵
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;