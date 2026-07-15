import { useNavigate } from 'react-router-dom';
  import {
    matchFoundContent,
    mockMatchFoundDetails,
    mockMatchFoundPlayers,
  } from '../Models/MatchFoundModel';

  export function MatchFoundViewModelFunction() {
    const navigate = useNavigate();

    const handleDecline = () => {
      navigate('/dashboard');
    };

    const handleAccept = () => {
      // TODO: wire this to the websocket-confirmed match start flow.
    };

    return {
      content: matchFoundContent,
      players: mockMatchFoundPlayers,
      details: mockMatchFoundDetails,
      handleDecline,
      handleAccept,
    };
  }