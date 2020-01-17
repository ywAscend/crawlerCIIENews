var express = require('express');
var router = express.Router();
const getExcel = require('../common/excelMode') 
const utils =require('../common/utils')

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

module.exports = router;
