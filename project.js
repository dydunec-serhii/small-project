const postsContainer = document.getElementById('posts');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageText = document.getElementById('page');

const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let posts = [];

const source = document.getElementById('posts-template').innerHTML;
const template = Handlebars.compile(source);

async function loadPosts() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json();
    posts = data.slice(0, 30);
    renderPosts();
  } catch (err) {
    console.error(err);
  }
}

function renderPosts() {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = posts.slice(start, end);
  postsContainer.innerHTML = template(pageItems);
  pageText.textContent = `Page ${currentPage}`;
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPosts();
  }
});
nextBtn.addEventListener('click', () => {
  if (currentPage * ITEMS_PER_PAGE < posts.length) {
    currentPage++;
    renderPosts();
  }
});

loadPosts();

const asyncContainer = document.getElementById('async-posts-container');
const asyncPrevBtn = document.getElementById('async-prev-btn');
const asyncNextBtn = document.getElementById('async-next-btn');
const asyncPageInfo = document.getElementById('async-page-info');

const ASYNC_ITEMS = 5;
let asyncCurrent = 1;
let asyncPosts = [];

const asyncTemplate = Handlebars.compile(
  document.getElementById('async-posts-template').innerHTML
);я

async function loadAsyncPosts() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await res.json();
    asyncPosts = data.slice(0, 30);
    renderAsync();
  } catch (err) {
    console.error(err);
  }
}

function renderAsync() {
  const start = (asyncCurrent - 1) * ASYNC_ITEMS;
  const end = start + ASYNC_ITEMS;
  asyncContainer.innerHTML = asyncTemplate(asyncPosts.slice(start, end));
  asyncPageInfo.textContent = `Page ${asyncCurrent}`;
}

asyncPrevBtn.addEventListener('click', () => {
  if (asyncCurrent > 1) {
    asyncCurrent--;
    renderAsync();
  }
});
asyncNextBtn.addEventListener('click', () => {
  if (asyncCurrent * ASYNC_ITEMS < asyncPosts.length) {
    asyncCurrent++;
    renderAsync();
  }
});

loadAsyncPosts();

const userList = document.getElementById('userList');
const addBtn = document.getElementById('addBtn');
const nameInput = document.getElementById('name');
const searchInput = document.getElementById('searchInput');

let localData = [];

function renderUsers(filter = '') {
  userList.innerHTML = '';

  localData
    .filter(u => u.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(user => {
      const li = document.createElement('li');

      const titleDiv = document.createElement('div');
      titleDiv.textContent = user.title;
      titleDiv.style.fontWeight = 'bold';

      const commentsList = document.createElement('ul');
      commentsList.style.marginTop = '5px';

      user.comments.forEach(comment => {
        const commentLi = document.createElement('li');
        commentLi.textContent = comment;
        commentLi.style.fontSize = '0.9em';
        commentLi.style.color = '#555';
        commentsList.appendChild(commentLi);
      });

      const commentInput = document.createElement('input');
      commentInput.placeholder = 'Додати коментар';
      commentInput.style.marginRight = '5px';

      const commentBtn = document.createElement('button');
      commentBtn.textContent = '+';
      commentBtn.style.padding = '2px 6px';

      commentBtn.onclick = () => {
        const text = commentInput.value.trim();
        if (!text) return;
        user.comments.push(text);
        commentInput.value = '';
        renderUsers(searchInput.value);
      };

      const delBtn = document.createElement('button');
      delBtn.textContent = '-';
      delBtn.classList.add('deleteBtn');
      delBtn.onclick = () => deleteUser(user.id);

      li.appendChild(titleDiv);
      li.appendChild(delBtn);
      li.appendChild(commentsList);
      li.appendChild(commentInput);
      li.appendChild(commentBtn);

      li.style.display = 'flex';
      li.style.flexDirection = 'column';
      li.style.padding = '10px';
      li.style.border = '1px solid #ccc';
      li.style.borderRadius = '6px';
      li.style.marginBottom = '8px';
      li.style.background = '#fff';

      userList.appendChild(li);
    });
}

function addUser() {
  const title = nameInput.value.trim();
  if (!title) return;

  localData.push({
    id: Date.now(),
    title,
    comments: []
  });

  nameInput.value = '';
  renderUsers(searchInput.value);
}

function deleteUser(id) {
  localData = localData.filter(u => u.id !== id);
  renderUsers(searchInput.value);
}

searchInput.addEventListener('input', () => {
  renderUsers(searchInput.value);
});

addBtn.addEventListener('click', addUser);
renderUsers();