import React from 'react';
import ImageUpload from './components/ImageUpload';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter>
        <Routes>
          <Route path='/' element={<ImageUpload/>}></Route>
        </Routes>
      </BrowserRouter> */}
      <ImageUpload />
    </div>
  );
}

export default App;
