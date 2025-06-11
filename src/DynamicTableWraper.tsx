import React from 'react';
import { ObjectFlatter,type Options as FlatlingOptions } from './ObjectFlatner';
import DynamicTable from './DynamicTable';
import Modal from 'react-modal';
import {revertChange, type DiffArray} from 'deep-diff'
import DynamicTableDiff from './DynamicTableDiff';


type IPagination={
      currentPage: number,
      rowsPerPage: number,
      total: number,
}
type IEmbedment={
          label:string,
          value:string,
          obj:{[x:string]:unknown}
        }

interface DynamicTableProps{
    searchComponent:React.FC
    config:{
        mode:'API'|'ENG',
        dataId:string,
        onPaginationChange:(e:IPagination)=>void,
        flatlingOptions:{
            base:FlatlingOptions,
            export?:FlatlingOptions,
            marchendiser?:FlatlingOptions
        }
    }
}
class DynamicTableWarper extends React.Component<DynamicTableProps> {
    rawData:{[x:string]:unknown}[]=[]
    dataId:string
    mode:'API'|'ENG'
    state: Readonly<{
        rows:{id:string,subRows:{ [x: string]: string | number | boolean;}[] }[],
        columns:string[],
        currentPage: number,
        total: number,
        rowsPerPage: number,
        flattingOption:keyof DynamicTableProps['config']['flatlingOptions'],
        viewModal_isOpen:boolean
        viewModal_id?:string,
        viewModal_columns:string[],
        viewModal_rows:{id:string,subRows:{ [x: string]: string | number | boolean;}[] }[],
        viewModal_flattingOption:keyof DynamicTableProps['config']['flatlingOptions'],

        editModal_isOpen:boolean
        editModal_id?:string,
        editModal_columns:string[],
        editModal_embedment:IEmbedment[],
        editModal_currentEmbedment?:string,
        editModal_latestRows:{id:string,subRows:{ [x: string]: string | number | boolean;}[] }[],
        editModal_oldRows:{id:string,subRows:{ [x: string]: string | number | boolean;}[] }[],
        editModal_flattingOption:keyof DynamicTableProps['config']['flatlingOptions'],
        
    }>;
    onPaginationChange:(e:IPagination)=>void

    
  constructor(props:DynamicTableProps) {
    super(props);
    this.mode= props.config.mode? props.config.mode:'ENG'
    this.onPaginationChange=props.config.onPaginationChange
    this.dataId=props.config.dataId
    this.state = {
      rows: [],
      columns: [],
      currentPage: 1,
      rowsPerPage: 5,
      total:1,
      flattingOption:'base',
      viewModal_isOpen:false,
      viewModal_columns:[],
      viewModal_rows:[],
      viewModal_flattingOption:'base',
    
      editModal_isOpen:false,
      editModal_columns:[],
      editModal_embedment:[],
      
      editModal_latestRows:[],
      editModal_oldRows:[],
      editModal_flattingOption:'base',
        
    };
    if(this.mode=='API'){
      this.handlePageChange(0)
    }
  }
  pushData(data:{ [x: string]: unknown }){
    this.rawData.push(data)
    this.setState({
      total:this.rawData.length
    })
    if(
      (this.state.currentPage* this.state.rowsPerPage)>this.state.total && ((this.state.currentPage-1)* this.state.rowsPerPage)<this.state.total){
      
        console.log("Rersh")
        this.updateComponent()
    }
  }
  setData(pagination:IPagination,data:{ [x: string]: unknown }[]){
    if(this.mode!='API') return
    this.rawData=data
    this.setState({
      total:pagination.total,
      currentPage:pagination.currentPage,
      rowsPerPage:pagination.rowsPerPage
    },()=>{

      console.log(" setData Refresh")
      this.updateComponent()
    })
    
  }
  flatten(flatlingOption:typeof this.state.flattingOption,rawData:typeof this.rawData){
    const rows: {id:string,subRows:{ [x: string]: string | number | boolean;}[] }[]=[];
    const fo=this.props.config.flatlingOptions[flatlingOption] || this.props.config.flatlingOptions.base
    const flatter= new ObjectFlatter(fo)
    for(let i=0; i<rawData.length;i++){
      if(rawData[i]==null) break
      const subRows: { [x: string]: string | number | boolean; }[]=[];
      flatter.flatten(rawData[i]).forEach(e=>subRows.push(e))
      rows.push({
        id:rawData[i][this.dataId] as string,
        subRows:subRows
      })

    }
    return {
      rows,columns:flatter.headers
    }
  }
  updateComponent(){
      console.log('updateComponent',this.state)
      const pageRows=[]
      for(let i=((this.state.currentPage-1)*this.state.rowsPerPage); i<(this.state.currentPage*this.state.rowsPerPage);i++){
        pageRows.push(this.rawData[i])
      }
      this.setState(this.flatten(this.state.flattingOption,pageRows));
  }
  // componentDidUpdate(prevProps:DynamicTableProps) {
  componentDidUpdate() {
    console.log('componentDidUpdates ')
    // if (prevProps.rows !== this.props.rows) {
      
    // }
    // this.updateComponent()
  }

