'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Student = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function SchuelerList() {
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const router = useRouter();

  // Fetch student names from the Fuseki server
  const fetchStudentNames = async () => {
    const studentQuery = `
    PREFIX fahrl: <https://github.com/seen22/fahrlehre-nextapp/vocabulary.rdf#>

SELECT ?subject ?firstName ?lastName
WHERE {
    ?subject <fahrl:hasFirstName> ?firstName .
    ?subject <fahrl:hasLastName> ?lastName .
}
 `;

    try {
      const response = await fetch('http://localhost:3030/FahrlehrerApp/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/sparql-results+json',
        },
        body: `query=${encodeURIComponent(studentQuery)}`,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch student names: ${response.statusText}`);
      }else {
        console.log(studentList);
      }

      const rdfData = await response.json();
      const students = rdfData.results.bindings.map((binding: any) => ({
        id: binding.subject.value,
        firstName: binding.firstName.value,
        lastName: binding.lastName.value,
      }));
      setStudentList(students);
      setFilteredStudents(students); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching student names:', error);
    }
  };

  useEffect(() => {
    fetchStudentNames();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const fullStudentId = event.target.value;
    
    // Extract the unique part of the student ID (everything after the last '/')
    const studentId = fullStudentId ? fullStudentId.split('formEntry-')[1] : '';
    
    setSelectedStudent(studentId);
  
    // Update the URL with the extracted student's ID
    if (studentId) {
      router.push(`/DashboardPage?id=${studentId}`);
    }
  };

  // Handle the search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    // Filter the student list based on the search term
    const filteredList = studentList.filter((student) =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm)
    );
    setFilteredStudents(filteredList);
  };

  return (

      <div className="mt-6">
        <input
          type="text"
          placeholder="Suchen..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full mt-2 p-2 bg-gray-700 text-white rounded-md"
        />
        <select
          onChange={handleSelectChange}
          value={selectedStudent}
          className="w-full mt-2 p-2 bg-gray-700 text-white rounded-md"
        >
          <option value="">Schüler Liste</option>
          {filteredStudents.map((student) => (
            <option key={student.id} value={student.id}>
              {student.firstName} {student.lastName}
            </option>
          ))}
        </select>
      </div>
  );
}
