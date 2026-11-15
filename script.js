// ASTROGUARD - Interactive website

// Page navigation
// ASTROGUARD PAGE NAVIGATION

const navButtons = document.querySelectorAll(".nav-button");
const pages = document.querySelectorAll(".page");

let currentPage = "dashboard";
let pageHistory = [];

function showPage(pageId, remember = true) {

    if (remember && currentPage !== pageId) {
        pageHistory.push(currentPage);
    }

    pages.forEach(page => {
        page.classList.add("hidden");
    });

    const targetPage = document.getElementById(pageId);

    if (!targetPage) return;

    targetPage.classList.remove("hidden");

    navButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    currentPage = pageId;

    backButton.disabled = pageHistory.length === 0;
}

// CREATE BACK BUTTON

const backButton = document.createElement("button");

backButton.id = "astroguard-back-button";
backButton.textContent = "← Back";

backButton.style.cssText = `
    padding: 10px 20px;
    margin: 15px 0;
    background: #087e99;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
`;

pages[0].parentElement.insertBefore(backButton, pages[0]);

backButton.addEventListener("click", () => {

    if (pageHistory.length === 0) return;

    const previousPage = pageHistory.pop();

    showPage(previousPage, false);
});

// NAVIGATION BUTTONS

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

// INITIAL PAGE

showPage("dashboard", false);

navButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const pageId = button.dataset.page;

        pages.forEach((page) => {
            page.classList.add("hidden");
        });

        document.getElementById(pageId).classList.remove("hidden");

        navButtons.forEach((navButton) => {
            navButton.classList.remove("active");
        });

        button.classList.add("active");
    });
});

// Health readings
let heartRate = 84;
let oxygen = 96;
let temperature = 37.0;
// ASTROGUARD DEMO THRESHOLDS
// These are illustrative values, NOT medical standards.

const HEALTH_LIMITS = {
    heartRate: {
        warning: 100,
        critical: 130
    },
    oxygen: {
        warning: 95,
        critical: 90
    },
    temperature: {
        warning: 38,
        critical: 39
    }
};

let warningActive = false;
let emergencyActive = false;

const missionDays = [1, 10, 20, 30];
const heartRates = [72, 75, 79, 84];

// Create the heart rate graph
let heartChart = null;
let trendChart = null;

const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: "#e6edf7"
            }
        }
    },
    scales: {
        x: {
            ticks: { color: "#cbd5e1" },
            grid: { color: "#263753" }
        },
        y: {
            ticks: { color: "#cbd5e1" },
            grid: { color: "#263753" }
        }
    }
};

function createHeartChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === "undefined") return null;

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: [...missionDays],
            datasets: [{
                label: "Heart rate (bpm)",
                data: [...heartRates],
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                fill: true,
                tension: 0.3
            }]
        },
        options: chartOptions
    });
}

heartChart = createHeartChart("heartChart");
trendChart = createHeartChart("trendChart");

// Health history table
const historyBody = document.getElementById("health-history-body");

function addHistoryRow() {
    if (!historyBody) return;

    const row = document.createElement("tr");
    const time = new Date().toLocaleTimeString();

    const status =
    heartRate >= HEALTH_LIMITS.heartRate.warning ||
    oxygen <= HEALTH_LIMITS.oxygen.warning ||
    temperature >= HEALTH_LIMITS.temperature.warning
        ? "Warning"
        : "Normal";

    [time, heartRate + " bpm", oxygen + "%", temperature + " °C", status]
        .forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

    historyBody.prepend(row);
}

// Update health data button
const updateButton = document.getElementById("update-health");

