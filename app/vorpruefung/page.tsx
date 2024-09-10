'use client';
import React, { useEffect,useState } from 'react';
import {useForm} from 'react-hook-form';

const vorpruefung = () => {
  const { register, handleSubmit } = useForm();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    stop: '',
    rightTurn: '',
    multiLaneRightTurn: '',
    railwayCrossing: '',
    leftTurn: '',
    multiLaneLeftTurn: '',
    gearSelection: '',
    bikeLane: '',
    bikeOvertake: '',
    entrance: '',
    speedAdjustment: '',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      setStudentId(id);
      console.log('Extracted ID from URL:', id);  // Log to verify
    } else {
      console.error('No ID found in URL');
    }
  }, []);

  const onSubmit = async (dropdownList: any) => {

    if (!studentId) {
      console.error('No student ID found.');
      return;
    }

    try {
      // Include the student ID in the data to be submitted
      const dataToSubmit = { ...dropdownList, id: studentId };

      // Send data to the API
      const response = await fetch('/api/saveStudentData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });
      const result = await response.json();

      if (response.ok && result.message === 'Data stored successfully') {
        console.log('Checkbox data saved successfully');
        window.location.href = `/DachboardPage?id=${result.id}`;
      } else {
        console.error('Failed to save checkbox data');
      }
    } catch (error) {
      console.error('Error saving checkbox data:', error);
    }
  };


  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {[
          { label: 'Stop', name: 'stop' },
          { label: 'Rechtsabbiegen', name: 'rightTurn' },
          { label: 'Rechtsabbiegen mehrspurig', name: 'multiLaneRightTurn' },
          { label: 'Bahnübergang', name: 'railwayCrossing' },
          { label: 'Linksabbiegen', name: 'leftTurn' },
          { label: 'Linksabbiegen mehrspurig', name: 'multiLaneLeftTurn' },
          { label: 'Gang wählen', name: 'gearSelection' },
          { label: 'Fahrradschutzstreifen', name: 'bikeLane' },
          { label: 'Fahrrad überholen', name: 'bikeOvertake' },
          { label: 'Eingangsortschaft', name: 'entrance' },
          { label: 'Geschwindigkeitsanpassung', name: 'speedAdjustment' },
        ].map(({ label, name }) => (
          <div key={name} className="flex items-center justify-between">
            <label className="text-sm font-medium">{label}</label>
            <select
              {...register(name)} // Integrating react-hook-form's register function
            className="ml-4 p-2 bg-gray-300 text-black rounded-md"
            >
              <option value="">Select</option>
              <option value="+">+</option>
              <option value="++">++</option>
              <option value="-">-</option>
              <option value="--">--</option>
            </select>
          </div>
          
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
          Speichern
        </button>
      </form>
    </div>
  );
};

export default vorpruefung;
