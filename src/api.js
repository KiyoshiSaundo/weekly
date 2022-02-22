import axios from "axios";
import settings from "@/settings";

// затраченное время по задачам по фильтру
export const getTimes = async (filter) => {
  return axios.post(settings.apiUrl + "/task.elapseditem.getlist", {
    order: { ID: "asc" },
    filter: filter,
    select: ["ID", "TASK_ID", "SECONDS"],
    params: {
      NAV_PARAMS: { nPageSize: 0 },
    },
  });
};

// список задач по фильтру
export const getTasks = async (filter) => {
  return axios.post(settings.apiUrl + "/tasks.task.list", {
    order: { ID: "asc" },
    filter: filter,
    select: ["ID", "TITLE", "GROUP_ID", "TIME_ESTIMATE"],
    params: { NAV_PARAMS: { nPageSize: 0 } },
  });
};

// список групп
export const getGroups = async (filter) => {
  return axios.post(settings.apiUrl + "/sonet_group.get", {
    ORDER: { ID: "asc" },
    FILTER: filter,
  });
};
