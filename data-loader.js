// Load shared data from admin site
async function loadSharedData() {
  const dataSources = [
    'https://raw.githubusercontent.com/kalapholpixel/PROPERTY-SALES-ADMIN/main/data/data.json',
    '../PROPERTY-SALES-ADMIN/data/data.json'
  ];

  for (const path of dataSources) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Fetch failed: ${response.status}`);
      }
      const data = await response.json();
      window.siteContent = data;
      console.log(`✓ Loaded data from admin site: ${path}`);
      if (window.onDataLoaded) {
        window.onDataLoaded();
      }
      return;
    } catch (error) {
      console.warn(`Could not load admin data from ${path}:`, error.message);
    }
  }

  console.warn('Could not load data from admin site, using fallback data');
  if (!window.siteContent) {
    console.error('No fallback data available');
    return;
  }
}

// Load data when script runs
loadSharedData();
