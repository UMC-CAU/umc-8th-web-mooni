import { useEffect } from "react";
import { ResponseMyInfoDto } from "../types/auth";
import { getMyInfo } from "../apis/auth";

const MyPage = () => {

    useEffect( () => {
        const getData = async () => {
            const response:ResponseMyInfoDto = await getMyInfo();
            console.log(response);
        }

        getData();
    }, [])
    return (
        <div>My Page</div>
    )
}

export default MyPage;