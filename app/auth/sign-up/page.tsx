import Link from 'next/link';
import React from 'react';

const SighnUp = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
      <form>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm">
          Already have an account?{' '}
          <Link className="text-blue-500" href="/auth/sign-in">Sign In</Link>
            
       
        </p>
      </div>
    </>
  );
};

export default SighnUp;
