'use client';

import { useIvaStore } from '@/lib/iva/store';
import { Theme } from '@/lib/iva/types';

const themes: { value: Theme; label: string }[] = [
  { value: 'gold', label: 'Gold' },
  { value: 'ocean', label: 'Ocean' },
  { value: 'forest', label: 'Forest' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useIvaStore();

  return (
    <select
      className="control-select theme-select"
      value={theme}
      onChange={(e) => setTheme(e.target.value as Theme)}
    >
      {themes.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  );
}
