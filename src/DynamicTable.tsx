type DynamicTableProps={
  rows:{id:string,subRows:{ [x: string]: string | number | boolean;}[] }[],
  columns:string[],
  action?:{
    options:{
      name:string,
      onclick:(id:string)=>void,
    }[]
  }
}
export default function DynamicTable({columns,rows,action}:DynamicTableProps){
  
  return (
      <table style={{backgroundColor:'transparent'}} border={1} cellPadding="5" >
        <thead>
          <tr>
            { (action && columns.length>0) && <th key={'action'}> Action</th>}
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
         
        </thead>
        <tbody>
          {
            rows.map((row, i) => 
                row.subRows.map((subRow,j)=>
                  <tr key={i+''+j}>
                    {(action && j === 0) && (
                        <td
                          rowSpan={row.subRows.length}
                          style={{
                             minWidth: '50px', fontWeight: 'bold' ,
                            verticalAlign: 'top',      // aligns cell content to the top
                            textAlign: 'left',         // aligns content to the left
                            padding: '5px',
                            }}
                        > 
                        <div style={{display:'flex'}}>
                          {
                            action.options.map(e=>(
                              <button style={{padding:'5px'}} onClick={() => e.onclick?.(row.id)}>{e.name}</button>
                            ))
                          }
                        </div>
                        </td>
                      )}
                    {columns.map((col, k) => (
                      <td 
                        style={{ 
                          minWidth:'100px',
                          textWrap:'nowrap'
                        }
                        } key={k}
                        // title={row[col] !== undefined ? row[col] : ''}
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