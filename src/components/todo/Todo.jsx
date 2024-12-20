import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import styles from "./Todo.module.scss";

export default function Todo(props) {
  const handleCheck = (e) => {
    const checked = e.target.checked;
    props.onCompleted(checked, props.todo.id);
  };

  const removeTodo = () => {
    props.onDelete(props.todo.id);
  };

  return (
    <label className={styles.todo}>
      <input
        className={styles.optionInput}
        type="checkbox"
        checked={props.todo.completed}
        onChange={handleCheck}
      />
      <div
        className={`${styles.todo_item} ${
          styles[props.todo.importance.toLowerCase()]
        }`}
      >
        <span>
          {props.todo.name} - {props.todo.description}
          <span> [{props.todo.importance}]</span>
          <span>{props.todo.date}</span>
        </span>
        <button className={styles.todo_deleteBtn} onClick={removeTodo}>
          <AiOutlineClose className={styles.todo_deleteIcon} />
        </button>
      </div>
    </label>
  );
}
