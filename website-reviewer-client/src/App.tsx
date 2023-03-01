import { useState } from 'react';
import { captureSnapshot, getReviews, saveReview } from './Api';
import Button from './Button';
import { useAsync } from './CustomHooks';
import ErrorIndicator from './ErrorIndicator';
import InputWithLabel from './InputWithLabel';
import LoadingIndicator from './LoadingIndicator';
import SelectWithLabel from './SelectWithLabel';
import SnapshotMask from './SnapshotMask';
import * as T from './types';

function App() {

  // snapshot parameters
  const [websiteUrl, setWebsiteUrl] = useState('https://tailwindcss.com/docs/installation');
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [imageUrl, setImageUrl] = useState('');

  // review parameters
  const [reviewName, setReviewName] = useState('');
  const [notes, setNotes] = useState<T.note[]>([]);
  

  const [currentReviewId, setCurrentReviewId] = useState<T.id >('default');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  

  const reviewHeadersAsync = useAsync(getReviews, []);

  if ( reviewHeadersAsync.status === "pending") {
    return <LoadingIndicator />
  }

  if (reviewHeadersAsync.status === "rejected") {
    return <ErrorIndicator />
  }

  const reviewHeaders = reviewHeadersAsync.value;
  const reviewSelections = reviewHeaders.map( reviewHeader => {
    return {value: reviewHeader.id, text: reviewHeader.name} 
  })

  const handleCaptureClick = async () => {
    setIsLoading(true);
    setHasError(false);

    const params = {
      websiteUrl,
      viewportWidth,
      viewportHeight
    }

    try {
      const imageURL = await captureSnapshot(params);  
      setImageUrl(imageURL);
    } catch(e) {
      console.error(e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTrySaveReview = async () => {
    setIsLoading(true);
    setHasError(false);

    // [TODO] validation

    const params = {
      name: reviewName,
      imageUrl,
      notes,
    }

    try {
      const newReviewId = await saveReview(params);  
    } catch(e) {
      console.error(e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleTryGetReviewDetails = async (id: T.id) => {

    setIsLoading(true);
    setHasError(false);

    // [TODO] validation

    const params = {
      name: reviewName,
      imageUrl,
      notes,
    }

    try {
      const newReviewId = await saveReview(params);  
    } catch(e) {
      console.error(e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }

    setCurrentReviewId(id);
  }

  return (
    <div className="h-full flex flex-col">
      <div className='flex'>
        <div className='p-5 max-w-[45%]'>
          <div className='flex flex-col pb-3'>
            <label htmlFor='website-url'>Enter the URL:</label>
            <input
              placeholder='eg. https://www.google.com/'
              name='website-url' 
              id='website-url' 
              className='bg-white border border-gray-500' 
              onChange={ e => setWebsiteUrl(e.currentTarget.value) }
            />
          </div>
          <div className='flex justify-between X'>
            <div className='flex flex-col max-w-[45%]'>
              <label htmlFor='viewport-width'>Viewport width:</label>
              <input
                type='number'
                name='viewport-width' 
                id='viewport-width' 
                className='bg-white border border-gray-500' 
                onChange={ e => setViewportWidth(+e.currentTarget.value)}
              />
            </div>
            <div className='flex flex-col max-w-[45%]'>
              <label htmlFor='viewport-width'>Viewport height:</label>
              <input
                type='number'
                name='viewport-height' 
                id='viewport-height' 
                className='bg-white border border-gray-500' 
                onChange={ e => setViewportHeight(+e.currentTarget.value)}
              />
            </div>
          </div>
          <Button 
            actionType='primary'
            actionText='Capture Snapshot'
            actionHandler={ handleCaptureClick }
          />
          <p># Left ctrl + click anywhere to create a note.</p>
        </div>
        <div className='p-5 max-w-[45%]'>
          <SelectWithLabel 
            label='Select a Review File'
            name='review-select'
            selected={currentReviewId}
            selections={reviewSelections}
            setSelected={ handleTryGetReviewDetails }
          />
          <InputWithLabel 
            label='Review Name'
            name='review-name'
            placeholder='eg. new project'
            value={reviewName}
            setValue={ setReviewName }
          />
          <Button 
            actionType='primary'
            actionText='Save Review'
            actionHandler={ handleTrySaveReview }
          />
        </div>
      </div>
      {
        imageUrl === ""
        ?
        <p>Render a snapshot of your target website by pressing the "Capture Snapshot" button</p>
        :
        <div className='flex relative max-w-fit'>
          <img 
            src={imageUrl}
            alt='screenshot of the entered website'
          />
          <SnapshotMask 
            notes={notes}
            setNotes={setNotes}
          />
        </div>
      }
      { isLoading && <LoadingIndicator /> }
      { hasError && <ErrorIndicator /> }
      
    </div>
  );
}

export default App;
