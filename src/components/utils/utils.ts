// utils.ts

/**
 * Formats a date string into a human-readable format.
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} The formatted date string.
 */
export const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };
  
  /**
   * Capitalizes the first letter of a given priority string.
   * @param {string} priority - The priority string to capitalize.
   * @returns {string} The capitalized priority string.
   */
  export const capitalizePriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };