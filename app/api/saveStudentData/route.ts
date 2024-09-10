import { NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/userData.json');

export async function POST(req: Request) {
  try {
    // Read the existing data from the JSON file
    const fileData = await fsPromises.readFile(dataFilePath);
    const jsonData = fileData.toString();
    const objectData = JSON.parse(jsonData);

    // Get the new data from the request body
    const newData = await req.json();
    const studentId = await newData.id; 
    
    // console.log('Received ID:', studentId);  // Log the received ID
    // console.log('Existing IDs:', objectData.map((student: { id: any; }) => student.id));  
  
     if (studentId) {
      // Check if the student already exists
      const existingStudentIndex = objectData.findIndex((student: { id: any; }) => student.id == studentId);

    if (existingStudentIndex !== -1) {
      console.log('Updating student with ID:', studentId);  // Log if a match is found
      objectData[existingStudentIndex] = { ...objectData[existingStudentIndex], ...newData };
    }
   } else {
      // Assign a new unique ID if the student is new
        const newId = objectData.length > 0 ? Math.max(...objectData.map((student: { id: any; }) => student.id)) + 1 : 1;
        newData.id = newId;
        objectData.push(newData);
    }

    // Write the updated data back to the JSON file
    const updatedData = JSON.stringify(objectData, null, 2);
    await fsPromises.writeFile(dataFilePath, updatedData);

    // Send a success response
    return NextResponse.json({ message: 'Data stored successfully', id: newData.id }, { status: 200 });
  } catch (error) {
    console.error('Error storing data:', error);
    return NextResponse.json({ message: 'Error storing data' }, { status: 500 });
  }
}
