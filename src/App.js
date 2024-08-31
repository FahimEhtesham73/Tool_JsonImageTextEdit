import React, { useState } from 'react';
import './App.css';

function App() {

  const [images, setImages] = useState([]);
  const [editableIndex, setEditableIndex] = useState(null);

  const [editedText, setEditedText] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file.type==='application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {

          const parsedImages = JSON.parse(e.target.result);


         
          const initializedImages = parsedImages.map((image) => ({
            name: image.name,
            text: image.text,
            history: [image.text],
          }));
          setImages(initializedImages);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };

      reader.readAsText(file);
    }
  };

  console.log(images);

  const handleEditClick = (index) => {

    setEditableIndex(index);
    setEditedText(images[index].text);

  };

  const handleSaveEdit = (index) => {

    const updatedImages = [...images];
    updatedImages[index].history = [...updatedImages[index].history,editedText];

    updatedImages[index].text = editedText;


    setImages(updatedImages);
    setEditableIndex(null);
  };

  const handleCancelEdit = () => {

    setEditableIndex(null);
  };

  const handleExport = () => {

    const jsonString = JSON.stringify(images, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'updated_images.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  console.log("downloaded",handleExport)

  return (
    <>
      <div className="App">
        <h1>IMAGE CORRECTION TOOL</h1>
      <label htmlFor="fileInput" className="file-label import-button">
        IMPORT
      </label>
      
      <input type="file" accept=".json" onChange={handleFileUpload} id="fileInput" className="file-input" />
     
        {images && images.map((image, index) => (
            
            <div className='box' key={index}>
              <img src={require(`${image.name}`)} alt={`Fahim ${index + 1}`} />
              <br />
              {editableIndex === index ? (
                <>
                  <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                  
                  <button onClick={() => handleSaveEdit(index)}>Save</button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <span>{image.text}</span>
                  <button onClick={() => handleEditClick(index)}>Edit</button>
                </>
              )}
              <div>
                <strong>Text History:</strong>
                <ul>
                  {image.history.map((item, historyIndex) => (
                    <li key={historyIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          
        <button onClick={handleExport}>EXPORT</button>
      </div>
    </>
  );
}

export default App;