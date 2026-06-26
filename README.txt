Quantum Research Technologies website

Files included:
- index.html
- styles.css
- script.js
- qrt-logo.jpeg

How to publish on GitHub Pages:
1. Upload these files directly to the root of your GitHub repository.
2. Make sure the logo file remains named exactly: qrt-logo.jpeg
3. In GitHub, go to Settings > Pages.
4. Choose the main branch and root folder.
5. Wait for GitHub Pages to publish the site.

Main editable sections:
- News items: edit the newsItems array in script.js.
- Board members: edit the boardMembers array in script.js.
- Directory: the site loads the public Google Sheets CSV and sorts members alphabetically by family name.
- WhatsApp group: update WHATSAPP_WEB_URL in script.js and the two button links in index.html if the invite link changes.

Current update:
- Removed the repeated Board intro paragraph.
- Hid the automatic directory loading counter.
- Removed the example from the directory search placeholder.
- Improved full-name parsing so names such as Anthony ABI AAD appear correctly as first name Anthony and family name ABI AAD.
- Replaced the News section with the four QRT events/milestones.
- Updated the WhatsApp link to the standard chat.whatsapp.com invite format.
