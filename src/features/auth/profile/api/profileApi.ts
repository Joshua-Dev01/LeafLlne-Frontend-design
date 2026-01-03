// import { apiGet, apiPut, apiPost } from "../../../../services/apiCall";
// import type { UserProfile, UploadDpResponse } from "../types/Profile";

import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from "../../../../services/apiCall";
import { handleResponse } from "../../../../utils/handleErrors";
import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  DeleteDpResponse,
  GetDpResponse,
  UploadDpResponse,
  UserProfileResponse,
  UserProfileForm,
} from "../types/Profile";

// fetch user profile
export const getUserProfile = async (): Promise<UserProfileResponse> => {
  return await apiGet<UserProfileResponse>("/auth/profile");
};
//   update user profile
// update user profile - accept the form shape (name, email, bio)
export const updateUserProfile = async (data: Partial<UserProfileForm>) => {
  return await apiPut("/auth/update-profile", data);
};

// upload display picture (DP)
export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await apiPost<UploadDpResponse, FormData>(
      "/upload/upload-dp",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  } catch (error) {
    return handleResponse({ error });
  }
};

// ✅ Get DP
export const getProfilePicture = async () => {
  return await apiGet<GetDpResponse>("/upload/dp");
};

// ✅ Delete DP
export const deleteProfilePicture = async () => {
  return await apiDelete<DeleteDpResponse>("/upload/delete-dp");
};

export const changePassword = async (data: ChangePasswordPayload) => {
  return await apiPost<ChangePasswordResponse, ChangePasswordPayload>(
    "/auth/change-password",
    data
  );
};
