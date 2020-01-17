 //引入http请求
 const superagent = require('superagent')
 //引入cherro --node版jquery处理dom
 const cheerio = require('cheerio')

//获取官方发布第一条新闻列表
function getFirstOfficialNewsList (url) {
  return new Promise((reslove,reject) =>{
    superagent.get(url).end((err,response) => {
      if(err){
        reject(err)
      }else{
        reslove(response)
      }
    })
  })
}

//获取所有页数地址
function getAllPagesUrl(firstNewsData){
  let $ = cheerio.load(firstNewsData.text)
  let pageList = []
  //总页数
  let totalPageTxt = $("div#downsidebar .loop-pagination div a")[$("div#downsidebar .loop-pagination div a").length-1]
  let totalPage = Number($(totalPageTxt).attr('onclick').match(/index_.+?(\d+)/)[0].replace(/[^0-9]/ig,""))
  for (let i = 2;i<=totalPage;i++){
    let url = {
      originUrl: encodeURI(`https://www.ciie.org/zbh/bqgffb/index_${i}.html`)
    }
    pageList.push(url)
  }
  return pageList
}

//获取所有详细数据
function getDetailsNewsData(detailsNewsList) {
  const promiseList = detailsNewsList.map( item => new Promise((reslove,reject) => {
    superagent.get(item.originUrl).end((err,response) => {
      if(err){
        reject(err)
      }else{
        reslove(response)
      }
    })
  }))
  return Promise.all(promiseList)
}

//获取所有页面详细新闻地址
function getDetailsNewsList(officialNewsList) {
  let _newsUrlList = []
  officialNewsList.forEach((element,index) => {
    let $ = cheerio.load(element.text)
    $('div#downsidebar .listnewsim-left .brief a').each((index,item) => {
      let news = {
        title: $(item).text(),
        abstracts: $(item).parent().siblings('p').text().replace(/[\r\n]/g,"").replace(/^\s*|\s*$/g,""),
        originUrl: `https://www.ciie.org${$(item).attr('href')}`,
        date: $(item).parents('.brief').siblings('span').text().replace(/\./g,'/') 
      }
      _newsUrlList.push(news)
    })
  });

  return _newsUrlList
}

//获取新闻数据
function getNewsData(newsList,newsListData) {
  let _newsListData = []
  newsList.forEach((item,index) => {
    let $ = cheerio.load(item.text)
    //标题
    let news = {
      title: newsListData[index].title,
      abstracts: newsListData[index].abstracts,
      originUrl: newsListData[index].originUrl,
      date: newsListData[index].date,
      author: $('div#downsidebar #ivs_date span').text().split('：')[1],
      fileName: `${newsListData[index].title}.pdf`,
      keyWords: '',
      article: getArticle($('div#downsidebar #ivs_content p'),$)
    }
    _newsListData.push(news)
  })
  return _newsListData
}
//文章详情
function getArticle(data,$){
  let _article = ''
  data.each((index,item) => {
    _article += $(item).text()
  })
  return _article
}


module.exports = {
  getFirstOfficialNewsList,
  getAllPagesUrl,
  getDetailsNewsData,
  getDetailsNewsList,
  getNewsData 
}