import React from "react";
import { FirestoreError } from "firebase/firestore";
import styles from "../../styles/Home.module.css";

interface IProps{
    error: undefined|FirestoreError,
    loading: undefined|boolean
}
export const StatusComponent: React.FC<IProps> = ({error, loading}) => {
    return (
        <div className={styles.status}>
            {error&& <span>{error.message}</span>}
            {loading&& <span>...</span>}
        </div>
    )
}