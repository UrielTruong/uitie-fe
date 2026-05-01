import { getUser } from "#/lib/auth"
import { useQuery } from "@tanstack/react-query"
import { searchUser } from "./userApi"

export const useSearchUser = (keyword?: string) => {
  return useQuery({
    queryKey: ['user', 'search', keyword],
    queryFn: () => searchUser(keyword),
  })
}