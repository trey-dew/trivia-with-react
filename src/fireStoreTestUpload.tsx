import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase'; // adjust the path if your firebase.ts is somewhere else
import { useState } from 'react';

function TestUpload() {
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestUpload = async () => {
    setUploading(true);
    setSuccess(false);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, "testUploads"), {
        testField: "Hello Firestore!",
        createdAt: new Date(),
      });

      console.log("Document written with ID: ", docRef.id);
      setSuccess(true);
    } catch (err: any) {
      console.error("Error adding document: ", err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={handleTestUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Test Document'}
      </button>
      {success && <p style={{ color: 'green' }}>✅ Upload successful!</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
    </div>
  );
}

export default TestUpload;
