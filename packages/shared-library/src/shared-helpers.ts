
// STRING RELATED FUNCTIONS

/**
 * Truncates a text string to a specified maximum length and appends ellipsis if necessary.
 *
 * @param {string} txt - The input text to be truncated.
 * @param {number} maxLength - The maximum length of the truncated text.
 * @returns {string} The truncated text with ellipsis if needed.
 *
 * @example
 * const truncatedText = truncateText("Lorem ipsum dolor sit amet", 10);
 */
export const truncateText = (txt: string, maxLength: number): string => {
    if (txt.length <= maxLength) return txt;
    else return txt.substring(0, maxLength) + "...";
  };
  
  export const firstLetterUppercase = (txt: string) => {
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  };
  
  export const generateClassId = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    const timestamp = new Date().getTime();
    const classId = `${randomString}-${timestamp}`;
    return classId;
  };
  