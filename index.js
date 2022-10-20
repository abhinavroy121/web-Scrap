

const express = require("express");
const cheerio = require("cheerio");
const rp=require('request-promise');
const ObjectsToCsv = require('objects-to-csv')
const PORT = 8000;
 const {Parser} = require('json2csv')
const app = express();


 const url = "https://www.quill.com/hanging-file-folders/cbk/122567.html?sort=p.avg_rating_1"
 
 var arr = []  // array to push all the object data 

  rp(url).then((html)=>{
    const $ = cheerio.load(html)
    const title = $("#skuName > a")
    let price = $('.priceupdate')
    let model = $('.model-number')
    let item_number = $('.iNumber')
    let product_category = $('.current')
    let description = $('.skuBrowseBullets')
   

    for(let i=0;i<10;i++){
      let ob ={}
      let descarr = []
      
      for(let j=0;j<description[i].children.length;j++){
           descarr.push(description[i].children[j].attribs.title)    
      }
    
      // creating seperate object for each product
      ob = {
        Product_Name: title[i].attribs.title,
        Product_Price: price[i].children[0].data,
        Item_Number: item_number[i].children[0].data,
        Model_Number: model[i].children[0].data,
        Product_Category: product_category[0].children[0].data,
        Product_Description: descarr
      }
      arr.push(ob)

    }
    // console.log(arr)

    // csv module to create csv file from the array
    const csv = new ObjectsToCsv(arr)
     csv.toDisk('./top-products.csv',{append:true})
      // csv.toDisk('./list.csv', { append: true })


    //  console.log(title[0].attribs.title)
    //  console.log(price[1].children[0].data)
    //  console.log(model[9].children[0].data)
    //  console.log(item_number[9].children[0].data)
    // console.log(product_category[0].children[0].data)
      //  console.log(description[0].children.length)
     
     

  })
  .catch((error) =>{
    console.error(error)
  })


  app.get('/',((req,res)=>{
    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(arr);
    res.attachment("top-products.csv")
    res.status(200).send(csvData)
}))

  app.listen(PORT,(()=>{
    console.log(`server listening on http://localhost:${PORT}`)
}))









