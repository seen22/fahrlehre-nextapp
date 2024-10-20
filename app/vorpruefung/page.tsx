'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BackButton from '../BackButton/page';
import { DataFactory, Writer } from 'n3';

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
   

    try {
      const { namedNode, literal } = DataFactory;
      const writer = new Writer();
      const studentURI = `https://github.com/seen22/fahrlehre-nextapp/formEntry-${studentId}`;
      const lessonURI = `https://github.com/seen22/fahrlehre-nextapp/lesson-${studentId}`;

      Object.entries(dropdownList).forEach(([key, value]) => {
        const predicate = namedNode(`fahrl:${key}`);
        const object = literal(value as string);
        writer.addQuad(namedNode(lessonURI), predicate, object);
      });
      writer.addQuad(
        namedNode(studentURI),
        namedNode('fahrl:hasDrivingLesson'),
        namedNode(lessonURI)
      );

      writer.end(async (error, result) => {
        if (error) {
          console.error('Error while serializing RDF:', error);

          return;
        }
      const updateQuery = `
        PREFIX fahrl: <https://github.com/seen22/fahrlehre-nextapp/vocabulary.rdf#>
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        INSERT DATA {
          ${result}
        }
      `;

      const response = await fetch('http://localhost:3030/FahrlehrerApp/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sparql-update',
        },
        body: updateQuery,
      });
      
      if (response.ok) {
        console.log('Dropdown data saved successfully');
        window.location.href = `/DashboardPage?id=${studentId}`;
      } else {
        console.error('Failed to save dropdown data:', result);
      }
    });
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
              <option value="">werten</option>
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="X">X</option>
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
