import type { User } from "#/types/user"
import type { Pagination } from "#/types/response"
import axiosClient from "./axiosClient"

export const searchUser = async (keyword?: string): Promise<Pagination<User[]>> => {
  const res = await axiosClient.get<Pagination<User[]>>('/user/search', { params: { keyword } })
  return res.data  
}