import React from "react";

const LogoutButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className=" hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
