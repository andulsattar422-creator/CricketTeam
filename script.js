// Admin Password Configuration - UPDATED TO SIMPLIFIED PASSWORD
const ADMIN_PASSWORD = "1";

// Default Fallback Data (If LocalStorage is Empty)
const defaultTeams = [
    { name: "Lahore Tigers 🐯", wins: 0, losses: 0, points: 0 },
    { name: "Karachi Kings 👑", wins: 0, losses: 0, points: 0 },
    { name: "Islamabad United 🦁", wins: 0, losses: 0, points: 0 }
];

const defaultMatches = [
    { date: "Sunday - 21 June", teams: "Tigers vs Kings", venue: "Local Ground A - 4:00 PM" },
    { date: "Saturday - 27 June", teams: "United vs Tigers", venue: "Local Ground B - 4:00 PM" }
];

const defaultImages = [
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500",
    "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=500",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500"
];

// Initialize State from LocalStorage
let leagueTeams = JSON.parse(localStorage.getItem("jcl_teams")) || defaultTeams;
let matchSchedule = JSON.parse(localStorage.getItem("jcl_schedule")) || defaultMatches;
let galleryImages = JSON.parse(localStorage.getItem("jcl_gallery")) || defaultImages;
let playerStats = JSON.parse(localStorage.getItem("jcl_stats")) || { bName: "Ali Ahmed", bRuns: "120", bowName: "Zain Khan", bowWickets: "5" };

// Document Event Core Orchestration
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    
    // Main View Detection
    if (document.getElementById("pointsTableBody")) {
        renderMainWebsite();
    }
    
    // Dashboard Panel View Detection
    if (document.getElementById("updateTeamSelect")) {
        populateAdminSelect();
        renderAdminGalleryPreview();
    }
    
    // Registration Hook
    const regForm = document.getElementById("registrationForm");
    if(regForm) {
        regForm.addEventListener("submit", handleRegistration);
    }
});

// UI Theme Mode Handler
function initTheme() {
    const toggleBtn = document.getElementById("theme-toggle");
    if(!toggleBtn) return;
    
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
        const icon = toggleBtn.querySelector("i");
        if(document.body.classList.contains("light-theme")) {
            icon.className = "fas fa-sun";
        } else {
            icon.className = "fas fa-moon";
        }
    });
}

// Security Authentication Gateway
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

// Populate Selector Lists dynamically
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

// Append New Dynamic Team Element
function addNewTeam() {
    const teamNameInput = document.getElementById("newTeamName");
    const name = teamNameInput.value.trim();
    
    if(name === "") {
        alert("Please enter a valid team name!");
        return;
    }

    leagueTeams.push({ name: name, wins: 0, losses: 0, points: 0 });
    localStorage.setItem("jcl_teams", JSON.stringify(leagueTeams));
    
    teamNameInput.value = "";
    populateAdminSelect();
    alert("New Team Added Successfully!");
}

// File Storage Reader API to base64 conversions
function uploadGalleryImage() {
    const fileInput = document.getElementById("galleryImageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image file first.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const base64String = reader.result;
        galleryImages.unshift(base64String); // New elements prepend to priority view
        localStorage.setItem("jcl_gallery", JSON.stringify(galleryImages));
        renderAdminGalleryPreview();
        fileInput.value = ""; 
        alert("Image uploaded from laptop successfully!");
    };
    reader.readAsDataURL(file);
}

// Render Control View Matrix for Previews
function renderAdminGalleryPreview() {
    const container = document.getElementById("gallery-preview-container");
    if (!container) return;
    container.innerHTML = "";

    galleryImages.forEach((imgSrc, index) => {
        let wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        
        let img = document.createElement("img");
        img.src = imgSrc;
        img.style.width = "80px";
        img.style.height = "60px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "4px";

        let delBtn = document.createElement("button");
        delBtn.innerHTML = "&times;";
        delBtn.style.cssText = "position:absolute; top:0; right:0; background:red; color:white; border:none; border-radius:50%; cursor:pointer; width:18px; height:18px; font-size:12px; display:flex; align-items:center; justify-content:center;";
        delBtn.onclick = () => {
            galleryImages.splice(index, 1);
            localStorage.setItem("jcl_gallery", JSON.stringify(galleryImages));
            renderAdminGalleryPreview();
        };

        wrapper.appendChild(img);
        wrapper.appendChild(delBtn);
        container.appendChild(wrapper);
    });
}

