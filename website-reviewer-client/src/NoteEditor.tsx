export default function NoteEditor(
  {
    text, 
    setText,
    tryDeleteNote
  }
  : 
  {
    text: string, 
    setText: (text: string) => void,
    tryDeleteNote: () => void,
  }
) {

  return (
    <div className="flex justify-between relative w-[267px]">
      <textarea
        className={`
          absolute bg-white border border-gray-500 rounded-lg p-1
          w-[200px] min-h-[35px] rounded-tr-none rounded-br-none
        `}
        value={text}
        onChange={ e => setText(e.currentTarget.value)}
      />
      <button
        className="
          absolute right-0 min-h-[35px]
          bg-red-500 text-gray-200 px-2 rounded-lg rounded-tl-none rounded-bl-none
        "
        onClick={ tryDeleteNote }
      >
        DELETE
      </button>

    </div>
  )
}