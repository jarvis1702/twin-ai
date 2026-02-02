// Person API
export async function getPersons() {
  const response = await fetch(`${API_BASE_URL}/persons/`);
  if (!response.ok) throw new Error('Failed to fetch persons');
  return response.json();
}

export async function addPerson(person) {
  const response = await fetch(`${API_BASE_URL}/persons/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(person),
  });
  if (!response.ok) throw new Error('Failed to add person');
  return response.json();
}

export async function updatePerson(id, updates) {
  const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update person');
  return response.json();
}

export async function deletePerson(id) {
  const response = await fetch(`${API_BASE_URL}/persons/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete person');
  return response.json();
}
const API_BASE_URL = 'http://localhost:8000';

export async function chatWithAI({ message, type, personId }) {
  let endpoint = `${API_BASE_URL}/chat/general`;

  // Construct URL with query parameter
  const url = new URL(endpoint);

  if (type === 'person' && personId) {
    endpoint = `${API_BASE_URL}/chat/person/${personId}`;
    url.href = endpoint;
  }

  url.searchParams.append('query', message);

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.response;
}
