const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getBanners = async () => {
  const response = await fetch(`${API_BASE_URL}/banner/get-all`);

  if (!response.ok) {
    throw new Error("Bannerlarni olishda xatolik yuz berdi");
  }

  return response.json();
};