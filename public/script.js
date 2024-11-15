let currentPage = 1;

async function loadLeaderboard(page = 1) {
  try {
    const res = await fetch(`/main-leaderboard?page=${page}`);
    const { users, totalPages } = await res.json();

    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear the existing list

    let rank = (page - 1) * 20 + 1; // Calculate the rank based on the page

    users.forEach(user => {
      const item = document.createElement('li');
      item.innerHTML = `
        <div>${rank++}</div>
        <div>${user.name}</div>
        <div>${user.rollNo}</div>
        <div>${user.points.total}</div>
      `;
      leaderboardList.appendChild(item);
    });

    updatePaginationControls(page, totalPages);
  } catch (err) {
    console.error('Error loading leaderboard:', err);
  }
}

function updatePaginationControls(page, totalPages) {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentPageSpan = document.getElementById('current-page');

  currentPageSpan.textContent = `Page ${page}`;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= totalPages;

  prevBtn.onclick = () => {
    if (page > 1) {
      currentPage--;
      loadLeaderboard(currentPage);
    }
  };

  nextBtn.onclick = () => {
    if (page < totalPages) {
      currentPage++;
      loadLeaderboard(currentPage);
    }
  };
}

// Initial load
loadLeaderboard();
