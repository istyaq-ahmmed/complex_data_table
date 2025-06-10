type DynamicTableProps={
  oldRows:{id:string,subRows:{ [x: string]: string | number | boolean;}[] }[],
  newRows:{id:string,subRows:{ [x: string]: string | number | boolean;}[] }[],
  columns:string[],
}
export default function DynamicTableDiff({columns,oldRows,newRows}:DynamicTableProps){
  
  return (
      <table style={{backgroundColor:'transparent'}} border={1} cellPadding="5" >
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
         
        </thead>
        <tbody>
          {
            oldRows.map((row, i) => 
                row.subRows.map((subRow,j)=>
                  <tr key={i+''+j}>
                    {columns.map((col, k) => (

                      <td 
                          style={{ 
                            backgroundColor:newRows[i].subRows[j][col]==subRow[col]?'transparent':'green',
                            minWidth:'100px',
                            textWrap:'nowrap'
                          }
                          } key={k}
                          title={newRows[i].subRows[j][col]==subRow[col]?undefined:String(newRows[i].subRows[j][col])}
                        >
                          {subRow[col] !== undefined ? subRow[col] : ''}
                        </td>
                      
                    

                    ))}
                    
                  </tr>
                )
            )
          }
        </tbody>
      </table>
    );
  }