if (updateButton) {
    updateButton.addEventListener("click", () => {
        heartRate = Math.floor(Math.random() * 41) + 60;
        oxygen = Math.floor(Math.random() * 11) + 90;
        temperature = Number((36 + Math.random() * 3).toFixed(1));

        document.getElementById("heart-rate").textContent = heartRate;
        document.getElementById("oxygen").textContent = oxygen;
        document.getElementById("temperature").textContent = temperature;

        // Update graphs
missionDays.push("Latest");
heartRates.push(heartRate);

if (missionDays.length > 10) {
    missionDays.shift();
    heartRates.shift();
}

// Update the heart rate graph
if (heartChart) {
    heartChart.data.labels = [...missionDays];
    heartChart.data.datasets[0].data = [...heartRates];
    heartChart.update();
}

// Update the health trends graph
if (trendChart) {
    trendChart.data.labels = [...missionDays];
    trendChart.data.datasets[0].data = [...heartRates];
    trendChart.update();
}

        // Activate warnings
       warningActive =
    heartRate > 110 ||
    oxygen < 95 ||
    temperature > 38;
    const warningPanel = document.getElementById(
    "warning-procedure"
);

if (warningPanel) {
    warningPanel.classList.toggle(
        "hidden",
        !warningActive
    );
}

        

        if (heartRate >= 130) {
    emergencyActive = true;
}
// Update crew health status
const crewStatus = document.getElementById("crew-status");

if (crewStatus) {
    let status = "normal";

    if (warningActive) {
        status = "warning";
    }

    if (heartRate >= 130) {
        status = "critical";
    }

    crewStatus.textContent = status.toUpperCase();
    crewStatus.className = "health-status " + status;
}
        // Display warning
const alertBox = document.getElementById("health-alert");

if (alertBox) {
    if (warningActive) {
        alertBox.className = "health-alert warning";
        alertBox.textContent =
            "⚠ WARNING: Check astronaut health data!";
    } else {
        alertBox.className = "health-alert normal";
        alertBox.textContent =
            "✓ HEALTH STATUS: NORMAL";
    }
}

        // Display emergency alert
        const emergencyPanel =
            document.getElementById("emergency-alert");

        if (emergencyActive) {
            emergencyPanel.classList.remove("hidden");
        } else {
            emergencyPanel.classList.add("hidden");
        }

        // Update alerts page and history
        const summary = document.getElementById("alert-summary");

        if (emergencyActive) {
            summary.textContent = "EMERGENCY: Simulated evacuation alert active.";
        } else if (warningActive) {
            summary.textContent = "WARNING: Check astronaut health data.";
        } else {
            summary.textContent = "No active alerts.";
        }

        addHistoryRow();
    });
}

// Clear alerts button
const clearButton = document.getElementById("clear-alerts");

if (clearButton) {
    clearButton.addEventListener("click", () => {
        warningActive = false;
        emergencyActive = false;

        const alertBox = document.getElementById("health-alert");
        const emergencyPanel =
            document.getElementById("emergency-alert");
        const summary = document.getElementById("alert-summary");

        alertBox.textContent =
            "All health measurements are within the demo limits.";
        alertBox.className = "alert normal";

        emergencyPanel.classList.add("hidden");
        summary.textContent = "No active alerts.";
    });
}

// Daily check-in form
const form = document.getElementById("checkinForm");

if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const sleep = Number(document.getElementById("sleepInput").value);
        const energy = Number(document.getElementById("energyInput").value);
        const stress = Number(document.getElementById("stressInput").value);
        const exercise = Number(document.getElementById("exerciseInput").value);

        document.getElementById("checkin-message").textContent =
            "Check-in submitted! Sleep: " + sleep +
            " hours, Energy: " + energy + "/5, Stress: " +
            stress + "/5, Exercise: " + exercise + " minutes.";
    });
}

// Add initial health history
addHistoryRow();

/* =========================================
   ASTROGUARD — MISSION COMMS
   Simulated messages only
========================================= */

