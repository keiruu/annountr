const responseHandler = (res : any, title : string, message : string, data : any) => {
  res.status(200)
      .json({
          status: 'ok',
          title: title,
          message: message,
          data: data
      })
}


module.exports = responseHandler
