
const axios = require("axios");
const cheerio = require("cheerio");
const rp=require('request-promise');
const ObjectsToCsv = require('objects-to-csv')
const PORT = 3000;


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
        Product_Name: title[0].attribs.title,
        Product_Price: price[0].children[0].data,
        Item_Number: item_number[0].children[0].data,
        Model_Number: model[0].children[0].data,
        Product_Category: product_category[0].children[0].data,
        Product_Description: descarr
      }
      arr.push(ob)
     
      // console.log(descarr)
    }
    console.log(arr)

    // csv module to create csv file from the array
    const csv = new ObjectsToCsv(arr)
     csv.toDisk('./top-products.csv')
      csv.toDisk('./list.csv', { append: true })


    //  console.log(title[0].attribs.title)
    //  console.log(price[0].children[0].data)
    //  console.log(model[0].children[0].data)
    //  console.log(item_number[0].children[0].data)
    // console.log(product_category[0].children[0].data)
      //  console.log(description[0].children.length)
     
     

  })
  .catch((error) =>{
    console.error(error)
  })












