import SearchComponent from '@/components/genral/Search';
import React from 'react';

const Home = () => {
  return (
    <div className="pt-10 gap-4 flex flex-col justify-start items-center min-h-screen bg-gray-100">
      <h1 className="text-5xl font-extrabold">
        Welcome to{' '}
        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Tech Doc
        </span>
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        Explore our collection of documentation.
      </p>

<hr />

        <div className='w-full'>
          <h2 className='flex text-2xl flex-col justify-center items-center w-full text-gray-700'>search your document</h2>
          <SearchComponent />
        </div>
    </div>
  );
};

export default Home;
