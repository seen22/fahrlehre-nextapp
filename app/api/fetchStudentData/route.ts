import { NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'json/userData.json');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firstName = searchParams.get('firstName');

  if (!firstName) {
    return NextResponse.json({ message: 'First name not provided' }, { status: 400 });
  }

  try {
    const fileData = await fsPromises.readFile(dataFilePath, 'utf8');
    const objectData = JSON.parse(fileData);

    const foundUser = objectData.find((user: any) => user.firstName.toLowerCase() === firstName.toLowerCase());

    if (foundUser) {
      return NextResponse.json(foundUser, { status: 200 });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
  }
}
