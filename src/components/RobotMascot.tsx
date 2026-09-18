export default function RobotMascot() {
  return (
    <div className="pointer-events-none absolute -left-10 bottom-24 z-30 hidden xl:block 2xl:-left-16 2xl:bottom-28">
      <div className="robot-bob origin-bottom">
        <img
          src="/images/robot.png"
          alt="Glissa AI mascot"
          className="h-[210px] w-auto select-none 2xl:h-[248px]"
          style={{
            filter: "drop-shadow(8px 16px 16px rgba(70, 60, 140, 0.2))",
            maskImage: "radial-gradient(ellipse 62% 72% at 50% 48%, black 52%, transparent 74%)",
            WebkitMaskImage: "radial-gradient(ellipse 62% 72% at 50% 48%, black 52%, transparent 74%)",
          }}
        />
      </div>
    </div>
  );
}
