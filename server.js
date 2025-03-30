const express = require("express");
const app = express();
const port = 3007;

app.use(express.static("public_html"));

// API route to show today's dates in both calendars
app.get("/today", (req, res) => {
  const now = new Date();
  const unixTime = now.getTime(); // Standard UNIX time in milliseconds
  const gregorianDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Calculate 360 days calendar date
  // Tropical year ~ 365.2422 days * 24 * 60 * 60 * 1000 ms = 31,556,925,888 ms
  // 360 days calendar year = 360 days * 24 * 60 * 60 * 1014.5616 ms = 31,556,925,888 ms
  const msPer360Day = 24 * 60 * 60 * 1014.5616; // Milliseconds in a 360-day calendar day
  const daysSinceEpoch = Math.floor(unixTime / msPer360Day); // Days since 1970-01-01 in 360 calendar
  const year360 = Math.floor(daysSinceEpoch / 360) + 1970;
  const dayOfYear360 = daysSinceEpoch % 360; // 0 to 359
  const month360 = Math.floor(dayOfYear360 / 30) + 1; // 1 to 12
  const day360 = (dayOfYear360 % 30) + 1; // 1 to 30

  const calendar360Date = `${year360}-${String(month360).padStart(2, "0")}-${String(day360).padStart(2, "0")}`;

  res.json({
    gregorian: gregorianDate,
    calendar360: calendar360Date,
    unix: unixTime,
  });
});

// API route to convert dates between calendars
app.get("/convert", (req, res) => {
  const { date, toCalendar } = req.query;

  // Validate input
  if (!date) {
    return res.status(400).json({ error: "Date parameter is required" });
  }
  if (!toCalendar || !["gregorian", "calendar360"].includes(toCalendar)) {
    return res.status(400).json({ error: 'toCalendar must be "gregorian" or "calendar360"' });
  }

  let inputDate;

  // Parse the date parameter
  if (!isNaN(date) && Number(date) > 0) {
    // UNIX timestamp in milliseconds
    inputDate = new Date(Number(date));
  } else {
    // ISO date string (YYYY-MM-DD)
    inputDate = new Date(date);
  }

  if (isNaN(inputDate.getTime()) && !date.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
    return res.status(400).json({
      error: "Invalid date format. Use UNIX timestamp or ISO date (YYYY-MM-DD)",
    });
  }

  const msPer360Day = 24 * 60 * 60 * 1014.5616; // Milliseconds per 360 calendar day
  const msPerGregDay = 24 * 60 * 60 * 1000; // Milliseconds per Gregorian day

  if (toCalendar === "calendar360") {
    // Convert from Gregorian to 360 days calendar
    const year = inputDate.getFullYear();
    const startOfYear = new Date(year, 0, 1).getTime();
    const msSinceYearStart = inputDate.getTime() - startOfYear;
    const daysSinceYearStart = msSinceYearStart / msPerGregDay;
    const total360Days = Math.floor((year - 1970) * 365.2422 * (1000 / 1014.5616)) + daysSinceYearStart * (1000 / 1014.5616);
    const year360 = Math.floor(total360Days / 360) + 1970;
    const dayOfYear360 = total360Days % 360;
    const month360 = Math.floor(dayOfYear360 / 30) + 1;
    const day360 = (dayOfYear360 % 30) + 1;

    const calendar360Date = `${year360}-${String(month360).padStart(2, "0")}-${String(day360).padStart(2, "0")}`;

    res.json({
      input: {
        gregorian: `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, "0")}-${String(inputDate.getDate()).padStart(2, "0")}`,
        unix: inputDate.getTime(),
      },
      result: {
        calendar360: calendar360Date,
        unix: inputDate.getTime(),
      },
    });
  } else if (toCalendar === "gregorian") {
    // Convert from 360 days calendar to Gregorian
    const dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!dateMatch) {
      return res.status(400).json({
        error: "Invalid 360 calendar format. Use YYYY-MM-DD",
      });
    }

    const [_, year360Str, month360Str, day360Str] = dateMatch;
    const year360 = parseInt(year360Str, 10);
    const month360 = parseInt(month360Str, 10);
    const day360 = parseInt(day360Str, 10);

    if (month360 < 1 || month360 > 12 || day360 < 1 || day360 > 30) {
      return res.status(400).json({ error: "Month must be 1-12 and day must be 1-30" });
    }

    const daysSinceEpoch360 = (year360 - 1970) * 360 + (month360 - 1) * 30 + (day360 - 1);
    const unixTime = daysSinceEpoch360 * msPer360Day;
    const gregDate = new Date(unixTime);

    res.json({
      input: {
        calendar360: date,
        unix: unixTime,
      },
      result: {
        gregorian: `${gregDate.getFullYear()}-${String(gregDate.getMonth() + 1).padStart(2, "0")}-${String(gregDate.getDate()).padStart(2, "0")}`,
        unix: unixTime,
      },
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});