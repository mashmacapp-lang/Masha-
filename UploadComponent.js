import React, { useState } from 'react';
import axios from 'axios';
const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const onSubmit = async (event) => { event.preventDefault(); if (!file) return; const formData = new FormData(); formData.append('file', file); try { const response = await axios.post('http://localhost:5000/upload', formData); console.log(response.data.fileUrl); alert('File uploaded successfully!'); } catch (error) { console.error('Error uploading file:', error); alert('File upload failed.'); } };
  return <form onSubmit={onSubmit}><input type="file" onChange={e=>setFile(e.target.files[0])} required /><button type="submit">Upload</button></form>;
};
export default UploadComponent;
