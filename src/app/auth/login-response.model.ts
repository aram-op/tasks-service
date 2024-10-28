export interface LoginResponseModel {
  accessToken: string,
  user: {
    email: string,
    id: string
  }
}
