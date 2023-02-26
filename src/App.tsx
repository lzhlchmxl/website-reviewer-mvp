import { useEffect, useState } from 'react';
import IframePlayer from './IframePlayer';

function App() {

  const [reviewLink, setReviewLink] = useState('https://tailwindcss.com/docs/installation');


  const handleInputChange = (value: string) => {
    setReviewLink(value);
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage)
    };
  })

  const handleMessage = (e: MessageEvent<{ type: string, message: string}>) => {
    if (e.data.type === 'elementClick') {
      
      console.log(`Clicked element: ${e.data.message}`);
    }
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
      <IframePlayer reviewLink={reviewLink} />
    </div>
  );
}

export default App;
