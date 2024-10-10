'use client';
import { useRouter } from 'next/navigation';
import { FiArrowLeft } from 'react-icons/fi';

export default function BackButton() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back(); // Gehe zur vorherigen Seite zurück
  };

  return (
    <div className="absolute top-4 left-4">
      <button
        onClick={handleBackClick}
        className="flex items-center p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition"
        aria-label="Zurück"
      >
        <FiArrowLeft size={24} /> {/* Das Pfeil-Icon */}
      </button>
    </div>
  );
}
