const postsContainer = document.getElementById('posts');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageText = document.getElementById('page');

const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let todos = [];
const source = document.getElementById('posts-template').innerHTML;
const template = Handlebars.compile(source);

function renderPage() {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = todos.slice(start, end);

  postsContainer.innerHTML = template(pageItems);
  pageText.textContent = `Page ${currentPage}`;
}

fetch('https://jsonplaceholder.typicode.com/posts')
  .then(res => res.json())
  .then(data => {
    todos = data.slice(0, 30);
    renderPage();
  });

nextBtn.addEventListener('click', () => {
  if (currentPage * ITEMS_PER_PAGE < todos.length) {
    currentPage++;
    renderPage();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
});

const asyncPostsContainer = document.getElementById('async-posts-container');
const asyncPrevBtn = document.getElementById('async-prev-btn');
const asyncNextBtn = document.getElementById('async-next-btn');
const asyncPageInfo = document.getElementById('async-page-info');

const ASYNC_ITEMS_PER_PAGE = 5;
let asyncCurrentPage = 1;
let asyncPosts = [];

const asyncTemplateSource = document.getElementById('async-posts-template').innerHTML;
const asyncTemplate = Handlebars.compile(asyncTemplateSource);

function renderAsyncPage() {
  const start = (asyncCurrentPage - 1) * ASYNC_ITEMS_PER_PAGE;
  const end = start + ASYNC_ITEMS_PER_PAGE;
  const pageItems = asyncPosts.slice(start, end);

  asyncPostsContainer.innerHTML = asyncTemplate(pageItems);
  asyncPageInfo.textContent = `Page ${asyncCurrentPage}`;
}

async function loadAsyncPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    if (!response.ok) {
      throw new Error('Помилка завантаження даних');
    }

    const data = await response.json();
    asyncPosts = data.slice(0, 30);

    renderAsyncPage();
  } catch (error) { console.error(error); }
}

asyncNextBtn.addEventListener('click', () => {
  if (asyncCurrentPage * ASYNC_ITEMS_PER_PAGE < asyncPosts.length) {
    asyncCurrentPage++;
    renderAsyncPage();
  }
});

asyncPrevBtn.addEventListener('click', () => {
  if (asyncCurrentPage > 1) {
    asyncCurrentPage--;
    renderAsyncPage();
  }
});

loadAsyncPosts();

const userList = document.getElementById('userList');
const addBtn = document.getElementById('addBtn');
const nameInput = document.getElementById('name');

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// READ
async function getUsers() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();

    userList.innerHTML = '';

    users.slice(0, 10).forEach(user => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${user.title}
        <button onclick="deleteUser(${user.id})">-</button>
      `;
      userList.appendChild(li);
    });
  } catch (error) {
    console.error(error);
  }
}

// CREATE
async function addUser() {
  const title = nameInput.value.trim();
  if (!title) return;

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        title,
        body: 'Test text',
        userId: 1
      })
    });

    nameInput.value = '';
    getUsers();
  } catch (error) {
    console.error(error);
  }
}

// DELETE
async function deleteUser(id) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    getUsers();
  } catch (error) {
    console.error(error);
  }
}

addBtn.addEventListener('click', addUser);
getUsers();