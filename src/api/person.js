
// 获取人物列表 (支持搜索和分页)
export const getPersons = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`/api/v1/persons?${queryString}`);
  return await response.json();
};

// 创建人物
export const createPerson = async (personData) => {
  const response = await fetch('/api/v1/persons', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personData),
  });
  return await response.json();
};

// 获取人物详情
export const getPersonById = async (id) => {
  const response = await fetch(`/api/v1/persons/${id}`);
  return await response.json();
};

// 更新人物
export const updatePerson = async (id, personData) => {
  const response = await fetch(`/api/v1/persons/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(personData),
  });
  return await response.json();
};

// 删除人物
export const deletePerson = async (id) => {
  const response = await fetch(`/api/v1/persons/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
};

// 获取某人物的所有事件
export const getPersonEvents = async (personId) => {
  const response = await fetch(`/api/v1/persons/${personId}/events`);
  return await response.json();
};

// 为某人物创建事件
export const createPersonEvent = async (personId, eventData) => {
  const response = await fetch(`/api/v1/persons/${personId}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  return await response.json();
};

// 获取某人物的所有关系
export const getPersonRelations = async (personId) => {
  const response = await fetch(`/api/v1/persons/${personId}/relations`);
  return await response.json();
};
