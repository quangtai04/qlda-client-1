import API from '../../utils/api';

const URL_PREFIX = '/api/task';

export const taskService = {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  analysis,
  getTaskUser,
  getAllTaskUser,
};

function addTask(data: any) {
  return API.post(`${URL_PREFIX}/addTask`, data);
}
function getTasks(projectId: string) {
  return API.get(`${URL_PREFIX}/getTasks?projectId=${projectId}`);
}
function updateTask(data: {
  taskId: string;
  projectId: string;
  dependencies: string;
  assignment: Array<string>;
  name: string;
}) {
  return API.post(`${URL_PREFIX}/updateTask`, data);
}
function deleteTask(data: { projectId: string; taskId: string }) {
  return API.post(`${URL_PREFIX}/deleteTask`, data);
}
function analysis(projectId: any) {
  return API.post(`${URL_PREFIX}/analysis`, projectId);
}
function getTaskUser({ projectId, memberId }) {
  return API.post(`${URL_PREFIX}/getTaskUser`, { projectId, memberId });
}
function getAllTaskUser() {
  return API.post(`${URL_PREFIX}/getAllTaskUser`);
}
