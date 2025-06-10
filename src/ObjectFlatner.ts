/* eslint-disable @typescript-eslint/no-explicit-any */
/* 
  If incase some unlucky soul needs help in editing this file feel free not to contact me.
*/
type MakeRequired<T> = {
  [P in keyof T]-?: T[P];
};

export type Options = {
  fixedColumns:boolean,
  linearArray?: { [x: string]: (e: {[s:string]:any}[]) => {[s:string]:string|number} };
  virtual?: {
    [x: string]: (
      e: { [x: string]: string | number | boolean },
      storage: { [x: string]: string | number | boolean },
    ) => string | number | boolean |undefined;
  };
  aliases?: {
    [x: string]: string;
  };
  arrayIDs?: string[];
};

/**
 *
 * @created 2025-05-10 by Istyaq Ahmmed.
 * @modified none
 */
export class ObjectFlatter {
  options: MakeRequired<Options>;
  headers: string[] = [];
  /**
   * Creates and manages CSV data base. Can flatten complex objects/arrays
   * @param path CSV File path
   * @param options Object flatting options
   * @created 2025-05-10 by Istyaq Ahmmed.
   * @modified none
   */
  constructor( options: Options) {
    if (options) this.options = {
        linearArray:options.linearArray??{},
        virtual:options.virtual??{},
        aliases:options.aliases??{},
        arrayIDs:options.arrayIDs??[],
        fixedColumns:false,
    };
    else this.options = { aliases: {}, linearArray: {}, arrayIDs: [],virtual:{},fixedColumns:false };

    if (typeof options.aliases == "object") {
      for (const key in options.aliases) {
        this.addHeaders(options.aliases[key]);
      }
    }
    this.options.fixedColumns=options.fixedColumns
    if (!Array.isArray(this.options.arrayIDs)) this.options.arrayIDs = [];
  }
  /**
   * Recursively Flattens Object
   * @param obj Object to be flatten
   * @param path Path of current object
   * @returns resulting Flattened object
   * @created 2025-05-10 by Istyaq Ahmmed.
   * @modified none
   */

