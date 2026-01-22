import type { Project } from "../../utils/recentProjects";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <div className="bg-gray-800/50 rounded-2xl border border-gray-700/80 overflow-hidden group hover:border-blue-400 transition-all duration-300 flex flex-col shadow-lg">
      {/* Preview */}
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        <span className="text-gray-500">Preview</span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-white mb-1">
          {project.name}
        </h3>
        <p className="text-xs text-gray-400 mb-4 flex-grow">
          Last edited: {project.updatedAt}
        </p>

        <button
          onClick={() => onOpen(project)}
          className="w-full mt-auto px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md transition-transform transform group-hover:scale-105"
        >
          Open
        </button>
      </div>
    </div>
  );
}
