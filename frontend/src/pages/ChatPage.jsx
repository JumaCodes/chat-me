import React from 'react'
import { useAuthStore } from '../zustand/store/useAuthStore';

const ChatPage = () => {
  const { logout } = useAuthStore();
  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-6">ChatPage</h1>

        <button onClick={logout} className="btn btn-primary">Logout</button>
      </div>
    </div>
  );
}

export default ChatPage