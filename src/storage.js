import localforage from "localforage";

const taskStorage = localforage.createInstance({
  name: "tasksDB",
  storeName: "tasks"
});

export const saveTasks = async (tasks) => {
  await taskStorage.setItem("tasks", tasks);
};

export const loadTasks = async () => {
  const tasks = await taskStorage.getItem("tasks");
  return tasks || [];
};
