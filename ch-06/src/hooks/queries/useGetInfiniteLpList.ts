import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

enum PAGINATION_ORDER {
    "asc"="asc",
    "desc"="desc",
}

function useGetInfiniteLpList(limit:number, search:string, order:PAGINATION_ORDER){
    return useInfiniteQuery({
        queryFn:({pageParam}) => 
            getLpList({cursor:pageParam, limit, search, order}),
            queryKey:[QUERY_KEY.lps,search,order],
            initialPageParam: 0,
            getNextPageParam: (lastPage) => {
            //console.log(lastPage, allPages)
            return lastPage.data.hasNext?lastPage.data.nextCursor:undefined;
        }

    })
}

export default useGetInfiniteLpList;