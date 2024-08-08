const httpStatus = require("http-status");
const fs = require("fs");

async function RequestPathAndMethodLoggerMiddleware(request, response, next) {
  try {
    const { method, path } = request;

    const log = `Timestamp : ${new Date()} - ${path} - ${method}\n`;

    fs.appendFileSync("request.log.txt", log, "utf8");

    next();
  } catch (err) {
    console.log(err);
    response
      .status(err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: err.status ? err.message : "Something went to wrong",
      });
  }
}

module.exports = {
  RequestPathAndMethodLoggerMiddleware,
};
