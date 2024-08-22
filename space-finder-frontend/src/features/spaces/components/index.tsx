import { Space } from "../types/types";
import styles from "./styles.module.css";

export default function Spaces({ spaces }: { spaces: Space[] }) {
  return (
    <div className={styles.container}>
      <h2>Spaces</h2>
      <ul>
        {spaces.map((space) => (
          <li key={space.id} className={styles.space}>
            <img src={space.photoUrl} alt={space.name} />
            <h3>{space.name}</h3>
            <p>{space.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
