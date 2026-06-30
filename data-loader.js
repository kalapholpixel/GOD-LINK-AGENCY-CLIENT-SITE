// Load shared data from admin site
async function loadSharedData() {
  try {
    // Try loading from the admin site's data folder
    const response = await fetch('../PROPERTY-SALES-ADMIN/data/data.json');
    
    if (!response.ok) {
      throw new Error('Failed to load admin data');
    }
    
    const data = await response.json();
    window.siteContent = data;
    
    console.log('✓ Loaded data from admin site');
    
    // Trigger any data-dependent initializations
    if (window.onDataLoaded) {
      window.onDataLoaded();
    }
  } catch (error) {
    console.warn('Could not load from admin site, using fallback data');
    
    // Fallback: use the bundled content-template.js
    if (!window.siteContent) {
      console.error('No fallback data available');
      return;
    }
  }
}

// Load data when script runs
loadSharedData();