function initMissionComms() {
    const form = document.getElementById("comms-form");
    const input = document.getElementById("comms-input");
    const messages = document.getElementById("comms-messages");
    const feedback = document.getElementById("comms-feedback");
    const quickButtons = document.querySelectorAll(
        "[data-comms-message]"
    );

    // Stop safely if the communication page is not in the HTML.
    if (!form || !input || !messages || !feedback) {
        return;
    }

    function addCommsMessage(sender, message, type) {
        const messageBox = document.createElement("div");
        messageBox.className = "comms-message " + type;

        const senderLabel = document.createElement("span");
        senderLabel.className = "comms-sender";
        senderLabel.textContent = sender;

        const messageText = document.createElement("p");
        messageText.textContent = message;

        const timeLabel = document.createElement("span");
        timeLabel.className = "comms-time";
        timeLabel.textContent =
            new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }) + " · SIMULATED";

        messageBox.append(senderLabel, messageText, timeLabel);
        messages.appendChild(messageBox);

        // Keep the newest message visible.
        messages.scrollTop = messages.scrollHeight;
    }

    function getMissionControlReply(message) {
        const text = message.toLowerCase();

        if (
            text.includes("emergency") ||
            text.includes("critical") ||
            text.includes("cannot breathe") ||
            text.includes("unconscious")
        ) {
            return "PRIORITY MESSAGE RECEIVED. Follow your mission's emergency procedures, notify the designated medical team, and follow their instructions immediately. This is a simulated response.";
        }

        if (
            text.includes("heart rate") ||
            text.includes("oxygen") ||
            text.includes("temperature") ||
            text.includes("health") ||
            text.includes("symptom") ||
            text.includes("pain")
        ) {
            return "HEALTH REPORT RECEIVED. Pause strenuous activity if appropriate, recheck the simulated readings, report any symptoms, and follow mission medical guidance. This demo cannot assess real health conditions.";
        }

        if (
            text.includes("assist") ||
            text.includes("help") ||
            text.includes("support")
        ) {
            return "ASSISTANCE REQUEST LOGGED. Please describe the issue and wait for guidance from the designated mission team. This is a simulated communication channel.";
        }

        if (
            text.includes("food") ||
            text.includes("nutrition") ||
            text.includes("meal") ||
            text.includes("water") ||
            text.includes("hydration")
        ) {
            return "CREW WELLNESS REQUEST RECEIVED. Review the Space Nutrition page for general food and hydration suggestions, and follow your mission's approved nutrition plan.";
        }

        if (
            text.includes("sleep") ||
            text.includes("tired") ||
            text.includes("fatigue") ||
            text.includes("exercise")
        ) {
            return "WELLNESS UPDATE RECEIVED. Record your rest and activity in Daily Check-in and follow your mission schedule and medical team's advice.";
        }

        return "MESSAGE RECEIVED, ASTRYN-X0. Your report has been logged in this local demonstration. Please continue following your mission procedures.";
    }

    function sendCommsMessage(message) {
        const cleanMessage = message.trim();

        if (!cleanMessage) {
            feedback.textContent = "Enter a message before transmitting.";
            return;
        }

        if (cleanMessage.length > 300) {
            feedback.textContent = "Messages must be 300 characters or fewer.";
            return;
        }

        addCommsMessage(
            "ASTRONAUT · ASTRYN-X0",
            cleanMessage,
            "astronaut-message"
        );

        feedback.textContent = "Message sent to the local simulation.";
        input.value = "";

        // Generate a simulated reply.
        window.setTimeout(function () {
            addCommsMessage(
                "MISSION CONTROL",
                getMissionControlReply(cleanMessage),
                "mission-message"
            );

            feedback.textContent =
                "Simulated reply received. No real transmission occurred.";
        }, 700);
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        sendCommsMessage(input.value);
    });

    quickButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const message = button.dataset.commsMessage;
            sendCommsMessage(message);
        });
    });
}

// Initialize once when the page has loaded.
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initMissionComms
    );
} else {
    initMissionComms();
}

/* =========================================
   ASTROGUARD — ENVIRONMENT ADAPTATION
========================================= */

const environmentSelect = document.getElementById(
    "mission-environment"
);

const environmentGuidance = document.getElementById(
    "environment-guidance"
);

const environmentInformation = {
    spacecraft: {
        title: "SPACECRAFT GUIDANCE",
        description:
            "Secure medical equipment and follow onboard safety procedures. Complete health measurements in the designated safe area. Consider the effects of microgravity on movement and equipment."
    },

    station: {
        title: "SPACE STATION GUIDANCE",
        description:
            "Follow the station's daily exercise and health-monitoring schedule. Secure loose medical equipment and record measurements consistently during long-duration missions."
    },

    rover: {
        title: "SPACE ROVER GUIDANCE",
        description:
            "Before exploration, check suit readiness and complete the required health assessment. During rover operations, follow communication, hydration and rest procedures."
    },

    moon: {
        title: "MOON BASE GUIDANCE",
        description:
            "Follow surface-base safety procedures. Monitor hydration, fatigue and recovery, especially after activities outside the habitat. Use approved equipment for health measurements."
    },

    planet: {
        title: "PLANETARY BASE GUIDANCE",
        description:
            "Follow the base's environmental safety procedures. Monitor crew wellness, maintain scheduled health checks and report unusual symptoms to the medical team."
    }
};

if (environmentSelect && environmentGuidance) {

    environmentSelect.addEventListener("change", function () {

        const selectedEnvironment = environmentSelect.value;

        const information =
            environmentInformation[selectedEnvironment];

        if (information) {
            environmentGuidance.innerHTML = `
                <h3>${information.title}</h3>
                <p>${information.description}</p>
            `;
        }

    });

}

/* =========================================
   ASTROGUARD — HEALTH CHECKLIST
========================================= */

