'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BackButton from '../BackButton/page';

const FormWithDropdowns = () => {
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
      console.log('Extracted ID from URL:', id);
    } else {
      console.error('No ID found in URL');
    }
  }, []);

  const onSubmit = async (dropdownList: any) => {
    if (!studentId) {
      console.error('No student ID found.');
      return;
    }
    console.log('3 Dropdown data saved successfully');

    try {
      // RDF Triples für die Dropdown-Auswahl erstellen
      const triples = Object.entries(dropdownList).map(([key, value]) => {
        const predicate =`fahrl:${key}`;
        const object = `"${value}"^^xsd:string`; 
        return `<https://github.com/seen22/fahrlehre-nextapp/formEntry-${studentId}> <${predicate}> ${object} .`;
      }).join('\n');

      const updateQuery = `
        PREFIX fahrl: <https://github.com/seen22/fahrlehre-nextapp/vocabulary.rdf#>
          PREFIX schema: <http://schema.org/>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX owl: <http://www.w3.org/2002/07/owl#>
        INSERT DATA {
          ${triples}
        }
      `;
      console.log('2 Dropdown data saved successfully');
      // Anfrage an Fuseki senden
      const response = await fetch('http://localhost:3030/FahrlehrerApp/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sparql-update',
        },
        body: updateQuery,
      });
      console.log('1 Dropdown data saved successfully');
      
      const result = await response.text();
      if (response.ok) {
        console.log('Dropdown data saved successfully');
        window.location.href = `/DashboardPage?id=${studentId}`;
      } else {
        console.error('Failed to save dropdown data:', result);
      }
    } catch (error) {
      console.error('Error saving dropdown data:', error);
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
      <BackButton></BackButton>
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
              {...register(name)}
              className="ml-4 p-2 bg-gray-300 text-black rounded-md"
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="+">+</option>
              <option value="++">-</option>
              <option value="-">X</option>
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

export default FormWithDropdowns;
