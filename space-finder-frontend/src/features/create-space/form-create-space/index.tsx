import { ChangeEvent, FormEvent, useRef, useState } from "react";
import useAuth from "../../authentication/hooks/useAuth";
import Input from "../../common/input";
import createSpace from "../services/dataService";
import styles from "./styles.module.css";

export interface FormDataProps {
  name: string;
  location: string;
  photo: File;
}

export default function FormCreateSpace({
  getPhoto,
}: {
  getPhoto: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [info, setInfo] = useState<string>("");
  const { userLogin } = useAuth();

  function clearFormFields(formData: FormData) {
    formData.set("name", "");
    formData.set("location", "");
    formData.set("photo", "");
  }

  function extractFormData(formData: FormData) {
    const name = formData.get("name")?.toString() || "";
    const location = formData.get("location")?.toString() || "";
    const photo = formData.get("photo") as File;
    return { name, location, photo } as FormDataProps;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (ref.current) {
      const formData = new FormData(ref.current);
      if (formData.get("photo") && formData.get("name") && formData.get("location")) {
        //send data to backend
        const data = extractFormData(formData);
        createSpace(data, { userCredentials: userLogin?.credentials ?? null });
        clearFormFields(formData);
      } else {
        setInfo("All fields are required");
      }
    }
  }

  return (
    <form className={styles.container} ref={ref} onSubmit={handleSubmit} noValidate>
      <Input id="name" name="name" label="Name" placeholder="name" required={true} />
      <Input
        id="location"
        name="location"
        label="Location"
        placeholder="location"
        required={true}
      />
      <Input
        id="photo"
        type="file"
        name="photo"
        label="Photo"
        required={true}
        onChange={(e) => getPhoto(e)}
      />
      <button type="submit">Send</button>
      <span>{info}</span>
    </form>
  );
}
