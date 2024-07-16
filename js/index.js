document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results');
  
    form.addEventListener('submit', event => {
      event.preventDefault();
      const query = input.value.trim();
      if (query) {
        searchUsers(query);
      }
    });
  
    function searchUsers(query) {
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => console.error('Error fetching users:', error));
    }
  
    function displayUsers(users) {
      resultsContainer.innerHTML = '';
      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user';
        userDiv.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}">
          <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
        `;
        userDiv.addEventListener('click', () => {
          fetchUserRepos(user.login);
        });
        resultsContainer.appendChild(userDiv);
      });
    }
  
    function fetchUserRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
        .then(response => response.json())
        .then(repos => displayRepos(username, repos))
        .catch(error => console.error('Error fetching repos:', error));
    }
  
    function displayRepos(username, repos) {
      const userDiv = Array.from(resultsContainer.children).find(div => div.querySelector(`a[href="https://github.com/${username}"]`));
      const reposContainer = document.createElement('div');
      reposContainer.className = 'repos';
      reposContainer.innerHTML = `<h3>Repositories for ${username}</h3>`;
      repos.forEach(repo => {
        const repoDiv = document.createElement('div');
        repoDiv.className = 'repo';
        repoDiv.innerHTML = `
          <p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>
          <p>${repo.description || 'No description available'}</p>
        `;
        reposContainer.appendChild(repoDiv);
      });
      userDiv.appendChild(reposContainer);
    }
  });