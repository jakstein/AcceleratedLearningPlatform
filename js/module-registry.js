// ===========================================
// Module Registry
// Must load BEFORE module files
// ===========================================

// ============================================
// CUSTOMIZE: You can rename this if desired
// The name is used internally - modules register here
// ============================================

// Module registry array
window.LearningModules = [];

// Function to register modules
window.registerModule = function(module) {
    window.LearningModules.push(module);
};