const healthTasks = document.querySelectorAll(".health-task");

const assessmentProgress = document.getElementById(
    "assessment-progress"
);

function updateAssessmentProgress() {

    if (!assessmentProgress) return;

    const completedTasks = document.querySelectorAll(
        ".health-task:checked"
    ).length;

    const totalTasks = healthTasks.length;

    assessmentProgress.textContent =
        completedTasks + " / " + totalTasks +
        " tasks completed";

    if (completedTasks === totalTasks) {
        assessmentProgress.textContent +=
            " — ALL CHECKS COMPLETED!";
    }

}

healthTasks.forEach(function (task) {

    task.addEventListener("change", updateAssessmentProgress);

});

// Display the initial progress.
updateAssessmentProgress();

/* =========================================
   ASTROGUARD — GAMIFICATION SYSTEM
========================================= */

(function initGamification() {

    const tasks = document.querySelectorAll(
        ".routine-task-check"
    );

    const totalXPDisplay = document.getElementById("total-xp");
    const levelDisplay = document.getElementById("mission-level");
    const streakDisplay = document.getElementById("daily-streak");
    const completedDisplay = document.getElementById("completed-routines");
    const progressBar = document.getElementById("xp-progress-bar");
    const progressText = document.getElementById("xp-progress-text");
    const routineMessage = document.getElementById("routine-message");

    if (!tasks.length || !totalXPDisplay) return;

    const STORAGE_KEY = "astroguard_gamification";

    const today = new Date().toLocaleDateString("en-CA");

    let savedData = {};

    try {
        savedData = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || {};
    } catch (error) {
        savedData = {};
    }

    let totalXP = savedData.totalXP || 0;
    let totalTasksCompleted = savedData.totalTasksCompleted || 0;
    let streak = savedData.streak || 0;
    let lastStreakDate = savedData.lastStreakDate || "";

    // Restore today's completed tasks.
    let completedToday = savedData.dailyDate === today
        ? (savedData.completedToday || [])
        : [];

    function saveProgress() {

        const data = {
            totalXP: totalXP,
            totalTasksCompleted: totalTasksCompleted,
            streak: streak,
            lastStreakDate: lastStreakDate,
            dailyDate: today,
            completedToday: completedToday
        };

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );
        } catch (error) {
            routineMessage.textContent =
                "Progress could not be saved in this browser.";
        }
    }

    function unlockAchievement(id, unlocked) {

        const achievement = document.getElementById(id);

        if (!achievement) return;

        const status = achievement.querySelector(
            ".achievement-status"
        );

        achievement.classList.toggle(
            "unlocked",
            unlocked
        );

        if (status) {
            status.textContent = unlocked
                ? "UNLOCKED"
                : "LOCKED";
        }
    }

    function updateGamification() {

        const completedCount = completedToday.length;

        const missionLevel = Math.floor(totalXP / 100) + 1;
        const currentLevelXP = totalXP % 100;

        // Update dashboard.
        totalXPDisplay.textContent = totalXP;
        levelDisplay.textContent =
            String(missionLevel).padStart(2, "0");

        streakDisplay.textContent = streak;

        completedDisplay.textContent =
            completedCount + "/" + tasks.length;

        // Update progress bar.
        progressBar.style.width = currentLevelXP + "%";

        progressText.textContent =
            currentLevelXP + " / 100 XP to next level";

        // Unlock achievements.
        unlockAchievement(
            "achievement-first",
            totalTasksCompleted >= 1
        );

        unlockAchievement(
            "achievement-half",
            completedCount >= 3
        );

        unlockAchievement(
            "achievement-all",
            completedCount === tasks.length
        );

        unlockAchievement(
            "achievement-level",
            missionLevel >= 2
        );

        // Update task messages.
        if (completedCount === tasks.length) {
            routineMessage.textContent =
                "MISSION COMPLETE! All daily objectives achieved. Excellent work, astronaut!";
        } else {
            routineMessage.textContent =
                completedCount + " of " + tasks.length +
                " daily objectives completed. Keep going!";
        }

        saveProgress();
    }

    // Restore previously completed tasks.
    tasks.forEach(function(task, index) {

        if (completedToday.includes(index)) {
            task.checked = true;
            task.disabled = true;
        }

        task.addEventListener("change", function() {

            if (!task.checked) return;

            if (completedToday.includes(index)) return;

            const reward = Number(task.dataset.xp) || 0;

            completedToday.push(index);

            totalXP += reward;
            totalTasksCompleted++;

            task.disabled = true;

            routineMessage.textContent =
                "Objective completed! +" + reward + " XP earned.";

            // Update streak when all tasks are completed.
            if (completedToday.length === tasks.length) {

                const previousDate = new Date(lastStreakDate + "T12:00:00");
                const currentDate = new Date(today + "T12:00:00");

                const difference = Math.round(
                    (currentDate - previousDate) / 86400000
                );

                if (lastStreakDate !== today) {
                    streak = difference === 1
                        ? streak + 1
                        : 1;

                    lastStreakDate = today;
                }
            }

            updateGamification();

        });

    });

    updateGamification();

})();

