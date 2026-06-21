// Admin Password Configuration
const ADMIN_PASSWORD = "JuniorClub";

// Default Fallback Data
const defaultTeams = [
    { name: "Lahore Tigers 🐯", wins: 0, losses: 0, points: 0 },
    { name: "Karachi Kings 👑", wins: 0, losses: 0, points: 0 },
    { name: "Islamabad United 🦁", wins: 0, losses: 0, points: 0 }
];

const defaultMatches = [
    { date: "Sunday - 21 June", teams: "Tigers vs Kings (Match 1)", venue: "Local Ground A - 10:00 AM" },
    { date: "Sunday - 21 June", teams: "United vs Stallions (Match 2)", venue: "Local Ground A - 4:00 PM" }
];

const defaultImages = [
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500",
    "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=500",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500"
];

const defaultReports = [
    { title: "Tournament Opening Match!", content: "Welcome to JCL 2026. Standings and full fixtures are now fully live and interactive." }
];

// Initialize State from LocalStorage
let leagueTeams = JSON.parse(localStorage.getItem("jcl_teams")) || defaultTeams;
let matchSchedule = JSON.parse(localStorage.getItem("jcl_schedule")) || defaultMatches;
let galleryImages = JSON.parse(localStorage.getItem("jcl_gallery")) || defaultImages;
let matchReports = JSON.parse(localStorage.getItem("jcl_reports")) || defaultReports;
let playerStats = JSON.parse(localStorage.getItem("jcl_stats")) || { bName: "Ali Ahmed", bRuns: "120", bowName: "Zain Khan", bowWickets: "5" };

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    if (document.getElementById("pointsTableBody")) { renderMainWebsite(); }
    if (document.getElementById("updateTeamSelect")) { 
        populateAdminSelect(); 
        renderAdminTeamsDeleteList();
        renderAdminReportsList();
        renderAdminGalleryPreview(); 
    }
    const regForm = document.getElementById("registrationForm");
    if(regForm) { regForm.addEventListener("submit", handleRegistration); }
});

function initTheme() {
    const toggleBtn = document.getElementById("theme-toggle");
    if(!toggleBtn) return;
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const icon = toggleBtn.querySelector("i");
        icon.className = document.body.classList.contains("light-theme") ? "fas fa-sun" : "fas fa-moon";
    });
}

// Security Access Verification
function checkAdminPassword() {
    const entered = document.getElementById("adminPassword").value;
    const errorMsg = document.getElementById("login-error");
    const overlay = document.getElementById("login-overlay");
    const dashboard = document.getElementById("admin-dashboard");

    if (entered === ADMIN_PASSWORD) {
        overlay.style.display = "none";
        dashboard.style.display = "block";
    } else {
        errorMsg.style.display = "block";
    }
}

function populateAdminSelect() {
    const select = document.getElementById("updateTeamSelect");
    if (!select) return;
    select.innerHTML = "";
    leagueTeams.forEach((team, index) => {
        let opt = document.createElement("option");
        opt.value = index;
        opt.innerText = team.name;
        select.appendChild(opt);
    });
}

// Render dynamic team lists inside admin panel with deletion features
function renderAdminTeamsDeleteList() {
    const container = document.getElementById("adminTeamsDeleteList");
    if (!container) return;
    container.innerHTML = "";
    leagueTeams.forEach((team, index) => {
        let div = document.createElement("div");
        div.className = "admin-list-item";
        div.innerHTML = `<span>${team.name}</span> <button class="btn-delete-small" onclick="removeTeam(${index})">Remove</button>`;
        container.appendChild(div);
    });
}

function addNewTeam() {
    const teamNameInput = document.getElementById("newTeamName");
    const name = teamNameInput.value.trim();
    if(name === "") { alert("Please enter a valid team name!"); return; }
    leagueTeams.push({ name: name, wins: 0, losses: 0, points: 0 });
    localStorage.setItem("jcl_teams", JSON.stringify(leagueTeams));
    teamNameInput.value = "";
    populateAdminSelect();
    renderAdminTeamsDeleteList();
    alert("New Team Added Successfully!");
}

