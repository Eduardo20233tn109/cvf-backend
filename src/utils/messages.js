const messages = {};


/*=======MENSAJES EN GENERAL==========*/
messages.messageGeneral = (res, statusCode, ok, data, message) => {
  res.status(statusCode).json({
    ok,
    data,
    message,
  });
};

export default messages;
