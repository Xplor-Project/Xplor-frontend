import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Project } from "../utils/recentProjects";

/* ================== DASHBOARD COMPONENTS ================== */
import AnimatedBackground from "../components/Dashboard/AnimatedBackground";
import ProjectCard from "../components/Dashboard/ProjectCard";
import CreateProjectModal from "../components/Dashboard/CreateProjectModal";

/* ========================================================== */

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [importing, setImporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  /* ---------- Load Recent Projects ---------- */
  useEffect(() => {
    // TODO: Replace with real API call
    const mockProjects: Project[] = [
      { id: "1", name: "Cyberpunk Cityscape", updatedAt: "2 hours ago" },
      { id: "2", name: "Forest Biome", updatedAt: "1 day ago" },
      { id: "3", name: "Spaceship Interior", updatedAt: "3 days ago" },
    ];

    setProjects(mockProjects);
  }, []);

  /* ---------- Import Project ---------- */
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Importing project: ${file.name}`);
      // Future: navigate("/editor", { state: { file } })
    }
    setImporting(false);
  };

  const handleImportClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).value = "";
    setImporting(true);
  };

  /* ---------- Open Project ---------- */
  const handleOpenProject = (project: Project) => {
    alert(`Opening project: ${project.name}`);
    // navigate("/editor", { state: { projectId: project.id } });
  };

  /* ---------- Create Project ---------- */
  const handleCreateProject = (data: {
    projectName: string;
    gridLength: number;
    gridWidth: number;
    height: number;
    optionalParams?: Record<string, number>;
  }) => {
    setIsModalOpen(false);

    navigate("/editor", {
      state: {
        projectName: data.projectName,
        gridLength: data.gridLength,
        gridWidth: data.gridWidth,
        height: data.height,
        optionalParams: data.optionalParams,
      },
    });
  };

  /* ========================================================= */

  return (
    <>
      <div
        className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8 transition-filter duration-300 ${
          isModalOpen ? "filter blur-lg" : ""
        }`}
      >
        <AnimatedBackground />

        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-10">
            {/* ---------- Header ---------- */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 via-teal-400 to-green-500 bg-clip-text text-transparent">
                Project Dashboard 📊
              </h1>
              <p className="text-lg text-gray-300">
                Manage your projects or start a new one.
              </p>
            </div>

            {/* ---------- Actions ---------- */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mb-10">
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg"
                onClick={() => setIsModalOpen(true)}
              >
                + Create New Project
              </button>

              <label
                className="flex-1 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg cursor-pointer text-center"
                htmlFor="import-project"
              >
                {importing ? "Importing..." : "Import Project"}
                <input
                  id="import-project"
                  type="file"
                  accept=".gltf,.glb,.json"
                  className="hidden"
                  onChange={handleImport}
                  onClick={handleImportClick}
                />
              </label>
            </div>

            {/* ---------- Recent Projects ---------- */}
            <div>
              <h2 className="text-2xl font-bold mb-5 text-gray-200">
                Recent Projects
              </h2>

              {projects.length === 0 ? (
                <div className="text-center py-10 bg-black/20 rounded-xl">
                  <p className="text-gray-400">No recent projects found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpen={handleOpenProject}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Create Project Modal ---------- */}
      <CreateProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </>
  );
}
