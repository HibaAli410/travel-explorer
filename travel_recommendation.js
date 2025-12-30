const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
// Country → Timezone mapping
const timeZones = {
  brazil: "America/Sao_Paulo",
  australia: "Australia/Sydney",
  india: "Asia/Kolkata",
  japan: "Asia/Tokyo"
};

// Function to get current time by timezone
function getCurrentTime(country) {
  const tz = timeZones[country.toLowerCase()];
  if (!tz) return null;

  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  }).format(new Date());
}

const dataUrl = "./travel_recommendation.json";

let travelData = [];

// load local JSON
axios.get(dataUrl)
  .then(res => {
    const data = res.data;
    travelData = [];

    // Countries → Cities
    data.countries.forEach(country => {
      country.cities.forEach(city => {
        travelData.push({
          title: city.name,
          description: city.description,
          image: city.imageUrl || "https://via.placeholder.com/400x250",
          category: "countries",
          country: country.name
        });
      });
    });

    // Temples
    data.temples.forEach(item => {
      travelData.push({
        title: item.name,
        description: item.description,
        image: item.imageUrl || "https://via.placeholder.com/400x250",
        category: "temples"
      });
    });

    // Beaches
    data.beaches.forEach(item => {
      travelData.push({
        title: item.name,
        description: item.description,
        image: item.imageUrl || "https://via.placeholder.com/400x250",
        category: "beaches"
      });
    });

    console.log("Data ready:", travelData.length);
  })
  .catch(err => console.error("JSON load error:", err));


// ✅ Display cards
function displayResults(items) {
  resultsContainer.innerHTML = '';

  if (!items.length) {
    resultsContainer.innerHTML =
      '<p class="text-gray-500 col-span-full text-center">No results found.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className =
      "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col";

    const currentTime = item.country ? getCurrentTime(item.country) : null;

    card.innerHTML = `
      <img src="${item.image}" class="w-full h-40 object-cover">

      <div class="p-4 flex flex-col flex-grow">
        <span class="text-xs text-blue-600 font-semibold uppercase">
          ${item.category}
        </span>

        <h3 class="text-lg font-bold mt-1">${item.title}</h3>

        <p class="text-sm text-gray-600 mt-2 line-clamp-2">
          ${item.description}
        </p>

        ${currentTime ? `
          <p class="text-sm text-green-600 font-semibold mt-2">
            🕒 Local Time (${item.country}): ${currentTime}
          </p>` : ''}

        <button 
          class="book-btn mt-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          data-destination="${item.title}">
          Book Now
        </button>
      </div>
    `;

    resultsContainer.appendChild(card);
  });

  // ✅ ADD EVENT LISTENERS HERE (IMPORTANT)
  document.querySelectorAll('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const destination = btn.dataset.destination;
      window.location.href =
        `book-now.html?destination=${encodeURIComponent(destination)}`;
    });
  });
}




// ✅ SEARCH LOGIC (CATEGORY + KEYWORD)
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;

  let filtered = [];

  // 🔥 CATEGORY SEARCH
  if (query === "temples" || query === "temple") {
    filtered = travelData.filter(item => item.category === "temples");

  } else if (query === "beaches" || query === "beach") {
    filtered = travelData.filter(item => item.category === "beaches");

  } else if (query === "countries" || query === "country") {
    filtered = travelData.filter(item => item.category === "countries");

  } else {
    // 🔍 NORMAL SEARCH
    filtered = travelData.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }

  displayResults(filtered);
});

// Enter key support
searchInput.addEventListener('keydown', e => {
  if (e.key === "Enter") searchBtn.click();
});

// Clear
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  resultsContainer.innerHTML = '';
});
