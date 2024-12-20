import React, { Component } from "react";
import Todo from "./components/todo/Todo";
import styles from "./app.module.scss";

const todoArr = [
  {
    id: 1,
    name: "Срочно: One",
    description: "First task",
    completed: false,
    importance: "High",
  },
  {
    id: 2,
    name: "Не срочно: Two",
    description: "Second task",
    completed: false,
    importance: "Low",
  },
  {
    id: 3,
    name: "Средняя срочность: Three",
    description: "Third task",
    completed: false,
    importance: "Medium",
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      searchTerm: "",
      importanceFilter: [],
      hideCompleted: false,
      importance: "Low",
      todos: todoArr,
    };
  }

  handleAddTodo = () => {
    const { name, description, importance, todos } = this.state;
    if (name.trim() !== "") {
      const todo = {
        name: name.trim(),
        description: description.trim(),
        completed: false,
        id: new Date().getTime(),
        date: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
        importance,
      };
      this.setState({
        todos: [...todos, todo],
        name: "",
        description: "",
        importance: "Low",
      });
    }
  };

  handleGenerateTodos = () => {
    const choiceImportant = ["Low", "Medium", "High"];
    this.setState((prevState) => ({
      todos: [
        ...prevState.todos,
        ...Array(1000)
          .fill(0)
          .map((_, index) => ({
            name: "Пример: " + index,
            description: " ",
            completed: false,
            id: new Date().getTime() + index,
            date:
              new Date().toDateString() + " " + new Date().toLocaleTimeString(),
            importance: choiceImportant[(index + 3) % 3],
          })),
      ],
    }));
  };

  handleDeleteTodo = (id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter((todo) => todo.id !== id),
    }));
  };

  handleDeleteAllTodos = () => {
    this.setState({ todos: [] });
  };

  handleSetCompleted = (newCompleted, id) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: newCompleted } : todo
      ),
    }));
  };

  handleImportanceFilterChange = (importance) => {
    this.setState((prevState) => {
      const filter = prevState.importanceFilter.includes(importance)
        ? prevState.importanceFilter.filter((i) => i !== importance)
        : [...prevState.importanceFilter, importance];
      return { importanceFilter: filter };
    });
  };

  toggleHideCompleted = () => {
    this.setState((prevState) => ({ hideCompleted: !prevState.hideCompleted }));
  };

  render() {
    const {
      name,
      description,
      searchTerm,
      importanceFilter,
      hideCompleted,
      importance,
      todos,
    } = this.state;

    const filteredTodos = todos.filter((todo) => {
      const matchesSearch =
        todo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesImportance =
        importanceFilter.length === 0 ||
        importanceFilter.includes(todo.importance);
      const matchesCompletion = !hideCompleted || !todo.completed;
      return matchesSearch && matchesImportance && matchesCompletion;
    });

    const sortedTodos = filteredTodos.sort((a, b) => {
      if (a.completed === b.completed) {
        const importanceOrder = { High: 3, Medium: 2, Low: 1 };
        return importanceOrder[b.importance] - importanceOrder[a.importance];
      }
      return a.completed ? 1 : -1;
    });

    const totalTasks = todos.length;
    const remainingTasks = todos.filter((todo) => !todo.completed).length;
    return (
      <div>
        <div className={styles.bg}></div>
        <div className={styles.wrapper}>
          <h1>Todo List</h1>
          <div className={styles.buttonContainer}>
            <button onClick={this.handleGenerateTodos}>
              Сгенерировать 1000
            </button>
            <button onClick={this.toggleHideCompleted}>
              {hideCompleted ? "Показать выполненные" : "Скрыть выполненные"}
            </button>
            <button onClick={this.handleDeleteAllTodos}>Удалить все</button>
          </div>
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => this.setState({ searchTerm: e.target.value })}
          />
          <div className={styles.importanceFilter}>
            {["Low", "Medium", "High"].map((imp) => (
              <label key={imp}>
                <input
                  type="checkbox"
                  onChange={() => this.handleImportanceFilterChange(imp)}
                />
                <p>
                  {imp === "Low"
                    ? "Низкая важность"
                    : imp === "Medium"
                    ? "Средняя важность"
                    : "Высокая важность"}
                </p>
              </label>
            ))}
          </div>
          <div className={styles.wrapperAddTodo}>
            <input
              className={styles.wrapperAddTodoInput}
              value={name}
              onChange={(e) => this.setState({ name: e.target.value })}
              placeholder="Введите задачу"
              required
            />
            <input
              className={styles.wrapperAddTodoInput}
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
              placeholder="Введите описание (необязательно)"
            />
            <div className={styles.importanceContainer}>
              <select
                className={styles.importanceSelect}
                value={importance}
                onChange={(e) => this.setState({ importance: e.target.value })}
              >
                <option value="Low">Низкая важность</option>
                <option value="Medium">Средняя важность</option>
                <option value="High">Высокая важность</option>
              </select>
              <button
                className={styles.wrapperButton}
                onClick={this.handleAddTodo}
              >
                Добавить
              </button>
            </div>
          </div>
          <div className={styles.stats}>
            <p>Всего задач: {totalTasks}</p>
            <p>Невыполненные задачи: {remainingTasks}</p>
          </div>
          <div className={styles.todos}>
            {sortedTodos.length > 0 ? (
              sortedTodos.map((todo) => (
                <Todo
                  key={todo.id}
                  todo={todo}
                  onCompleted={this.handleSetCompleted}
                  onDelete={this.handleDeleteTodo}
                />
              ))
            ) : (
              <p>Нет задач, соответствующих вашему запросу.</p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