  handlePageChange = (direction:number) => {
    let nextPage = this.state.currentPage + direction;
    if(this.mode=='ENG'){
      const totalPages = Math.ceil(this.state.total / this.state.rowsPerPage);
      if (nextPage < 1) nextPage = 1;
      if (nextPage > totalPages) nextPage = totalPages;
      this.setState( { currentPage: nextPage },()=>{
        this.updateComponent()
      });
    }else{
      this.onPaginationChange({
        currentPage: nextPage,
        rowsPerPage: this.state.rowsPerPage,
        total: this.state.total
      })
    }
  };

  // handleRowsPerPageChange = (e) => {
  handleRowsPerPageChange:React.SelectHTMLAttributes<HTMLSelectElement>['onChange'] = (e) => {
    
    if(this.mode=='ENG'){
      this.setState({
        rowsPerPage: parseInt(e.target.value, 10),
      },()=>{this.handlePageChange(0)});
    }else{
      this.onPaginationChange({
        currentPage: this.state.currentPage,
        rowsPerPage: parseInt(e.target.value, 10),
        total: this.state.total
      })
    }
  };
  handleExpandModeChange:React.SelectHTMLAttributes<HTMLSelectElement>['onChange'] = (e) => {
    console.log("eeee",e)
    this.setState({
      flattingOption:e.target.value,
    },()=>{
      this.updateComponent()
    });
  };

  handleViewModal(id?: string){
    if(id!=null) {
      this.setState({
        viewModal_id:id,
      })
    }else{
      id=this.state.viewModal_id
    }
    // console.log("viewModal_id",id)
    const rawData=this.rawData.find(e=> e[this.dataId]==id)
    console.log("rawData",this.state.viewModal_flattingOption,rawData)

    
    if(rawData){
      const flatten=this.flatten(this.state.viewModal_flattingOption,[rawData])
      console.log("flatten",flatten)
      this.setState({
        viewModal_rows:flatten.rows,
        viewModal_isOpen:true,
        viewModal_columns:flatten.columns
      })
    }
    // console.log(this.state)
  }

  handleHistoryModal(id?: string){
    if(id!=null) {
      this.setState({
        editModal_id:id,
      })
    }else{
      id=this.state.editModal_id
    }
    const rawData=this.rawData.find(e=> e[this.dataId]==id)
        
    if(rawData){
      let editModal_currentEmbedment= this.state.editModal_currentEmbedment
      const changeHistory=rawData.changeHistory as {
        changedAt:string 
        changedBy: string
        changes:DiffArray<unknown,unknown>[]
      }[]
      const changes:IEmbedment[]=[]
      const f=[]
      if(changeHistory && changeHistory.length>0){
        for (let i = changeHistory.length - 1; i >= 0; i--) {
              const c:IEmbedment={
                label:(new Date(changeHistory[i].changedAt)).toLocaleString(),
                value:String(i),
                obj:JSON.parse(JSON.stringify(rawData))
              }
              for(const change of changeHistory[i].changes){
                revertChange(c.obj, true, change);
              }
              f.push(c.obj)
              changes.push(c)
            }
        editModal_currentEmbedment=changes[0].value
      }else{
        editModal_currentEmbedment="N/A"
      }
      this.setState({
        editModal_embedment:changes,
        editModal_isOpen:true,
        editModal_currentEmbedment:editModal_currentEmbedment,
      },()=>{this.changeHistoryModal()})
    }else{
      console.log("rawData is empty")
    }
  }
  changeHistoryModal(){
    console.log(this.state)
    const rawData=this.rawData.find(e=> e[this.dataId]==this.state.editModal_id)
    const change=this.state.editModal_embedment.find(e=>e.value==this.state.editModal_currentEmbedment)
    if(rawData && change){
      const flatten=this.flatten(this.state.editModal_flattingOption,[rawData,change.obj])
        this.setState({
          editModal_latestRows:[flatten.rows[0]],
          editModal_oldRows:[flatten.rows[1]],
          editModal_columns:flatten.columns
        })
    }else{
      this.setState({
          editModal_latestRows:[],
          editModal_oldRows:[],
          editModal_columns:['No History']
        })
    }
  }

