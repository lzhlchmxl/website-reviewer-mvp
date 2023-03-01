import { useState } from 'react';
import { captureSnapshot, createReview, getReviewDetails, getReviews } from './Api';
import Button from './Button';
import { useAsync } from './CustomHooks';
import ErrorIndicator from './ErrorIndicator';
import InputWithLabel from './InputWithLabel';
import LoadingIndicator from './LoadingIndicator';
import SelectWithLabel from './SelectWithLabel';
import SnapshotMask from './SnapshotMask';
import * as T from './types';
import Modal from 'react-modal';
import _ from 'lodash';

function App() {

  // snapshot parameters
  const [websiteUrl, setWebsiteUrl] = useState('https://www.google.com/');
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [imageUrl, setImageUrl] = useState('');

  // review parameters
  const [reviewName, setReviewName] = useState('');
  const [notes, setNotes] = useState<T.Note[]>([]);
  

  const [currentReviewId, setCurrentReviewId] = useState<T.ReviewId >('default');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // modal control
  const [modalIsOpen, setIsOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  
  // [TODO] This is not a good pattern, should've looked for a solution with routing
  const [reviewSelections, setReviewSelections] = useState<{value: string; text: string;}[]>([]);
  const tryUpdateListView = async () => {
    try {
      const reviewHeaders = await getReviews(); 
      const updatedReviewSelections = reviewHeaders.map( reviewHeader => {
        return {value: reviewHeader.id, text: reviewHeader.name} 
      })

      if ( !_.isEqual(updatedReviewSelections, reviewSelections)) {
        setReviewSelections(updatedReviewSelections);
      }
    } catch(e) {
      console.error(e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }
  tryUpdateListView();

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
      const imageUrl = await captureSnapshot(snapShotParams);  
      setImageUrl(imageUrl);
      const newReviewParams = {
        name: newReviewName,
        imageUrl,
        notes: [],
      }
      const newReviewId = await createReview(newReviewParams);
      setCurrentReviewId(newReviewId);
      /* [TODO] should've separated the detail view from list view */
      tryUpdateListView();

    } catch(e) {
      console.error(e);
      setHasError(true);
    } finally {
      setReviewName(newReviewName);
      setIsOpen(false);
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

  const handleTryGetReviewDetails = async (id: T.ReviewId) => {

    setIsLoading(true);
    setHasError(false);

    try {
      const reviewDetails = await getReviewDetails(id);
      const { notes, imageUrl, name } = reviewDetails;
      setNotes(notes);
      setImageUrl(imageUrl);
      setReviewName(name);
      setCurrentReviewId(id);
    } catch(e) {
      console.error(e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
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
            value={newReviewName}
            setValue={ setNewReviewName }
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

