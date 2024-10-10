'use client'; // Direktive für die Verwendung von React-Hooks
import { useState } from 'react';
import Link from 'next/link';
import StartSeite from './StartSeite/page';

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      {/* Anwendung Name */}
      <h1 className="text-4xl font-bold mb-8">FahrMemo</h1>

      <div className="mb-8">
        <Link href="/schuelerDaten">
          <button className="w-full mt-2 p-2 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
            Neu Schüler eintragen
          </button>
        </Link>
      </div>

      <StartSeite/>
    </div>
  );
}

