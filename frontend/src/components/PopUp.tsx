/* The popup can be used for the following: 
    Topic selection popup for Ranked Play.

This is how it would be called and rendered in its necessary files:
    import PopUp from '../components/PopUp'
        <PopUp
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSelectTopic={(topic) => { setShowPopup(false); onRankedPlay?.(topic); }}
    />
*/

import React from 'react';

type Topic = 'math' | 'programming';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: Topic) => void;
}

interface TopicConfig {
  topic: Topic;
  label: string;
  icon: React.ReactNode;
  borderColor: string;
  hoverBg: string;
  hoverBorder: string;
}

const TOPICS: TopicConfig[] = [
  {
    topic: 'math',
    label: 'Math',
    icon: <span style={{ fontSize: 48, lineHeight: 1 }}>+ -</span>,
    borderColor: '#a78bfa',
    hoverBg: 'rgba(167,139,250,0.08)',
    hoverBorder: '#5f5980',
  },
  {
    topic: 'programming',
    label: 'Programming',
    icon: <span style={{ fontSize: 48, lineHeight: 1, fontFamily: 'monospace' }}>&lt;/&gt;</span>,
    borderColor: '#0e34a0',
    hoverBg: 'rgba(59,130,246,0.08)',
    hoverBorder: '#1d4ed8',
  },
];

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  borderRadius: 'inherit',
  cursor: 'default',
};

const dialogStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#ffffff',
  border: '1px solid #0f172a',
  borderRadius: 20,
  width: 560,
  padding: '48px 40px 36px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 28,
  boxShadow: '0 20px 60px rgba(15, 23, 42, 0.18)',
};

const closeBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: 16,
  right: 20,
  background: 'none',
  border: 'none',
  fontSize: 22,
  color: '#64748b',
  cursor: 'pointer',
  lineHeight: 1,
  padding: 4,
};

const topicBtnBaseStyle: React.CSSProperties = {
  width: 190,
  height: 160,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  backgroundColor: '#ffffff',
  borderRadius: 14,
  fontFamily: '"Baloo Bhai 2", cursive',
  fontWeight: 600,
  fontSize: 28,
  color: '#0f172a',
  cursor: 'pointer',
  transition: 'all 0.18s ease',
};

const cancelBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontFamily: '"Baloo Bhai 2", cursive',
  fontSize: 16,
  color: '#64748b',
  textDecoration: 'underline',
  cursor: 'pointer',
  padding: 0,
};

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, onSelectTopic }) => {
  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={overlayStyle}>
      <dialog
        open
        aria-label="Choose a topic"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key == 'Escape') onClose();
        }}
        style={dialogStyle}
      >
        <button
          type="button"
          onClick={onClose}
          style={closeBtnStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          X
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: '"Baloo Bhai 2", cursive',
            fontWeight: 700,
            fontSize: 40,
            color: '#0f172a',
            margin: '0 0 6px',
            lineHeight: 1.1,
          }}>
            Choose a Topic
          </h2>
          <p style={{
            fontFamily: '"Baloo Bhai 2", cursive',
            fontSize: 20,
            color: '#64748b',
            margin: 0,
          }}>
            What would you like to be challenged on?
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {TOPICS.map((t) => (
            <button
              key={t.topic}
              type="button"
              onClick={() => onSelectTopic(t.topic)}
              style={{ ...topicBtnBaseStyle, border: `2px solid ${t.borderColor}` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = t.hoverBg;
                e.currentTarget.style.borderColor = t.hoverBorder;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = t.borderColor;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={cancelBtnStyle}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          Cancel
        </button>
      </dialog>
    </div>
  );
};

export default Popup;