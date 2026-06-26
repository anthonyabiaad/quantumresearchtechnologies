const DIRECTORY_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFXYPMndMvhgX4zzXwgJRA5mqwkDrCSCPPyv7UMgVpubPmj1fGSSE8YWMqTWj4ZwEKCm0_t_Prnx-7/pub?gid=2012131818&single=true&output=csv";
const WHATSAPP_WEB_URL = "https://chat.whatsapp.com/DOwIi2uaRBGJnSZOlb8h3z";

let directoryMembers = [];

const boardMembers = [
  {
    name: "Co-founder I",
    role: "QRT Founding Board",
    description: "Contributes to the association's vision, community structure, and long-term academic-industry strategy. Replace this placeholder with the co-founder's name when ready."
  },
  {
    name: "Co-founder II",
    role: "QRT Founding Board",
    description: "Supports the development of partnerships, events, and initiatives connecting quantum research with industrial actors. Replace this placeholder with the co-founder's name when ready."
  },
  {
    name: "Co-founder III",
    role: "QRT Founding Board",
    description: "Helps coordinate the community, directory, and visibility of members working across quantum science and technology. Replace this placeholder with the co-founder's name when ready."
  }
];

const newsItems = [
  {
    date: "September 2025",
    title: "Legal registration of QRT",
    text: "Quantum Research Technologies was legally registered under PSL University, giving the association a formal structure to develop its academic and industrial mission."
  },
  {
    date: "4 December 2025",
    title: "First QRT event with Google",
    text: "QRT members were invited to the Google event “Révolution quantique, défis et perspectives technologiques”, where they had the opportunity to hear Michel Devoret and Alain Aspect, Nobel Prize-winning physicists."
  },
  {
    date: "28 April 2026",
    title: "First quantum computing bootcamp with ColibriTD",
    text: "QRT organized its first quantum computing bootcamp with ColibriTD at PSL Research University, open to students with a scientific and programming background — engineering, computer science, AI, and related fields — eager to learn about quantum computing for real-life applications. Your next professional opportunity might be in quantum.",
    location: "5 rue André Mazet",
    eventDate: "Tuesday, April 28"
  },
  {
    date: "10 June 2026",
    title: "Conference with ColibriTD on quantum methods for PDEs",
    text: "QRT hosted a conference with the quantum company ColibriTD at PSL Research University, focused on partial differential equations for medicine, climate, finance, and defence. The event was open to anyone eager to understand the quantum field for future positions or investments.",
    location: "3 rue Amyot, 75005 Paris",
    eventDate: "Wednesday, June 10"
  }
];

const directoryBody = document.querySelector("#directoryBody");
const directoryStatus = document.querySelector("#directoryStatus");
const searchInput = document.querySelector("#directorySearch");
const boardGrid = document.querySelector("#boardGrid");
const newsGrid = document.querySelector("#newsGrid");
const currentYear = document.querySelector("#currentYear");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeHeader(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value.trim());
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value.trim());
      if (row.some((cell) => cell !== "")) rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  row.push(value.trim());
  if (row.some((cell) => cell !== "")) rows.push(row);
  return rows;
}

function headerIndex(headers, acceptedNames) {
  const normalizedAccepted = acceptedNames.map(normalizeHeader);
  return headers.findIndex((header) => normalizedAccepted.includes(normalizeHeader(header)));
}

function getCell(row, headers, acceptedNames) {
  const index = headerIndex(headers, acceptedNames);
  return index >= 0 ? row[index] || "" : "";
}

function splitFullName(fullName) {
  const cleaned = String(fullName || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return { firstName: "", familyName: "" };

  if (cleaned.includes(",")) {
    const [family, ...rest] = cleaned.split(",").map((part) => part.trim()).filter(Boolean);
    return {
      firstName: rest.join(" "),
      familyName: family || ""
    };
  }

  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length === 1) return { firstName: parts[0], familyName: "" };

  const isUpperNamePart = (part) => {
    const letters = part.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
    return letters.length > 1 && letters === letters.toUpperCase();
  };

  let uppercaseTailStart = parts.length;
  while (uppercaseTailStart > 0 && isUpperNamePart(parts[uppercaseTailStart - 1])) {
    uppercaseTailStart -= 1;
  }

  if (uppercaseTailStart > 0 && uppercaseTailStart < parts.length) {
    return {
      firstName: parts.slice(0, uppercaseTailStart).join(" "),
      familyName: parts.slice(uppercaseTailStart).join(" ")
    };
  }

  return {
    firstName: parts[0],
    familyName: parts.slice(1).join(" ")
  };
}

