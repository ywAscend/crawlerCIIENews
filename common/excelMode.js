const xlsx = require('node-xlsx')
const  fs = require('fs') 

 function getExcel (param,start,end) {
  let dataList = [] //要生成的数组容器
  //let columnList = ['title','author','keyWords','date','abstracts','article','fileName','origin']
  let columnList = ['题名','作者','关键字','日期','摘要','文章','文件名','来源']
  dataList.push(columnList) //添加列
  param.forEach(item => {
    let rowList = []  
    rowList.push(item.title)
    rowList.push(item.author)
    rowList.push(item.keyWords)
    rowList.push(item.date)
    rowList.push(item.abstracts)
    rowList.push(item.article)
    rowList.push(item.fileName)
    rowList.push(item.originUrl)
    dataList.push(rowList) //添加行
  })
  writeXls(dataList,start,end)
}

function writeXls(datas,start,end){
  let buffer = xlsx.build([
    {
      name:'sheet1',
      data:datas
    }
  ])
  fs.writeFileSync(`./展会动态${start}-${end}.xlsx`,buffer,{'flag':'w'}) //生成excel
}

module.exports = getExcel