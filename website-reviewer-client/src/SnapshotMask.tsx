import * as T from './types';
import uniqid from 'uniqid';
import NotesIndicator from './NotesIndicator';
import NoteEditor from './NoteEditor';

export default function SnapshotMask({notes, setNotes}: {notes: T.Note[], setNotes: (notes: T.Note[]) => void}) {

  

  const handleMaskClick = (e: any) => {
    
    if (e.ctrlKey) {

      const mask = e.target.getBoundingClientRect();
      const x = e.clientX - mask.left;
      const y = e.clientY - mask.top;

      const newNote:T.NewNote = {
        id: uniqid(),
        text: null,
        isActive: true,
        x,
        y,
      }

      setNotes([...notes, newNote]);
    }
  }

  const handleTrySaveNote = (text: string, id: string) => {

    const note = notes.find( note => note.id === id);

    if (note === undefined) {
      throw new Error(`Unable to find note with id: ${id}`);
    }

    const newNote: T.Note = {
      ...note,
      text,
    }

    const notesClone = notes.filter( note => note.id !== id);

    if (text === "" || text === null) {
      setNotes([...notesClone]);
    } else {
      // try save note to database
      setNotes([...notesClone, newNote]);
    }
  }

  const handleToggleActive = (id: string) => {
    
    const note = notes.find( note => note.id === id);

    if (note === undefined) {
      throw new Error(`Unable to find note with id: ${id}`);
    }

    const newNote: T.Note = {
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
            initialText={note.text}
            trySaveNote={ (text) => handleTrySaveNote(text, note.id) }
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