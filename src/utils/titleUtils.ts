export const updateDocumentTitle = (isAuthenticated: boolean, isAdmin = false) => {
  if (!isAuthenticated) {
    document.title = "Algee";
  } else if (isAdmin) {
    document.title = "Algee - System Administrator";
  } else {
    document.title = "Algee - Africa's Premium Credit Intelligence";
  }
}; 