import bcrypt from "bcryptjs";
import { User } from "../users/user.model.js";
import CustomError from "#shared/errors/CustomError.util.js";
import jwt from "jsonwebtoken";
import { verifyEmail } from "#shared/services/verifyEmail.js";
import { Session } from "../auth/session.model.js";
import { sendOTPMail } from "#shared/services/sendOTPMail.js";
import cloudinary from "#config/cloudinary.config.js";

export const allUserService = async () => {
  const users = await User.find();
  return users;
};

export const getUserByIdService = async ({ userId }) => {
  const user = await User.findById(userId).select(
    "-password -otp -otpExpiry -token",
  ); //removes what not to show

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return user;
};

export const updateUserService = async ({
  userIdToUpdate,
  loggedUser,
  userDetails,
  file,
}) => {
  const { firstName, lastName, address, city, zipCode, phoneNo, role } =
    userDetails;

  //What if some another authenticated user tries to update another users profile?
  //This ensures either user or admin updates the profile
  if (
    loggedUser._id.toString() !== userIdToUpdate &&
    loggedUser.role !== "admin"
  ) {
    throw new CustomError("You are not allowed to update this profile", 403);
  }

  //find the user in DB to update
  let user = await User.findById(userIdToUpdate);
  //check for found user
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  let profilePicUrl = user.profilePic;
  let profilePicPublicId = user.profilePicPublicId;

  if (!file) {
    console.log("no file uploaded");
  }

  //If a new file is uploaded
  if (file) {
    if (profilePicPublicId) {
      await cloudinary.uploader.destroy(profilePicPublicId);
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "retailkartneo/profilepics" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    // console.log(uploadResult, uploadResult.secure_url);

    profilePicUrl = uploadResult.secure_url;
    profilePicPublicId = uploadResult.public_id;
  }

  //update fields
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.address = address || user.address;
  user.city = city || user.city;
  user.zipCode = zipCode || user.zipCode;
  user.phoneNo = phoneNo || user.phoneNo;
  user.role = role;
  user.profilePic = profilePicUrl;
  user.profilePicPublicId = profilePicPublicId;

  const updatedUser = await user.save();

  return updatedUser;
};
