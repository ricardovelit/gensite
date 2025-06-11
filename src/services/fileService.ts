import axios from 'axios';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface FileContent {
  name: string;
  content: string;
  language: string;
}

export const createFile = async (file: FileContent) => {
  try {
    const response = await axios.post('http://localhost:8000/api/files', file);
    return response.data;
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
};

export const getFileContent = async (filename: string) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/files/${filename}`);
    return response.data;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

export async function downloadProject(files: { [filename: string]: { content: string } }) {
  const zip = new JSZip();
  Object.entries(files).forEach(([name, file]) => {
    zip.file(name, file.content);
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'gensite-project.zip');
} 