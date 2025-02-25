export const generateUniqueId = (): string => {
  try {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  } catch (error) {
    console.error('Error generating ID:', error);
    return `id-${new Date().getTime()}-${Math.floor(Math.random() * 100000)}`;
  }
}; 