/* =========================================
   ASTROGUARD — ADDITIONAL HEALTH CHARTS
========================================= */

(function initAdditionalHealthCharts() {

    if (typeof Chart === "undefined") return;

    const labels = ["Initial", "Latest"];

    const chartHistory = {
        oxygen: [96, 96],
        temperature: [37.0, 37.0],
        sleep: [5.5, 5.5]
    };

    let currentSleep = 5.5;

    function createVitalChart(canvasId, title, data, color) {

        const canvas = document.getElementById(canvasId);

        if (!canvas) return null;

        return new Chart(canvas, {
            type: "line",

            data: {
                labels: [...labels],

                datasets: [{
                    label: title,
                    data: [...data],
                    borderColor: color,
                    backgroundColor: color + "22",
                    fill: true,
                    tension: 0.35
                }]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        labels: {
                            color: "#e6edf7"
                        }
                    }
                },

                scales: {
                    x: {
                        ticks: { color: "#cbd5e1" },
                        grid: { color: "#263753" }
                    },

                    y: {
                        ticks: { color: "#cbd5e1" },
                        grid: { color: "#263753" }
                    }
                }
            }
        });
    }

    const oxygenChart = createVitalChart(
        "oxygenChart",
        "Blood Oxygen (%)",
        chartHistory.oxygen,
        "#38bdf8"
    );

    const temperatureChart = createVitalChart(
        "temperatureChart",
        "Body Temperature (°C)",
        chartHistory.temperature,
        "#a78bfa"
    );

    const sleepChart = createVitalChart(
        "sleepChart",
        "Sleep Duration (hours)",
        chartHistory.sleep,
        "#34d399"
    );

    function updateVitalChart(chart, data) {

        if (!chart) return;

        chart.data.labels = [...labels];
        chart.data.datasets[0].data = [...data];
        chart.update();
    }

    function addLatestValue(data, value) {

        data.push(value);

        if (data.length > 10) {
            data.shift();
        }
    }

    function updateIndicator(id, value, caution, critical, lowerIsWorse) {

        const element = document.getElementById(id);

        if (!element) return;

        let status = "normal";

        if (lowerIsWorse) {
            if (value <= critical) {
                status = "critical";
            } else if (value <= caution) {
                status = "warning";
            }
        } else {
            if (value >= critical) {
                status = "critical";
            } else if (value >= caution) {
                status = "warning";
            }
        }

        element.textContent = status.toUpperCase();
        element.className = "indicator-status " + status;
    }

    function updateHealthIndicators() {

        updateIndicator(
            "heart-status",
            heartRate,
            100,
            130,
            false
        );

        updateIndicator(
            "oxygen-status",
            oxygen,
            95,
            90,
            true
        );

        updateIndicator(
            "temperature-status",
            temperature,
            38,
            39,
            false
        );
    }

    // Listen to the existing Update Health Data button.
    const updateButton = document.getElementById("update-health");

    if (updateButton) {

        updateButton.addEventListener("click", function() {

            // Use the readings generated by your existing script.
            addLatestValue(chartHistory.oxygen, oxygen);
            addLatestValue(chartHistory.temperature, temperature);

            // Simulated sleep data for demonstration.
            currentSleep = Number(
                (4 + Math.random() * 5).toFixed(1)
            );

            addLatestValue(chartHistory.sleep, currentSleep);

            labels.push("Latest");

            if (labels.length > 10) {
                labels.shift();
            }

            updateVitalChart(oxygenChart, chartHistory.oxygen);
            updateVitalChart(temperatureChart, chartHistory.temperature);
            updateVitalChart(sleepChart, chartHistory.sleep);

            updateHealthIndicators();

        });
    }

    updateHealthIndicators();

})();

