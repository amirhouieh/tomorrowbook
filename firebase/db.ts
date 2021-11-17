import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore, orderBy, query,
    serverTimestamp
} from "firebase/firestore";
import { firebaseApp } from "../pages/_app";
import { IReaderDataFromClient, IReaderDataFromServer } from "../types";
import { useEffect, useMemo, useState } from "react";


export type TFireStoreResponse<T> = [data: T|undefined, error: undefined|any];


export const db = () => {
    return getFirestore(firebaseApp)
}

export const getReadersRef = () => {
    return collection(db(), 'readers');
}

export const getReadersQuery = () => {
    return query(
        getReadersRef(),
        orderBy("createdAt", "desc"),
    );
}

export const publishReader = (readerData: IReaderDataFromClient) => {
    const createdAt = serverTimestamp();
    return addDoc(getReadersRef(), {...readerData, createdAt});
}

export function useReaderData<T>(p: string): TFireStoreResponse<T>{
    const [data, setData] = useState<T|undefined>(undefined);
    const [error, setError] = useState<any|undefined>(undefined);

    useEffect(()=>{
        getDoc(doc(db(), p))
            .then(res => setData(res.data() as T))
            .catch(setError);

    }, [p]);

    const arr: TFireStoreResponse<T> = [data, error]
    return useMemo(() => arr, arr);
}


export function useReadersData(): TFireStoreResponse<IReaderDataFromServer[]>{
    const [data, setData] = useState<IReaderDataFromServer[]|undefined>(undefined);
    const [error, setError] = useState<any|undefined>(undefined);

    useEffect(()=>{
        getDocs(getReadersQuery())
            .then(res => {
                return setData(res.docs.map(d => {
                    const data = d.data({
                        serverTimestamps: "previous",
                    }) as IReaderDataFromServer;

                    return {
                        ...data,
                        id: d.id
                    }
                }) as IReaderDataFromServer[])
            })
            .catch(setError);
    }, []);

    const arr: TFireStoreResponse<IReaderDataFromServer[]> = [data, error]
    return useMemo(() => arr, arr);
}