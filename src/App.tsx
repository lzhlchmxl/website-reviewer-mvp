import { useState } from 'react';
import Iframe from 'react-iframe';

function App() {

  const [reviewLink, setReviewLink] = useState('https://www.google.com/');


  const handleInputChange = (value: string) => {
    setReviewLink(value);
  }


  return (
    <div className="h-full flex flex-col">
      <div className='p-5'>
        <label htmlFor='review-link'>Enter the URL:</label>
        <input
          placeholder='eg. https://www.google.com/'
          name='review-link' 
          id='review-link' 
          className='bg-gray-200 border border-gray-500 w-1/2 ml-3' 
          onChange={ e => handleInputChange(e.currentTarget.value) }
        />
        <p># Hold left-ctrl and click anywhere to create a note.</p>
      </div>

      <Iframe 
        url={reviewLink}
        id=""
        className="w-full grow"
        // display="block"
        // position="relative"
      />
    </div>
  );
}

export default App;
