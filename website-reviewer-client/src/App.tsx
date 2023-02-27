import { useState } from 'react';
import { captureSnapshot } from './Api';
// import { useAsync } from './CustomHooks';
import ErrorIndicator from './ErrorIndicator';
import LoadingIndicator from './LoadingIndicator';
import SnapshotMask from './SnapshotMask';

function App() {

  const [accessKey, setAccessKey] = useState('a02aeaf299f062eb982f088fad8d5397')
  const [websiteURL, setWebsiteURL] = useState('https://tailwindcss.com/docs/installation');
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  // const [imageWidth, setImageWidth] = useState(1440);
  const [imageURL, setImageURL] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

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

  // const handleImageWidthChange = (value: number) => {
  //   setImageWidth(value);
  // }

  const handleCaptureClick = async () => {
    setIsLoading(true);
    setHasError(false);

    const params = {
      accessKey,
      websiteURL,
      viewportWidth,
      viewportHeight
    }

    try {
      const imageURL = await captureSnapshot(params);  
      console.log(imageURL)
      setImageURL(imageURL);
    } catch(e) {
      console.error(e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
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
          {/* <label htmlFor='image-width'>Image width:</label>
          <input
            type='number'
            name='image-width' 
            id='image-width' 
            className='bg-gray-200 border border-gray-500 w-1/2 ml-3 max-w-[120px]' 
            onChange={ e => handleImageWidthChange(+e.currentTarget.value)}
          /> */}
        </div>
        <button 
          className='border border-gray-900 rounded-md p-1 px-3 shadow-md hover:bg-black hover:text-white transition-all'
          onClick={ handleCaptureClick }
        >
          Capture Snapshot
        </button>
        <p># Left ctrl + click anywhere to create a note.</p>
      </div>
      {
        imageURL === ""
        ?
        <p>Render a snapshot of your target website by pressing the "Capture Snapshot" button</p>
        :
        <div className='flex relative max-w-fit'>
          <img 
            src={imageURL}
            alt='screenshot of the entered website'
          />
          <SnapshotMask />
        </div>
      }
      { isLoading && <LoadingIndicator /> }
      { hasError && <ErrorIndicator /> }
      
    </div>
  );
}

export default App;
