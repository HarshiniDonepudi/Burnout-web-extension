# Burnout Tracker Chrome Extension

The **Burnout Tracker** is a Chrome extension designed to help users monitor their browsing habits and detect early signs of burnout. It tracks activity such as time spent on work vs. leisure websites, tab switching rates, and stress-related searches. In addition, the extension prompts users with periodic check‑in questions—focusing on time-related factors—that lock the screen until an answer is submitted.

Data is sent immediately to a Google Sheet via a Google Apps Script web app, allowing you to review and analyze your metrics over time. [Link Text](https://docs.google.com/spreadsheets/d/11vdEADa618aJelUlYplTn0oNLHTi1qBi5e5-Ctj6Fe8/edit?gid=0#gid=0)


## Features

- **Activity Metrics Tracking**
  - **Work vs. Leisure Time:** Measures the actual time (in milliseconds, later converted to minutes) spent on work-related and leisure-related websites.
  - **Tab Switching Rate:** Tracks the number of times you switch tabs and calculates a rate (switches per minute).
  - **Stress-Related Searches:** Detects search queries containing keywords like "burnout", "stress", etc.
- **Periodic Check-In**
  - Every 4th new tab triggers a check-in page.
  - The check-in page captures a screenshot of your current browser view and displays a full‑screen overlay with a frosted-glass (glass effect) interface.
  - **Single Random Question:** Only one randomly chosen burnout-related question is displayed at a time.
  - **Expanded Time‑Related Questions:** Questions address sleep quality, work hours, break frequency, continuous work periods, leisure time, and work-life balance.
  - The interface is styled with a soothing pastel blue, pink, and yellow theme.
- **Immediate Data Sync**
  - Data is sent immediately to a Google Sheet via a deployed Google Apps Script web app.
- **User Setup**
  - On first use, the extension opens a setup page to capture your name, industry, job role, and work arrangement.

## Mapping of Check-In Questions to Data Metrics

The check‑in questions are designed not only to prompt self-reflection but also to record specific data metrics. The mapping is as follows:

### Morning (5 AM – 12 PM)
- **`sleep_quality`**: *How well did you sleep last night? (Scale 1-10)*
- **`hours_sleep`**: *How many hours of sleep did you get? (Number)* ( Not including ) 
- **`morning_energy`**: *What's your energy level this morning? (Scale 1-10)*
- **`morning_mood`**: *How are you feeling this morning? (Scale 1-10)*

### Afternoon (12 PM – 5 PM)
- **`stress`**: *How would you rate your stress levels so far? (Scale 1-10)*
- **`hours_worked_so_far`**: *How many hours have you worked so far today? (Number)*
- **`breaks_taken`**: *How many breaks have you taken today? (Number)*
- **`last_break_duration`**: *How long was your last break (in minutes)? (Number)*
- **`productivity`**: *How productive do you feel today? (Scale 1-10)*

### Evening (After 5 PM)
- **`satisfaction`**: *How satisfied are you with today's work? (Scale 1-10)*
- **`hours_worked_total`**: *How many hours did you work today? (Number)*
- **`continuous_work`**: *What is the longest period you worked continuously without a break (in minutes)? (Number)*
- **`leisure_minutes`**: *How many minutes of leisure time did you have today? (Number)*
- **`overall_balance`**: *How would you rate your work-life balance today? (Scale 1-10)*
- **`evening_mood`**: *How are you feeling this evening? (Scale 1-10)*

Each question’s answer is captured and sent immediately to your Google Sheet along with the event type (e.g., `periodicResponse`).

## File Structure

- **manifest.json**: Defines permissions, background scripts, and UI elements.
- **background.js**: Contains the service worker that tracks metrics, syncs data to Google Sheets, and manages the check‑in state (blocking new tabs while a check‑in is active).
- **popup.html & popup.js**: Provide a popup interface displaying real-time activity metrics.
- **setup.html & setup.js**: Capture initial user information.
- **questions.html & questions.js**: Display a single, randomly chosen check‑in question (based on time) with a pastel glass theme. The page locks the interface and captures a screenshot until the user submits an answer.
- **assets/icons/**: Contains the extension’s icon images.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/burnout-tracker-extension.git
   cd burnout-tracker-extension

