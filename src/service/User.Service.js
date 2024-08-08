const UserModel = require("./../model/User.Model");

async function CreateNewUserInDBService(name, email, encryptedPassword) {
  try {
    const result = await UserModel.create({
      name,
      email,
      password: encryptedPassword,
    });

    if (result) {
      return {
        success: true,
        data: result,
      };
    } else {
      throw new Error(" CreateNewUserInDBService unable to create user");
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}
async function GetUserByEmailFromDBService(email) {
  try {
    const result = await UserModel.find({
      email,
    });

    if (result.length) {
      return {
        success: true,
        data: result[0],
      };
    } else {
      throw new Error("GetUserByEmailFromDBService unable to find a user");
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

async function GetUserByUserIdFromDBService(userId) {
  try {
    const result = await UserModel.findById(userId);

    if (result) {
      return {
        success: true,
        data: result,
      };
    } else {
      throw new Error("GetUserByUserIdFromDBService unable to find a user");
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

module.exports = {
  CreateNewUserInDBService,
  GetUserByEmailFromDBService,
  GetUserByUserIdFromDBService,
};
