export default function InputWithLabel(
  {
    label,
    name,
    placeholder,
    value,
    setValue,
  }
  :
  {
    label: string,
    name: string,
    placeholder?: string,
    value: string,
    setValue: (value: string) => void,
  }
) {

  return (
    <div className='flex flex-col'>
      <label htmlFor={name}>{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        name={name}
        id={name}
        className='bg-white border border-gray-500' 
        onChange={ e => setValue(e.currentTarget.value) }
      />
    </div>
  )
}