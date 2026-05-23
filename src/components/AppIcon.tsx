import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {
  Plane,
  Settings,
  Info,
  Check,
  CheckCircle2,
  AlertTriangle,
  Home,
  ArrowLeft,
  LocateFixed,
  Building2,
  X,
  MapPin,
  Crosshair,
  Moon,
  Compass,
  Radar,
  Navigation,
  Clock,
} from 'lucide-react-native';

export type IconType =
  | 'airplane'
  | 'settings'
  | 'info'
  | 'checkmark'
  | 'checkmark-circle'
  | 'warning'
  | 'home'
  | 'back'
  | 'location-target'
  | 'terminal'
  | 'close'
  | 'map-pin'
  | 'crosshair'
  | 'moon'
  | 'compass'
  | 'radar'
  | 'navigation'
  | 'clock';

interface AppIconProps {
  name: IconType;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function AppIcon({
  name,
  color = '#4A5568',
  size = 24,
  style,
}: AppIconProps): React.JSX.Element {
  switch (name) {
    case 'airplane':
      return <Plane color={color} size={size} style={style} />;
    case 'settings':
      return <Settings color={color} size={size} style={style} />;
    case 'info':
      return <Info color={color} size={size} style={style} />;
    case 'checkmark':
      return <Check color={color} size={size} style={style} />;
    case 'checkmark-circle':
      return <CheckCircle2 color={color} size={size} style={style} fill={color === '#10B981' ? 'rgba(16, 185, 129, 0.1)' : undefined} />;
    case 'warning':
      return <AlertTriangle color={color} size={size} style={style} />;
    case 'home':
      return <Home color={color} size={size} style={style} />;
    case 'back':
      return <ArrowLeft color={color} size={size} style={style} />;
    case 'location-target':
      return <LocateFixed color={color} size={size} style={style} />;
    case 'terminal':
      return <Building2 color={color} size={size} style={style} />;
    case 'close':
      return <X color={color} size={size} style={style} />;
    case 'map-pin':
      return <MapPin color={color} size={size} style={style} />;
    case 'crosshair':
      return <Crosshair color={color} size={size} style={style} />;
    case 'moon':
      return <Moon color={color} size={size} style={style} />;
    case 'compass':
      return <Compass color={color} size={size} style={style} />;
    case 'radar':
      return <Radar color={color} size={size} style={style} />;
    case 'navigation':
      return <Navigation color={color} size={size} style={style} />;
    case 'clock':
      return <Clock color={color} size={size} style={style} />;
    default:
      return <Info color={color} size={size} style={style} />;
  }
}


