import { ComponentPropsWithRef, HTMLInputTypeAttribute, memo} from "react";
import styles from "./styles.module.css";

interface InputProps extends Omit<ComponentPropsWithRef<"input">, "required" | "type" | "id"> {
    readonly id: string;
    readonly label: string;
    readonly error?: string;
    readonly type?: HTMLInputTypeAttribute;
    readonly required?: boolean;
}

export default memo(function Input({
    id,
    label,
    error,
    type = "text",
    required = false,
    ...rest
}: InputProps) {
    return (
        <div className={styles.container}>
            <div className={styles["label-error"]}>
                <label htmlFor={id}>{label}</label>
                <span>{error}</span>
            </div>
            <input
                id={id}
                type={type}
                {...rest}
                aria-labelledby={id}
                aria-required={required}
                required={required}
                aria-invalid={!!error}
            />
        </div>
    );
})
