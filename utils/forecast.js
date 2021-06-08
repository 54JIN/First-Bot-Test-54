const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${latitude},${longitude}&units=f`
    
    request({url, json: true}, (error, {body}) => {
        if(error){
            callback('Unable to connect to weather service!',undefined)
        }
        else if(body.error){
            callback('Unable to find location',undefined)
        }
        else{
            callback(undefined, `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feels like ${body.current.feelslike} degrees out.`
                //{
                // weather_description: response.body.current.weather_descriptions[0],
                // current_temperature: response.body.current.temperature,
                // feelslike: response.body.current.feelslike  
            //}
            )
        }
    })
}

module.exports = forecast