// Utility to fetch recent projects (mocked for now)
export type Project = {
  id: string;
  name: string;
  updatedAt: string;
};

export const getRecentProjects = async (): Promise<Project[]> => {
  // Replace with API call
  return [
    { id: "1", name: "Demo Project", updatedAt: "2025-10-07" },
    { id: "2", name: "VR House", updatedAt: "2025-10-06" },
    { id: "3", name: "Car Model", updatedAt: "2025-10-05" },
  ];
};
