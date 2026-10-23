const DATA_URL = "data/roms.json";

const fallbackData = {
  devices: {
    Pacman: {
      name: "Nothing Phone (2a)",
      codename: "Pacman",
      description: "MediaTek Dimensity 7200 Pro · Codename: Pacman",
      maintainer: "AxionOS Team",
      builds: [{
        version: "Alpha V1",
        android: "Android 14",
        securityPatch: "2024-11-01",
        date: "Add date",
        type: "Fastboot Only",
        summary: "Add your latest ROM build details in data/roms.json.",
        downloadUrl: "",
        changelogUrl: "",
        sourceUrl: "https://github.com/",
        status: "DEMO DATA"
      }]
    },
    Pong: {
      name: "Nothing Phone (2)",
      codename: "Pong",
      description: "Nothing Phone (2) · Codename: Pong",
      maintainer: "AxionOS Team",
      builds: []
    },
    Spacewar: {
      name: "POCO F4",
      codename: "Spacewar",
      description: "POCO F4 · Codename: Spacewar",
      maintainer: "AxionOS Team",
      builds: []
    }
  }
};

let romData = fallbackData;
const $ = (id) => document.getElementById(id);

function safeText(value, fallback = "—") {
  return value === undefined || value === null || value === "" ? fallback : String(value);
}

function renderDevice(codename) {
  const device = romData.devices?.[codename];
  if (!device) return;

  $("deviceTitle").textContent = safeText(device.name);
  $("deviceDescription").textContent = safeText(device.description, `Codename: ${codename}`);
  $("deviceCodename").textContent = safeText(device.codename, codename);

  const builds = Array.isArray(device.builds) ? device.builds : [];
  const latest = builds[0];

  if (!latest) {
    $("releaseVersion").innerHTML = "No releases <span>COMING SOON</span>";
    $("releaseSummary").textContent = "No builds have been added for this device yet.";
    $("securityPatch").textContent = "—";
    $("releaseDate").textContent = "—";
    $("packageType").textContent = "—";
    $("releaseStatus").textContent = "NO BUILDS";
    $("downloadButton").href = "#";
    $("downloadButton").classList.add("disabled");
    $("downloadButton").setAttribute("aria-disabled", "true");
    $("downloadNote").textContent = "Add a release entry to data/roms.json to enable downloads.";
    $("changelogLink").href = "#";
    $("sourceLink").href = "https://github.com/";
  } else {
    $("releaseVersion").innerHTML = "";
    $("releaseVersion").append(document.createTextNode(safeText(latest.version, "Latest build")));
    const android = document.createElement("span");
    android.textContent = safeText(latest.android, "Android");
    $("releaseVersion").append(android);
    $("releaseSummary").textContent = safeText(latest.summary, "Latest release information.");
    $("securityPatch").textContent = safeText(latest.securityPatch);
    $("releaseDate").textContent = safeText(latest.date);
    $("packageType").textContent = safeText(latest.type);
    $("releaseStatus").textContent = safeText(latest.status, "AVAILABLE");
    const button = $("downloadButton");
    if (latest.downloadUrl) {
      button.href = latest.downloadUrl;
      button.classList.remove("disabled");
      button.removeAttribute("aria-disabled");
      $("downloadNote").textContent = "Check the installation guide before flashing.";
    } else {
      button.href = "#";
      button.classList.add("disabled");
      button.setAttribute("aria-disabled", "true");
      $("downloadNote").textContent = "Add your actual download URL in data/roms.json.";
    }
    $("changelogLink").href = latest.changelogUrl || "#";
    $("sourceLink").href = latest.sourceUrl || "https://github.com/";
  }

  $("archiveCount").textContent = `${builds.length} release${builds.length === 1 ? "" : "s"}`;
  const body = $("historyBody");
  body.replaceChildren();
  if (!builds.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent = "No releases yet. Add build entries to data/roms.json.";
    row.append(cell);
    body.append(row);
    return;
  }

  builds.forEach((build) => {
    const row = document.createElement("tr");
    const values = [
      { text: safeText(build.version), className: "build-tag" },
      { text: safeText(build.android) },
      { text: safeText(build.date) },
      { text: safeText(build.type) }
    ];
    values.forEach((item, index) => {
      const cell = document.createElement("td");
      if (index === 0) {
        const strong = document.createElement("strong");
        strong.className = item.className;
        strong.textContent = item.text;
        cell.append(strong);
      } else cell.textContent = item.text;
      row.append(cell);
    });
    const downloadCell = document.createElement("td");
    if (build.downloadUrl) {
      const link = document.createElement("a");
      link.className = "table-download";
      link.href = build.downloadUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "Download ↗";
      downloadCell.append(link);
    } else {
      downloadCell.textContent = "Link not added";
      downloadCell.style.color = "#747d8c";
    }
    row.append(downloadCell);
    body.append(row);
  });
}

async function init() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (response.ok) romData = await response.json();
  } catch (error) {
    // Local preview or a missing JSON file: keep the built-in demo data.
  }
  const select = $("deviceSelect");
  renderDevice(select.value);
  select.addEventListener("change", () => {
    const hash = `#${select.value}`;
    history.replaceState(null, "", hash);
    renderDevice(select.value);
  });
  const hashDevice = decodeURIComponent(location.hash.slice(1));
  if (hashDevice && romData.devices?.[hashDevice]) {
    select.value = hashDevice;
    renderDevice(hashDevice);
  }
}

init();
