import { useState } from 'react';
import { captureSnapshot, createReview, getReviews } from './Api';
import Button from './Button';
import { useAsync } from './CustomHooks';
import ErrorIndicator from './ErrorIndicator';
import InputWithLabel from './InputWithLabel';
import LoadingIndicator from './LoadingIndicator';
import SelectWithLabel from './SelectWithLabel';
import SnapshotMask from './SnapshotMask';
import * as T from './types';
import Modal from 'react-modal';

function App() {

  // snapshot parameters
  const [websiteUrl, setWebsiteUrl] = useState('https://www.google.com/');
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [imageUrl, setImageUrl] = useState('');

  // review parameters
  const [reviewName, setReviewName] = useState('');
  const [notes, setNotes] = useState<T.note[]>([]);
  

  const [currentReviewId, setCurrentReviewId] = useState<T.id >('default');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // modal control
  const [modalIsOpen, setIsOpen] = useState(false);
  

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

  const handleNewReviewClick = () => {
    setIsOpen(true);
  }

  const handleTryCreateReview = async () => {
    setIsLoading(true);
    setHasError(false);

    const snapShotParams = {
      websiteUrl,
      viewportWidth,
      viewportHeight
    }

    try {
      const imageURL = await captureSnapshot(snapShotParams);  
      setImageUrl(imageURL);
      const newReviewParams = {
        name: reviewName,
        imageUrl,
        notes,
      }
      const newReviewId = await createReview(newReviewParams);  
      setCurrentReviewId(newReviewId);

    } catch(e) {
      console.error(e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  // const handleTrySaveReview = async () => {
  //   setIsLoading(true);
  //   setHasError(false);

  //   // [TODO] validation

  //   const params = {
  //     name: reviewName,
  //     imageUrl,
  //     notes,
  //   }

  //   try {
  //     const newReviewId = await saveReview(params);  
  //   } catch(e) {
  //     console.error(e);
  //     setHasError(true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const handleTryGetReviewDetails = async (id: T.id) => {

    setIsLoading(true);
    setHasError(false);

  }

  return (
    <div className="h-full flex flex-col">
      <div className='p-5 flex justify-between'>
        <SelectWithLabel 
          defaultText='- select -'
          label='Select Exisiting Review'
          name='review-select'
          selected={currentReviewId}
          selections={reviewSelections}
          setSelected={ handleTryGetReviewDetails }
        />
        <InputWithLabel 
          type='text'
          label='Review Name'
          name='review-name'
          value={reviewName}
          disabled={currentReviewId === 'default'}
          setValue={ setReviewName }
        />
      </div>
      <div className='p-5 flex justify-between'>
        <Button 
          actionType='primary'
          actionText='New Review'
          actionHandler={ handleNewReviewClick }
        />
        {/* <Button 
          actionType='primary'
          actionText='Save Review'
          actionHandler={ handleTrySaveReview }
        /> */}
      </div>
      {
        imageUrl !== ""
        &&
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="New Review"
        appElement={document.getElementById('root') || undefined}
      >
        <div className='p-5'>
          <Button 
            actionType='secondary'
            actionText='close'
            actionHandler={ () => setIsOpen(false) }
          />
        </div>
        <div className='p-5'>
          <InputWithLabel 
            type='text'
            label='Enter New Review Name'
            name='new-review-name'
            value={reviewName}
            setValue={ setReviewName }
          />
          <InputWithLabel 
            type='text'
            label='Enter Target Website URL:'
            name='website-url'
            placeholder='eg. https://www.google.com/'
            value={websiteUrl}
            setValue={ v => setWebsiteUrl(v) }
          />
          <div className='flex justify-between X'>
            <InputWithLabel 
              type='number'
              label='Viewport Width:'
              name='viewport-width'
              placeholder='eg. 1440'
              value={viewportWidth}
              setValue={ v => setViewportWidth(v) }
            />
            <InputWithLabel 
              type='number'
              label='Viewport Height:'
              name='viewport-height'
              placeholder='eg. 990'
              value={viewportHeight}
              setValue={ v => setViewportHeight(v) }
            />
          </div>
          <Button 
            actionType='primary'
            actionText='Create Review'
            actionHandler={ handleTryCreateReview }
          />
        </div>
      </Modal>
    </div>
  );
}

export default App;

