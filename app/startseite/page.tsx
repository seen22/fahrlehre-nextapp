'use client'; // Direktive für die Verwendung von React-Hooks
import { useState } from 'react';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import SchuelerList from '../SchuelerList/page';

export default function startseite() {

return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-gray-900 text-white mt-8">
      {/* Anwendung Name */}
      <h1 className="text-4xl font-bold mb-8">FahrMemo</h1>
      <div className="mb-8">

        <Link href="/schuelerDaten">
          <button className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition"
          aria-label="Neu Schüler eintragen">
            <FiPlus size={32} /> 
          </button>
        </Link>
      </div>

      <SchuelerList/>
    </div>
  );
}