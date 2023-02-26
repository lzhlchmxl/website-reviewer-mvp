import { useEffect, useState } from 'react';

function App() {

  const [accessKey, setAccessKey] = useState('77aa642b578d63b8c6216ecc37937949')
  const [websiteURL, setWebsiteURL] = useState('https://tailwindcss.com/docs/installation');
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [imageURL, setImageURL] = useState('');

  const handleURLChange = (value: string) => {
    setWebsiteURL(value);
  }

  const handleKeyChange = (value: string) => {
    setAccessKey(value);
  }

  const handleViewportWidthChange = (value: number) => {
    setViewportWidth(value);
  }

  const handleViewportHeightChange = (value: number) => {
    setViewportHeight(value);
  }

  const handleCaptureClick = () => {
    // 
  }

  return (
    <div className="h-full flex flex-col">
      <div className='p-5'>
        <div className='pb-5'>
          <label htmlFor='website-url'>Enter the URL:</label>
          <input
            placeholder='eg. https://www.google.com/'
            name='website-url' 
            id='website-url' 
            className='bg-gray-200 border border-gray-500 w-1/2 ml-3' 
            onChange={ e => handleURLChange(e.currentTarget.value) }
          />
        </div>
        <div className='pb-5'>
          <label htmlFor='access-key'>Enter access key:</label>
          <input
            name='access-key' 
            id='access-key' 
            className='bg-gray-200 border border-gray-500 w-1/2 ml-3' 
            onChange={ e => handleKeyChange(e.currentTarget.value) }
          />
        </div>
        <div className='flex pb-5'>
          <label htmlFor='viewport-width'>Viewport width:</label>
          <input
            type='number'
            name='viewport-width' 
            id='viewport-width' 
            className='bg-gray-200 border border-gray-500 w-1/2 ml-3 max-w-[120px] mr-5' 
            onChange={ e => handleViewportWidthChange(+e.currentTarget.value)}
          />
          <label htmlFor='viewport-width'>Viewport height:</label>
          <input
            type='number'
            name='viewport-height' 
            id='viewport-height' 
            className='bg-gray-200 border border-gray-500 w-1/2 ml-3 max-w-[120px]' 
            onChange={ e => handleViewportHeightChange(+e.currentTarget.value)}
          />
        </div>
        <button 
          className='border border-gray-900 rounded-md p-1 px-3 shadow-md hover:bg-black hover:text-white transition-all'
          onClick={ handleCaptureClick }
        >
          Capture Snapshot
        </button>
        <p># Hold left-ctrl and click anywhere to create a note.</p>
      </div>
      {
        imageURL !== ""
        &&
        <img 
          src={imageURL}
          alt='screenshot of the entered website'
        />
      }
      
    </div>
  );
}

export default App;
