import React from 'react';
import { type PopupProps, TOPICS } from '../Models/PopUpModel';
import { useSelectTopic } from '../ViewModels/PopUpViewModel';
import WebSocketService from '../services/websocket.service';



const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  console.log("setting selectTopic");
  const selectTopic = useSelectTopic();

  console.log("setting Socket");
  const socket = WebSocketService();

  return (
    <div
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      role="button"
      tabIndex={-1}
      aria-label='outer-div'

      className='absolute rounded-3xl flex z-50 top-[20%] left-[30%] w-[100%] h-[100%] '
    >
      <dialog
        open
        aria-label="Choose a topic"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key == 'Escape') onClose();
        }}
      >
        <button
          type="button"
          onClick={onClose}
        >
          X
        </button>

        <div >
          <h2>
            Choose a Topic
          </h2>
          <p>
            What would you like to be challenged on?
          </p>
        </div>

        <div>
          {TOPICS.map((t) => (
            <button
              key={t.topic}
              type="button"
              aria-label={`topic-${t.topic}`}
              onClick={() => selectTopic(t.topic, socket.socket)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label='cancel-button'
        >
          Cancel
        </button>
      </dialog>
    </div>
  );
};

export default Popup;