// Store Standings Vectors
function savePointsTable() {
    const selectedIndex = document.getElementById("updateTeamSelect").value;
    const wins = parseInt(document.getElementById("teamWins").value) || 0;
    const losses = parseInt(document.getElementById("teamLosses").value) || 0;
    const points = parseInt(document.getElementById("teamPoints").value) || 0;

    leagueTeams[selectedIndex].wins = wins;
    leagueTeams[selectedIndex].losses = losses;
    leagueTeams[selectedIndex].points = points;

    localStorage.setItem("jcl_teams", JSON.stringify(leagueTeams));
    alert("Points table updated!");
}

// Store Dynamic Calendars
function saveMatchSchedule() {
    const mDate = document.getElementById("matchDate").value;
    const mTeams = document.getElementById("matchTeams").value;
    const mVenue = document.getElementById("matchVenue").value;

    if(mDate && mTeams && mVenue) {
        matchSchedule[0] = { date: mDate, teams: mTeams, venue: mVenue };
        localStorage.setItem("jcl_schedule", JSON.stringify(matchSchedule));
        alert("Match Card Updated Successfully!");
    } else {
        alert("Please fill all fields!");
    }
}

// Store Performer Profiles
function savePlayerStats() {
    playerStats.bName = document.getElementById("topBatsmanName").value || playerStats.bName;
    playerStats.bRuns = document.getElementById("topBatsmanRuns").value || playerStats.bRuns;
    playerStats.bowName = document.getElementById("topBowlerName").value || playerStats.bowName;
    playerStats.bowWickets = document.getElementById("topBowlerWickets").value || playerStats.bowWickets;

    localStorage.setItem("jcl_stats", JSON.stringify(playerStats));
    alert("Player Stats published!");
}

// Main DOM Render Engines
function renderMainWebsite() {
    // 1. Points Matrix Engine
    const tableBody = document.getElementById("pointsTableBody");
    if (tableBody) {
        tableBody.innerHTML = "";
        let sortedTeams = [...leagueTeams].sort((a,b) => b.points - a.points);
        
        sortedTeams.forEach((team, index) => {
            let totalMatches = team.wins + team.losses;
            let row = `<tr>
                <td>${index + 1}</td>
                <td><strong>${team.name}</strong></td>
                <td>${totalMatches}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td>
                <td style="color:#3b82f6; font-weight:bold;">${team.points}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }

    // 2. Schedule Grid Render
    const scheduleGrid = document.getElementById("scheduleGridContainer");
    if (scheduleGrid) {
        scheduleGrid.innerHTML = "";
        matchSchedule.forEach(match => {
            let card = `<div class="match-card">
                <div class="match-date"><i class="fas fa-calendar-alt"></i> ${match.date}</div>
                <div class="teams">${match.teams}</div>
                <div class="venue"><i class="fas fa-map-marker-alt"></i> ${match.venue}</div>
            </div>`;
            scheduleGrid.innerHTML += card;
        });
    }

    // 3. Dynamic Media View Streaming Engine
    const galleryGrid = document.getElementById("live-features-grid");
    if (galleryGrid) {
        galleryGrid.innerHTML = "";
        galleryImages.forEach(imgSrc => {
            let item = `<div class="gallery-item">
                <img src="${imgSrc}" alt="JCL Live Action">
            </div>`;
            galleryGrid.innerHTML += item;
        });
    }

    // 4. Performers Cards View Engine
    if(document.getElementById("displayBatsmanName")) {
        document.getElementById("displayBatsmanName").innerText = playerStats.bName;
        document.getElementById("displayBatsmanRuns").innerText = playerStats.bRuns + " Runs";
        document.getElementById("displayBowlerName").innerText = playerStats.bowName;
        document.getElementById("displayBowlerWickets").innerText = playerStats.bowWickets + " Wickets";
    }
}

// Form Messenger Event Hook (External Redirect Linkage)
function handleRegistration(e) {
    e.preventDefault();
    const tName = document.getElementById("teamName").value;
    const cName = document.getElementById("captainName").value;
    const phone = document.getElementById("contactNum").value;
    const pList = document.getElementById("playerList").value;

    const message = `Hello JCL Management! %0A%0Aআমি আমার টিম রেজিস্টার করতে চাই:%0A*Team Name:* ${tName}%0A*Captain Name:* ${cName}%0A*Contact:* ${phone}%0A*Players:* ${pList}`;
    window.open(`https://wa.me/923024337352?text=${message}`, '_blank');
}