function mapDirectoryRows(rows) {
  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1)
    .map((row) => {
      const fullName = getCell(row, headers, ["NAME", "Full Name", "Full name", "Nom complet"]);
      let familyName = getCell(row, headers, ["FAMILY NAME", "Family Name", "Last Name", "Surname", "Nom", "Nom de famille"]);
      let firstName = getCell(row, headers, ["FIRST NAME", "First Name", "Given Name", "Forename", "Prenom", "Prénom"]);

      if ((!familyName || !firstName) && fullName) {
        const splitName = splitFullName(fullName);
        if (!firstName) firstName = splitName.firstName;
        if (!familyName) familyName = splitName.familyName;
      }

      const keywords = getCell(row, headers, [
        "KEYWORDS",
        "Keywords",
        "Keywords about your research",
        "Research Keywords",
        "Research keywords",
        "Research field",
        "Research fields",
        "Field",
        "Domain"
      ]);

      const institution = getCell(row, headers, [
        "PhD institution",
        "Institution",
        "University",
        "Laboratory",
        "Lab",
        "Company",
        "Current institution",
        "Current Institution",
        "Institution / University / Company",
        "Institution/University/Company",
        "University / Company",
        "University/Company",
        "Affiliation"
      ]);

      const role = getCell(row, headers, [
        "Role",
        "Position",
        "Status",
        "Current position",
        "Current Position",
        "Current status",
        "Current Status",
        "Profile",
        "Degree",
        "Level"
      ]);

      return {
        familyName,
        firstName,
        keywords,
        institution,
        role
      };
    })
    .filter((member) => Object.values(member).some((value) => String(value).trim() !== ""))
    .sort((a, b) => {
      const familyComparison = a.familyName.localeCompare(b.familyName, undefined, { sensitivity: "base" });
      if (familyComparison !== 0) return familyComparison;
      return a.firstName.localeCompare(b.firstName, undefined, { sensitivity: "base" });
    });
}

function renderDirectory(filter = "") {
  const normalizedFilter = filter.trim().toLowerCase();
  const filteredMembers = directoryMembers.filter((member) => {
    return Object.values(member).join(" ").toLowerCase().includes(normalizedFilter);
  });

  if (filteredMembers.length === 0) {
    directoryBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="5">No matching member yet. Try another keyword or add your profile through the form.</td>
      </tr>
    `;
    return;
  }

  directoryBody.innerHTML = filteredMembers.map((member) => `
    <tr>
      <td><strong>${escapeHTML(member.familyName || "—")}</strong></td>
      <td>${escapeHTML(member.firstName || "—")}</td>
      <td>${escapeHTML(member.keywords || "—")}</td>
      <td>${escapeHTML(member.institution || "—")}</td>
      <td>${escapeHTML(member.role || "—")}</td>
    </tr>
  `).join("");
}

async function loadDirectory() {
  try {
    const response = await fetch(DIRECTORY_CSV_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`CSV request failed with status ${response.status}`);

    const csvText = await response.text();
    const rows = parseCSV(csvText);
    directoryMembers = mapDirectoryRows(rows);

    if (directoryStatus) {
      directoryStatus.hidden = true;
      directoryStatus.textContent = "";
    }

    renderDirectory(searchInput.value);
  } catch (error) {
    directoryMembers = [];
    if (directoryStatus) {
      directoryStatus.hidden = false;
      directoryStatus.innerHTML = `The public directory could not be loaded automatically. <a href="${DIRECTORY_CSV_URL}" target="_blank" rel="noopener noreferrer">Open the data sheet</a>.`;
    }
    renderDirectory(searchInput.value);
    console.error(error);
  }
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderBoard() {
  boardGrid.innerHTML = boardMembers.map((member) => `
    <article class="board-card">
      <div class="board-avatar" aria-hidden="true">${escapeHTML(initials(member.name))}</div>
      <h3>${escapeHTML(member.name)}</h3>
      <span class="board-role">${escapeHTML(member.role)}</span>
      <p>${escapeHTML(member.description)}</p>
    </article>
  `).join("");
}

function renderNews() {
  newsGrid.innerHTML = newsItems.map((item) => {
    const isExternal = item.link && item.link.startsWith("http");
    const details = [item.location, item.eventDate]
      .filter(Boolean)
      .map((detail) => `<span>${escapeHTML(detail)}</span>`)
      .join("");
    const detailsBlock = details ? `<div class="news-details">${details}</div>` : "";
    const linkBlock = item.link ? `<a class="news-link" href="${escapeHTML(item.link)}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""}>Read more</a>` : "";

    return `
      <article class="news-card">
        <span class="news-date">${escapeHTML(item.date)}</span>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.text)}</p>
        ${detailsBlock}
        ${linkBlock}
      </article>
    `;
  }).join("");
}

function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

searchInput.addEventListener("input", (event) => {
  renderDirectory(event.target.value);
});

menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

currentYear.textContent = new Date().getFullYear();
renderBoard();
renderNews();
loadDirectory();
setupRevealAnimations();
