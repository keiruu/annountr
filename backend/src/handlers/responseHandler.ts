const responseHandler = (res : any, statusCode : number, title : string, message : string, data : any) => {
  return res.status(statusCode)
      .json({
          status: 'ok',
          title: title,
          message: message,
          data: data
      })
}


module.exports = responseHandler
