var express = require('express');
var router = express.Router();
const getExcel = require('../common/excelMode') 
const utils =require('../common/utils')
//const serverData = require('../server/serverData') 

let firstNewsData = ''
let newsListData =[]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//获取新闻路由
router.get('/getIncomeNews', function(req,res,next){
  
  utils.getFirstOfficialNewsList(req.query.urls).then(response =>{
    firstNewsData = response
    let allPagesUrl = utils.getAllPagesUrl(firstNewsData)
    return utils.getDetailsNewsData(allPagesUrl)
  })
  .then((allPagesData)=>{
    let totalPageNewsData = [firstNewsData,...allPagesData]
    
     newsListData = utils.getDetailsNewsList(totalPageNewsData)
     
     return utils.getDetailsNewsData(newsListData)
  })
  .then((resData)=>{
    let allNewsData = utils.getNewsData(resData,newsListData)
    getExcel(allNewsData)
    res.send(allNewsData)
  })
  .catch(error => {
    res.send(`新闻数据抓取失败-${error}`)
  })



})

router.get('/getotherNews',function(req,res,next){

  utils.getFirstOfficialNewsList(req.query.urls).then(response =>{
    firstNewsData = response
    let allPagesUrl = utils.getAllPagesUrl(firstNewsData)
    return utils.getDetailsNewsData(allPagesUrl)
  })
  .then((allPagesData)=>{
    let totalPageNewsData = [firstNewsData,...allPagesData]
    newsListData = utils.getDetailsNewsList(totalPageNewsData)
    res.send(newsListData)  
     
  }).catch(error => {
    res.send(`新闻数据抓取失败-${error}`)
  })

})

router.get('/getNewsData', async function(req,res,next){
  console.log(req.query)
  let {startPage,endPage} = req.query
  let queryList =  newsListData
  //查询的数据列表
  let dataList = queryList.slice(startPage,endPage)
  
   utils.getDetailsNewsData(dataList)
   .then((resp)=>{
      let allNewsData = utils.getNewsData(resp,dataList)
      getExcel(allNewsData,startPage,endPage)
      res.send(allNewsData)
   })
   .catch(err=>{
    res.send(err)
   })

  

  

})


module.exports = router;
