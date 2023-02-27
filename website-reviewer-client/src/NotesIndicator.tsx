import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function NotesIndicator(
  {
    isActive,
    toggleActive
  }
  : 
  {
    isActive: boolean,
    toggleActive: () => void,
  } 
) {
  
  return (
    <div
      className="
        rounded-full bg-pink-600 w-5 h-5 text-white flex justify-center items-center
        hover:cursor-pointer
      "
      onClick={ toggleActive }
    >
      {
        isActive 
        ?
        <FontAwesomeIcon icon={faClose} />
        :
        <FontAwesomeIcon icon={faPlus} />
      }
    </div>
  )
}