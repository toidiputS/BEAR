import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  fill?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = '', fill }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LucideIcon = (LucideIcons as any)[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon size={size} className={className} fill={fill} />;
};

export default Icon;