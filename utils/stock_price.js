const request=require(`request`)

const stock_price=function(company_name,callback){
    const url=`http://api.marketstack.com/v1/eod?access_key=${process.env.STOCK_API_KEY}&symbols=${company_name}`
    request({url , json:true},(error, { body }={})=>{
        if(error){
            //the first parameter for callback is error and second is info
            callback(`Unable to connect to IEX-stock API!`,undefined)
        }
        else if(body.error){
            callback(`Please type in a valid company stock symbol!`,undefined)
        }
        else{
            callback(body.data[0]);
        }
        }
    )
}

module.exports=stock_price