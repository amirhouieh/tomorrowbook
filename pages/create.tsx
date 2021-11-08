import type { NextPage } from 'next'

import { Reader } from "../components/reader/reader";
import { useState } from "react";
import { InputForm } from "../components/input-form";
import { IReaderComponentInput } from "../types";

const CreateReader: NextPage = () => {
    const [readerInput, setReaderInput] = useState<IReaderComponentInput|null>(null);

    return (
        <div className={"reader-page-create"}>
            {
                readerInput?
                    <Reader {...readerInput} />
                    :
                    <InputForm onSubmit={setReaderInput} />
            }
        </div>
    )
}

export default CreateReader
