export default function Button(
  {
    actionType,
    actionText,
    actionHandler,
  }
  :
  {
    actionType: "primary" | "secondary" | "tertiary",
    actionText: string,
    actionHandler: () => void,
  }
) {

  return (
    <button 
      className='border border-gray-900 rounded-md p-1 mt-5 px-3 shadow-md hover:bg-black hover:text-white transition-all'
      onClick={ actionHandler }
    >
      {actionText}
    </button>
  )
}