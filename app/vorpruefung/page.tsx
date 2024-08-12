'use client';
import React, { useState } from 'react';

const FormWithDropdowns = () => {
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

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <form className="space-y-4">
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
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
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
      </form>
    </div>
  );
};

export default FormWithDropdowns;
