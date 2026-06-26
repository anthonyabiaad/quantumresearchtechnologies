Quantum Research Technologies website

Files included:
- index.html
- styles.css
- script.js
- qrt-logo.jpeg

GitHub Pages setup:
1. Upload these four website files directly to the root of your GitHub repository.
2. Do not put qrt-logo.jpeg inside an assets folder. The site now expects the logo file at: qrt-logo.jpeg
3. In your repository, go to Settings > Pages.
4. Under Build and deployment, select Deploy from a branch.
5. Select the main branch and root folder, then save.

Updated content:
- Navigation and page order: News, Board, Directory, Join.
- Board section includes the QRT history after the Quantum Computing Hackathon with the City of London Corporation and IBM.
- Directory loads from the public Google Sheets CSV and sorts alphabetically by FAMILY NAME.
- WhatsApp button uses a WhatsApp Web link.
- The Share text was shortened as requested.

Directory CSV source:
https://docs.google.com/spreadsheets/d/e/2PACX-1vRFXYPMndMvhgX4zzXwgJRA5mqwkDrCSCPPyv7UMgVpubPmj1fGSSE8YWMqTWj4ZwEKCm0_t_Prnx-7/pub?gid=2012131818&single=true&output=csv

Important:
If the directory does not load locally when opening index.html directly, test after publishing on GitHub Pages. Some browsers restrict fetch requests from local files.
