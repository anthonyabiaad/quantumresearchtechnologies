const directoryMembers = [
  {
    name: "Directory opening soon",
    keywords: "Quantum optics · Photonics · Quantum information · Industry links",
    institution: "Submit your profile through the form",
    role: "Community member"
  }
];

const boardMembers = [
  {
    name: "Founding Board",
    role: "Strategy & Community",
    description: "Coordinates the global vision of QRT and develops the bridge between academic research and quantum companies."
  },
  {
    name: "Academic Relations",
    role: "Laboratories & Researchers",
    description: "Builds connections with universities, research groups, PhD students, postdocs, and academic supervisors."
  },
  {
    name: "Industry Partnerships",
    role: "Companies & Startups",
    description: "Creates links with quantum startups, industrial laboratories, investors, and technology transfer actors."
  }
];

const newsItems = [
  {
    date: "Launching soon",
    title: "Quantum Research Technologies is taking shape",
    text: "QRT is being built as a community where academia meets the quantum industry, with a focus on visibility, collaboration, and opportunity sharing.",
    link: "#join"
  },
  {
    date: "Directory",
    title: "A public directory for quantum profiles",
    text: "Members can submit their research keywords, institution, and profile information to help the community find collaborators and expertise more easily.",
    link: "#directory"
  },
  {
    date: "Community",
    title: "Join the QRT WhatsApp group",
    text: "The WhatsApp group will be used to share events, talks, opportunities, and updates relevant to quantum science and technology.",
    link: "https://chat.whatsapp.com/DOwIi2uaRBGJnSZOlb8h3z?mode=gi_t"
  }
];

const directoryBody = document.querySelector("#directoryBody");
const searchInput = document.querySelector("#directorySearch");
const boardGrid = document.querySelector("#boardGrid");
const newsGrid = document.querySelector("#newsGrid");
const currentYear = document.querySelector("#currentYear");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function renderDirectory(filter = "") {
  const normalizedFilter = filter.trim().toLowerCase();
  const filteredMembers = directoryMembers.filter((member) => {
    return Object.values(member).join(" ").toLowerCase().includes(normalizedFilter);
  });

  if (filteredMembers.length === 0) {
    directoryBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">No matching member yet. Try another keyword or add your profile through the form.</td>
      </tr>
    `;
    return;
  }

  directoryBody.innerHTML = filteredMembers.map((member) => `
    <tr>
      <td><strong>${member.name}</strong></td>
      <td>${member.keywords}</td>
      <td>${member.institution}</td>
      <td>${member.role}</td>
    </tr>
  `).join("");
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
      <div class="board-avatar" aria-hidden="true">${initials(member.name)}</div>
      <h3>${member.name}</h3>
      <span class="board-role">${member.role}</span>
      <p>${member.description}</p>
    </article>
  `).join("");
}

function renderNews() {
  newsGrid.innerHTML = newsItems.map((item) => {
    const isExternal = item.link.startsWith("http");
    return `
      <article class="news-card">
        <span class="news-date">${item.date}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <a class="news-link" href="${item.link}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""}>Read more</a>
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
renderDirectory();
renderBoard();
renderNews();
setupRevealAnimations();
