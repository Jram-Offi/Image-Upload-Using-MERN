// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ImageUpload = () => {
//   const [file, setFile] = useState(null); // For storing selected file
//   const [images, setImages] = useState([]); // For displaying uploaded images

//   // Handle file selection
//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//     }
//   };

//   // Handle file upload to the server
//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file before uploading.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:5000/api/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       alert('File uploaded successfully!');
//       console.log('Upload response:', response.data);

//       // Fetch images after successful upload
//       fetchImages();
//       setFile(null); // Clear the selected file
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       alert('Failed to upload the file.');
//     }
//   };

//   // Fetch images from the backend
//   const fetchImages = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/images');
//       setImages(response.data);
//     } catch (error) {
//       console.error('Error fetching images:', error);
//     }
//   };

//   // Fetch images on component mount
//   useEffect(() => {
//     fetchImages();
//   }, []);

//   return (
//     <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
//       <h1>Image Upload and Display</h1>
//       <div style={{ marginBottom: '20px' }}>
//         <input type="file" onChange={handleFileChange} />
//         <button onClick={handleUpload} style={{ marginLeft: '10px' }}>
//           Upload
//         </button>
//       </div>

//       <div>
//         <h2>Uploaded Images:</h2>
//         {images.length === 0 ? (
//           <p>No images uploaded yet.</p>
//         ) : (
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
//             {images.map((image) => {
//           if (
//             !image?.image?.data ||
//             !image?.image?.contentType ||
//             !Array.isArray(image.image.data.data)
//           ) {
//             console.error('Invalid image data:', image);
//             return null;
//           }

//           const base64String = btoa(
//             String.fromCharCode(...new Uint8Array(image.image.data.data))
//           );

//           return (
//             <img
//               key={image._id}
//               src={`data:${image.image.contentType};base64,${base64String}`}
//               alt={image.name || 'Uploaded Image'}
//               style={{ width: '200px', margin: '10px', borderRadius: '10px' }}
//             />
//           );
//         })}
//         </div>
//          )}
// //       </div>
//     </div>
//   );
// };

// export default ImageUpload;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      convertToPng(selectedFile);
    }
  };


  // Convert image to PNG using the Canvas API
  const convertToPng = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Convert the canvas content to a PNG file
        canvas.toBlob(
          (blob) => {
            const pngFile = new File([blob], `${file.name.split('.')[0]}.png`, {
              type: 'image/png',
            });
            setFile(pngFile); // Store the PNG file
          },
          'image/png',
          1.0 // Quality (1.0 = highest)
        );
      };

      img.onerror = () => {
        console.error('Error loading the image');
      };
    };

    reader.onerror = () => {
      console.error('Error reading the file');
    };
  };

  // Handle file upload to the server
  const handleUpload = async () => {
    if (!file) {
      alert('No file selected or conversion failed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      fetchImages(); // Refresh the image list
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Fetch images from the backend
  const fetchImages = async () => {
    try {
      // setImages([]);
      const response = await axios.get('http://localhost:5000/api/images');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(()=>{
    fetchImages();
  },[])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Image Upload and Convert to PNG</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div style={{ marginTop: '20px' }}>
        <h2>Uploaded Images:</h2>
        {images.length === 0 ? (
          <p>No images uploaded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {images.map((image) => {
          if (
            !image?.image?.data ||
            !image?.image?.contentType ||
            !Array.isArray(image.image.data.data)
          ) {
            console.error('Invalid image data:', image);
            return null;
          }

          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(image.image.data.data))
          );

          return (
            <img
              key={image._id}
              src={`data:${image.image.contentType};base64,${base64String}`}
              alt={image.name || 'Uploaded Image'}
              style={{ width: '200px', margin: '10px', borderRadius: '10px' }}
            />
          );
        })}
        </div>
         )}
      </div>
    </div>
  );
};

export default ImageUpload;
