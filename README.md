# 360 Days Calendar: A Precise and Consistent Timekeeping System
<![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
<![GitHub stars](https://img.shields.io/github/stars/dyablohunter/360dayscalendar.svg)
<![GitHub forks](https://img.shields.io/github/forks/dyablohunter/360dayscalendar.svg)

Welcome to the [360 Days Calendar](https://360days.org) project! This calendar system offers a modern, precise alternative to the Gregorian calendar. With 360 days divided into 12 months of 30 days each and a slightly longer second (1014.56 milliseconds), it aligns perfectly with the tropical year, eliminating the need for leap years or periodic corrections.

## About
The 360 Days Calendar redefines timekeeping by:
* Using 12 months of exactly 30 days each, totaling 360 days per year.
* Redefining the second to 1014.56 milliseconds to match the tropical year precisely.
* Eliminating the need for leap days or other adjustments, ensuring long-term accuracy.

## Features
* **Unmatched Precision**: Perfect alignment with the tropical year.
* **Perfect Consistency**: Uniform 30-day months for easy planning.
* **Simplified Structure**: Balanced and predictable calendar system.
* **Future-Proof Design**: No drift over centuries, no manual corrections needed.

## Usage
### API Usage
The API provides two main endpoints:
1. **/today**: Get today's date in both Gregorian and 360 Days calendars.
2. **/convert**: Convert a date from one calendar to the other.

**Example: Fetch Today's Date**
```javascript
fetch('https://360days.org/today')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

**Example: Convert a Date**
```javascript
fetch('https://360days.org/convert?date=2025-03-27&toCalendar=calendar360')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Web Interface
* Navigate between months using the arrow buttons.
* Click on a date to see its equivalent in the other calendar.
* Use the reload button to reset to today's date.

## Installation
1. Clone the repository: `git clone https://github.com/dyablohunter/360dayscalendar.git`
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
4. Open `http://localhost:3006` in your browser.

## Contributing
We welcome contributions! To contribute:
* Submit issues for bugs or feature requests.
* Fork the repository and make pull requests with improvements.

## License
This project is licensed under the MIT License.

## Contact
Email: [admin@360days.org](mailto:admin@360days.org)
