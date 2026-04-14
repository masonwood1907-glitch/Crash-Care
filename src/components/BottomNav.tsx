import type { TabView } from '../types';

interface BottomNavProps {
  active: TabView;
  onChange: (tab: TabView) => void;
}

const TABS: { id: TabView; label: string; icon: string }[] = [
  {
    id: 'today',
    label: 'TODAY',
    icon: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>`,
  },
  {
    id: 'weeks',
    label: 'WEEKS',
    icon: `<path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>`,
  },
  {
    id: 'overview',
    label: 'OVERVIEW',
    icon: `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>`,
  },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: 'rgba(14,16,11,0.97)',
        borderTop: '1px solid #2a3025',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all duration-150 min-h-[56px]"
            style={{
              background: isActive ? 'rgba(74,92,56,0.15)' : 'transparent',
              borderTop: `2px solid ${isActive ? '#6b8c4a' : 'transparent'}`,
              color: isActive ? '#6b8c4a' : '#3a4035',
            }}
          >
            <svg
              width="22" height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
              dangerouslySetInnerHTML={{ __html: tab.icon }}
            />
            <span
              className="font-mono tracking-widest"
              style={{ fontSize: 8, letterSpacing: '0.15em' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
