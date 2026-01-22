export default function AnimatedBackground() {
  return (
    <>
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
    </>
  );
}
