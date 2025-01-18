// app/auth/layout.tsx
import React from 'react';
import { ReactNode } from 'react';
import '../globals.css'

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <html>
    <body className="flex min-h-screen justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Tech Doc</h1>
        </header>
        <main>{children}</main>
      </div>
    </body>
    </html>
  );
};

export default AuthLayout;
