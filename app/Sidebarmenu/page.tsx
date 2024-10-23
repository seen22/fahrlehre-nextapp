'use client'; // Direktive für die Verwendung von React-Hooks

import { useState } from 'react';
import { FiMenu, FiX,FiHome } from 'react-icons/fi'; // FiX für das Schließen-Symbol
import Link from 'next/link';
import SchuelerList from '../SchuelerList/page';

export default function Sidebarmenu() {
  const [isOpen, setIsOpen] = useState(false); // Startet geschlossen

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Umschalten zwischen geöffnet und geschlossen
  };

  return (
    <div className="relative">
      {/* Das Burger-Icon ist immer sichtbar */}
      <button onClick={toggleMenu} className="p-2 bg-gray-700 text-white rounded-md fixed top-2 left-2 z-50">
        {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
      </button>

      {/* Menü anzeigen, wenn isOpen true ist */}
      {isOpen && (
        <nav className="fixed top-12 left-0 w-64 h-full bg-gray-800 p-6 z-40"> {/* top-12 sorgt für mehr Platz nach oben */}
          <ul className="space-y-4">
          <li>
              <Link href="/" className="flex items-center text-lg font-medium hover:text-blue-400 transition" onClick={toggleMenu}>
                <FiHome className="mr-2" /> Startseite
              </Link>
            </li>
            {/*<li>
              <Link href="/uebungsfahrt" className="block text-lg font-medium hover:text-blue-400 transition" onClick={toggleMenu}>
              Übungsfahrt
              </Link>
            </li>
            <li>
              <Link href="/vorpruefung" className="block text-lg font-medium hover:text-blue-400 transition" onClick={toggleMenu}>
              Vorprüfung
              </Link>
            </li>
            <li>
              <Link href="/DashboardPage" className="block text-lg font-medium hover:text-blue-400 transition" onClick={toggleMenu}>
                Dashboard
              </Link>
            </li> */}
            {/* <SchuelerList></SchuelerList> */}
          </ul>
        </nav>
      )}
    </div>
  );
}
