import { useState } from 'react';
import * as T from './types';
import uniqid from 'uniqid';
import NotesIndicator from './NotesIndicator';
import NoteEditor from './NoteEditor';

export default function SnapshotMask() {

  const [notes, setNotes] = useState<T.note[]>([]);

  const handleMaskClick = (e: any) => {
    
    if (e.ctrlKey) {

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
  }

  const handleSetText = (text: string, id: string) => {

    const note = notes.find( note => note.id === id);

    if (note === undefined) {
      throw new Error(`Unable to find note with id: ${id}`);
    }

    const newNote: T.note = {
      ...note,
      text,
    }

    const notesClone = notes.filter( note => note.id !== id);
    setNotes([...notesClone, newNote]);
  }

  const handleToggleActive = (id: string) => {
    
    const note = notes.find( note => note.id === id);

    if (note === undefined) {
      throw new Error(`Unable to find note with id: ${id}`);
    }

    const newNote: T.note = {
      ...note,
      isActive: !note.isActive,
    }

    const notesClone = notes.filter( note => note.id !== id);
    setNotes([...notesClone, newNote]);
  }

  const handleTryDeleteNote = (id: string) => {
    
    const confirmed = window.confirm("Are you sure you want to delete this note?");

    if (confirmed) {
      const notesClone = notes.filter( note => note.id !== id);
      setNotes(notesClone);
    }

  }

  const notesHTML = notes.map( note => {

    return (
      <div 
        key={note.id}
        onClick={ (e) => e.stopPropagation() }
        className={`absolute`}
        style={{top: `${note.y-10}px`, left: `${note.x-10}px`}}
      >
        <NotesIndicator 
          toggleActive={ () => handleToggleActive(note.id) }
          isActive={note.isActive}
        />
        {
          note.isActive 
          &&
          <NoteEditor 
            text={note.text}
            setText={ (text) => handleSetText(text, note.id) }
            tryDeleteNote={ () => handleTryDeleteNote(note.id) }
          />
        }
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