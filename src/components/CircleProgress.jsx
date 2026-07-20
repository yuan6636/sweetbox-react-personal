function CircleProgress({
  size = 132,
  strokeWidth = 12,
  progress = 33,
  trackColor = 'var(--neutral-600)', // 👈 圓環底色
  progressColor = 'var(--neutral-800)', // 👈 進度顏色
  children, // 👈 中間放 HTML
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Number(progress) || 0;
  const offset = circumference * (1 - safeProgress / 100);
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      <svg width={size} height={size}>
        {/* 底色圓環 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* 進度圓環 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 0.4s ease',
          }}
        />
      </svg>

      {/* 中間內容（可放三行 HTML） */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}

export default CircleProgress;
