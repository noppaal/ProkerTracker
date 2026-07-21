import React from 'react';

export const ProgressBar = ({ progress, showLabel = true, height = 'h-2' }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress || 0));

  let barColor = 'bg-[#C4554D]';
  let textColor = 'text-[#C4554D]';
  
  if (clampedProgress >= 75) {
    barColor = 'bg-[#448361]';
    textColor = 'text-[#448361]';
  } else if (clampedProgress >= 40) {
    barColor = 'bg-[#D9730D]';
    textColor = 'text-[#D9730D]';
  }

  return (
    <div className="w-full flex items-center gap-2">
      <div className={`flex-1 bg-[#EEEEEC] rounded-full overflow-hidden ${height}`}>
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-300`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className={`text-[11px] font-mono font-medium ${textColor} min-w-[32px] text-right`}>
          {clampedProgress}%
        </span>
      )}
    </div>
  );
};