const organInformation = {
    brain: {
        title: "BRAIN & NERVOUS SYSTEM",
        description: "Spaceflight can affect sleep, concentration, balance and coordination. Monitor sleep quality, cognitive performance and neurological symptoms."
    },
    eyes: {
        title: "EYES & VISION",
        description: "Spaceflight-associated neuro-ocular changes (SANS) can affect vision and eye structures. Report blurred vision or other visual changes to the medical team."
    },
    heart: {
        title: "HEART & CIRCULATORY SYSTEM",
        description: "Microgravity changes how blood and other fluids distribute around the body. Monitor heart rate, blood pressure and symptoms such as dizziness."
    },
    lungs: {
        title: "LUNGS & RESPIRATORY SYSTEM",
        description: "Monitor respiratory rate, oxygen saturation and breathing symptoms. Report unusual readings or difficulty breathing promptly."
    },
    bones: {
        title: "BONES & SKELETAL SYSTEM",
        description: "Microgravity can cause bone mineral density loss. Follow prescribed resistance exercise and nutrition plans, and monitor bone health."
    },
    muscles: {
        title: "MUSCLES & MUSCULAR SYSTEM",
        description: "Muscle strength and mass can decrease in microgravity. Follow scheduled resistance and aerobic exercise programmes."
    }
};

document.querySelectorAll(".organ-button").forEach(button => {
    button.addEventListener("click", () => {
        const organ = button.dataset.organ;
        const information = organInformation[organ];

        if (!information) return;

        document.getElementById("organ-title").textContent =
            information.title;

        document.getElementById("organ-description").textContent =
            information.description;
    });
});
// ASTROGUARD — INTERACTIVE BODY ASSESSMENT

const bodyHealthData = {
    brain: {
        title: "BRAIN & NERVOUS SYSTEM",
        description: "Controls thinking, memory, balance and coordination.",
        indicators: "Sleep quality, cognitive performance and balance.",
        risks: "Microgravity can affect balance and spatial orientation.",
        actions: "Maintain a consistent sleep schedule and report persistent headaches or confusion."
    },

    eyes: {
        title: "EYES & VISION",
        description: "Allow astronauts to see and process visual information.",
        indicators: "Visual acuity and changes in vision.",
        risks: "Spaceflight-associated neuro-ocular syndrome may affect eye structures and vision.",
        actions: "Complete scheduled eye examinations and report blurred vision."
    },

    heart: {
        title: "HEART & CIRCULATORY SYSTEM",
        description: "Pumps blood throughout the body.",
        indicators: "Heart rate and blood pressure.",
        risks: "Microgravity can affect fluid distribution and cardiovascular fitness.",
        actions: "Follow prescribed exercise routines and monitor cardiovascular measurements."
    },

    lungs: {
        title: "LUNGS & RESPIRATORY SYSTEM",
        description: "Exchange oxygen and carbon dioxide during breathing.",
        indicators: "Respiratory rate, oxygen saturation and breathing symptoms.",
        risks: "Spacecraft environmental conditions may affect respiratory health.",
        actions: "Monitor breathing and report breathing difficulties immediately."
    },

    bones: {
        title: "BONES & SKELETAL SYSTEM",
        description: "Support the body and protect internal organs.",
        indicators: "Bone mineral density and calcium balance.",
        risks: "Microgravity can cause bone mineral loss.",
        actions: "Follow prescribed resistance exercise and nutrition plans."
    },

    muscles: {
        title: "MUSCLES & MUSCULAR SYSTEM",
        description: "Allow movement, posture and physical activity.",
        indicators: "Muscle strength and endurance.",
        risks: "Microgravity can cause muscle loss and reduced strength.",
        actions: "Complete scheduled resistance and aerobic exercise."
    }
};

let selectedBodyArea = null;

document.querySelectorAll(".body-hotspot").forEach(hotspot => {

    function selectBodyArea() {
        selectedBodyArea = hotspot.dataset.body;
        const data = bodyHealthData[selectedBodyArea];

        if (!data) return;

        document.getElementById("body-title").textContent = data.title;
        document.getElementById("body-description").textContent = data.description;
        document.getElementById("body-indicators").textContent = data.indicators;
        document.getElementById("body-risks").textContent = data.risks;
        document.getElementById("body-actions").textContent = data.actions;

        document.querySelectorAll(".body-hotspot").forEach(point => {
            point.classList.remove("active");
        });

        hotspot.classList.add("active");
    }

    hotspot.addEventListener("click", selectBodyArea);

    hotspot.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            selectBodyArea();
        }
    });
});
