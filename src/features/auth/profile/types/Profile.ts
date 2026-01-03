export interface ProfilePictureData {
    _id: string;
    userId: string;
    url: string;
    publicId: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetDpResponse {
    message: string;
    picture: ProfilePictureData | null;
}

export interface UploadDpResponse {
    message: string;
    picture: ProfilePictureData;
}

export interface DeleteDpResponse {
    message: string;
}



export interface UserProfileResponse {
  user: {
    name: string;
    email: string;
    id: string;
    picture?: string;
    bio?: string;
  };
}

export interface UserProfileForm {
    name: string;
    email: string;
    bio: string;
}


export interface SecurityUser {
    // Define the properties of SecurityUser as needed
    id: string;
    email: string;
    // Add other properties if required
}

export interface SecurityResponse {
    message: string;
    user: SecurityUser;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
}