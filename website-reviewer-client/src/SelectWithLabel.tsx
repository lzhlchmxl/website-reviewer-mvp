export default function selectWithLabel(
  {
    label,
    name,
    selections,
    selected,
    setSelected,
  }
  :
  {
    label: string,
    name: string,
    selections: {value: string, text: string}[],
    selected: string,
    setSelected: (value: string) => void,
  }
) {

  const selectionsHTML = selections.map( (selection, index) => {
    return <option value={selection.value} key={index}>{selection.text}</option>;
  })

  return (
    <div className='flex flex-col'>
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        id={name}
        value={selected}     
        onChange={ e => setSelected(e.currentTarget.value) }
      >
        <option value={'default'} disabled hidden>- select review -</option>
        { selectionsHTML }
      </select>

    </div>
  )
}