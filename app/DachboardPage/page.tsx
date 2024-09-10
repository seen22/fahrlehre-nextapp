'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);

  const navigateTo = (path: string) => {
    router.push(`${path}?id=${studentId}`);
  };


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setStudentId(id);
      console.log('Extracted ID from URL:', id);  
    } else {
      console.error('No ID found in URL');
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-10">Fahrlehrer App</h1>
      
      <div className="space-y-6 w-full max-w-xs">
        {/* <button
          onClick={() => navigateTo('/hallo')}
          className="w-full bg-gray-800 text-white p-4 rounded-md hover:bg-gray-700 transition"
        >
          Go to Hallo Page
        </button> */}

        <button
          onClick={() => navigateTo('/uebungsfahrt')}
          className="w-full bg-gray-800 text-white p-4 rounded-md hover:bg-gray-700 transition"
        >
          Go to Users Page
        </button>

        <button
          onClick={() => navigateTo('/vorpruefung')}
          className="w-full bg-gray-800 text-white p-4 rounded-md hover:bg-gray-700 transition"
        >
          Go to Add to Card
        </button>
      </div>
    </div>
  );
}
