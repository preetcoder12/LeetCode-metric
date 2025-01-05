document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search_btn');
    const userNameInput = document.getElementById('user_input');
    const statsContainer = document.querySelector('.stats_container');
    const cardsStatsContainer = document.querySelector('.stat_card');
    const easyProgressCircle = document.querySelector('.easy_progress');
    const mediumProgressCircle = document.querySelector('.medium_progress');
    const hardProgressCircle = document.querySelector('.hard_progress');
    const easyLabel = document.querySelector('.easy_label');
    const mediumLabel = document.querySelector('.medium_label');
    const hardLabel = document.querySelector('.hard_label');

    function validUsername(username) {
        if (username.trim().length === 0) {
            alert("Enter a valid username");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]+$/;
        if (!regex.test(username)) {
            alert("Enter a valid username");
            return false;
        }
        return true;
    }

    async function fetchUserDetails(username) {
        const URL = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try {
            searchButton.textContent = "Searching";
            searchButton.disabled = true;
            const response = await fetch(URL);
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            const data = await response.json();
            console.log("User data:", data);
            displayUserData(data);
        } catch (error) {
            statsContainer.innerHTML = `<p>${error}</p>`;
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle, difficulty) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        // Update the label to include both the difficulty and the progress
        label.textContent = `${difficulty} ${solved}/${total}`;
    }

    function displayUserData(data) {
        const totalEasyQues = data.totalEasy;
        const totalMediumQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;

        updateProgress(easySolved, totalEasyQues, easyLabel, easyProgressCircle, "Easy");
        updateProgress(mediumSolved, totalMediumQues, mediumLabel, mediumProgressCircle, "Medium");
        updateProgress(hardSolved, totalHardQues, hardLabel, hardProgressCircle, "Hard");

        const cardData = [
            { label: "Ranking", value: data.ranking },
            { label: "Total Solved", value: data.totalSolved },
            { label: "Acceptance Rate", value: `${data.acceptanceRate}%` },
            { label: "Total Questions", value: data.totalQuestions },
        ];

        cardsStatsContainer.innerHTML = cardData
            .map(
                (item) =>
                    `<div class="card">
                        <h3>${item.label} = </h3>
                        <p>${item.value}</p>
                    </div>`
            )
            .join(""); // To remove commas between items, we use join("")
    }

    searchButton.addEventListener('click', function () {
        const username = userNameInput.value;

        if (validUsername(username)) {
            fetchUserDetails(username);
        }
    });
});
