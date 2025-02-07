export const TokenSelector = ({ onSelectChange }: { onSelectChange: (token: string) => void }) => (
  <select onChange={(e) => onSelectChange(e.target.value)}>
    <option value="0x21f42Cc67A082cc649F3EBdfb7BBc2CE48b1347f">TUNAD</option>  {/*/tunad/*/} 
    <option value="0x1c9678F406910A2c57De3d9a834A6278998E3DA5">PEPET</option>   {/*/pepet/*/} 
  </select>
)