  render() {
    const { rows, columns, currentPage, rowsPerPage,flattingOption } = this.state;
    const totalPages = Math.ceil(this.state.total/this.state.rowsPerPage);
    const { searchComponent: SearchComponent } = this.props;
    const actionPanelOptions=[
              {
                name: '👁️‍🗨️',
                onclick:  (id: string): void=> {
                  this.handleViewModal(id)
                }
              }
            ]
  if(this.mode=='API') actionPanelOptions.push({
                name: '⌚',
                onclick: (id: string): void=> {
                  console.log("Onclick History",id)
                  this.handleHistoryModal(id)
                }
              })
    return (
      <div style={{display:'flex',alignItems:'flex-start',flexDirection:'row'}}> 
        {this.mode=='API' && (<SearchComponent/>)}
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>

          <div style={{ marginTop: '10px' }}>
            <span style={{ marginLeft: '20px' }}>
              Expand Mode:
              <select  value={flattingOption} onChange={this.handleExpandModeChange} style={{ marginLeft: '5px' ,textTransform:'capitalize'}}>
                {Object.keys(this.props.config.flatlingOptions).map(n => (
                  <option style={{textTransform:'capitalize'}} key={n} value={n}>{n}</option>
                ))}
              </select>
            </span>
            <button onClick={() => this.handlePageChange(-1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span style={{ margin: '0 10px' }}>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button onClick={() => this.handlePageChange(1)} disabled={currentPage === totalPages}>
              Next
            </button>
            <span style={{ marginLeft: '20px' }}>
              Rows per page:
              <select value={rowsPerPage} onChange={this.handleRowsPerPageChange} style={{ marginLeft: '5px' }}>
                {[1,5, 10, 20, 50].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </span>
            
          </div>
          <DynamicTable action={{
            options:actionPanelOptions
          }} rows={rows} columns={columns}></DynamicTable>
        </div>
        
        
        <Modal
        isOpen={this.state.viewModal_isOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={()=>{
          this.setState({
              viewModal_isOpen:false
          })
        }}
        // style={customStyles}
        style={{content:{backgroundColor:'gray'}}}
        contentLabel="Example Modal"
      >
        <div>
            Expand Mode:
              <select  value={this.state.viewModal_flattingOption} onChange={(e)=>{
                // console.log(this.state_viewModal)
                this.setState({
                  viewModal_flattingOption:e.target.value
                },()=>{
                  this.handleViewModal()
                })
              }
                } style={{ marginLeft: '5px' ,textTransform:'capitalize'}}>
                {Object.keys(this.props.config.flatlingOptions).map(n => (
                  <option style={{textTransform:'capitalize'}} key={n} value={n}>{n}</option>
                ))}
              </select>
          </div>
          <DynamicTable  rows={this.state.viewModal_rows} columns={this.state.viewModal_columns}></DynamicTable>
        </Modal>



        <Modal
        isOpen={this.state.editModal_isOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={()=>{
          this.setState({
              editModal_isOpen:false
          })
        }}
        // style={customStyles}
        style={{content:{backgroundColor:'gray'}}}
        contentLabel="Example Modal"
      >
        <div>
          <div>
            Embedment:
              <select name='Expand Mode'  value={this.state.editModal_currentEmbedment} onChange={(e)=>{
                this.setState({
                  editModal_currentEmbedment:e.target.value
                },()=>{
                  this.changeHistoryModal()
                })
              }
                } style={{ marginLeft: '5px' ,textTransform:'capitalize'}}>
                {this.state.editModal_embedment.map(n => (
                  <option style={{textTransform:'capitalize'}} key={n.label} value={n.value}>{n.label}</option>
                ))}
              </select>
          </div>
          <div>
            Expand Mode:
              <select name='Expand Mode'  value={this.state.editModal_flattingOption} onChange={(e)=>{
                // console.log(this.state_viewModal)
                this.setState({
                  editModal_flattingOption:e.target.value
                },()=>{
                  this.handleHistoryModal()
                })
              }
                } style={{ marginLeft: '5px' ,textTransform:'capitalize'}}>
                {Object.keys(this.props.config.flatlingOptions).map(n => (
                  <option style={{textTransform:'capitalize'}} key={n} value={n}>{n}</option>
                ))}
              </select>
          </div>
          </div>
          <DynamicTableDiff  newRows={this.state.editModal_latestRows} oldRows={this.state.editModal_oldRows} columns={this.state.editModal_columns}></DynamicTableDiff>
        </Modal>
      </div>
    );
  }
}

export default DynamicTableWarper;
