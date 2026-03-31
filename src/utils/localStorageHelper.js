const STORAGE_KEY = "uploaded_images";

export const getImages = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveImages = (images) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
};

export const addImages = (newImages) => {
  const existing = getImages();
  const updated = [...newImages, ...existing];
  saveImages(updated);
  return updated;
};

export const removeImage = (id) => {
  const existing = getImages();
  const updated = existing.filter((img) => img.id !== id);
  saveImages(updated);
  return updated;
};

export const updateImageName = (id, newName) => {
  const existing = getImages();
  const updated = existing.map((img) =>
    img.id === id ? { ...img, name: newName } : img
  );
  saveImages(updated);
  return updated;
};
