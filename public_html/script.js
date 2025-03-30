document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  let gregMonth = now.getMonth();
  let gregYear = now.getFullYear();
  const msPer360Day = 24 * 60 * 60 * 1014.5616;
  const daysSinceEpoch = Math.floor(now.getTime() / msPer360Day);
  let year360 = Math.floor(daysSinceEpoch / 360) + 1970;
  let month360 = Math.floor((daysSinceEpoch % 360) / 30) + 1;

  // Helper function to check leap year (for Gregorian calendar)
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // Generate Gregorian Calendar
  function generateGregorianCalendar(month, year) {
    const container = document.getElementById("gregorian-calendar");
    document.getElementById("greg-title").textContent = `${new Date(year, month).toLocaleString("default", {
      month: "long",
    })} ${year}`;
    let html = '<div class="days">';
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
      html += `<div class="day-header">${day}</div>`;
    });
    html += '</div><div class="days">';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      html += '<div class="day"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrent =
        year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const classes = isCurrent ? "day current-day" : "day";
      html += `<div class="${classes}" data-date="${dateStr}">${day}</div>`;
    }
    html += "</div>";
    container.innerHTML = html;
  }

  // Generate 360 Days Calendar
  function generate360Calendar(month, year) {
    const container = document.getElementById("calendar-360");
    document.getElementById("title-360").textContent = `Month ${month} / ${year}`;
    let html = '<div class="days">';
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
      html += `<div class="day-header">${day}</div>`;
    });
    html += '</div><div class="days">';

    // Calculate first day of the month (simplified: assumes epoch alignment)
    const daysSinceEpoch = (year - 1970) * 360 + (month - 1) * 30;
    const firstDay = (daysSinceEpoch % 7 + 7) % 7; // Adjust to ensure positive

    for (let i = 0; i < firstDay; i++) {
      html += '<div class="day"></div>';
    }

    for (let day = 1; day <= 30; day++) {
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const daysTotal = (year - 1970) * 360 + (month - 1) * 30 + (day - 1);
      const unixTime = daysTotal * msPer360Day;
      const gregDate = new Date(unixTime);
      const gregDateStr = `${gregDate.getFullYear()}-${String(gregDate.getMonth() + 1).padStart(2, "0")}-${String(
        gregDate.getDate()
      ).padStart(2, "0")}`;
      const isCurrent =
        gregDateStr ===
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const classes = isCurrent ? "day current-day" : "day";
      html += `<div class="${classes}" data-date="${dateStr}" data-greg="${gregDateStr}">${day}</div>`;
    }
    html += "</div>";
    container.innerHTML = html;
  }

  // Convert Gregorian to 360 days date
  function gregTo360(gregDateStr) {
    const date = new Date(gregDateStr);
    const unixTime = date.getTime();
    const daysSinceEpoch = Math.floor(unixTime / msPer360Day);
    const year360 = Math.floor(daysSinceEpoch / 360) + 1970;
    const dayOfYear360 = daysSinceEpoch % 360;
    const month360 = Math.floor(dayOfYear360 / 30) + 1;
    const day360 = (dayOfYear360 % 30) + 1;
    return `${year360}-${String(month360).padStart(2, "0")}-${String(day360).padStart(2, "0")}`;
  }

  // Convert 360 days to Gregorian date
  function calendar360ToGreg(date360) {
    const [yearStr, monthStr, dayStr] = date360.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const daysSinceEpoch = (year - 1970) * 360 + (month - 1) * 30 + (day - 1);
    const unixTime = daysSinceEpoch * msPer360Day;
    const gregDate = new Date(unixTime);
    return `${gregDate.getFullYear()}-${String(gregDate.getMonth() + 1).padStart(2, "0")}-${String(
      gregDate.getDate()
    ).padStart(2, "0")}`;
  }

  // Highlight selected dates
  function highlightSelectedDates(gregDate, date360) {
    const allDays = document.querySelectorAll(".day");
    allDays.forEach((d) => d.classList.remove("selected-day"));
    const gregDay = document.querySelector(`.day[data-date="${gregDate}"]`);
    const day360 = document.querySelector(`.day[data-date="${date360}"]`);
    if (gregDay) gregDay.classList.add("selected-day");
    if (day360) day360.classList.add("selected-day");
  }

  // Date selection handling with month syncing
  function handleDateSelection(event) {
    if (!event.target.classList.contains("day") || event.target.classList.contains("day-header")) return;

    const day = event.target;
    let gregDate, date360;

    if (day.closest(".gregorian")) {
      gregDate = day.dataset.date;
      date360 = gregTo360(gregDate);
      const [targetYear360, targetMonth360] = date360.split("-").map((part, idx) => (idx === 0 ? parseInt(part, 10) : parseInt(part, 10)));
      if (targetMonth360 !== month360 || targetYear360 !== year360) {
        month360 = targetMonth360;
        year360 = targetYear360;
        generate360Calendar(month360, year360);
      }
    } else if (day.closest(".calendar-360")) {
      date360 = day.dataset.date;
      gregDate = calendar360ToGreg(date360);
      const gregDateObj = new Date(gregDate);
      if (gregDateObj.getMonth() !== gregMonth || gregDateObj.getFullYear() !== gregYear) {
        gregMonth = gregDateObj.getMonth();
        gregYear = gregDateObj.getFullYear();
        generateGregorianCalendar(gregMonth, gregYear);
      }
    }

    highlightSelectedDates(gregDate, date360);
  }

  // Attach event listeners using delegation
  document.querySelector(".gregorian").addEventListener("click", handleDateSelection);
  document.querySelector(".calendar-360").addEventListener("click", handleDateSelection);

  // Navigation handlers
  document.getElementById("greg-prev").addEventListener("click", () => {
    gregMonth--;
    if (gregMonth < 0) {
      gregMonth = 11;
      gregYear--;
    }
    generateGregorianCalendar(gregMonth, gregYear);
  });

  document.getElementById("greg-next").addEventListener("click", () => {
    gregMonth++;
    if (gregMonth > 11) {
      gregMonth = 0;
      gregYear++;
    }
    generateGregorianCalendar(gregMonth, gregYear);
  });

  document.getElementById("prev-360").addEventListener("click", () => {
    month360--;
    if (month360 < 1) {
      month360 = 12;
      year360--;
    }
    generate360Calendar(month360, year360);
  });

  document.getElementById("next-360").addEventListener("click", () => {
    month360++;
    if (month360 > 12) {
      month360 = 1;
      year360++;
    }
    generate360Calendar(month360, year360);
  });

  // Reset to today handler for multiple buttons
  document.querySelectorAll(".reload").forEach((btn) => {
    btn.addEventListener("click", () => {
      const today = new Date();
      gregMonth = today.getMonth();
      gregYear = today.getFullYear();
      const daysSinceEpoch = Math.floor(today.getTime() / msPer360Day);
      year360 = Math.floor(daysSinceEpoch / 360) + 1970;
      month360 = Math.floor((daysSinceEpoch % 360) / 30) + 1;

      generateGregorianCalendar(gregMonth, gregYear);
      generate360Calendar(month360, year360);
    });
  });

  // Tab functionality for code examples
  function setupTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tabButtons = container.querySelectorAll(".tab-button");
    const tabPanes = container.querySelectorAll(".tab-pane");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabPanes.forEach((pane) => pane.classList.remove("active"));
        button.classList.add("active");
        const tabId = button.dataset.tab;
        container.querySelector(`#${tabId}`).classList.add("active");
      });
    });
  }

  setupTabs("today-examples");
  setupTabs("convert-examples");

  // Initialize
  generateGregorianCalendar(gregMonth, gregYear);
  generate360Calendar(month360, year360);
});