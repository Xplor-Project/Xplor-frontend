import Keyboard from "react-simple-keyboard";

interface VirtualKeyboardProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VirtualKeyboard({
  value,
  onChange,
}: VirtualKeyboardProps) {
  return (
    <div className="w-full mt-4 bg-gray-900 p-4 rounded-xl border border-gray-700">
      <Keyboard
        layout={{
          default: [
            "1 2 3 4 5 6 7 8 9 0",
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "{shift} z x c v b n m {bksp}",
            "{space}",
          ],
          shift: [
            "! @ # $ % ^ & * ( )",
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{shift} Z X C V B N M {bksp}",
            "{space}",
          ],
        }}
        onChange={onChange}
        theme="simple-keyboard tailwind-kb"
        buttonTheme={[
          {
            class: "tw-key",
            buttons:
              "1 2 3 4 5 6 7 8 9 0 q w e r t y u i o p a s d f g h j k l z x c v b n m Q W E R T Y U I O P A S D F G H J K L Z X C V B N M",
          },
          {
            class: "tw-fn",
            buttons: "{shift} {bksp} {space}",
          },
        ]}
      />

      {/* Tailwind-only styling (inline, no CSS file) */}
      <style>
        {`
          .tailwind-kb .hg-row {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .tailwind-kb .hg-button {
            background: #1f2937;
            color: white;
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
          }
          .tailwind-kb .hg-button:active {
            background: #2563eb;
          }
          .tailwind-kb .tw-fn {
            background: #374151;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        `}
      </style>
    </div>
  );
}
