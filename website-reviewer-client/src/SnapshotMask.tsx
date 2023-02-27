import { useState } from 'react';
import * as T from './types';
import uniqid from 'uniqid';
import NotesIndicator from './NotesIndicator';

export default function SnapshotMask() {

  const [notes, setNotes] = useState<T.note[]>([]);

  const handleMaskClick = (e: any) => {
    const mask = e.target.getBoundingClientRect();
    const x = e.clientX - mask.left;
    const y = e.clientY - mask.top;

    const newNote:T.note = {
      id: uniqid(),
      text: '',
      isActive: true,
      x,
      y,
    }

    setNotes([...notes, newNote]);
  }

  const notesHTML = notes.map( note => {

    return (
      <div 
        key={note.id}
        className={`absolute`}
        style={{top: `${note.y-10}px`, left: `${note.x-10}px`,}}
      >
        <NotesIndicator />
      </div>
    )
  })

  return (
    <div
      className='absolute w-[-webkit-fill-available] h-[-webkit-fill-available]'
      onClick={ e => handleMaskClick(e) }
    >
      {notesHTML}
    </div>
  )
}