function removeTeam(index) {
    if(confirm(`Are you sure you want to remove "${leagueTeams[index].name}"?`)) {
        leagueTeams.splice(index, 1);
        localStorage.setItem("jcl_teams", JSON.stringify(leagueTeams));
        populateAdminSelect();
        renderAdminTeamsDeleteList();
    }
}

// Match Reports Management
function addMatchReport() {
    const titleInput = document.getElementById("reportTitle");
    const contentInput = document.getElementById("reportContent");
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if(title === "" || content === "") { alert("Please fill both Title and Content fields!"); return; }
    
    matchReports.unshift({ title, content });
    localStorage.setItem("jcl_reports", JSON.stringify(matchReports));
    
    titleInput.value = "";
    contentInput.value = "";
    renderAdminReportsList();
    alert("Report Published Successfully!");
}

function renderAdminReportsList() {
    const container = document.getElementById("adminReportsList");
    if(!container) return;
    container.innerHTML = "";
    matchReports.forEach((report, index) => {
        let div = document.createElement("div");
        div.className = "admin-list-item";
        div.innerHTML = `<span><b>${report.title}</b></span> <button class="btn-delete-small" onclick="removeReport(${index})">Delete</button>`;
        container.appendChild(div);
    });
}

function removeReport(index) {
    matchReports.splice(index, 1);
    localStorage.setItem("jcl_reports", JSON.stringify(matchReports));
    renderAdminReportsList();
}

// Schedule Multi-Match Engine
function addMatchSchedule() {
    const mDate = document.getElementById("matchDate").value.trim();
    const mTeams = document.getElementById("matchTeams").value.trim();
    const mVenue = document.getElementById("matchVenue").value.trim();
    
    if(mDate && mTeams && mVenue) {
        matchSchedule.push({ date: mDate, teams: mTeams, venue: mVenue });
        localStorage.setItem("jcl_schedule", JSON.stringify(matchSchedule));
        alert("Match Fixture Appended Successfully!");
        document.getElementById("matchTeams").value = "";
    } else { alert("Please fill all fields!"); }
}

function clearAllSchedules() {
    if(confirm("Are you sure you want to delete ALL matches from the schedule?")) {
        matchSchedule = [];
        localStorage.setItem("jcl_schedule", JSON.stringify(matchSchedule));
        alert("All fixtures cleared! Add new ones now.");
    }
}

function uploadGalleryImage() {
    const fileInput = document.getElementById("galleryImageInput");
    const file = fileInput.files[0];
    if (!file) { alert("Please select an image file first."); return; }
    const reader = new FileReader();
    reader.onloadend = function () {
        galleryImages.unshift(reader.result);
        localStorage.setItem("jcl_gallery", JSON.stringify(galleryImages));
        renderAdminGalleryPreview();
        fileInput.value = "";
        alert("Image uploaded successfully!");
    };
    reader.readAsDataURL(file);
}

function renderAdminGalleryPreview() {
    const container = document.getElementById("gallery-preview-container");
    if (!container) return;
    container.innerHTML = "";
    galleryImages.forEach((imgSrc, index) => {
        let wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        let img = document.createElement("img");
        img.src = imgSrc; img.style.cssText = "width:80px; height:60px; object-fit:cover; border-radius:4px;";
        let delBtn = document.createElement("button");
        delBtn.innerHTML = "&times;";
        delBtn.style.cssText = "position:absolute; top:0; right:0; background:red; color:white; border:none; border-radius:50%; cursor:pointer; width:18px; height:18px; display:flex; align-items:center; justify-content:center;";
        delBtn.onclick = () => {
            galleryImages.splice(index, 1);
            localStorage.setItem("jcl_gallery", JSON.stringify(galleryImages));
            renderAdminGalleryPreview();
        };
        wrapper.appendChild(img); wrapper.appendChild(delBtn); container.appendChild(wrapper);
    });
}

function savePointsTable() {
    const selectedIndex = document.getElementById("updateTeamSelect").value;
    leagueTeams[selectedIndex].wins = parseInt(document.getElementById("teamWins").value) || 0;
    leagueTeams[selectedIndex].losses = parseInt(document.getElementById("teamLosses").value) || 0;
    leagueTeams[selectedIndex].points = parseInt(document.getElementById("teamPoints").value) || 0;
    localStorage.setItem("jcl_teams", JSON.stringify(leagueTeams));
    alert("Points table updated!");
}

