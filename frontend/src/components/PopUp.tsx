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

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, onSelectTopic }) => {
  if (!isOpen) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close popup"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') onClose();
      }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        borderRadius: 'inherit',
        cursor: 'default',
      }}
    >

      <div
        role="presentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
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
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
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
          }}
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

          <button
            type="button"
            onClick={() => onSelectTopic('math')}
            style={{
              width: 190,
              height: 160,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: '#ffffff',
              border: '2px solid #a78bfa',
              borderRadius: 14,
              fontFamily: '"Baloo Bhai 2", cursive',
              fontWeight: 600,
              fontSize: 28,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(167,139,250,0.08)';
              e.currentTarget.style.borderColor = '#7c3aed';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#a78bfa';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: 48, lineHeight: 1 }}>+ -</span>
            Math
          </button>

          <button
            type="button"
            onClick={() => onSelectTopic('programming')}
            style={{
              width: 190,
              height: 160,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              backgroundColor: '#ffffff',
              border: '2px solid #3b82f6',
              borderRadius: 14,
              fontFamily: '"Baloo Bhai 2", cursive',
              fontWeight: 600,
              fontSize: 28,
              color: '#0f172a',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.08)';
              e.currentTarget.style.borderColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: 48, lineHeight: 1, fontFamily: 'monospace' }}>&lt;/&gt;</span>
            Programming
          </button>

        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: '"Baloo Bhai 2", cursive',
            fontSize: 16,
            color: '#64748b',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default Popup;