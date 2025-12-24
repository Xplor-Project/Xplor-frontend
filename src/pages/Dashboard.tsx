import React, { useEffect, useState } from "react";
import type { Project } from "../utils/recentProjects";
import { useNavigate } from "react-router-dom";

// A simple icon for the close button
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [importing, setImporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for demonstration since getRecentProjects is an example
    const mockProjects: Project[] = [
      { id: "1", name: "Cyberpunk Cityscape", updatedAt: "2 hours ago" },
      { id: "2", name: "Forest Biome", updatedAt: "1 day ago" },
      { id: "3", name: "Spaceship Interior", updatedAt: "3 days ago" },
    ];
    // In a real app, you would use:
    // getRecentProjects().then(setProjects);
    setProjects(mockProjects);
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement import logic (navigate to editor with file)
      alert(`Importing project: ${file.name}`);
    }
    // Reset the importing state whether a file was selected or not
    setImporting(false);
  };

  // This handler allows the user to re-select the same file
  const handleImportClick = (e: React.MouseEvent<HTMLInputElement>) => {
    (e.target as HTMLInputElement).value = "";
    setImporting(true);
  };

  return (
    <>
      {/* Main Dashboard Content */}
      <div
        className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8 transition-filter duration-300 ${
          isModalOpen ? "filter blur-lg" : ""
        }`}
      >
        {/* Animated background blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute w-96 h-96 bg-blue-900/50 rounded-full mix-blend-screen filter blur-3xl animate-blob1"
            style={{ top: "-10%", left: "-10%" }}
          />
          <div
            className="absolute w-96 h-96 bg-green-900/50 rounded-full mix-blend-screen filter blur-3xl animate-blob2"
            style={{ bottom: "-20%", right: "-20%" }}
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 via-teal-400 to-green-500 bg-clip-text text-transparent drop-shadow-lg animate-fadein">
                Project Dashboard 📊
              </h1>
              <p className="text-lg text-gray-300 animate-fadein delay-100">
                Manage your projects or start a new one.
              </p>
            </div>

            {/* --- Actions (Moved to Top) --- */}
            <div className="w-full flex flex-col sm:flex-row gap-4 mb-10 animate-fadein delay-200">
              <button
                className="flex-1 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                onClick={() => setIsModalOpen(true)} // This now opens the modal
              >
                + Create New Project
              </button>
              <label
                className="flex-1 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow-lg hover:shadow-green-500/50 transition-all transform hover:scale-105 cursor-pointer text-center"
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

            {/* --- Recent Projects (Card Layout) --- */}
            <div className="animate-fadein delay-300">
              <h2 className="text-2xl font-bold mb-5 text-gray-200">
                Recent Projects
              </h2>
              {projects.length === 0 ? (
                <div className="text-center py-10 bg-black/20 rounded-xl">
                  <p className="text-gray-400">No recent projects found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-gray-800/50 rounded-2xl border border-gray-700/80 overflow-hidden group hover:border-blue-400 transition-all duration-300 flex flex-col shadow-lg"
                    >
                      {/* Preview Area */}
                      <div className="aspect-video bg-gray-900 flex items-center justify-center">
                        {/* TODO: Replace this div with your <img /> or canvas preview */}
                        <span className="text-gray-500">Preview</span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold text-xl text-white mb-1">
                          {p.name}
                        </h3>
                        <p className="text-xs text-gray-400 mb-4 flex-grow">
                          Last edited: {p.updatedAt}
                        </p>
                        <button
                          className="w-full mt-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md transition-transform transform group-hover:scale-105"
                          onClick={() => alert(`Opening project: ${p.name}`)}
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Custom keyframes for blobs and fadein */}
        <style>{`
            @keyframes blob1 { 0%,100%{transform:translate(0, 0) scale(1);} 33%{transform:translate(30px, -40px) scale(1.1);} 66%{transform:translate(-20px, 20px) scale(0.9);} }
            @keyframes blob2 { 0%,100%{transform:translate(0, 0) scale(1);} 33%{transform:translate(-30px, 40px) scale(1.1);} 66%{transform:translate(20px, -20px) scale(0.9);} }
            .animate-blob1 { animation: blob1 12s infinite ease-in-out; }
            .animate-blob2 { animation: blob2 15s infinite ease-in-out; }
            @keyframes fadein { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
            .animate-fadein { animation: fadein 0.7s both cubic-bezier(0.25, 0.46, 0.45, 0.94); }
            .delay-100 { animation-delay: 0.1s; }
            .delay-200 { animation-delay: 0.2s; }
            .delay-300 { animation-delay: 0.3s; }
            .transition-filter { transition: filter 0.3s ease-in-out; }

            /* Animation for modal entry */
            @keyframes modal-in { from{opacity:0;transform:scale(0.95) translateY(20px);} to{opacity:1;transform:scale(1) translateY(0);} }
            .animate-modal-in { animation: modal-in 0.3s both cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        `}</style>
      </div>

      {/* --- Create Project Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="relative bg-gray-800 border border-gray-700 shadow-2xl rounded-3xl p-8 w-full max-w-lg text-white animate-modal-in">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>

            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Create New Project
            </h2>
            <p className="text-gray-400 mb-6">
              Define the initial parameters for your scene.
            </p>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const projectName =
                  (form.elements.namedItem("projectName") as HTMLInputElement)
                    ?.value || "Untitled Project";
                const length =
                  Number(
                    (form.elements.namedItem("length") as HTMLInputElement)
                      ?.value
                  ) || 20;
                const breadth =
                  Number(
                    (form.elements.namedItem("breadth") as HTMLInputElement)
                      ?.value
                  ) || 20;

                // Optional blender parameters
                const wall_thickness =
                  Number(
                    (
                      form.elements.namedItem(
                        "wall_thickness"
                      ) as HTMLInputElement
                    )?.value
                  ) || undefined;
                const door_width =
                  Number(
                    (form.elements.namedItem("door_width") as HTMLInputElement)
                      ?.value
                  ) || undefined;
                const door_height =
                  Number(
                    (form.elements.namedItem("door_height") as HTMLInputElement)
                      ?.value
                  ) || undefined;

                setIsModalOpen(false);
                // Pass length as gridLength and breadth as gridWidth
                navigate("/editor", {
                  state: {
                    projectName,
                    gridLength: length,
                    gridWidth: breadth,
                    height:
                      Number(
                        (form.elements.namedItem("height") as HTMLInputElement)
                          ?.value
                      ) || 2.8,
                    // forward optional blender params so the editor or backend can use them
                    optionalParams: {
                      ...(typeof wall_thickness === "number" &&
                      !isNaN(wall_thickness)
                        ? { wall_thickness }
                        : {}),
                      ...(typeof door_width === "number" && !isNaN(door_width)
                        ? { door_width }
                        : {}),
                      ...(typeof door_height === "number" && !isNaN(door_height)
                        ? { door_height }
                        : {}),
                    },
                  },
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="projectName"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    placeholder="e.g., My First Room"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="length"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Length (m)
                    </label>
                    <input
                      type="number"
                      id="length"
                      name="length"
                      defaultValue="20"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="breadth"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Breadth (m)
                    </label>
                    <input
                      type="number"
                      id="breadth"
                      name="breadth"
                      defaultValue="20"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="height"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Height (m)
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      defaultValue="5"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>
                {/* Optional Blender parameters from blender_worker.py (frontend only) */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="wall_thickness"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Wall Thickness (m)
                    </label>
                    <input
                      type="number"
                      id="wall_thickness"
                      name="wall_thickness"
                      defaultValue="0.2"
                      step="0.01"
                      min="0.01"
                      max="1.0"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="door_width"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Door Width (m)
                    </label>
                    <input
                      type="number"
                      id="door_width"
                      name="door_width"
                      defaultValue="0.9"
                      step="0.01"
                      min="0.5"
                      max="2.0"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="door_height"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Door Height (m)
                    </label>
                    <input
                      type="number"
                      id="door_height"
                      name="door_height"
                      defaultValue="2.1"
                      step="0.01"
                      min="1.5"
                      max="3.0"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                >
                  Generate & Open
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
