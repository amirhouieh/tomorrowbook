import type { NextPage } from 'next'

import { Reader } from "../../components/reader/reader";
import { useReaderData } from "../../firebase/db";
import { StatusComponent } from "../../components/status";
import { IReaderDataFromClient } from "../../types";
import { useRouter } from "next/router";

const ReaderPage: NextPage = (props) => {
    const router = useRouter()
    const { id } = router.query;

    const [reader, error] = useReaderData<IReaderDataFromClient>(`readers/${id}`);

    return (
        <div>
            <StatusComponent error={error} loading={!reader} />
            {
                reader&&
                <Reader  data={reader} create={false}/>
            }
        </div>
    )
}

export default ReaderPage
