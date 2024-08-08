const httpStatus = require("http-status");

const {
  CreateNewAdventureInDBService,
  GetAllAdventuresInACityFromDBService,
} = require("./../service/Adventure.Service");

async function CreateNewAdventureController(request, response) {
  try {
    const { id: cityId } = request.query;

    const { name, category, images, duration, pricePerHead } = request.body;

    const result = await CreateNewAdventureInDBService(
      cityId,
      name,
      category,
      images,
      duration,
      pricePerHead
    );

    if (!result.success) {
      throw new Error("CreateNewAdventureInDBService failed to complete task");
    }

    response.status(201).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

/**********************************************************************
 * This function is a controller, which will help to get all adventures in a city
 *
 * @param {Object} request - Request object of http request
 * @param {Object} response - Response object of http request
 *
 * @return None
 ***********************************************************************/
async function GetAllAdventuresInACityController(request, response) {
  try {
    const { cityid: cityId } = request.query;

    const result = await GetAllAdventuresInACityFromDBService(cityId);

    if (result.success) {
      response.status(httpStatus.OK).json({
        success: true,
        data: result.data,
      });
    } else {
      throw new Error(
        `GetAllAdventuresInACityFromDBService didn't get any adventures for cityId : ${cityId}`
      );
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

module.exports = {
  CreateNewAdventureController,
  GetAllAdventuresInACityController,
};
