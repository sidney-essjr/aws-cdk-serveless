import { useLoaderData } from "react-router-dom";
import Spaces from "../../features/spaces/components";
import { Space } from "../../features/spaces/types/types";
import styles from "./styles.module.css";

export default function SpacesPage() {
  const spaces = useLoaderData() as Space[];

  return (
    <section className={styles.container}>
      {spaces.length > 0 ? <Spaces spaces={spaces} /> : <p>No spaces found</p>}
    </section>
  );
}
