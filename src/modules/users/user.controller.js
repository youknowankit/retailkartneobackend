import successResponse from "#shared/utils/apiResponse.util.js";
import asyncHandler from "#middleware/async.middleware.js";
import {
  allUserService,
  getUserByIdService,
  updateUserService,
} from "./user.service.js";

//GET ALL USERS | ADMIN ONLY
export const allUser = asyncHandler(async (_, res) => {
  const data = await allUserService();

  successResponse(res, "All users fetched successfully", data, 200);
});

//GET USER BY ID
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const data = await getUserByIdService({ userId });

  successResponse(res, "User fetched successfully", data, 200);
});

//UPDATE USER
export const updateUser = asyncHandler(async (req, res) => {
  const userIdToUpdate = req.params.id;

  //This will come from isAuthenticated middleware which we will put in the route
  const loggedUser = req.user;
  const { firstName, lastName, address, city, zipCode, phoneNo, role } =
    req.body;
  const file = req.file;

  const data = await updateUserService({
    userIdToUpdate,
    loggedUser,
    userDetails: {
      firstName,
      lastName,
      address,
      city,
      zipCode,
      phoneNo,
      role,
    },
    file,
  });

  successResponse(res, "Profile Updated Successfully", data, 200);
});