function savePlayerStats() {
    playerStats.bName = document.getElementById("topBatsmanName").value || playerStats.bName;
    playerStats.bRuns = document.getElementById("topBatsmanRuns").value || playerStats.bRuns;
    playerStats.bowName = document.getElementById("topBowlerName").value || playerStats.bowName;
    playerStats.bowWickets = document.getElementById("topBowlerWickets").value || playerStats.bowWickets;
    localStorage.setItem("jcl_stats", JSON.stringify(playerStats));
    alert("Player Stats published!");
}

function renderMainWebsite() {
    // 1. Points Table Render
    const tableBody = document.getElementById("pointsTableBody");
    if (tableBody) {
        tableBody.innerHTML = "";
        let sortedTeams = [...leagueTeams].sort((a,b) => b.points - a.points);
        sortedTeams.forEach((team, index) => {
            let row = `<tr><td>${index + 1}</td><td><strong>${team.name}</strong></td><td>${team.wins + team.losses}</td><td>${team.wins}</td><td>${team.losses}</td><td style="color:#3b82f6; font-weight:bold;">${team.points}</td></tr>`;
            tableBody.innerHTML += row;
        });
    }
    
    // 2. Match Reports Render
    const reportsContainer = document.getElementById("matchReportsContainer");
    if(reportsContainer) {
        reportsContainer.innerHTML = "";
        if(matchReports.length === 0) {
            reportsContainer.innerHTML = `<p style="color:#94a3b8; grid-column: 1/-1; text-align:center;">No match reports published yet.</p>`;
        }
        matchReports.forEach(report => {
            reportsContainer.innerHTML += `<div class="match-card" style="border-left: 4px solid #a855f7;"><h3>📢 ${report.title}</h3><p style="margin-top:10px; color:#94a3b8; font-size:0.95rem; line-height:1.6;">${report.content}</p></div>`;
        });
    }

    // 3. Multi-Match Schedule Render
    const scheduleGrid = document.getElementById("scheduleGridContainer");
    if (scheduleGrid) {
        scheduleGrid.innerHTML = "";
        if(matchSchedule.length === 0) {
            scheduleGrid.innerHTML = `<p style="color:#94a3b8; grid-column: 1/-1; text-align:center;">No upcoming fixtures scheduled.</p>`;
        }
        matchSchedule.forEach(match => {
            scheduleGrid.innerHTML += `<div class="match-card"><div class="match-date"><i class="fas fa-calendar-alt"></i> ${match.date}</div><div class="teams">${match.teams}</div><div class="venue"><i class="fas fa-map-marker-alt"></i> ${match.venue}</div></div>`;
        });
    }
    
    // 4. Gallery Render
    const galleryGrid = document.getElementById("live-features-grid");
    if (galleryGrid) {
        galleryGrid.innerHTML = "";
        galleryImages.forEach(imgSrc => {
            galleryGrid.innerHTML += `<div class="gallery-item"><img src="${imgSrc}" alt="JCL Live Action"></div>`;
        });
    }
    
    // 5. Performers Render
    if(document.getElementById("displayBatsmanName")) {
        document.getElementById("displayBatsmanName").innerText = playerStats.bName;
        document.getElementById("displayBatsmanRuns").innerText = playerStats.bRuns + " Runs";
        document.getElementById("displayBowlerName").innerText = playerStats.bowName;
        document.getElementById("displayBowlerWickets").innerText = playerStats.bowWickets + " Wickets";
    }
}

function handleRegistration(e) {
    e.preventDefault();
    const message = `Hello JCL Management! %0A%0Aআমি আমার টিম রেজিস্টার করতে চাই:%0A*Team Name:* ${document.getElementById("teamName").value}%0A*Captain Name:* ${document.getElementById("captainName").value}%0A*Contact:* ${document.getElementById("contactNum").value}%0A*Players:* ${document.getElementById("playerList").value}`;
    window.open(`https://wa.me/923024337352?text=${message}`, '_blank');
}
