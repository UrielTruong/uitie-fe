import axiosClient from './axiosClient'
import type { Response } from '#/types/response'

export const followUser = async (id: number): Promise<Response<undefined>> => {
  const res = await axiosClient.post<Response<undefined>>(`/users/${id}/follow`)
  return res.data
}

export const unfollowUser = async (id: number): Promise<Response<undefined>> => {
  const res = await axiosClient.delete<Response<undefined>>(`/users/${id}/follow`)
  return res.data
}
