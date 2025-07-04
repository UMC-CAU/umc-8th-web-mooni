import { PaginationDto } from "../types/common.ts";
import { RequestLpDto, ResponseLpDto, ResponseLpListDto, ResponseLikeLpDto } from "../types/lp.ts";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto:PaginationDto):Promise<ResponseLpListDto> => {
    const{data}=await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    })

    return data;
};

export const getLpDetail = async({lpId}: RequestLpDto): Promise<ResponseLpDto> => {
    const{data} = await axiosInstance.get(`/v1/lps/${lpId}`)

    return data;
}

export const postLike = async ({lpId}: RequestLpDto):Promise<ResponseLikeLpDto> => {
    const {data} = await axiosInstance.post(`/v1/lps/${lpId}/likes`)

    return data;
}

export const deleteLike = async({lpId}: RequestLpDto):Promise<ResponseLikeLpDto> => {
    const {data} = await axiosInstance.delete(`v1/lps/${lpId}/likes`);

    return data;
}