  /**
   * Expands Array
   * @param obj Array
   * @param path path to array
   * @returns Expanded array
   * @created 2025-05-23 by Istyaq Ahmmed.
   * @modified none
   */
  expandArray(obj: { [x: string]: any }[], path: string) {
    const results: { [x: string]: string | number | boolean }[] = [];
    if (typeof this.options.linearArray[path] == "function") {
        results.push(this.options.linearArray[path](obj) as { [x: string]: string | number | boolean; });
    } else
      for (const ele of obj) {
        let first = false;
        this.#expand(ele, path).forEach((e) => {
          if (first) {
            const rootObj:{[x:string]:string | number | boolean} = {};
            for (const [key, value] of Object.entries(obj)) {
              if (typeof value !== "object" && value != null) {
                rootObj[path + "." + key] = value as string | number | boolean;
              }
            }
            first = false;
            results.push({ ...rootObj, ...e });
          } else results.push(e);
        });
      }
    return results;
  }

  /**
   * Private Method for expanding
   * @param obj Object to be expended
   * @param path Path of the obj
   * @returns expended obj
   * @created 2025-05-23 by Istyaq Ahmmed.
   * @modified none
   */
  #expand(obj: { [x: string]: any } | { [x: string]: any }[], path: string) {
    // Don't ask how or why it works, but it does.
    const results: { [x: string]: string | number | boolean }[] = [];
    let rootObj: { [x: string]: string | number | boolean } = {};
    if (typeof obj == "object") {
      if (!Array.isArray(obj)) {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value !== "object" && value != null) {
            rootObj[path + "." + key] = value as string | number | boolean;
          }
        }

        results.push(rootObj);
        for (const [key, value] of Object.entries(obj)) {
          if (value === null) continue;
          else if (typeof value !== "object") {
            rootObj[path + "." + key] = value as string | number | boolean;
          } else if (Array.isArray(value)) {
            let first = true;
            this.expandArray(value, path + "." + key).forEach((e) => {
              if (first) {
                // const t = { ...rootObj };
                first = false;
                for (const [key2, value] of Object.entries(e)) {
                  if (typeof value !== "object" && value != null) {
                    rootObj[key2] = value as string | number | boolean;
                  }
                }
                // rootObj = t;
              } else {
                results.push(e);
              }
            });
          } else {
            let first = true;
            this.#expand(value, path + "." + key).forEach((e) => {
              if (first) {
                const t = { ...rootObj };
                for (const [key, value] of Object.entries(e)) {
                  first = false;
                  if (typeof value !== "object" && value != null) {
                    rootObj[key] = value as string | number | boolean;
                  }
                }
                rootObj = t;
              } else {
                results.push(e);
              }
            });
          }
        }
      } else {
        let first = true;
        this.expandArray(obj, path).forEach((e) => {
          if (first) {
            const t = { ...rootObj };
            first = false;
            for (const [key, value] of Object.entries(e)) {
              if (typeof value !== "object" && value != null) {
                rootObj[key] = value as string | number | boolean;
              }
            }
            rootObj = t;
          } else {
            results.push(e);
          }
        });
      }
    }

    return results;
  }

  /**
   * Recursively Flattens Array or Complex obj
   * @param obj Array or Obj to be flattened
   * @returns Flattened array or object
   * @created 2025-05-23 by Istyaq Ahmmed.
   * @modified none
   */
  expand(obj: { [x: string]: any }) {
    let results: any[] = [];
    const idStorage: { [x: string]: string | number | boolean } = {};
    if (this.options.arrayIDs.length > 0)
      results = this.#expand(obj, "").map((e) => {
        for (const id of this.options.arrayIDs) {
          if (e[id] != null) idStorage[id] = e[id];
          e[id] = idStorage[id];
        }
        return e;
      });
    else results = this.#expand(obj, "");

    const virtualStorage = {};
    if (Object.entries(this.options.virtual).length > 0) {
      results.forEach((e) => {
        for (const key in this.options.virtual) {
          const val = this.options.virtual[key](e, virtualStorage);
          if (val != null) {
            e[key] = val;
          }
        }
      });
    }
    return results;
  }
  /**
   *  Expands and Writes into CSV file
   * @param obj Complex Object
   * @returns none
   * @created 2025-05-10 by Istyaq Ahmmed.
   * @modified none
   */
    flatten(obj: unknown) {
    let expended: { [x: string]: string | number | boolean }[] = [];
    if (Array.isArray(obj)) {
      for (const o of obj) {
        this.expand(o).forEach((e) => expended.push(e));
      }
    } else {
      expended = this.expand(obj as { [x: string]: any });
    }
    for (const row of expended) {
      for (const [key, value] of Object.entries(row)) {
        if (this.options.aliases[key]) {
          delete row[key];
          row[this.options.aliases[key]] = value;
           this.addHeaders(this.options.aliases[key]);
        } else {
            this.addHeaders(key);
        }
      }
    }
    return expended;
  }
  
  /**
   * Add Headers In csv File if the header is new
   * @param header File headers
   * @created 2025-05-10 by Istyaq Ahmmed.
   * @modified none
   */
   addHeaders(header: string) {
       if(this.options.fixedColumns || header=='delete') {
           return false
    }
    if ( !this.headers.includes(header)) {
      this.headers.push(header);
      return true;
    }
    return false;
  }
  /**
   * dsdk
   * @returns none
   * @created 2025-05-10 by Istyaq Ahmmed.
   * @modified none
   */
  makeHeaderStr() {
    return this.headers.join(",");
  }
}
/*
import { example } from "./example Zara";
const db = new CSV_DataBase("./fileZara.csv", {
  linearArray: {
    // ".planningMarket.composition": (
    //   e: {
    //     ".tag": string;
    //     ".quantity": number;
    //   }[],
    // ) => {
    //   console.log(e);
    //   const obj = {};
    //   for (const ele of e) {
    //     obj[ele["tag"]] = ele["description:"];
    //   }
    //   return obj;
    // },
    ".planningMarket.composition": (
      e: {
        ".tag": string;
        ".quantity": number;
      }[],
    ) => {
      return {};
    },
    ".planningMarket.pvp": (
      e: {
        currency: string;
        value: number;
      }[],
    ) => {
      const obj = {};
      for (const ele of e) {
        const key = ele.currency;
        let it = 2;
        while (true) {
          if (obj[key] == null) {
            obj[key] = ele.value;
            break;
          } else if (obj[key + " " + it] == null) {
            obj[key + " " + it] = ele.value;
            break;
          } else {
            it++;
          }
        }
      }
      // console.log(obj);
      return obj;
    },
  },
  arrayIDs: [".orderNo"],

  aliases: {
    ".purchaser": "Purchaser",
    ".purchaserAddress": "Purchaser Address",
    ".shippedFrom": "Shipped From",
    ".orderNo": "Order NO",
    ".dateOfOrder": "Date Of Order",
    ".supplier": "Supplier",
    ".supplierReference": "Supplier Reference",
    ".season": "Season",
    ".buyer": "Buyer",
    ".paymentTerms": "Payment Terms",
    ".description": "Description",
    ".marketOfOrigin": "Market Of Origin",
    ".rfid": "RFID",
    ".planningMarket.deliveryType": "Delivery Type",
    ".planningMarket.logisticsOrder": "Logistics Order",
    ".planningMarket.partialDeliveryOrder": "Delivery Order",
    ".planningMarket.incoterm": "Incoterm",
    ".planningMarket.shippedFrom": "Delivery From",
    ".planningMarket.timeOfDelivery": "Time of Delivery",
    ".planningMarket.transportMode": "Transport By",
    ".planningMarket.presentationType": "Presentation Type",
    ".planningMarket.quantity": "Quantity In Packs",
    ".planningMarket.currency": "Currency",
    ".planningMarket.costPerUnit": "Cost Per Unit",
    ".planningMarket.compositionStr": "Composition Str",
    ".planningMarket.compositionDescription": "Composition Description",
    EUR: "EUR",

    ".planningMarket.assortments.articleNo": "Article No",
    ".planningMarket.assortments.colour": "Colour",
    ".planningMarket.assortments.sizes.total.tag": "Size",
    ".planningMarket.assortments.sizes.total.quantity": "Quantity Per Size",
  },
  virtual: {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    quantityInPCS: (e: {}, storage: {}) => {
      if (e[".numberOfPieces"] != null) {
        storage[".numberOfPieces"] = e[".numberOfPieces"];
      }
      if (e[".planingMarkets.quantity"] != null)
        return (
          storage[".numberOfPieces"] * Number(e[".planingMarkets.quantity"])
        );
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    invoiceTotalValue: (e: {}, storage: {}) => {
      if (
        e[".planingMarkets.invoiceAveragePrice"] != null &&
        e[".planingMarkets.quantity"] != null
      )
        return (
          e[".planingMarkets.invoiceAveragePrice"] *
          Number(e[".planingMarkets.quantity"])
        );
    },
  },
});
*/
/*
// // HnM;
import { example } from "./example HnM";
const db = new CSV_DataBase("./fileHnM.csv", {
  linearArray: {
    // ".PM.assortments.sizes.total": (
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
  arrayIDs: [".ON", ".PM.PMA", ".PM.PMB"],
  aliases: {
    ".ON": "Order NO",
    ".DO": "Date Of Order",
    ".PT": "PT Prod No",
    ".CCG": "Customs Customer Group",
    ".ToP": "Type of Construction",
    ".DEV": "Development",
    ".PNU": "Product No",
    ".PN": "Product Name",
    ".PRD": "Product Description",
    ".SN": "Season",
    ".NoP": "No of Pieces",
    ".PM.PMA": "Planning Market A",
    ".PM.PMB": "Planning Market B",
    ".PM.TD": "Time of Delivery",
    ".PM.ToD": "Terms of Delivery",
    ".PM.QUN": "Quantity In Packs",
    quantityInPCS: "Quantity in PCS",
    ".PM.IAP": "Invoice Average Price",
    ".PM.CUR": "Currency",
    invoiceTotalValue: "Value",
    ".PM.TB": "Transport By",
    ".PM.assortments.articleNo": "Article No",
    ".OpN": "Option No",
    ".PM.assortments.colourCode": "Color Code",
    ".PM.assortments.graphicalAppearance": "Graphical Appearance",
    ".PM.assortments.description": "Article Description",
    ".PM.assortments.PT_Article_Number": "PT Article No",
    ".PM.assortments.optionNo": "Option No",
    ".PM.assortments.sizes.total.tag": "Size",
    ".PM.assortments.sizes.total.quantity": "Quantity Per Size",
  },
  virtual: {
    quantityInPCS: (e: {}, storage: {}) => {
      if (e[".NoP"] != null) {
        storage[".NoP"] = Number(e[".NoP"]);
      }
      if (e[".PM.QUN"] != null) return storage[".NoP"] * Number(e[".PM.QUN"]);
    },
    invoiceTotalValue: (e: {}, storage: {}) => {
      if (e[".PM.IAP"] != null && e[".PM.QUN"] != null)
        return e[".PM.IAP"] * Number(e[".PM.QUN"]);
    },
  },
});
// */
// const expand = db.write(example);
// expand
//   .then((e) => {
//     // console.log(e);
//     console.log(e.length);
//   })
//   .catch((e) => console.log(e));
