import CloseIcon from "./CloseIcon";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    projectName: string;
    gridLength: number;
    gridWidth: number;
    height: number;
    optionalParams?: {
      wall_thickness?: number;
      door_width?: number;
      door_height?: number;
    };
  }) => void;
}

export default function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: CreateProjectModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-gray-800 border border-gray-700 shadow-2xl rounded-3xl p-8 w-full max-w-lg text-white animate-modal-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <CloseIcon />
        </button>

        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          Create New Project
        </h2>
        <p className="text-gray-400 mb-6">
          Define the initial parameters for your scene.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;

            const get = (name: string) =>
              (form.elements.namedItem(name) as HTMLInputElement)?.value;

            const wall_thickness = Number(get("wall_thickness"));
            const door_width = Number(get("door_width"));
            const door_height = Number(get("door_height"));

            onCreate({
              projectName: get("projectName") || "Untitled Project",
              gridLength: Number(get("length") || 20),
              gridWidth: Number(get("breadth") || 20),
              height: Number(get("height") || 2.8),
              optionalParams: {
                ...(wall_thickness && !isNaN(wall_thickness)
                  ? { wall_thickness }
                  : {}),
                ...(door_width && !isNaN(door_width)
                  ? { door_width }
                  : {}),
                ...(door_height && !isNaN(door_height)
                  ? { door_height }
                  : {}),
              },
            });
          }}
        >
          <div className="space-y-5">
            {/* Project Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Project Name
              </label>
              <input
                name="projectName"
                placeholder="e.g. My First Room"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Length (m)
                </label>
                <input
                  name="length"
                  type="number"
                  defaultValue={20}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Breadth (m)
                </label>
                <input
                  name="breadth"
                  type="number"
                  defaultValue={20}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Height (m)
                </label>
                <input
                  name="height"
                  type="number"
                  defaultValue={49.99}
                  step="0.1"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                />
              </div>
            </div>

            {/* Optional Blender Params */}
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                Optional Parameters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Wall Thickness (m)
                  </label>
                  <input
                    name="wall_thickness"
                    type="number"
                    defaultValue={0.2}
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Door Width (m)
                  </label>
                  <input
                    name="door_width"
                    type="number"
                    defaultValue={0.9}
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Door Height (m)
                  </label>
                  <input
                    name="door_height"
                    type="number"
                    defaultValue={2.1}
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              Generate & Open
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
