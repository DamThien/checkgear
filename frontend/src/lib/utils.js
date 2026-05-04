export const formatVND = (n) => Number(n || 0).toLocaleString('vi-VN') + ' ₫';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
};
