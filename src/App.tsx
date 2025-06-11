import './App.css'
import DynamicTableWarper from './DynamicTableWraper'
import React, { useState } from 'react';
import {ExampleHnM} from './ExampleData'
import {APIRespExample} from './APIExample'
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Or whatever your main app container ID is

function App() {
  // const [count, setCount] = useState(0)
  const tableRef = React.useRef<DynamicTableWarper>(null);
  const handlePaginationChange = React.useCallback(() => {
          if (!tableRef.current) {
              console.warn("Ref not ready yet, skipping initial pagination setup.");
              return;
            }
            console.log("Page Changed",tableRef.current)
            tableRef.current?.setData(
              {
                currentPage: APIRespExample.query.page+1,
                rowsPerPage: APIRespExample.query.perPage,
                total: APIRespExample.query.total
              },
              APIRespExample.items
            )
    }, [tableRef]);
  React.useEffect(() => {
        if (tableRef.current) {
          handlePaginationChange();
        }
      }, [handlePaginationChange]);
  

  
  const [st, setAge]= useState(0)
  // This line is just for tricking Ts.s
  const mode:"ENG"|'API'= ExampleHnM[0].orderNo=='307059-1643'?"API":'ENG';

  return (
    <>
    <button onClick={() =>{
      console.log("Mode",mode)
      }}>
              Current Mode is {mode}
      </button>
    {
      mode=='ENG' && <button onClick={() =>{
        console.log('st[0].ind',st)
        tableRef.current?.pushData(ExampleHnM[st])
        setAge(st+1)
      }}>
              Emulate Engine Data
      </button>
    }
    
      
    <DynamicTableWarper  ref={tableRef}
      searchComponent={() => {
        return <div>
          <form>
            <label>
              Purchase Order: <br />
              <input type="text" name="po" />
            </label>
            <label>
              CCD: <br />
              <input type='date' name="ccd" />
            </label>
            <label>
              Created At:<br />
              <input type='date' name="ca" />
            </label>
            <label>
              Transport By:<br />
              <input type="text" name="tb" />
            </label>
            <input type="submit" value="Filter" />
            <input type='button' value="Clear" />
          </form>
        </div>;
      }}
      config={
        {
          mode:mode,
          dataId:'orderNo',
          onPaginationChange: handlePaginationChange,
          flatlingOptions:{
            base: {
                fixedColumns:true,
                linearArray: {
                ".changeHistory": (
                ) => {
                  return {}
                },
                ".planingMarkets": (
                  e,
                ) => {
                  const planingMarketA=[]
                  const timeOfDelivery=[]
                  const invoiceAveragePrice=[]
                  const transportMode=[]
                  const currency=[]
                  const termsOfDelivery=[]
                  let quantity=0,value=0;
                  for (const ele of e) {
                    planingMarketA.push(ele['planingMarketA'])
                    value+=Number(ele['invoiceAveragePrice'])
                    invoiceAveragePrice.push(ele['invoiceAveragePrice'])
                    transportMode.push(ele['transportMode'])
                    termsOfDelivery.push(ele['termsOfDelivery'])
                    currency.push(ele['currency'])
                    quantity+=Number(ele['quantity'])
                    const tod=new Date(ele['timeOfDelivery'])
                    timeOfDelivery.push(`${tod.getFullYear()}-${tod.getMonth()}-${tod.getDate()}`)
                  }
                  return {
                    planingMarketA:planingMarketA.join(',\n'),
                    timeOfDelivery:timeOfDelivery.join(',\n'),
                    invoiceAveragePrice:invoiceAveragePrice.join(',\n'),
                    transportMode:transportMode.join(',\n'),
                    termsOfDelivery:termsOfDelivery.join(',\n'),
                    currency:currency.join(',\n'),
                    quantity:quantity,
                    invoiceTotalValue:(value*quantity).toFixed(2)
                  };
                },
                },
                arrayIDs: [".orderNo", "planingMarketA",'.numberOfPieces'],
                aliases: {
                  ".orderNo": "Order NO",
                  '.dateOfOrder':'Date Of Order',
                  '.ptProductNo':'delete',
                  '.customsCustomerGroup':'Customs Customer Groups',
                  '.typeOfConstruction':'Type of Construction',
                  '.developmentNo':'delete',
                  '.productNo':'Product No',
                  '.productName':'Product Name',
                  '.productDescription':'Product Description',
                  '.season':'Season',
                  '.numberOfPieces':'No of Pieces',
                  'planingMarketA':'Planning Market A',
                  'timeOfDelivery':'Time of Delivery',
                  'termsOfDelivery':'Terms of Delivery',
                  'quantity':'Quantity In Packs',
                  "quantityInPCS":"Quantity in PCS",
                  'invoiceAveragePrice':'Invoice Average Price',
                  'currency':'Currency',
                  'invoiceTotalValue':'Value',
                  'transportMode':'Transport By',
                  '.optionNo':'delete',

                },
                virtual:{
                  "quantityInPCS":(e:{ [x: string]: string | number | boolean },storage:{ [x: string]: string | number | boolean })=>{
                    if(e['.numberOfPieces']!=null ){
                      storage['.numberOfPieces']=e['.numberOfPieces']    
                    }
                     if(e['quantity']!=null ) return storage['.numberOfPieces'] as number * Number(e['quantity'])
                  },
                  // "invoiceTotalValue":(e:{ [x: string]: string | number | boolean })=>{
                  //   if(e['invoiceAveragePrice']!=null && e['quantity']!=null ) return e['invoiceAveragePrice'] as number * Number(e['quantity'])
                  // }
                }},
            export: {
                fixedColumns:true,
                linearArray: {
                ".changeHistory": (
                ) => {
                  return {}
                },
                ".planingMarkets.assortments": (
                  
                ) => {
                  return {};
                },
                },
                arrayIDs: ['.orderNo','.dateOfOrder','.ptProductNo','.customsCustomerGroup','.typeOfConstruction','.developmentNo','.productNo','.productName','.productDescription','.season', '.optionNo','.numberOfPieces'],
                aliases: {
                  ".orderNo": "Order NO",
                  '.dateOfOrder':'Date Of Order',
                  '.ptProductNo':'PT Prod No',
                  '.customsCustomerGroup':'Customs Customer Group',
                  '.typeOfConstruction':'Type of Construction',
                  '.developmentNo':'Development',
                  '.productNo':'Product No',
                  '.productName':'Product Name',
                  '.productDescription':'Product Description',
                  '.season':'Season',
                  '.numberOfPieces':'No of Pieces',
                  '.planingMarkets.planingMarketA':'Planning Market A',
                  '.planingMarkets.planingMarketB':'Planning Market B',
                  '.planingMarkets.timeOfDelivery':'Time of Delivery',
                  '.planingMarkets.termsOfDelivery':'Terms of Delivery',
                  '.planingMarkets.quantity':'Quantity In Packs',
                  "quantityInPCS":"Quantity in PCS",
                  '.planingMarkets.invoiceAveragePrice':'Invoice Average Price',
                  '.planingMarkets.currency':'Currency',
                  'invoiceTotalValue':'Value',
                  '.planingMarkets.transportMode':'Transport By',
                  '.optionNo':'All Option No',                  
                },
                virtual:{
                  "quantityInPCS":(e:{ [x: string]: string | number | boolean },storage:{ [x: string]: string | number | boolean })=>{
                    if(e['.numberOfPieces']!=null ){
                      storage['.numberOfPieces']=e['.numberOfPieces']    
                    }
                    if(e['.planingMarkets.quantity']!=null ) return storage['.numberOfPieces'] as number * Number(e['.planingMarkets.quantity'])
                  },
                  "invoiceTotalValue":(e:{ [x: string]: string | number | boolean })=>{
                    if(e['.planingMarkets.invoiceAveragePrice']!=null && e['.planingMarkets.quantity']!=null ) return (e['.planingMarkets.invoiceAveragePrice'] as number * Number(e['.planingMarkets.quantity'])).toFixed(2)
                  }
                }},
            marchendiser: {
              fixedColumns:true,
                linearArray: {
                   ".changeHistory": (
                ) => {
                  return {}
                },
                // ".planingMarkets.assortments.sizes.total": (
                //   e: {
                //     ".tag": string;
                //     ".quantity": number;
                //   }[],
                // ) => {
                //   const obj = {};
                //   for (const ele of e) {
                //     obj[ele["tag"]] = ele["quantity"];
                //   }
                //   return obj;
                // },
                },
                arrayIDs: [".orderNo", ".planingMarkets.planingMarketA",".planingMarkets.planingMarketB",'.numberOfPieces'],
                aliases: {
                  ".orderNo": "Order NO",
                  '.dateOfOrder':'Date Of Order',
                  '.ptProductNo':'PT Prod No',
                  '.customsCustomerGroup':'Customs Customer Group',
                  '.typeOfConstruction':'Type of Construction',
                  '.developmentNo':'Development',
                  '.productNo':'Product No',
                  '.productName':'Product Name',
                  '.productDescription':'Product Description',
                  '.season':'Season',
                  '.numberOfPieces':'No of Pieces',
                  '.planingMarkets.planingMarketA':'Planning Market A',
                  '.planingMarkets.planingMarketB':'Planning Market B',
                  '.planingMarkets.timeOfDelivery':'Time of Delivery',
                  '.planingMarkets.termsOfDelivery':'Terms of Delivery',
                  '.planingMarkets.quantity':'Quantity In Packs',
                  "quantityInPCS":"Quantity in PCS",
                  '.planingMarkets.invoiceAveragePrice':'Invoice Average Price',
                  '.planingMarkets.currency':'Currency',
                  'invoiceTotalValue':'Value',
                  '.planingMarkets.transportMode':'Transport By',
                  '.planingMarkets.assortments.articleNo':'Article No',
                  '.optionNo':'All Option No',
                  '.planingMarkets.assortments.colourCode':'Color Code',
                  '.planingMarkets.assortments.graphicalAppearance':'Graphical Appearance',
                  '.planingMarkets.assortments.description':'Article Description',
                  '.planingMarkets.assortments.PT_Article_Number':'PT Article No',
                  ".planingMarkets.assortments.optionNo":'Option No',
                  ".planingMarkets.assortments.sizes.total.tag":'Size',
                  ".planingMarkets.assortments.sizes.total.quantity":'Quantity Per Size'

                },
                virtual:{
                  "quantityInPCS":(e:{ [x: string]: string | number | boolean },storage:{ [x: string]: string | number | boolean })=>{
                    if(e['.numberOfPieces']!=null ){
                      storage['.numberOfPieces']=e['.numberOfPieces']    
                    }
                    if(e['.planingMarkets.quantity']!=null ) return storage['.numberOfPieces'] as number * Number(e['.planingMarkets.quantity'])
                  },
                  "invoiceTotalValue":(e:{ [x: string]: string | number | boolean })=>{
                    if(e['.planingMarkets.invoiceAveragePrice']!=null && e['.planingMarkets.quantity']!=null ) return e['.planingMarkets.invoiceAveragePrice'] as number * Number(e['.planingMarkets.quantity'])
                  }
                }},
            }
        }
      } />
    </>
  )
}

export default App
