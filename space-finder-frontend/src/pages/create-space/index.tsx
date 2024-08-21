import { ChangeEvent, useState } from "react";
import FormCreateSpace from "../../features/create-space/form-create-space";
import styles from "./styles.module.css";

export default function CreateSpacePage() {
    const [photoUrl, setPhotoUrl] = useState<string>("");

    function getPhoto(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0])
            setPhotoUrl(URL.createObjectURL(event.target.files[0]));
    }

    function handleShowPhoto() {
        if (!photoUrl) {
            return <p>Photo preview</p>;
        }
        return <img src={photoUrl} alt="Photo of the place visited" />;
    }

    return (
        <section className={styles.container}>
            <h1>Create your visited space</h1>
            <FormCreateSpace getPhoto={getPhoto} />
            <div>{handleShowPhoto()}</div>
        </section>
    );
}
