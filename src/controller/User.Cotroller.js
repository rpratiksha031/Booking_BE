const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  CreateNewUserInDBService,
  GetUserByEmailFromDBService,
} = require("./../service/User.Service");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

async function CreateNewUserController(request, response) {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      response.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Email, Name & Password is required",
      });
      return;
    }

    const SALT = bcrypt.genSaltSync(10);

    const encryptedPassword = bcrypt.hashSync(password, SALT);

    const result = await CreateNewUserInDBService(
      name,
      email,
      encryptedPassword
    );

    if (result.success) {
      response.status(httpStatus.CREATED).json({
        success: true,
        message: "User registered successfully",
      });
    } else {
      throw new Error("CreateNewUserController unable to create a new user");
    }
  } catch (error) {
    console.log(error);
    response.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

async function SigninUserController(request, response) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      const err = new Error("Email & Password are required");
      err.status = httpStatus.BAD_REQUEST;
      throw err;
    }

    // Step 1 : We have to verify the username and password
    const UserResult = await GetUserByEmailFromDBService(email);

    if (!UserResult.success) {
      const err = new Error("Invalid Email or Password");
      err.status = httpStatus.BAD_REQUEST;
      throw err;
    }

    const { password: encryptedPassword, _id: userId } = UserResult.data;

    // Password check
    const PasswordCompareResult = bcrypt.compareSync(
      password,
      encryptedPassword
    );

    if (!PasswordCompareResult) {
      const err = new Error("Invalid Email or Password");
      err.status = httpStatus.BAD_REQUEST;
      throw err;
    }

    // Step 2 : We will generate the token and will send back to
    //          the client

    const PAYLOAD = {
      userid: userId,
    };

    const token = jwt.sign(PAYLOAD, JWT_SECRET_KEY, { expiresIn: "1h" });

    response.status(httpStatus.CREATED).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    response
      .status(error.status ? error.status : httpStatus.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: error.status ? error.message : "Something went wrong",
      });
  }
}

module.exports = {
  CreateNewUserController,
  SigninUserController,
};
